"""
Каркас для будущей базы данных.

Сейчас это просто заглушка. Когда понадобится реальная БД —
подключим SQLAlchemy / SQLite / PostgreSQL и будем писать сюда.
"""

# Здесь в будущем будет что-то вроде:
# from sqlalchemy import create_engine
# engine = create_engine("sqlite:///./chat.db")

def init_db() -> None:
    """Инициализация БД. Пока ничего не делает."""
    print("[database] init_db() вызван — БД пока не подключена")


def save_message(user_id: str, text: str) -> None:
    """Сохранить сообщение (заглушка)."""
    # TODO: реализовать сохранение в БД
    pass


def get_history(user_id: str) -> list:
    """Получить историю сообщений (заглушка)."""
    # TODO: реализовать чтение из БД
    return []