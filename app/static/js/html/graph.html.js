var graphPageContent = `
<!-- Просмотр графа (вставьте это внутрь .content-area) -->
<div class="graph-container" id="graphContainer">
    <!-- Заголовок -->
    <div class="graph-header">
        <h3>
            🕸️ Граф процессов
            <span id="graphType">онтологический граф</span>
        </h3>
        <div class="graph-stats" id="graphStats">
            <div class="graph-stat-item">Вершин: <span id="nodesCount">0</span></div>
            <div class="graph-stat-item">Рёбер: <span id="edgesCount">0</span></div>
        </div>
    </div>
    
    <!-- Область отображения графа -->
    <div class="graph-view-area">
        <!-- Индикатор загрузки -->
        <div class="graph-loading" id="graphLoading" style="display: none;">
            <div class="graph-loading-spinner"></div>
        </div>
        
        <!-- Canvas для рисования графа -->
        <canvas id="graphCanvas"></canvas>
        
        <!-- Tooltip для отображения информации при наведении -->
        <div id="graphTooltip" class="graph-tooltip" style="display: none;"></div>
    </div>
    
    <!-- Панель управления -->
    <div class="graph-controls">
        <div class="graph-controls-left">
            <button class="graph-btn" id="graphZoomInBtn" title="Приблизить">➕</button>
            <input type="range" class="graph-zoom-slider" id="graphZoomSlider" min="0.2" max="2" step="0.1" value="1">
            <button class="graph-btn" id="graphZoomOutBtn" title="Отдалить">➖</button>
            <button class="graph-btn" id="graphResetBtn" title="Сбросить вид">⟲ Сброс</button>
        </div>
        <div class="graph-controls-right">
            <button class="graph-btn" id="graphRefreshBtn" title="Обновить граф">🔄 Обновить</button>
            <button class="graph-btn primary" id="graphLayoutBtn" title="Перестроить граф">⚡ Перестроить</button>
        </div>
    </div>
</div>`