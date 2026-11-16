function startEntitiesPage() {
    // Состояние
    let entities = [];
    let selectedEntityId = null;

    // DOM элементы
    const entitiesList = document.getElementById('entitiesList');
    const entityDetailsForm = document.getElementById('entityDetailsForm');
    const emptyState = document.getElementById('emptyState');
    
    // Поля формы
    const entityIdInput = document.getElementById('entityId');
    const entityNameInput = document.getElementById('entityName');
    const entityTypeInput = document.getElementById('entityType');
    const entityDescriptionInput = document.getElementById('entityDescription');
    const entityAttributesInput = document.getElementById('entityAttributes');
    
    // Кнопки
    const addEntityBtn = document.getElementById('addEntityBtn');
    const saveEntityBtn = document.getElementById('saveEntityBtn');
    const updateEntityBtn = document.getElementById('updateEntityBtn');
    const deleteEntityBtn = document.getElementById('deleteEntityBtn');

    // ========== МЕСТО ДЛЯ ВАШЕЙ ЛОГИКИ PYTHON ==========
    // Раскомментируйте после подключения Eel

    /*
    // Загрузка всех сущностей
    async function loadEntities() {
        try {
            entities = await eel.get_all_entities()();
            renderEntitiesList();
            
            if (entities.length > 0 && !selectedEntityId) {
                selectEntity(entities[0].id);
            }
        } catch (error) {
            console.error('Ошибка загрузки сущностей:', error);
        }
    }
    
    // Загрузка деталей сущности
    async function loadEntityDetails(entityId) {
        try {
            const entity = await eel.get_entity_by_id(entityId)();
            if (entity) {
                fillEntityForm(entity);
                showDetailsForm(true);
            }
        } catch (error) {
            console.error('Ошибка загрузки деталей:', error);
        }
    }
    
    // Создание новой сущности
    async function createEntity() {
        try {
            const formData = getFormData();
            const newEntity = await eel.create_entity(formData)();
            await loadEntities();
            selectEntity(newEntity.id);
        } catch (error) {
            console.error('Ошибка создания сущности:', error);
        }
    }
    
    // Обновление сущности
    async function updateEntity() {
        if (!selectedEntityId) return;
        
        try {
            const formData = getFormData();
            await eel.update_entity(selectedEntityId, formData)();
            await loadEntities();
            selectEntity(selectedEntityId);
        } catch (error) {
            console.error('Ошибка обновления сущности:', error);
        }
    }
    
    // Удаление сущности
    async function deleteEntity() {
        if (!selectedEntityId) return;
        
        if (!confirm('Вы уверены, что хотите удалить эту сущность?')) return;
        
        try {
            await eel.delete_entity(selectedEntityId)();
            selectedEntityId = null;
            await loadEntities();
            clearForm();
            showDetailsForm(false);
        } catch (error) {
            console.error('Ошибка удаления сущности:', error);
        }
    }
    */

    // ========== ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ ТЕСТИРОВАНИЯ ==========
    // Удалите после подключения реального API
    
    const mockEntities = [
        { id: 1, name: 'Процесс', type: 'Класс', icon: '⚙️' },
        { id: 2, name: 'Ресурс', type: 'Класс', icon: '📦' },
        { id: 3, name: 'Роль', type: 'Класс', icon: '👤' },
        { id: 4, name: 'Событие', type: 'Класс', icon: '⚡' },
        { id: 5, name: 'Закупка сырья', type: 'Экземпляр', icon: '📋' }
    ];
    
    const mockEntityDetails = {
        1: { id: 1, name: 'Процесс', type: 'Класс', description: 'Базовый класс для всех процессов', attributes: '{"abstract": true, "parent": "Thing"}' },
        2: { id: 2, name: 'Ресурс', type: 'Класс', description: 'Материальные и нематериальные ресурсы', attributes: '{"consumable": false}' },
        3: { id: 3, name: 'Роль', type: 'Класс', description: 'Роли участников процессов', attributes: '{}' },
        4: { id: 4, name: 'Событие', type: 'Класс', description: 'Моментальные события в процессах', attributes: '{"temporal": true}' },
        5: { id: 5, name: 'Закупка сырья', type: 'Экземпляр', description: 'Процесс закупки материалов', attributes: '{"priority": "high"}' }
    };
    
    async function loadEntities() {
        setTimeout(() => {
            entities = mockEntities;
            renderEntitiesList();
            
            if (entities.length > 0 && !selectedEntityId) {
                selectEntity(entities[0].id);
            }
        }, 300);
    }
    
    async function loadEntityDetails(entityId) {
        setTimeout(() => {
            const entity = mockEntityDetails[entityId];
            if (entity) {
                fillEntityForm(entity);
                showDetailsForm(true);
            }
        }, 200);
    }
    
    async function createEntity() {
        setTimeout(() => {
            const formData = getFormData();
            const newId = Math.max(...entities.map(e => e.id)) + 1;
            const newEntity = { id: newId, ...formData, icon: '📄' };
            mockEntities.push(newEntity);
            mockEntityDetails[newId] = newEntity;
            loadEntities();
            selectEntity(newId);
        }, 300);
    }
    
    async function updateEntity() {
        setTimeout(() => {
            if (selectedEntityId) {
                const formData = getFormData();
                const index = mockEntities.findIndex(e => e.id === selectedEntityId);
                if (index !== -1) {
                    mockEntities[index] = { ...mockEntities[index], ...formData };
                    mockEntityDetails[selectedEntityId] = { ...mockEntityDetails[selectedEntityId], ...formData };
                    loadEntities();
                    selectEntity(selectedEntityId);
                }
            }
        }, 300);
    }
    
    async function deleteEntity() {
        if (!selectedEntityId) return;
        if (!confirm('Вы уверены, что хотите удалить эту сущность?')) return;
        
        setTimeout(() => {
            const index = mockEntities.findIndex(e => e.id === selectedEntityId);
            if (index !== -1) {
                mockEntities.splice(index, 1);
                delete mockEntityDetails[selectedEntityId];
                selectedEntityId = null;
                loadEntities();
                clearForm();
                showDetailsForm(false);
            }
        }, 300);
    }
    // ========== КОНЕЦ ЗАГЛУШКИ ==========

    // ========== UI ФУНКЦИИ ==========
    
    function renderEntitiesList() {
        if (!entitiesList) return;
        
        if (entities.length === 0) {
            entitiesList.innerHTML = '<div class="loading-placeholder">Нет сущностей</div>';
            return;
        }
        
        let html = '';
        entities.forEach(entity => {
            const isSelected = entity.id === selectedEntityId;
            html += `
                <div class="entity-list-item ${isSelected ? 'selected' : ''}" data-id="${entity.id}">
                    <div class="entity-icon">${entity.icon || '📄'}</div>
                    <div class="entity-info">
                        <div class="entity-name">${escapeHtml(entity.name)}</div>
                        <div class="entity-type">${escapeHtml(entity.type || '—')}</div>
                    </div>
                </div>
            `;
        });
        
        entitiesList.innerHTML = html;
        
        // Добавляем обработчики
        document.querySelectorAll('.entity-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                selectEntity(id);
            });
        });
    }
    
    function selectEntity(id) {
        selectedEntityId = id;
        renderEntitiesList();
        loadEntityDetails(id);
    }
    
    function fillEntityForm(entity) {
        entityIdInput.value = entity.id || '';
        entityNameInput.value = entity.name || '';
        entityTypeInput.value = entity.type || '';
        entityDescriptionInput.value = entity.description || '';
        
        // Форматируем JSON для читаемости
        let attributes = entity.attributes || '';
        if (typeof attributes === 'object') {
            attributes = JSON.stringify(attributes, null, 2);
        }
        entityAttributesInput.value = attributes;
    }
    
    function getFormData() {
        let attributes = entityAttributesInput.value.trim();
        try {
            // Пробуем распарсить как JSON
            if (attributes && attributes !== '{}') {
                JSON.parse(attributes);
            }
        } catch (e) {
            // Если не валидный JSON, оставляем как строку
            console.warn('Invalid JSON in attributes');
        }
        
        return {
            name: entityNameInput.value.trim(),
            type: entityTypeInput.value.trim(),
            description: entityDescriptionInput.value.trim(),
            attributes: attributes
        };
    }
    
    function clearForm() {
        entityIdInput.value = '';
        entityNameInput.value = '';
        entityTypeInput.value = '';
        entityDescriptionInput.value = '';
        entityAttributesInput.value = '';
    }
    
    function showDetailsForm(show) {
        if (entityDetailsForm && emptyState) {
            if (show) {
                entityDetailsForm.classList.add('active');
                emptyState.style.display = 'none';
            } else {
                entityDetailsForm.classList.remove('active');
                emptyState.style.display = 'flex';
            }
        }
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    
    function init() {
        loadEntities();
        
        // Обработчики кнопок
        if (addEntityBtn) {
            addEntityBtn.addEventListener('click', () => {
                clearForm();
                showDetailsForm(true);
                selectedEntityId = null;
                renderEntitiesList();
                entityNameInput.focus();
            });
        }
        
        if (saveEntityBtn) {
            saveEntityBtn.addEventListener('click', () => {
                if (selectedEntityId) {
                    updateEntity();
                } else {
                    createEntity();
                }
            });
        }
        
        if (updateEntityBtn) {
            updateEntityBtn.addEventListener('click', () => {
                if (selectedEntityId) {
                    loadEntityDetails(selectedEntityId);
                }
            });
        }
        
        if (deleteEntityBtn) {
            deleteEntityBtn.addEventListener('click', deleteEntity);
        }
    }
    
    // Экспортируем модуль
    window.EntitiesViewerModule = {
        init: init,
        refresh: loadEntities
    };
    
    // Автозапуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}