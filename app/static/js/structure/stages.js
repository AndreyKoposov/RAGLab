/**
 * Структура процесса - клиентская часть для Eel
 * Три колонки: этапы -> параметры этапа -> информация о параметре
 */

function startStagesPage() {
    // Состояние компонента
    const structureState = {
        stages: [],              // Список этапов
        currentStageId: null,    // ID выбранного этапа
        currentParameterId: null, // ID выбранного параметра
        parameters: [],          // Параметры текущего этапа (с категориями)
        isLoading: false,
        categories: [
            { id: 'input', name: 'Входные', icon: '📥' },
            { id: 'control', name: 'Управляющие', icon: '🎮' },
            { id: 'resource', name: 'Ресурсные', icon: '📦' },
            { id: 'output', name: 'Выходные', icon: '📤' }
        ]
    };

    // DOM элементы
    const container = document.getElementById('processStructureContainer');
    const structureName = document.getElementById('processStructureName');
    const structureBadge = document.getElementById('processStructureBadge');
    const stagesList = document.getElementById('stagesList');
    const stagesCount = document.getElementById('stagesCount');
    const parametersContent = document.getElementById('parametersContent');
    const parametersCategories = document.getElementById('parametersCategories');
    const parametersCount = document.getElementById('parametersCount');
    const parameterInfo = document.getElementById('parameterInfo');
    const structureLoading = document.getElementById('structureLoading');

    // Инициализация
    function initProcessStructure(processId = null) {
        if (!stagesList) return;
        
        // Загружаем этапы для процесса
        loadStages(processId);
    }

    // ========== МЕСТО ДЛЯ ВАШЕЙ ЛОГИКИ PYTHON ==========
    // Раскомментируйте после подключения Eel

    /*
    // Загрузка этапов процесса
    async function loadStages(processId) {
        try {
            showLoading(true);
            
            // Вызов Python функции для получения этапов
            // Ожидаемый формат: [{ id: 1, name: 'Этап 1', description: '...', paramCount: 5 }, ...]
            const stages = await eel.get_process_stages(processId)();
            
            structureState.stages = stages || [];
            renderStages();
            
            // Если есть этапы, выбираем первый
            if (stages && stages.length > 0) {
                selectStage(stages[0].id);
            } else {
                clearParameters();
                clearParameterInfo();
            }
            
            updateStats();
            showLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки этапов:', error);
            showLoading(false);
            showError('Не удалось загрузить этапы процесса');
        }
    }
    
    // Загрузка параметров этапа
    async function loadStageParameters(stageId) {
        try {
            showLoading(true);
            
            // Вызов Python функции для получения параметров этапа
            // Ожидаемый формат: {
            //   input: [{ id: 1, name: 'Параметр 1', type: 'string', ... }, ...],
            //   control: [...],
            //   resource: [...],
            //   output: [...]
            // }
            const parameters = await eel.get_stage_parameters(stageId)();
            
            structureState.parameters = parameters || {};
            structureState.currentStageId = stageId;
            
            renderParameters();
            updateStats();
            showLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки параметров:', error);
            showLoading(false);
            showError('Не удалось загрузить параметры этапа');
        }
    }
    
    // Загрузка информации о параметре
    async function loadParameterInfo(parameterId, category) {
        try {
            showLoading(true);
            
            // Вызов Python функции для получения информации о параметре
            // Ожидаемый формат: {
            //   id: 1,
            //   name: 'Температура',
            //   measure: '°C',
            //   description: 'Описание параметра',
            //   type: 'continuous',
            //   min: 0,
            //   max: 100,
            //   unit: 'градус Цельсия',
            //   constraints: '...',
            //   source: 'ГОСТ ...'
            // }
            const info = await eel.get_parameter_info(parameterId, category)();
            
            structureState.currentParameterId = parameterId;
            renderParameterInfo(info);
            
            showLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки информации о параметре:', error);
            showLoading(false);
            showError('Не удалось загрузить информацию о параметре');
        }
    }
    
    // Выбор процесса (можно вызвать из основного приложения)
    async function setProcess(processId) {
        await loadStages(processId);
        if (structureState.stages.length > 0) {
            structureName.textContent = `процесс #${processId}`;
        }
    }
    */

    // ========== ВРЕМЕННАЯ ЛОГИКА ДЛЯ ТЕСТИРОВАНИЯ ==========
    
    // Заглушка загрузки этапов
    async function loadStages(processId) {
        showLoading(true);
        
        setTimeout(() => {
            const mockStages = [
                { 
                    id: 1, 
                    name: 'Подготовка сырья', 
                    description: 'Подготовка и предварительная обработка материалов',
                    paramCount: 8,
                    duration: '2-3 часа'
                },
                { 
                    id: 2, 
                    name: 'Смешивание компонентов', 
                    description: 'Смешивание в заданных пропорциях',
                    paramCount: 12,
                    duration: '1 час'
                },
                { 
                    id: 3, 
                    name: 'Термическая обработка', 
                    description: 'Нагрев до заданной температуры',
                    paramCount: 15,
                    duration: '4 часа'
                },
                { 
                    id: 4, 
                    name: 'Охлаждение', 
                    description: 'Контролируемое охлаждение',
                    paramCount: 6,
                    duration: '2 часа'
                },
                { 
                    id: 5, 
                    name: 'Контроль качества', 
                    description: 'Проверка соответствия спецификациям',
                    paramCount: 10,
                    duration: '1 час'
                }
            ];
            
            structureState.stages = mockStages;
            renderStages();
            
            // Выбираем первый этап
            if (mockStages.length > 0) {
                selectStage(mockStages[0].id);
            }
            
            structureName.textContent = processId ? `процесс #${processId}` : 'производственный процесс';
            updateStats();
            showLoading(false);
        }, 500);
    }
    
    // Заглушка загрузки параметров этапа
    async function loadStageParameters(stageId) {
        showLoading(true);
        
        setTimeout(() => {
            const mockParameters = {
                input: [
                    { id: 101, name: 'Сырьё основное', type: 'material', measure: 'кг', description: 'Основной материал' },
                    { id: 102, name: 'Сырьё вспомогательное', type: 'material', measure: 'кг', description: 'Добавки' },
                    { id: 103, name: 'Вода', type: 'resource', measure: 'л', description: 'Техническая вода' }
                ],
                control: [
                    { id: 201, name: 'Температура', type: 'continuous', measure: '°C', description: 'Рабочая температура', min: 20, max: 80 },
                    { id: 202, name: 'Давление', type: 'continuous', measure: 'атм', description: 'Давление в системе' },
                    { id: 203, name: 'Скорость подачи', type: 'continuous', measure: 'кг/ч', description: 'Скорость подачи материала' }
                ],
                resource: [
                    { id: 301, name: 'Электроэнергия', type: 'resource', measure: 'кВт·ч', description: 'Потребляемая мощность' },
                    { id: 302, name: 'Персонал', type: 'human', measure: 'чел.', description: 'Количество операторов' },
                    { id: 303, name: 'Оборудование', type: 'equipment', measure: 'ед.', description: 'Единицы оборудования' }
                ],
                output: [
                    { id: 401, name: 'Полуфабрикат', type: 'product', measure: 'кг', description: 'Выход продукта' },
                    { id: 402, name: 'Отходы', type: 'waste', measure: 'кг', description: 'Количество отходов' }
                ]
            };
            
            structureState.parameters = mockParameters;
            structureState.currentStageId = stageId;
            
            renderParameters();
            updateStats();
            showLoading(false);
        }, 400);
    }
    
    // Заглушка загрузки информации о параметре
    async function loadParameterInfo(parameterId, category) {
        showLoading(true);
        
        setTimeout(() => {
            const mockInfo = {
                id: parameterId,
                name: parameterId === 101 ? 'Сырьё основное' : 
                      parameterId === 201 ? 'Температура' :
                      parameterId === 301 ? 'Электроэнергия' :
                      parameterId === 401 ? 'Полуфабрикат' : 'Параметр',
                measure: parameterId === 101 ? 'кг' :
                         parameterId === 201 ? '°C' :
                         parameterId === 301 ? 'кВт·ч' :
                         parameterId === 401 ? 'кг' : 'ед.',
                description: 'Подробное описание параметра. Здесь может быть указана дополнительная информация о способах измерения, требованиях к точности, допустимых отклонениях и т.д.',
                type: category === 'input' ? 'Материальный' :
                      category === 'control' ? 'Управляющий' :
                      category === 'resource' ? 'Ресурсный' : 'Выходной',
                min: parameterId === 201 ? 20 : null,
                max: parameterId === 201 ? 80 : null,
                unit: parameterId === 101 ? 'килограмм' :
                      parameterId === 201 ? 'градус Цельсия' :
                      parameterId === 301 ? 'киловатт-час' : '',
                constraints: 'Допустимое отклонение: ±5%',
                source: 'Технологический регламент',
                frequency: 'Каждые 30 минут',
                method: 'Прямое измерение'
            };
            
            structureState.currentParameterId = parameterId;
            renderParameterInfo(mockInfo);
            
            showLoading(false);
        }, 300);
    }
    // ========== КОНЕЦ ТЕСТОВОЙ ЛОГИКИ ==========

    // ========== UI ФУНКЦИИ ==========
    
    // Отрисовка списка этапов
    function renderStages() {
        if (!stagesList) return;
        
        const stagesContainer = stagesList.querySelector('.stages-list') || stagesList;
        
        if (structureState.stages.length === 0) {
            stagesContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #94a3b8;">
                    Нет этапов для отображения
                </div>
            `;
            return;
        }
        
        let html = '';
        structureState.stages.forEach(stage => {
            const isSelected = stage.id === structureState.currentStageId;
            html += `
                <div class="stage-item ${isSelected ? 'selected' : ''}" data-stage-id="${stage.id}">
                    <div class="stage-name">${escapeHtml(stage.name)}</div>
                    <div class="stage-meta">
                        <span>📊 ${stage.paramCount || 0} параметров</span>
                        <span>⏱️ ${stage.duration || '—'}</span>
                    </div>
                </div>
            `;
        });
        
        stagesContainer.innerHTML = html;
        
        // Добавляем обработчики
        stagesContainer.querySelectorAll('.stage-item').forEach(item => {
            item.addEventListener('click', () => {
                const stageId = parseInt(item.dataset.stageId);
                selectStage(stageId);
            });
        });
        
        stagesCount.textContent = structureState.stages.length;
    }
    
    // Отрисовка параметров по категориям
    function renderParameters() {
        if (!parametersCategories) return;
        
        const params = structureState.parameters;
        
        if (!params || Object.keys(params).length === 0) {
            parametersCategories.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #94a3b8;">
                    Нет параметров для выбранного этапа
                </div>
            `;
            parametersCount.textContent = '0';
            return;
        }
        
        let totalParams = 0;
        let html = '';
        
        structureState.categories.forEach(category => {
            const categoryParams = params[category.id] || [];
            totalParams += categoryParams.length;
            
            if (categoryParams.length === 0) return;
            
            html += `
                <div class="parameter-category" data-category="${category.id}">
                    <div class="category-header">
                        <span class="category-header-icon">${category.icon}</span>
                        ${category.name}
                        <span style="margin-left: auto; font-size: 12px; color: #64748b;">${categoryParams.length}</span>
                    </div>
                    <div class="category-items">
            `;
            
            categoryParams.forEach(param => {
                const isSelected = param.id === structureState.currentParameterId;
                html += `
                    <div class="parameter-item ${isSelected ? 'selected' : ''}" 
                         data-param-id="${param.id}" 
                         data-category="${category.id}">
                        <div class="parameter-name">${escapeHtml(param.name)}</div>
                        <div class="parameter-type">
                            <span class="parameter-type-badge">${escapeHtml(param.type || '—')}</span>
                            <span>${escapeHtml(param.measure || '—')}</span>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        parametersCategories.innerHTML = html;
        parametersCount.textContent = totalParams;
        
        // Добавляем обработчики
        parametersCategories.querySelectorAll('.parameter-item').forEach(item => {
            item.addEventListener('click', () => {
                const paramId = parseInt(item.dataset.paramId);
                const category = item.dataset.category;
                selectParameter(paramId, category);
            });
        });
    }
    
    // Отрисовка информации о параметре
    function renderParameterInfo(info) {
        if (!parameterInfo) return;
        
        if (!info) {
            parameterInfo.innerHTML = `
                <div class="info-empty">
                    <div class="info-empty-icon">📌</div>
                    <div class="info-empty-text">Выберите параметр для просмотра информации</div>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="parameter-info">
                <div class="info-section">
                    <div class="info-section-title">Основная информация</div>
                    <div class="info-grid">
                        <div class="info-row">
                            <span class="info-label">Название:</span>
                            <span class="info-value">${escapeHtml(info.name || '—')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Тип:</span>
                            <span class="info-value">${escapeHtml(info.type || '—')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Мера:</span>
                            <span class="info-value">${escapeHtml(info.measure || '—')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Единица:</span>
                            <span class="info-value">${escapeHtml(info.unit || info.measure || '—')}</span>
                        </div>
                    </div>
                </div>
        `;
        
        if (info.min !== undefined || info.max !== undefined) {
            html += `
                <div class="info-section">
                    <div class="info-section-title">Диапазон значений</div>
                    <div class="info-grid">
                        ${info.min !== undefined ? `
                            <div class="info-row">
                                <span class="info-label">Минимум:</span>
                                <span class="info-value">${info.min} ${info.unit || ''}</span>
                            </div>
                        ` : ''}
                        ${info.max !== undefined ? `
                            <div class="info-row">
                                <span class="info-label">Максимум:</span>
                                <span class="info-value">${info.max} ${info.unit || ''}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        html += `
            <div class="info-section">
                <div class="info-section-title">Описание</div>
                <div class="info-description">
                    ${escapeHtml(info.description || 'Нет описания')}
                </div>
            </div>
        `;
        
        if (info.constraints || info.source || info.frequency || info.method) {
            html += `
                <div class="info-section">
                    <div class="info-section-title">Дополнительно</div>
                    <div class="info-grid">
            `;
            
            if (info.constraints) {
                html += `
                    <div class="info-row">
                        <span class="info-label">Ограничения:</span>
                        <span class="info-value">${escapeHtml(info.constraints)}</span>
                    </div>
                `;
            }
            
            if (info.source) {
                html += `
                    <div class="info-row">
                        <span class="info-label">Источник:</span>
                        <span class="info-value">${escapeHtml(info.source)}</span>
                    </div>
                `;
            }
            
            if (info.frequency) {
                html += `
                    <div class="info-row">
                        <span class="info-label">Периодичность:</span>
                        <span class="info-value">${escapeHtml(info.frequency)}</span>
                    </div>
                `;
            }
            
            if (info.method) {
                html += `
                    <div class="info-row">
                        <span class="info-label">Метод:</span>
                        <span class="info-value">${escapeHtml(info.method)}</span>
                    </div>
                `;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
        
        parameterInfo.innerHTML = html;
    }
    
    // Выбор этапа
    function selectStage(stageId) {
        if (stageId === structureState.currentStageId) return;
        
        structureState.currentStageId = stageId;
        structureState.currentParameterId = null;
        
        // Подсвечиваем выбранный этап
        document.querySelectorAll('.stage-item').forEach(item => {
            item.classList.toggle('selected', parseInt(item.dataset.stageId) === stageId);
        });
        
        // Загружаем параметры этапа
        loadStageParameters(stageId);
        
        // Очищаем информацию о параметре
        renderParameterInfo(null);
    }
    
    // Выбор параметра
    function selectParameter(paramId, category) {
        if (paramId === structureState.currentParameterId) return;
        
        structureState.currentParameterId = paramId;
        
        // Подсвечиваем выбранный параметр
        document.querySelectorAll('.parameter-item').forEach(item => {
            item.classList.toggle('selected', parseInt(item.dataset.paramId) === paramId);
        });
        
        // Загружаем информацию о параметре
        loadParameterInfo(paramId, category);
    }
    
    // Очистка параметров
    function clearParameters() {
        structureState.parameters = {};
        structureState.currentParameterId = null;
        
        if (parametersCategories) {
            parametersCategories.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #94a3b8;">
                    Выберите этап для просмотра параметров
                </div>
            `;
        }
        parametersCount.textContent = '0';
    }
    
    // Очистка информации о параметре
    function clearParameterInfo() {
        structureState.currentParameterId = null;
        
        if (parameterInfo) {
            parameterInfo.innerHTML = `
                <div class="info-empty">
                    <div class="info-empty-icon">📌</div>
                    <div class="info-empty-text">Выберите параметр для просмотра информации</div>
                </div>
            `;
        }
    }
    
    // Обновление статистики
    function updateStats() {
        const stageCount = structureState.stages.length;
        structureBadge.textContent = `этапов: ${stageCount}`;
    }
    
    // Показать/скрыть загрузку
    function showLoading(show) {
        structureState.isLoading = show;
        structureLoading.style.display = show ? 'flex' : 'none';
    }
    
    // Показать сообщение
    function showMessage(text) {
        console.log('✅', text);
    }
    
    // Показать ошибку
    function showError(text) {
        console.error('❌', text);
    }
    
    // Экранирование HTML
    function escapeHtml(text) {
        if (!text && text !== 0) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ========== ПУБЛИЧНЫЙ API ==========
    
    window.ProcessStructureModule = {
        init: initProcessStructure,
        
        // Загрузка структуры для конкретного процесса
        loadProcess: function(processId) {
            loadStages(processId);
        },
        
        // Установить название процесса
        setProcessName: function(name) {
            structureName.textContent = name || 'процесс';
        },
        
        // Получить текущий выбранный этап
        getCurrentStage: function() {
            if (!structureState.currentStageId) return null;
            return structureState.stages.find(s => s.id === structureState.currentStageId) || null;
        },
        
        // Получить текущий выбранный параметр
        getCurrentParameter: function() {
            return structureState.currentParameterId;
        },
        
        // Очистить все данные
        clear: function() {
            structureState.stages = [];
            structureState.parameters = {};
            structureState.currentStageId = null;
            structureState.currentParameterId = null;
            
            renderStages();
            clearParameters();
            clearParameterInfo();
            updateStats();
        }
    };

    // Автоматическая инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProcessStructure);
    } else {
        initProcessStructure();
    }
}