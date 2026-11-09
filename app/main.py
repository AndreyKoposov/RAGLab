from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app import database

BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="AI Ontology Bot")

# Отдаём статику (script.js, стили и т.п.) по адресу /static/...
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


class ChatRequest(BaseModel):
    """Тело запроса от клиента."""
    message: str
    user_id: str = "default"


class ChatResponse(BaseModel):
    """Ответ сервера."""
    reply: str

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

    # Каркас: сохраняем сообщения (сейчас — no-op)
    database.save_message(payload.user_id, user_text)
    database.save_message("bot", reply)

    return ChatResponse(reply=reply)
