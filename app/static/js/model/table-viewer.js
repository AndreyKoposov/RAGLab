/**
 * Таблица для просмотра данных - клиентская часть для Eel
 * Вся бизнес-логика на стороне Python
 */

function startTablePage() {
    // Состояние таблицы
    const tableState = {
        data: [],                // Исходные данные [{ param: '', feature: '', transformation: '' }]
        filteredData: [],         // Отфильтрованные данные (для поиска)
        isLoading: false,
        currentFilter: '',        // Текущий фильтр поиска
        columns: [
            { field: 'param', label: 'Параметр' },
            { field: 'feature', label: 'Признак модели' },
            { field: 'transformation', label: 'Трансформация' }
        ]
    };

    // DOM элементы
    const tableContainer = document.getElementById('tableContainer');
    const tableBody = document.getElementById('tableBody');
    const tableWrapper = document.getElementById('tableWrapper');
    const tableLoading = document.getElementById('tableLoading');
    const tableEmpty = document.getElementById('tableEmpty');
    const tableRowCount = document.getElementById('tableRowCount');
    const tableStats = document.getElementById('tableStats');
    const tableType = document.getElementById('tableType');
    
    // Кнопки и элементы управления
    const tableExportBtn = document.getElementById('tableExportBtn');
    const tableRefreshBtn = document.getElementById('tableRefreshBtn');
    const tableSearch = document.getElementById('tableSearch');

    // Инициализация таблицы
    function initTableViewer() {
        if (!tableBody) return;
        
        // Загружаем данные
        loadTableData();
        
        // Добавляем обработчики событий
        if (tableExportBtn) {
            tableExportBtn.addEventListener('click', exportToExcel);
        }
        
        if (tableRefreshBtn) {
            tableRefreshBtn.addEventListener('click', refreshData);
        }
        
        if (tableSearch) {
            tableSearch.addEventListener('input', handleSearch);
        }
    }

    // ========== МЕСТО ДЛЯ ВАШЕЙ ЛОГИКИ PYTHON ==========
    // Раскомментируйте после подключения Eel

    /*
    // Загрузка данных с сервера
    async function loadTableData() {
        try {
            showLoading(true);
            
            // Вызов Python функции для получения данных
            // Ожидаемый формат: [{ param: '', feature: '', transformation: '' }, ...]
            const data = await eel.get_table_data()();
            
            // Обновляем состояние
            tableState.data = data || [];
            tableState.filteredData = [...tableState.data];
            
            // Обновляем отображение
            renderTable();
            updateStats();
            
            showLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            showLoading(false);
            showError('Не удалось загрузить данные таблицы');
        }
    }
    
    // Экспорт в Excel
    async function exportToExcel() {
        try {
            showLoading(true);
            
            // Вызов Python функции для экспорта
            const result = await eel.export_table_to_excel(tableState.data)();
            
            if (result.success) {
                showMessage('Файл Excel успешно скачан');
            } else {
                showError('Ошибка экспорта: ' + (result.error || 'Неизвестная ошибка'));
            }
            
            showLoading(false);
        } catch (error) {
            console.error('Ошибка экспорта в Excel:', error);
            showLoading(false);
            showError('Не удалось экспортировать данные');
        }
    }
    
    // Обновление данных
    async function refreshData() {
        await loadTableData();
    }
    
    // Установка типа таблицы (опционально)
    async function setTableType(type) {
        try {
            const result = await eel.get_table_info(type)();
            if (result && result.title) {
                tableType.textContent = result.title;
            }
        } catch (error) {
            console.error('Ошибка получения информации о таблице:', error);
        }
    }
    */

    // ========== ВРЕМЕННАЯ ЛОГИКА ДЛЯ ТЕСТИРОВАНИЯ ==========
    
    // Заглушка загрузки данных
    async function loadTableData() {
        showLoading(true);
        
        // Имитация загрузки с сервера
        setTimeout(() => {
            // Тестовые данные
            const mockData = [
                { 
                    param: 'Температура плавления', 
                    feature: 'Термическое свойство', 
                    transformation: 'Нормировка [0,1]' 
                },
                { 
                    param: 'Плотность материала', 
                    feature: 'Физическое свойство', 
                    transformation: 'Логарифмическое масштабирование' 
                },
                { 
                    param: 'Время реакции', 
                    feature: 'Кинетический параметр', 
                    transformation: 'Обратное преобразование' 
                },
                { 
                    param: 'Концентрация реагента', 
                    feature: 'Химический состав', 
                    transformation: 'Стандартизация (Z-score)' 
                },
                { 
                    param: 'Давление в системе', 
                    feature: 'Термодинамический параметр', 
                    transformation: 'Без преобразования' 
                },
                { 
                    param: 'Размер частиц', 
                    feature: 'Морфологический признак', 
                    transformation: 'Квантильное преобразование' 
                },
                { 
                    param: 'pH среды', 
                    feature: 'Химическая активность', 
                    transformation: 'Категоризация (кислый/нейтральный/щелочной)' 
                },
                { 
                    param: 'Электропроводность', 
                    feature: 'Электрическое свойство', 
                    transformation: 'Масштабирование [0,100]' 
                },
                { 
                    param: 'Вязкость', 
                    feature: 'Реологическое свойство', 
                    transformation: 'Логарифмическое' 
                },
                { 
                    param: 'Пористость', 
                    feature: 'Структурный признак', 
                    transformation: 'Процентное отношение' 
                }
            ];
            
            tableState.data = mockData;
            tableState.filteredData = [...mockData];
            
            renderTable();
            updateStats();
            
            showLoading(false);
        }, 800);
    }
    
    // Заглушка экспорта в Excel
    async function exportToExcel() {
        showLoading(true);
        
        setTimeout(() => {
            showLoading(false);
            
            // Создаем CSV для демонстрации
            const headers = ['Параметр', 'Признак модели', 'Трансформация'];
            const csvContent = [
                headers.join(','),
                ...tableState.filteredData.map(row => 
                    `"${row.param}","${row.feature}","${row.transformation}"`
                )
            ].join('\n');
            
            // Скачиваем как CSV (в реальном приложении будет Excel от Python)
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'table_export.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showMessage('Файл скачан (тестовый CSV)');
        }, 500);
    }
    
    // Заглушка обновления
    async function refreshData() {
        await loadTableData();
    }
    // ========== КОНЕЦ ТЕСТОВОЙ ЛОГИКИ ==========

    // ========== UI ФУНКЦИИ ==========
    
    // Отрисовка таблицы
    function renderTable() {
        if (!tableBody) return;
        
        const dataToRender = tableState.filteredData;
        
        // Показываем/скрываем пустое состояние
        if (dataToRender.length === 0) {
            tableBody.innerHTML = '';
            tableEmpty.style.display = 'flex';
            return;
        }
        
        tableEmpty.style.display = 'none';
        
        // Создаем строки таблицы
        let html = '';
        dataToRender.forEach((row, index) => {
            html += `
                <tr>
                    <td>${escapeHtml(row.param || '')}</td>
                    <td>${escapeHtml(row.feature || '')}</td>
                    <td>${escapeHtml(row.transformation || '')}</td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    // Обновление статистики
    function updateStats() {
        const totalRows = tableState.data.length;
        const displayedRows = tableState.filteredData.length;
        
        tableRowCount.textContent = `${totalRows} записей`;
        
        if (totalRows === displayedRows) {
            tableStats.textContent = `загружено ${totalRows} строк`;
        } else {
            tableStats.textContent = `показано ${displayedRows} из ${totalRows}`;
        }
    }
    
    // Обработка поиска
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        tableState.currentFilter = searchTerm;
        
        if (!searchTerm) {
            // Сброс фильтра
            tableState.filteredData = [...tableState.data];
        } else {
            // Фильтрация по всем полям
            tableState.filteredData = tableState.data.filter(row => {
                return (
                    (row.param && row.param.toLowerCase().includes(searchTerm)) ||
                    (row.feature && row.feature.toLowerCase().includes(searchTerm)) ||
                    (row.transformation && row.transformation.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        renderTable();
        updateStats();
    }
    
    // Экранирование HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Показать/скрыть загрузку
    function showLoading(show) {
        tableState.isLoading = show;
        tableLoading.style.display = show ? 'flex' : 'none';
        
        // Блокируем кнопки во время загрузки
        if (tableExportBtn) tableExportBtn.disabled = show;
        if (tableRefreshBtn) tableRefreshBtn.disabled = show;
    }
    
    // Показать сообщение
    function showMessage(text) {
        console.log('✅', text);
        // Здесь можно добавить тостер или уведомление
    }
    
    // Показать ошибку
    function showError(text) {
        console.error('❌', text);
        // Здесь можно добавить тостер или уведомление
    }
    
    // ========== ПУБЛИЧНЫЙ API ==========
    
    window.TableViewerModule = {
        init: initTableViewer,
        
        // Загрузка новых данных (можно вызвать из Python)
        setData: function(data) {
            tableState.data = data || [];
            tableState.filteredData = [...tableState.data];
            tableState.currentFilter = '';
            
            if (tableSearch) {
                tableSearch.value = '';
            }
            
            renderTable();
            updateStats();
        },
        
        // Получить текущие данные
        getData: function() {
            return [...tableState.data];
        },
        
        // Получить отфильтрованные данные
        getFilteredData: function() {
            return [...tableState.filteredData];
        },
        
        // Обновить данные (вызовет загрузку с сервера)
        refresh: function() {
            refreshData();
        },
        
        // Очистить таблицу
        clear: function() {
            tableState.data = [];
            tableState.filteredData = [];
            renderTable();
            updateStats();
        },
        
        // Показать/скрыть поиск
        toggleSearch: function(show) {
            if (tableSearch) {
                tableSearch.style.display = show ? 'block' : 'none';
            }
        }
    };

    // Автоматическая инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTableViewer);
    } else {
        initTableViewer();
    }
}