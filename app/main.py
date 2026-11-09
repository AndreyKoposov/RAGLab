from pypdf import PdfReader
import io

from pathlib import Path
import uuid

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app import database
from app.ai.engine import engine


BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "static"
UPLOAD_DIR = BASE_DIR.parent / "uploads"


MAX_FILE_SIZE = 20 * 1024 * 1024   # 20 МБ
ALLOWED_EXTENSIONS = {".pdf"}

app = FastAPI(title="AI Ontology Bot")

# Отдаём статику (script.js, стили и т.п.) по адресу /static/...
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


class ChatRequest(BaseModel):
    """Тело запроса от клиента."""
    message: str
    user_id: str = "default"


class ChatResponse(BaseModel):
    """Ответ сервера."""
    reply: str

class UploadResponse(BaseModel):
    filename: str
    size: int
    url: str

@app.get("/")
def index() -> FileResponse:
    """Отдаём HTML-страницу чата."""
    return FileResponse(STATIC_DIR / "index.html")


@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    """
    Принимает сообщение пользователя и возвращает ответ бота.
    Синхронный обработчик — как и требовалось.
    """
    user_text = payload.message.strip()

    # Простейшая логика бота-эха.
    # Позже сюда можно вставить вызов OpenAI / локальной LLM.
    if not user_text:
        reply = "Пожалуйста, напиши что-нибудь 🙂"
    else:
        reply = f"Бот получил: «{user_text}». (Это заглушка, скоро подключим ИИ)"

    reply = engine.chat(user_text)

    # Каркас: сохраняем сообщения (сейчас — no-op)
    database.save_message(payload.user_id, user_text)
    database.save_message("bot", reply)

    return ChatResponse(reply=reply)

@app.post("/api/upload", response_model=UploadResponse)
def upload_pdf(file: UploadFile = File(...)) -> UploadResponse:
    """
    Принимает PDF-файл и сохраняет его в /uploads.
    Синхронный обработчик (как и весь проект).
    """
    original_name = file.filename or "file.pdf"
    ext = Path(original_name).suffix.lower()

    # 1) Проверка расширения
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Разрешены только PDF-файлы")

    # 2) Проверка MIME-типа (доп. защита)
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Неверный тип файла (нужен PDF)")

    # 3) Читаем файл целиком и проверяем размер
    #    (для больших файлов лучше чанками — но у нас лимит 20 МБ)
    content = file.file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"Файл слишком большой (макс. {MAX_FILE_SIZE // (1024 * 1024)} МБ)",
        )

    _log_pdf_text(content, original_name)

    # 4) Сохраняем под уникальным именем, чтобы не перезаписывать
    safe_id = uuid.uuid4().hex
    save_name = f"{safe_id}{ext}"
    save_path = UPLOAD_DIR / save_name
    save_path.write_bytes(content)

    return UploadResponse(
        filename=original_name,
        size=len(content),
        url=f"/uploads/{save_name}",
    )


def _log_pdf_text(content: bytes, name: str) -> None:
    """
    Извлекает текст из PDF-байтов и пишет его в лог.
    Никогда не бросает исключение — при ошибке просто логирует её.
    """
    try:
        reader = PdfReader(io.BytesIO(content))
    except Exception as e:
        # logger.warning("Не удалось открыть PDF «%s»: %s", name, e)
        return

    pages_text = []
    for i, page in enumerate(reader.pages, start=1):
        try:
            text = page.extract_text() or ""
        except Exception as e:
            # logger.warning("Страница %d файла «%s»: ошибка извлечения: %s", i, name, e)
            text = ""
        pages_text.append(text)

    full_text = "\n".join(pages_text).strip()

    # Печатаем в лог ТОЛЬКО текст (без имён файлов, размеров и т.п.)
    if full_text:
        print(f"PDF text [{name}]:\n{content}")
    else:
        print(f"PDF text {name}: <текст не найден — возможно, скан или картинки>")
