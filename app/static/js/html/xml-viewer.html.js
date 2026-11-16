var xmlPageContent = `
<!-- XML редактор (вставьте это внутрь .content-area) -->
<div class="xml-container" id="xmlContainer">
    <!-- Заголовок -->
    <div class="xml-header">
        <h3>
            📄 XML документ
            <span id="xmlFilename">process_ontology.xml</span>
        </h3>
        <div class="xml-unsaved-badge" id="xmlUnsavedBadge">✎ Несохранённые изменения</div>
    </div>
    
    <!-- Область редактирования -->
    <div class="xml-editor-area">
        <!-- Индикатор загрузки -->
        <div class="xml-loading" id="xmlLoading" style="display: none;">
            <div class="xml-loading-spinner"></div>
        </div>
        
        <!-- Редактор с нумерацией строк -->
        <div class="xml-editor-wrapper">
            <div class="xml-line-numbers" id="xmlLineNumbers"></div>
            <textarea 
                class="xml-textarea" 
                id="xmlTextarea"
                spellcheck="false"
                wrap="off"
                placeholder="Загрузка XML документа..."
            ></textarea>
        </div>
    </div>
    
    <!-- Панель инструментов -->
    <div class="xml-toolbar">
        <div class="xml-toolbar-left">
            <button class="xml-btn" id="xmlCopyBtn" title="Копировать в буфер обмена">
                📋 Копировать
            </button>
            <button class="xml-btn" id="xmlDownloadBtn" title="Скачать XML файл">
                ⬇️ Скачать
            </button>
        </div>
        <div class="xml-toolbar-right">
            <button class="xml-btn primary" id="xmlSaveBtn" title="Сохранить изменения">
                💾 Сохранить
            </button>
            <button class="xml-btn" id="xmlGraphBtn" title="Скачать в виде графа">
                🕸️ Граф
            </button>
        </div>
    </div>
    
    <!-- Статусбар -->
    <div class="xml-statusbar">
        <div class="xml-status">
            <div class="xml-status-item">
                <span class="xml-status-dot valid" id="xmlValidationDot"></span>
                <span id="xmlValidationStatus">XML валиден</span>
            </div>
            <div class="xml-status-item">
                <span id="xmlLineCount">Строк: 0</span>
            </div>
            <div class="xml-status-item">
                <span id="xmlCharCount">Символов: 0</span>
            </div>
        </div>
        <div class="xml-encoding">
            UTF-8
        </div>
    </div>
</div>`