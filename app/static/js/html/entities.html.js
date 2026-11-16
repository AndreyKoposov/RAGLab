var entitiesPageContent = `
<!-- Страница просмотра сущностей (вставляется в контейнер) -->
<div class="entities-container">
    <!-- Левая колонка: список сущностей -->
    <div class="entities-list-column">
        <div class="entities-header">
            <h3>Сущности</h3>
            <button class="add-entity-btn" id="addEntityBtn">+</button>
        </div>
        <div class="entities-list" id="entitiesList">
            <!-- Сущности будут загружены через JS -->
            <div class="loading-placeholder">Загрузка...</div>
        </div>
    </div>

    <!-- Правая колонка: информация о сущности -->
    <div class="entity-details-column">
        <div class="details-header">
            <h3>Информация о сущности</h3>
        </div>
        
        <div class="entity-details-form" id="entityDetailsForm">
            <!-- Поля формы будут заполняться через JS -->
            <div class="form-group">
                <label for="entityId">ID</label>
                <input type="text" id="entityId" readonly disabled>
            </div>
            
            <div class="form-group">
                <label for="entityName">Имя <span class="required">*</span></label>
                <input type="text" id="entityName" placeholder="Введите имя сущности">
            </div>
            
            <div class="form-group">
                <label for="entityType">Тип</label>
                <input type="text" id="entityType" placeholder="Введите тип сущности">
            </div>
            
            <div class="form-group">
                <label for="entityDescription">Описание</label>
                <textarea id="entityDescription" rows="4" placeholder="Введите описание"></textarea>
            </div>
            
            <div class="form-group">
                <label for="entityAttributes">Атрибуты (JSON)</label>
                <textarea id="entityAttributes" rows="3" placeholder='{"key": "value"}'></textarea>
            </div>
            
            <div class="form-actions">
                <button class="action-btn save-btn" id="saveEntityBtn">💾 Сохранить</button>
                <button class="action-btn update-btn" id="updateEntityBtn">🔄 Обновить</button>
                <button class="action-btn delete-btn" id="deleteEntityBtn">🗑 Удалить</button>
            </div>
        </div>
        
        <div class="empty-state" id="emptyState">
            <div class="empty-icon">📦</div>
            <p>Выберите сущность из списка</p>
        </div>
    </div>
</div>`