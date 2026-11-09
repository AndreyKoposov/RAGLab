// ============================================================
// Хранилище сообщений — прямо в JS (в памяти браузера).
// При перезагрузке страницы всё очищается — так и задумано.
// ============================================================
const messages = [];

// Уникальный ID пользователя (просто для будущего)
const userId = "user-" + Math.random().toString(36).slice(2, 8);

// Элементы страницы
const messagesEl = document.getElementById("messages");
const formEl = document.getElementById("form");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("send");

// Добавить сообщение в локальное хранилище + отрисовать
function addMessage(text, role) {
    messages.push({ text, role, ts: Date.now() });
    renderMessages();
}

// Перерисовать весь список сообщений
function renderMessages() {
    messagesEl.innerHTML = "";
    for (const m of messages) {
        const div = document.createElement("div");
        div.className = "msg " + (m.role === "user" ? "user" : "bot");
        div.textContent = m.text;
        messagesEl.appendChild(div);
    }
    // Прокрутка вниз
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Отправка сообщения на сервер
async function sendToServer(text) {
    const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, user_id: userId }),
    });
    if (!resp.ok) {
        throw new Error("Ошибка сервера: " + resp.status);
    }
    const data = await resp.json();
    return data.reply;
}

// Обработка отправки формы
formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;

    // 1) Добавили сообщение пользователя
    addMessage(text, "user");
    inputEl.value = "";

    // 2) Блокируем кнопку на время запроса
    sendBtn.disabled = true;
    inputEl.disabled = true;

    try {
        // 3) Сходили на сервер и получили ответ
        const reply = await sendToServer(text);
        addMessage(reply, "bot");
    } catch (err) {
        addMessage("⚠️ Ошибка соединения: " + err.message, "bot");
    } finally {
        sendBtn.disabled = false;
        inputEl.disabled = false;
        inputEl.focus();
    }
});

// Приветствие при загрузке
addMessage("Привет! Я бот-заглушка. Напиши что-нибудь 👋", "bot");