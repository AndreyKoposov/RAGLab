var tablePageContent = `
<!-- Таблица для просмотра данных (вставьте это внутрь .content-area) -->
<div class="table-container" id="tableContainer">
    <!-- Заголовок -->
    <div class="table-header">
        <h3>
            📊 Таблица данных
            <span id="tableType">онтологический анализ</span>
        </h3>
        <div class="table-count-badge" id="tableRowCount">0 записей</div>
    </div>
    
    <!-- Область таблицы -->
    <div class="table-wrapper" id="tableWrapper">
        <!-- Индикатор загрузки -->
        <div class="table-loading" id="tableLoading" style="display: none;">
            <div class="table-loading-spinner"></div>
        </div>
        
        <!-- Таблица -->
        <table class="data-table" id="dataTable">
            <thead>
                <tr>
                    <th>Параметр</th>
                    <th>Признак модели</th>
                    <th>Трансформация</th>
                </tr>
            </thead>
            <tbody id="tableBody">
                <!-- Данные будут вставлены через JavaScript -->
            </tbody>
        </table>
        
        <!-- Пустое состояние -->
        <div class="table-empty" id="tableEmpty" style="display: none;">
            <div class="table-empty-icon">📭</div>
            <div>Нет данных для отображения</div>
            <div style="font-size: 13px; color: #cbd5e1;">Загрузите данные через Python</div>
        </div>
    </div>
    
    <!-- Панель инструментов -->
    <div class="table-toolbar">
        <div class="table-toolbar-left">
            <!-- Поиск по таблице (опционально) -->
            <input 
                type="text" 
                class="table-search" 
                id="tableSearch" 
                placeholder="🔍 Поиск по таблице..."
                style="display: none;" <!-- Скрыт по умолчанию, можно включить -->
            >
            
            <div class="table-info">
                <div class="table-info-item">
                    <span class="table-info-dot"></span>
                    <span id="tableStats">загружено 0 строк</span>
                </div>
            </div>
        </div>
        
        <div class="table-toolbar-right">
            <button class="table-btn primary" id="tableExportBtn" title="Скачать в Excel формате">
                📥 Скачать Excel
            </button>
            <button class="table-btn" id="tableRefreshBtn" title="Обновить данные">
                🔄 Обновить
            </button>
        </div>
    </div>
</div>
`