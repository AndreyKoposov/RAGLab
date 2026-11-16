var stagesPageContent = `
<!-- Структура процесса (вставьте это внутрь .content-area) -->
<div class="process-structure-container" id="processStructureContainer">
    <!-- Заголовок -->
    <div class="process-structure-header">
        <h3>
            🔄 Структура процесса
            <span id="processStructureName">выберите процесс</span>
        </h3>
        <div class="process-structure-badge" id="processStructureBadge">этапов: 0</div>
    </div>
    
    <!-- Основная область с тремя колонками -->
    <div class="process-structure-content">
        <!-- Индикатор загрузки -->
        <div class="structure-loading" id="structureLoading" style="display: none;">
            <div class="structure-loading-spinner"></div>
        </div>
        
        <!-- Левая колонка: этапы -->
        <div class="structure-column column-stages">
            <div class="column-header">
                <span>📋 Этапы</span>
                <span class="column-header-count" id="stagesCount">0</span>
            </div>
            <div class="column-content" id="stagesList">
                <div class="stages-list">
                    <!-- Этапы будут загружены через JavaScript -->
                </div>
            </div>
        </div>
        
        <!-- Центральная колонка: параметры по категориям -->
        <div class="structure-column column-parameters">
            <div class="column-header">
                <span>⚙️ Параметры этапа</span>
                <span class="column-header-count" id="parametersCount">0</span>
            </div>
            <div class="column-content" id="parametersContent">
                <div class="parameters-categories" id="parametersCategories">
                    <!-- Категории будут загружены через JavaScript -->
                </div>
            </div>
        </div>
        
        <!-- Правая колонка: информация о параметре -->
        <div class="structure-column column-info">
            <div class="column-header">
                <span>ℹ️ Информация</span>
            </div>
            <div class="column-content" id="parameterInfo">
                <div class="info-empty">
                    <div class="info-empty-icon">📌</div>
                    <div class="info-empty-text">Выберите параметр для просмотра информации</div>
                </div>
            </div>
        </div>
    </div>
</div>`