// ============================================================
// Хранилище сообщений — в памяти браузера
// ============================================================
const messages = [];
const userId = "user-" + Math.random().toString(36).slice(2, 8);

// Элементы
const messagesEl = document.getElementById("messages");
const formEl = document.getElementById("form");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("send");
const fileInput = document.getElementById("fileInput");
const attachBtn = document.getElementById("attachBtn");

// ------------------------------------------------------------
// Рендер сообщений
// ------------------------------------------------------------
function addMessage(text, role, fileUrl = null, fileName = null) {
    messages.push({ text, role, fileUrl, fileName, ts: Date.now() });
    renderMessages();
}

function renderMessages() {
    messagesEl.innerHTML = "";
    for (const m of messages) {
        const div = document.createElement("div");
        div.className = "msg " + (m.role === "user" ? "user" : "bot");

        // Текст
        if (m.text) {
            const p = document.createElement("div");
            p.textContent = m.text;
            div.appendChild(p);
        }

        // Если есть вложение — ссылка на скачивание
        if (m.fileUrl) {
            const a = document.createElement("a");
            a.href = m.fileUrl;
            a.target = "_blank";
            a.rel = "noopener";
            a.className = "file-link";
            a.textContent = "📄 " + (m.fileName || "файл");
            div.appendChild(a);
        }

        messagesEl.appendChild(div);
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ------------------------------------------------------------
// Отправка текста
// ------------------------------------------------------------
async function sendToServer(text) {
    const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, user_id: userId }),
    });
    if (!resp.ok) throw new Error("Ошибка сервера: " + resp.status);
    const data = await resp.json();
    return data.reply;
}

// ------------------------------------------------------------
// Загрузка PDF-файла
// ------------------------------------------------------------
async function uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);                 // имя поля — "file", как в FastAPI

    const resp = await fetch("/api/upload", {
        method: "POST",
        body: fd,                            // Content-Type выставит браузер
    });

    if (!resp.ok) {
        // Попробуем вытащить detail из ответа FastAPI
        let detail = "Ошибка " + resp.status;
        try {
            const err = await resp.json();
            if (err.detail) detail = err.detail;
        } catch (_) {}
        throw new Error(detail);
    }
    return await resp.json();                // { filename, size, url }
}

// ------------------------------------------------------------
// Обработчик выбора файла
// ------------------------------------------------------------
fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // 1) Локально показываем сообщение пользователя с файлом
    addMessage("", "user", null, file.name);

    attachBtn.classList.add("disabled");
    sendBtn.disabled = true;

    try {
        const result = await uploadFile(file);

        // 2) Дополняем сообщение реальной ссылкой
        const last = messages[messages.length - 1];
        last.fileUrl = result.url;
        last.text = `Загружен файл (${(result.size / 1024).toFixed(1)} КБ)`;
        renderMessages();

        // 3) Ответ бота
        addMessage(`Файл «${result.filename}» принят ✅`, "bot");
    } catch (err) {
        addMessage("⚠️ Не удалось загрузить файл: " + err.message, "bot");
    } finally {
        // сброс — чтобы можно было выбрать тот же файл повторно
        fileInput.value = "";
        attachBtn.classList.remove("disabled");
        sendBtn.disabled = false;
        inputEl.focus();
    }
});

// ------------------------------------------------------------
// Отправка текстового сообщения
// ------------------------------------------------------------
formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage(text, "user");
    inputEl.value = "";

    sendBtn.disabled = true;
    inputEl.disabled = true;

    try {
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

// Приветствие
addMessage("Привет! Я бот-заглушка. Можно написать текст или прикрепить PDF 📎", "bot");