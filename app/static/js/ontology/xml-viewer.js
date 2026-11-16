/**
 * XML редактор - клиентская часть для Eel
 * Вся бизнес-логика на стороне Python
 */

function startXmlPage() {
    // Состояние редактора
    const xmlState = {
        currentContent: '',        // Текущее содержимое
        originalContent: '',       // Оригинальное содержимое (для отслеживания изменений)
        filename: 'process_ontology.xml',
        isValid: true,
        isLoading: false,
        hasUnsavedChanges: false
    };

    // DOM элементы
    const xmlContainer = document.getElementById('xmlContainer');
    const xmlTextarea = document.getElementById('xmlTextarea');
    const xmlLineNumbers = document.getElementById('xmlLineNumbers');
    const xmlLoading = document.getElementById('xmlLoading');
    const xmlUnsavedBadge = document.getElementById('xmlUnsavedBadge');
    const xmlFilename = document.getElementById('xmlFilename');
    const xmlValidationStatus = document.getElementById('xmlValidationStatus');
    const xmlValidationDot = document.getElementById('xmlValidationDot');
    const xmlLineCount = document.getElementById('xmlLineCount');
    const xmlCharCount = document.getElementById('xmlCharCount');
    
    // Кнопки
    const xmlCopyBtn = document.getElementById('xmlCopyBtn');
    const xmlDownloadBtn = document.getElementById('xmlDownloadBtn');
    const xmlSaveBtn = document.getElementById('xmlSaveBtn');
    const xmlGraphBtn = document.getElementById('xmlGraphBtn');

    // Инициализация
    function initXmlViewer() {
        if (!xmlTextarea) return;
        
        // Загружаем XML документ
        loadXmlDocument();
        
        // Добавляем обработчики событий
        xmlTextarea.addEventListener('input', handleXmlChange);
        xmlTextarea.addEventListener('scroll', syncLineNumbers);
        xmlTextarea.addEventListener('keydown', handleTabKey);
        
        // Кнопки
        xmlCopyBtn.addEventListener('click', copyToClipboard);
        xmlDownloadBtn.addEventListener('click', downloadXml);
        xmlSaveBtn.addEventListener('click', saveChanges);
        xmlGraphBtn.addEventListener('click', downloadAsGraph);
        
        // Обновляем статистику
        updateStats();
    }

    // ========== МЕСТО ДЛЯ ВАШЕЙ ЛОГИКИ PYTHON ==========
    // Раскомментируйте после подключения Eel

    /*
    // Загрузка XML документа
    async function loadXmlDocument() {
        try {
            showLoading(true);
            
            // Вызов Python функции для получения XML
            const result = await eel.get_xml_document()();
            
            // Обновляем состояние
            xmlState.currentContent = result.content;
            xmlState.originalContent = result.content;
            xmlState.filename = result.filename || 'document.xml';
            xmlState.isValid = result.isValid || true;
            
            // Обновляем UI
            xmlTextarea.value = xmlState.currentContent;
            xmlFilename.textContent = xmlState.filename;
            updateLineNumbers();
            updateValidationStatus(xmlState.isValid);
            updateStats();
            checkUnsavedChanges();
            
            showLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки XML:', error);
            showLoading(false);
            showError('Не удалось загрузить XML документ');
        }
    }
    
    // Сохранение изменений
    async function saveChanges() {
        try {
            showLoading(true);
            
            // Вызов Python функции для сохранения
            const result = await eel.save_xml_document(xmlState.currentContent)();
            
            if (result.success) {
                xmlState.originalContent = xmlState.currentContent;
                xmlState.isValid = result.isValid;
                checkUnsavedChanges();
                updateValidationStatus(result.isValid);
                showMessage('Документ сохранён');
            } else {
                showError('Ошибка сохранения: ' + result.error);
            }
            
            showLoading(false);
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            showLoading(false);
            showError('Не удалось сохранить документ');
        }
    }
    
    // Валидация XML
    async function validateXml(content) {
        try {
            const result = await eel.validate_xml(content)();
            xmlState.isValid = result.isValid;
            updateValidationStatus(result.isValid);
            return result.isValid;
        } catch (error) {
            console.error('Ошибка валидации:', error);
            return false;
        }
    }
    
    // Скачать как граф
    async function downloadAsGraph() {
        try {
            showLoading(true);
            
            // Вызов Python функции для генерации графа
            const result = await eel.export_as_graph(xmlState.currentContent)();
            
            if (result.success) {
                showMessage('Граф сгенерирован и скачан');
            } else {
                showError('Ошибка генерации графа');
            }
            
            showLoading(false);
        } catch (error) {
            console.error('Ошибка генерации графа:', error);
            showLoading(false);
            showError('Не удалось сгенерировать граф');
        }
    }
    */

    // ========== ВРЕМЕННАЯ ЛОГИКА ДЛЯ ТЕСТИРОВАНИЯ ==========
    
    // Заглушка загрузки
    async function loadXmlDocument() {
        setTimeout(() => {
            const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<ontology>
    <process id="p1">
        <name>Закупка сырья</name>
        <description>Процесс закупки необходимых материалов</description>
        <inputs>
            <input>Потребность в материалах</input>
            <input>Список поставщиков</input>
        </inputs>
        <outputs>
            <output>Закупленные материалы</output>
            <output>Договоры поставки</output>
        </outputs>
        <roles>
            <role>Менеджер по закупкам</role>
            <role>Складской работник</role>
        </roles>
    </process>
    
    <process id="p2">
        <name>Производство деталей</name>
        <description>Основной производственный процесс</description>
        <inputs>
            <input>Сырьё и материалы</input>
            <input>Техническая документация</input>
        </inputs>
        <outputs>
            <output>Готовые детали</output>
        </outputs>
        <roles>
            <role>Оператор станка</role>
            <role>Технолог</role>
        </roles>
    </process>
    
    <relations>
        <relation from="p1" to="p2" type="supplies"/>
    </relations>
</ontology>`;
            
            xmlState.currentContent = sampleXml;
            xmlState.originalContent = sampleXml;
            xmlTextarea.value = sampleXml;
            
            updateLineNumbers();
            updateStats();
            checkUnsavedChanges();
            
            showLoading(false);
        }, 500);
    }
    
    // Заглушка сохранения
    async function saveChanges() {
        showLoading(true);
        setTimeout(() => {
            xmlState.originalContent = xmlState.currentContent;
            checkUnsavedChanges();
            showLoading(false);
            showMessage('Документ сохранён (тест)');
        }, 500);
    }
    
    // Заглушка графа
    async function downloadAsGraph() {
        showLoading(true);
        setTimeout(() => {
            showLoading(false);
            showMessage('Граф сгенерирован (тест)');
        }, 1000);
    }
    // ========== КОНЕЦ ТЕСТОВОЙ ЛОГИКИ ==========

    // ========== UI ФУНКЦИИ ==========
    
    // Обработка изменений в тексте
    function handleXmlChange() {
        xmlState.currentContent = xmlTextarea.value;
        updateLineNumbers();
        updateStats();
        checkUnsavedChanges();
        
        // Здесь можно добавить валидацию с debounce
        // validateXml(xmlState.currentContent);
    }

    // Синхронизация скролла номеров строк
    function syncLineNumbers() {
        if (xmlLineNumbers) {
            xmlLineNumbers.scrollTop = xmlTextarea.scrollTop;
        }
    }

    // Обновление номеров строк
    function updateLineNumbers() {
        if (!xmlLineNumbers) return;
        
        const lines = xmlTextarea.value.split('\n');
        const lineCount = lines.length;
        
        let numbersHtml = '';
        for (let i = 1; i <= lineCount; i++) {
            numbersHtml += `<span>${i}</span>`;
        }
        
        xmlLineNumbers.innerHTML = numbersHtml;
    }

    // Обновление статистики
    function updateStats() {
        const content = xmlState.currentContent;
        const lines = content.split('\n');
        const charCount = content.length;
        
        xmlLineCount.textContent = `Строк: ${lines.length}`;
        xmlCharCount.textContent = `Символов: ${charCount}`;
    }

    // Проверка несохранённых изменений
    function checkUnsavedChanges() {
        const hasChanges = xmlState.currentContent !== xmlState.originalContent;
        xmlState.hasUnsavedChanges = hasChanges;
        
        if (hasChanges) {
            xmlUnsavedBadge.classList.add('visible');
        } else {
            xmlUnsavedBadge.classList.remove('visible');
        }
    }

    // Обновление статуса валидации
    function updateValidationStatus(isValid) {
        xmlValidationDot.className = 'xml-status-dot ' + (isValid ? 'valid' : 'invalid');
        xmlValidationStatus.textContent = isValid ? 'XML валиден' : 'XML содержит ошибки';
    }

    // Обработка клавиши Tab
    function handleTabKey(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            
            const start = xmlTextarea.selectionStart;
            const end = xmlTextarea.selectionEnd;
            
            // Вставляем 4 пробела
            xmlTextarea.value = xmlTextarea.value.substring(0, start) + '    ' + 
                                xmlTextarea.value.substring(end);
            
            // Возвращаем курсор
            xmlTextarea.selectionStart = xmlTextarea.selectionEnd = start + 4;
            
            // Триггерим событие изменения
            xmlTextarea.dispatchEvent(new Event('input'));
        }
    }

    // Копирование в буфер обмена
    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(xmlState.currentContent);
            showMessage('Скопировано в буфер обмена');
        } catch (err) {
            showError('Не удалось скопировать');
        }
    }

    // Скачать XML
    function downloadXml() {
        const blob = new Blob([xmlState.currentContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = xmlState.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Показать/скрыть загрузку
    function showLoading(show) {
        xmlState.isLoading = show;
        xmlLoading.style.display = show ? 'flex' : 'none';
    }

    // Показать сообщение
    function showMessage(text) {
        // Можно заменить на более красивый тостер
        console.log('✅', text);
    }

    // Показать ошибку
    function showError(text) {
        console.error('❌', text);
    }

    // ========== ПУБЛИЧНЫЙ API ==========
    
    window.XmlViewerModule = {
        init: initXmlViewer,
        
        // Загрузка нового документа
        loadDocument: function(content, filename) {
            xmlState.currentContent = content;
            xmlState.originalContent = content;
            xmlState.filename = filename || 'document.xml';
            
            xmlTextarea.value = content;
            xmlFilename.textContent = xmlState.filename;
            updateLineNumbers();
            updateStats();
            checkUnsavedChanges();
        },
        
        // Получить текущее содержимое
        getContent: function() {
            return xmlState.currentContent;
        },
        
        // Проверить наличие несохранённых изменений
        hasUnsavedChanges: function() {
            return xmlState.hasUnsavedChanges;
        },
        
        // Очистить редактор
        clear: function() {
            xmlTextarea.value = '';
            xmlState.currentContent = '';
            xmlState.originalContent = '';
            updateLineNumbers();
            updateStats();
            checkUnsavedChanges();
        },
        
        // Установить статус валидации
        setValidationStatus: function(isValid) {
            updateValidationStatus(isValid);
        }
    };

    // Автоматическая инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initXmlViewer);
    } else {
        initXmlViewer();
    }
}