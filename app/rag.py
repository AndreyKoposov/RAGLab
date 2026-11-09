from __future__ import annotations

import io
import logging
import uuid
from dataclasses import dataclass, field
from typing import Iterable

import numpy as np
from pypdf import PdfReader

from fastembed import TextEmbedding

logger = logging.getLogger("chat.rag")


# ---------------------------------------------------------------
# Модель эмбеддингов. Загружается один раз на процесс.
# Можно заменить на любую другую модель sentence-transformers.
# ---------------------------------------------------------------
EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
# ↑ мультиязычная и лёгкая (~120 МБ), хорошо работает с русским


@dataclass
class Chunk:
    """Один кусок текста, который мы потом подмешиваем в промпт."""
    id: str
    text: str
    source: str            # имя файла-источника
    page: int | None = None  # номер страницы (если известен)
    metadata: dict = field(default_factory=dict)


class RAGStore:
    """
    Хранилище «базы знаний» в памяти.

    - один экземпляр на процесс (создаётся в main.py)
    - хранит список чанков + numpy-матрицу эмбеддингов (N × D)
    - методы синхронные
    """

    def __init__(
        self,
        model_name: str = EMBEDDING_MODEL_NAME,
        chunk_size: int = 800,
        chunk_overlap: int = 150,
    ) -> None:
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

        self._chunks: list[Chunk] = []
        self._vectors: np.ndarray | None = None   # (N, D), float32, L2-норма
        self._model = None                        # ленивая загрузка

        self._model_name = model_name
        logger.info("RAGStore создан (модель будет загружена при первом использовании)")

    # -----------------------------------------------------------
    # Модель
    # -----------------------------------------------------------
    @property
    def model(self):
        if self._model is None:
            self._model = TextEmbedding("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
        return self._model
    # -----------------------------------------------------------
    # Публичное API
    # -----------------------------------------------------------
    def add_pdf(self, filename: str, content: bytes) -> int:
        """
        Разбирает PDF, режет на чанки, считает эмбеддинги, добавляет в стор.
        Возвращает количество добавленных чанков.
        """
        pages = self._extract_pdf_pages(content, filename)
        if not pages:
            logger.warning("RAG: в файле «%s» не найдено текста", filename)
            return 0

        chunks: list[Chunk] = []
        for page_no, page_text in pages:
            for piece in self._split_text(page_text):
                chunks.append(Chunk(
                    id=uuid.uuid4().hex,
                    text=piece,
                    source=filename,
                    page=page_no,
                ))

        if not chunks:
            return 0

        vectors = self._embed([c.text for c in chunks])
        self._chunks.extend(chunks)
        self._vectors = vectors if self._vectors is None else np.vstack([self._vectors, vectors])

        logger.info(
            "RAG: «%s» → %d чанков (всего в базе: %d)",
            filename, len(chunks), len(self._chunks),
        )
        return len(chunks)

    def add_text(self, text: str, source: str = "manual") -> int:
        """Добавить произвольный текст (полезно для тестов)."""
        chunks = [Chunk(uuid.uuid4().hex, piece, source) for piece in self._split_text(text)]
        if not chunks:
            return 0
        vectors = self._embed([c.text for c in chunks])
        self._chunks.extend(chunks)
        self._vectors = vectors if self._vectors is None else np.vstack([self._vectors, vectors])
        return len(chunks)

    def search(self, query: str, top_k: int = 4) -> list[tuple[Chunk, float]]:
        """
        Возвращает top_k наиболее релевантных чанков вместе с косинусной близостью.
        """
        if not self._chunks or self._vectors is None:
            return []

        q = self._embed([query])[0]                    # (D,)
        scores = self._vectors @ q                     # (N,) — косинус, т.к. всё нормировано
        top_k = min(top_k, len(self._chunks))
        idx = np.argpartition(-scores, top_k - 1)[:top_k]
        idx = idx[np.argsort(-scores[idx])]            # отсортировать по убыванию

        return [(self._chunks[i], float(scores[i])) for i in idx]

    def build_prompt(
        self,
        question: str,
        top_k: int = 4,
        min_score: float = 0.15,
    ) -> str:
        """
        Формирует промпт для LLM: контекст из найденных кусков + вопрос.
        Порог min_score отсекает совсем нерелевантное.
        """
        hits = [(c, s) for c, s in self.search(question, top_k) if s >= min_score]
        if not hits:
            # Если ничего не нашли — говорим об этом прямо, чтобы LLM не выдумывал
            return (
                "Ты — ассистент по документам. В базе знаний нет релевантных фрагментов.\n"
                "Честно сообщи пользователю, что информации в загруженных документах нет.\n\n"
                f"Вопрос пользователя: {question}"
            )

        context_blocks = []
        for i, (chunk, _score) in enumerate(hits, start=1):
            src = f"{chunk.source}"
            if chunk.page is not None:
                src += f", стр. {chunk.page}"
            context_blocks.append(f"[{i}] ({src})\n{chunk.text}")
        context = "\n\n".join(context_blocks)

        return (
            "Ты — ассистент, отвечающий на вопросы СТРОГО по предоставленному контексту.\n"
            "Если ответа в контексте нет — прямо скажи, что информации нет, и ничего не выдумывай.\n\n"
            f"Контекст:\n{context}\n\n"
            f"Вопрос пользователя: {question}\n\n"
            "Ответ:"
        )

    # -----------------------------------------------------------
    # Внутреннее
    # -----------------------------------------------------------
    def _extract_pdf_pages(self, content: bytes, filename: str) -> list[tuple[int, str]]:
        """PDF-байты → список (номер страницы, текст). Пустые страницы пропускаем."""
        try:
            reader = PdfReader(io.BytesIO(content))
        except Exception as e:
            logger.warning("RAG: не удалось открыть PDF «%s»: %s", filename, e)
            return []

        result: list[tuple[int, str]] = []
        for i, page in enumerate(reader.pages, start=1):
            try:
                text = (page.extract_text() or "").strip()
            except Exception as e:
                logger.warning("RAG: страница %d файла «%s»: %s", i, filename, e)
                text = ""
            if text:
                result.append((i, text))
        return result

    def _split_text(self, text: str) -> Iterable[str]:
        """
        Нарезка на перекрывающиеся куски.
        Приоритет — разбивать по абзацам/предложениям, но в крайнем случае
        режем по символам.
        """
        text = text.strip()
        if not text:
            return []

        pieces: list[str] = []
        start = 0
        n = len(text)
        while start < n:
            end = min(start + self.chunk_size, n)
            # Пытаемся закончить по границе абзаца/предложения
            if end < n:
                window = text[start:end]
                for sep in ("\n\n", "\n", ". ", "! ", "? "):
                    cut = window.rfind(sep)
                    if cut != -1 and cut > self.chunk_size * 0.5:
                        end = start + cut + len(sep)
                        break
            piece = text[start:end].strip()
            if piece:
                pieces.append(piece)
            if end >= n:
                break
            start = max(end - self.chunk_overlap, start + 1)
        return pieces

    def _embed(self, texts: list[str]) -> np.ndarray:
        vecs = np.array(list(self.model.embed(texts)), dtype=np.float32)
        # нормализуем
        norms = np.linalg.norm(vecs, axis=1, keepdims=True)
        return vecs / np.clip(norms, 1e-12, None)