/**
 * Просмотр графа на основе триплетов
 * Входные данные: [{node1, edge, node2}, ...]
 */

function startGraphPage() {
    // Состояние графа
    const graphState = {
        triplets: [],           // Исходные триплеты [{node1, edge, node2}]
        nodes: new Map(),        // Map id -> {id, label, x, y, vx, vy, radius}
        edges: [],              // [{from, to, label, id}]
        nodeIdMap: new Map(),    // Map label -> id для быстрого поиска
        nextNodeId: 0,
        
        // Параметры отображения
        width: 0,
        height: 0,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        
        // Параметры физики
        physicsEnabled: true,
        repulsionForce: 1000,    // Сила отталкивания
        springLength: 150,       // Желаемая длина ребра
        springForce: 0.05,       // Сила притяжения
        damping: 0.9,            // Затухание
        minRadius: 5,            // Минимальный радиус узла
        maxRadius: 20,           // Максимальный радиус узла
        
        // Интерактивность
        hoveredNode: null,
        hoveredEdge: null,
        tooltipVisible: false
    };

    // DOM элементы
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas?.getContext('2d');
    const graphLoading = document.getElementById('graphLoading');
    const nodesCountSpan = document.getElementById('nodesCount');
    const edgesCountSpan = document.getElementById('edgesCount');
    const graphTooltip = document.getElementById('graphTooltip');
    
    // Элементы управления
    const zoomSlider = document.getElementById('graphZoomSlider');
    const zoomInBtn = document.getElementById('graphZoomInBtn');
    const zoomOutBtn = document.getElementById('graphZoomOutBtn');
    const resetBtn = document.getElementById('graphResetBtn');
    const refreshBtn = document.getElementById('graphRefreshBtn');
    const layoutBtn = document.getElementById('graphLayoutBtn');

    // Инициализация
    function initGraphViewer() {
        if (!canvas || !ctx) return;
        
        // Загружаем данные графа
        loadGraphData();
        
        // Настраиваем размер canvas
        resizeCanvas();
        
        // Добавляем обработчики событий
        window.addEventListener('resize', resizeCanvas);
        
        // Обработчики мыши
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('wheel', handleWheel);
        
        // Обработчики кнопок
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(graphState.scale + 0.2));
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(graphState.scale - 0.2));
        if (zoomSlider) zoomSlider.addEventListener('input', (e) => setZoom(parseFloat(e.target.value)));
        if (resetBtn) resetBtn.addEventListener('click', resetView);
        if (refreshBtn) refreshBtn.addEventListener('click', loadGraphData);
        if (layoutBtn) layoutBtn.addEventListener('click', restartPhysics);
        
        // Запускаем анимацию
        requestAnimationFrame(animate);
    }

    // ========== МЕСТО ДЛЯ ВАШЕЙ ЛОГИКИ PYTHON ==========
    // Раскомментируйте после подключения Eel

    /*
    // Загрузка данных графа
    async function loadGraphData() {
        try {
            showLoading(true);
            
            // Вызов Python функции для получения триплетов
            // Ожидаемый формат: [{node1: "Температура", edge: "влияет", node2: "Давление"}, ...]
            const triplets = await eel.get_graph_data()();
            
            // Обрабатываем триплеты
            processTriplets(triplets);
            
            showLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки графа:', error);
            showLoading(false);
            showError('Не удалось загрузить данные графа');
        }
    }
    
    // Обновление графа (можно вызвать из Python)
    async function updateGraphData(triplets) {
        processTriplets(triplets);
    }
    */

    // ========== ВРЕМЕННАЯ ЛОГИКА ДЛЯ ТЕСТИРОВАНИЯ ==========
    
    // Заглушка загрузки данных
    async function loadGraphData() {
        showLoading(true);
        
        setTimeout(() => {
            // Тестовые триплеты
            const mockTriplets = [
                { node1: "Закупка сырья", edge: "предшествует", node2: "Производство" },
                { node1: "Производство", edge: "предшествует", node2: "Контроль качества" },
                { node1: "Контроль качества", edge: "предшествует", node2: "Упаковка" },
                { node1: "Упаковка", edge: "предшествует", node2: "Отгрузка" },
                { node1: "Температура", edge: "влияет на", node2: "Качество" },
                { node1: "Давление", edge: "влияет на", node2: "Качество" },
                { node1: "Влажность", edge: "влияет на", node2: "Качество" },
                { node1: "Качество", edge: "определяет", node2: "Сорт" },
                { node1: "Скорость", edge: "влияет на", node2: "Производительность" },
                { node1: "Производительность", edge: "связана с", node2: "Эффективность" },
                { node1: "Сырьё", edge: "поставляется", node2: "Поставщик" },
                { node1: "Поставщик", edge: "имеет", node2: "Рейтинг" },
                { node1: "Оборудование", edge: "требует", node2: "Обслуживание" },
                { node1: "Обслуживание", edge: "влияет на", node2: "Надёжность" },
                { node1: "Персонал", edge: "обеспечивает", node2: "Операции" }
            ];
            
            processTriplets(mockTriplets);
            showLoading(false);
        }, 800);
    }
    // ========== КОНЕЦ ТЕСТОВОЙ ЛОГИКИ ==========

    // ========== ОБРАБОТКА ДАННЫХ ==========
    
    // Обработка триплетов и построение графа
    function processTriplets(triplets) {
        graphState.triplets = triplets || [];
        graphState.nodes.clear();
        graphState.nodeIdMap.clear();
        graphState.edges = [];
        graphState.nextNodeId = 0;
        
        // Сначала создаём все уникальные узлы
        triplets.forEach(triplet => {
            addNodeIfNotExists(triplet.node1);
            addNodeIfNotExists(triplet.node2);
        });
        
        // Затем создаём рёбра
        triplets.forEach(triplet => {
            const fromId = graphState.nodeIdMap.get(triplet.node1);
            const toId = graphState.nodeIdMap.get(triplet.node2);
            
            if (fromId !== undefined && toId !== undefined) {
                graphState.edges.push({
                    id: `e${graphState.edges.length}`,
                    from: fromId,
                    to: toId,
                    label: triplet.edge || 'связан'
                });
            }
        });
        
        // Вычисляем радиусы узлов на основе количества связей
        calculateNodeRadii();
        
        // Размещаем узлы случайно (физика расставит их красиво)
        initializeNodePositions();
        
        // Обновляем статистику
        updateStats();
        
        // Перезапускаем физику
        restartPhysics();
    }
    
    // Добавление узла если его ещё нет
    function addNodeIfNotExists(label) {
        if (!label) return;
        
        if (!graphState.nodeIdMap.has(label)) {
            const id = graphState.nextNodeId++;
            graphState.nodeIdMap.set(label, id);
            graphState.nodes.set(id, {
                id: id,
                label: label,
                x: Math.random() * graphState.width,
                y: Math.random() * graphState.height,
                vx: 0,
                vy: 0,
                radius: 10, // Временный радиус
                connections: 0
            });
        }
        
        // Увеличиваем счётчик связей для узла
        const nodeId = graphState.nodeIdMap.get(label);
        const node = graphState.nodes.get(nodeId);
        if (node) {
            node.connections++;
        }
    }
    
    // Вычисление радиусов узлов на основе количества связей
    function calculateNodeRadii() {
        if (graphState.nodes.size === 0) return;
        
        // Находим минимум и максимум связей
        let minConnections = Infinity;
        let maxConnections = -Infinity;
        
        graphState.nodes.forEach(node => {
            minConnections = Math.min(minConnections, node.connections);
            maxConnections = Math.max(maxConnections, node.connections);
        });
        
        // Если все узлы имеют одинаковое количество связей
        if (maxConnections === minConnections) {
            graphState.nodes.forEach(node => {
                node.radius = graphState.minRadius;
            });
            return;
        }
        
        // Нормируем и вычисляем радиус
        graphState.nodes.forEach(node => {
            // Логарифмическое масштабирование для лучшей визуализации
            const logValue = Math.log(node.connections - minConnections + 1) / Math.log(maxConnections - minConnections + 1);
            node.radius = graphState.minRadius + logValue * (graphState.maxRadius - graphState.minRadius);
        });
    }
    
    // Инициализация позиций узлов
    function initializeNodePositions() {
        const centerX = graphState.width / 2;
        const centerY = graphState.height / 2;
        const radius = Math.min(graphState.width, graphState.height) * 0.4;
        
        graphState.nodes.forEach(node => {
            // Размещаем узлы по кругу со случайным смещением
            const angle = (node.id / graphState.nodes.size) * Math.PI * 2;
            node.x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50;
            node.y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50;
            node.vx = 0;
            node.vy = 0;
        });
    }
    
    // ========== ФИЗИКА ГРАФА ==========
    
    // Обновление физики
    function updatePhysics() {
        if (!graphState.physicsEnabled) return;
        
        const nodes = Array.from(graphState.nodes.values());
        const repulsion = graphState.repulsionForce;
        const springLength = graphState.springLength;
        const springForce = graphState.springForce;
        
        // Сброс сил
        nodes.forEach(node => {
            node.fx = 0;
            node.fy = 0;
        });
        
        // Силы отталкивания между узлами
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];
                
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                
                const force = repulsion / (distance * distance);
                const fx = (dx / distance) * force;
                const fy = (dy / distance) * force;
                
                a.fx = (a.fx || 0) + fx;
                a.fy = (a.fy || 0) + fy;
                b.fx = (b.fx || 0) - fx;
                b.fy = (b.fy || 0) - fy;
            }
        }
        
        // Силы притяжения по рёбрам
        graphState.edges.forEach(edge => {
            const from = graphState.nodes.get(edge.from);
            const to = graphState.nodes.get(edge.to);
            
            if (!from || !to) return;
            
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            
            const force = (distance - springLength) * springForce;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            from.fx = (from.fx || 0) + fx;
            from.fy = (from.fy || 0) + fy;
            to.fx = (to.fx || 0) - fx;
            to.fy = (to.fy || 0) - fy;
        });
        
        // Применяем силы
        nodes.forEach(node => {
            node.vx = (node.vx || 0) * graphState.damping + (node.fx || 0) * 0.1;
            node.vy = (node.vy || 0) * graphState.damping + (node.fy || 0) * 0.1;
            
            node.x += node.vx;
            node.y += node.vy;
            
            // Удерживаем в пределах canvas с отступами
            const margin = 50;
            node.x = Math.max(margin, Math.min(graphState.width - margin, node.x));
            node.y = Math.max(margin, Math.min(graphState.height - margin, node.y));
        });
    }
    
    // ========== ОТРИСОВКА ==========
    
    // Отрисовка графа
    function drawGraph() {
        if (!ctx) return;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, graphState.width, graphState.height);
        
        // Применяем трансформации
        ctx.save();
        ctx.translate(graphState.offsetX, graphState.offsetY);
        ctx.scale(graphState.scale, graphState.scale);
        
        // Рисуем рёбра
        drawEdges();
        
        // Рисуем узлы
        drawNodes();
        
        ctx.restore();
    }
    
    // Отрисовка рёбер
    function drawEdges() {
        graphState.edges.forEach(edge => {
            const from = graphState.nodes.get(edge.from);
            const to = graphState.nodes.get(edge.to);
            
            if (!from || !to) return;
            
            // Определяем цвет ребра (выделяем если наведено)
            const isHovered = graphState.hoveredEdge === edge.id;
            ctx.beginPath();
            ctx.strokeStyle = isHovered ? '#1f3a6b' : '#94a3b8';
            ctx.lineWidth = isHovered ? 3 : 2;
            
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            
            // Рисуем метку ребра (если достаточно места)
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 40 && graphState.scale > 0.7) {
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                
                ctx.font = '12px Arial';
                ctx.fillStyle = isHovered ? '#1f3a6b' : '#475569';
                ctx.shadowColor = 'white';
                ctx.shadowBlur = 4;
                ctx.fillText(edge.label, midX - 20, midY - 10);
                ctx.shadowBlur = 0;
            }
        });
    }
    
    // Отрисовка узлов
    function drawNodes() {
        graphState.nodes.forEach(node => {
            const isHovered = graphState.hoveredNode === node.id;
            
            // Рисуем круг узла
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            
            // Заливка
            ctx.fillStyle = isHovered ? '#e1eaf8' : '#f0f4fe';
            ctx.fill();
            
            // Обводка
            ctx.strokeStyle = isHovered ? '#1f3a6b' : '#b8ccf0';
            ctx.lineWidth = isHovered ? 3 : 2;
            ctx.stroke();
            
            // Рисуем метку узла
            ctx.font = `${Math.max(10, Math.floor(12 * node.radius / 10))}px Arial`;
            ctx.fillStyle = '#0b2b4f';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label.substring(0, 10), node.x, node.y);
        });
    }
    
    // ========== ИНТЕРАКТИВНОСТЬ ==========
    
    // Обработка движения мыши
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - graphState.offsetX) / graphState.scale;
        const mouseY = (e.clientY - rect.top - graphState.offsetY) / graphState.scale;
        
        // Поиск узла под мышью
        let hoveredNode = null;
        graphState.nodes.forEach(node => {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < node.radius + 5) {
                hoveredNode = node.id;
            }
        });
        
        // Поиск ребра под мышью
        let hoveredEdge = null;
        if (!hoveredNode) {
            // Упрощённая проверка попадания в ребро
            graphState.edges.forEach(edge => {
                const from = graphState.nodes.get(edge.from);
                const to = graphState.nodes.get(edge.to);
                if (!from || !to) return;
                
                // Проверка расстояния до отрезка
                const d = distanceToSegment(
                    {x: mouseX, y: mouseY},
                    {x: from.x, y: from.y},
                    {x: to.x, y: to.y}
                );
                
                if (d < 5) {
                    hoveredEdge = edge.id;
                }
            });
        }
        
        // Обновляем состояние
        graphState.hoveredNode = hoveredNode;
        graphState.hoveredEdge = hoveredEdge;
        
        // Показываем тултип
        if (hoveredNode) {
            const node = graphState.nodes.get(hoveredNode);
            showTooltip(node.label, e.clientX, e.clientY);
        } else if (hoveredEdge) {
            const edge = graphState.edges.find(e => e.id === hoveredEdge);
            showTooltip(edge.label, e.clientX, e.clientY);
        } else {
            hideTooltip();
        }
        
        // Перетаскивание
        if (graphState.isDragging) {
            graphState.offsetX = graphState.dragStart.offsetX + (e.clientX - graphState.dragStart.x);
            graphState.offsetY = graphState.dragStart.offsetY + (e.clientY - graphState.dragStart.y);
        }
    }
    
    // Расстояние от точки до отрезка
    function distanceToSegment(p, a, b) {
        const ab = {x: b.x - a.x, y: b.y - a.y};
        const ap = {x: p.x - a.x, y: p.y - a.y};
        
        const t = (ap.x * ab.x + ap.y * ab.y) / (ab.x * ab.x + ab.y * ab.y);
        
        if (t < 0) {
            return Math.sqrt((p.x - a.x) ** 2 + (p.y - a.y) ** 2);
        }
        if (t > 1) {
            return Math.sqrt((p.x - b.x) ** 2 + (p.y - b.y) ** 2);
        }
        
        const proj = {x: a.x + t * ab.x, y: a.y + t * ab.y};
        return Math.sqrt((p.x - proj.x) ** 2 + (p.y - proj.y) ** 2);
    }
    
    // Показать тултип
    function showTooltip(text, x, y) {
        if (graphTooltip) {
            graphTooltip.style.display = 'block';
            graphTooltip.style.left = x + 'px';
            graphTooltip.style.top = y - 30 + 'px';
            graphTooltip.textContent = text;
        }
    }
    
    // Скрыть тултип
    function hideTooltip() {
        if (graphTooltip) {
            graphTooltip.style.display = 'none';
        }
    }
    
    // Обработка нажатия мыши
    function handleMouseDown(e) {
        graphState.isDragging = true;
        graphState.dragStart = {
            x: e.clientX,
            y: e.clientY,
            offsetX: graphState.offsetX,
            offsetY: graphState.offsetY
        };
        canvas.style.cursor = 'grabbing';
    }
    
    // Обработка отпускания мыши
    function handleMouseUp() {
        graphState.isDragging = false;
        canvas.style.cursor = 'default';
    }
    
    // Обработка ухода мыши
    function handleMouseLeave() {
        graphState.isDragging = false;
        graphState.hoveredNode = null;
        graphState.hoveredEdge = null;
        hideTooltip();
        canvas.style.cursor = 'default';
    }
    
    // Обработка колесика (зум)
    function handleWheel(e) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const newScale = Math.max(0.2, Math.min(3, graphState.scale + delta));
        
        // Корректируем смещение, чтобы зум был относительно мыши
        graphState.offsetX -= mouseX * (newScale - graphState.scale);
        graphState.offsetY -= mouseY * (newScale - graphState.scale);
        
        graphState.scale = newScale;
        
        if (zoomSlider) zoomSlider.value = graphState.scale;
    }
    
    // ========== УПРАВЛЕНИЕ ==========
    
    // Установка зума
    function setZoom(value) {
        graphState.scale = Math.max(0.2, Math.min(3, value));
        if (zoomSlider) zoomSlider.value = graphState.scale;
    }
    
    // Сброс вида
    function resetView() {
        graphState.scale = 1;
        graphState.offsetX = 0;
        graphState.offsetY = 0;
        if (zoomSlider) zoomSlider.value = 1;
    }
    
    // Перезапуск физики
    function restartPhysics() {
        graphState.physicsEnabled = true;
    }
    
    // Остановка физики
    function stopPhysics() {
        graphState.physicsEnabled = false;
    }
    
    // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
    
    // Изменение размера canvas
    function resizeCanvas() {
        const container = canvas.parentElement;
        graphState.width = container.clientWidth;
        graphState.height = container.clientHeight;
        
        canvas.width = graphState.width;
        canvas.height = graphState.height;
    }
    
    // Обновление статистики
    function updateStats() {
        if (nodesCountSpan) {
            nodesCountSpan.textContent = graphState.nodes.size;
        }
        if (edgesCountSpan) {
            edgesCountSpan.textContent = graphState.edges.length;
        }
    }
    
    // Показать/скрыть загрузку
    function showLoading(show) {
        if (graphLoading) {
            graphLoading.style.display = show ? 'flex' : 'none';
        }
    }
    
    // Показать сообщение
    function showMessage(text) {
        console.log('✅', text);
    }
    
    // Показать ошибку
    function showError(text) {
        console.error('❌', text);
    }
    
    // Анимация
    function animate() {
        if (graphState.physicsEnabled) {
            updatePhysics();
        }
        
        drawGraph();
        requestAnimationFrame(animate);
    }
    
    // ========== ПУБЛИЧНЫЙ API ==========
    
    window.GraphViewerModule = {
        init: initGraphViewer,
        
        // Загрузка новых триплетов
        loadTriplets: function(triplets) {
            processTriplets(triplets);
        },
        
        // Получить текущие триплеты
        getTriplets: function() {
            return [...graphState.triplets];
        },
        
        // Получить статистику
        getStats: function() {
            return {
                nodes: graphState.nodes.size,
                edges: graphState.edges.length,
                triplets: graphState.triplets.length
            };
        },
        
        // Управление физикой
        enablePhysics: function() { graphState.physicsEnabled = true; },
        disablePhysics: function() { graphState.physicsEnabled = false; },
        
        // Сброс
        reset: function() {
            resetView();
            initializeNodePositions();
        }
    };

    // Автоматическая инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGraphViewer);
    } else {
        initGraphViewer();
    }
}