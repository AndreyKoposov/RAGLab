window.onload = function() {
    initGUI();
}

async function initGUI() {
    // // ========== DOM ЭЛЕМЕНТЫ ==========
    const processItems = document.getElementById('processItems');
    const processCount = document.getElementById('processCount');
    const addProcessBtn = document.getElementById('addProcessBtn');
    const subBtnBar = document.getElementById('sub-btn-bar')

    // Основные кнопки
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    const btn3 = document.getElementById('btn3');
    const btn4 = document.getElementById('btn4');
    const allBtns = [btn1, btn2, btn3, btn4];

    // Область оснвного контента
    const contentArea = document.getElementById('contentArea');

    // Боковые панели и их кнопки
    const leftBar = document.getElementById("process-list")
    const rightBar = document.getElementById("chatPanel")
    const leftBtn = document.getElementById("hide-leftbar-btn")
    const rightBtn = document.getElementById("hide-rightbar-btn")

    // Обработчики сокрытия/октрытия боковых панелей
    leftBtn.addEventListener('click', function(e) {
        const closed = leftBar.style.display === "none";
        leftBar.style.display = closed ? "flex" : "none";

        const span = leftBtn.getElementsByTagName('span')[0]
        span.innerHTML = closed ? "◀" : "▶";
    });
    rightBtn.addEventListener('click', function(e) {
        const closed = rightBar.style.display === "none";
        rightBar.style.display = closed ? "flex" : "none";

        const span = rightBtn.getElementsByTagName('span')[0]
        span.innerHTML = closed ? "▶" : "◀";
    });

    // Функция сброса активного класса кнопок и установки нового
    function setActiveButton(activeBtn) {
        allBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    // Функция сброса активного класса кнопок под-меню
    function setActiveSubButton(activeBtnId) {
        document.querySelectorAll('.sub-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.getElementById('sub-btn-' + activeBtnId)
        activeBtn.classList.add('active');
    }

    // Функция установки основного контента
    function setContent(btnNumber) {
        if (btnNumber == 1)
            renderSubBtns(getStructureSubBtns())
        if (btnNumber == 2)
            renderSubBtns(getAnalyzeSubBtns())
        if (btnNumber == 3)
            renderSubBtns(getOntologySubBtns())
        if (btnNumber == 4)
            renderSubBtns(getPredictSubBtns())
    }

    // Отрисовка кнопок под-меню
    function renderSubBtns(btns) {
        subBtnBar.innerHTML = '';
        btns.forEach(btn => {
            const btnElement = document.createElement('button');

            btnElement.className = 'tab-btn sub-btn';
            btnElement.id = "sub-btn-" + btn.id
            btnElement.data_id = btn.id
            btnElement.innerHTML = btn.name;
            
            subBtnBar.appendChild(btnElement);

            btnElement.addEventListener('click', (e) => { 
                contentArea.innerHTML = btn.getContent();
                btn.start();
                setActiveSubButton(btn.id);
            });
        });
    }

    // ========== МОДАЛЬНОЕ ОКНО ==========
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal">
            <h3 id="modalTitle">Новый процесс</h3>
            <input type="text" class="modal-input" id="processNameInput" placeholder="Введите название процесса">
            <div class="modal-buttons">
                <button class="modal-btn cancel" id="modalCancel">Отмена</button>
                <button class="modal-btn save" id="modalSave">Сохранить</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // Элементы модального окна
    const modalTitle = document.getElementById('modalTitle');
    const processNameInput = document.getElementById('processNameInput');
    const modalCancel = document.getElementById('modalCancel');
    const modalSave = document.getElementById('modalSave');

    // Состояние модального окна
    let currentEditId = null;
    let deleteMode = false;

    // Функция открытия модального окна для создания
    function openCreateModal() {
        currentEditId = null;
        modalTitle.textContent = 'Новый процесс';
        processNameInput.value = '';
        modalOverlay.classList.add('active');
        processNameInput.focus();
    }
    // Функция открытия модального окна для редактирования
    function openEditModal(id) {
        const process = processes.find(p => p.id === id);
        if (process) {
            currentEditId = id;
            modalTitle.textContent = 'Редактировать процесс';
            processNameInput.value = process.name;
            modalOverlay.classList.add('active');
            processNameInput.focus();
        }
        else {
            console.log("Cant find process with id " + id)
        }
    }
    // Функция открытия модального окна для удаления
    function openDeleteModal(id) {
        deleteMode = true;
        const process = processes.find(p => p.id === id);
        if (process) {
            currentEditId = id;
            modalTitle.textContent = 'Удаление процесса! Введите "' + process.name + '"';
            processNameInput.value = '';
            modalOverlay.classList.add('active');
            processNameInput.focus();
        }
        else {
            console.log("Cant find process with id " + process.id)
        }
    }
    // Функция закрытия модального окна
    function closeModal() {
        modalOverlay.classList.remove('active');
        processNameInput.value = '';
        currentEditId = null;
        deleteMode = false;
    }
    // Обработчики для модального окна
    addProcessBtn.addEventListener('click', openCreateModal);
    modalCancel.addEventListener('click', closeModal);
    modalSave.addEventListener('click', saveProcess);
    // Закрытие по клику на оверлей
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // ========== УПРАВЛЕНИЕ ПРОЦЕССАМИ ==========
    let processes = []
    let selectedProcessId = undefined;

    // Получение процессов с сервера 
    async function fetch_processes() {
        // Очистка списка процессов
        processes = []
        infos = await api_processes_get()
        // Добавляем процессы в список
        for (let i = 0; i < infos.length; i++) {
            pr_id = infos[i]["id"]
            pr_name = infos[i]["name"]
            pr_avatar = infos[i]["avatar"]
            pr_created = infos[i]["created"]
            pr_option = infos[i]["option"]
            pr_count = infos[i]["count"]

            processes.push({ id: pr_id, name: pr_name, avatar: pr_avatar, badge: pr_count + ' элемента', meta: pr_created, option: pr_option })
        }
    }
    // Функция обновления счетчика процессов
    function updateProcessCount() {
        processCount.textContent = `📋 Процессы `;
        if (processes.length > 0)
            processCount.textContent += `(${processes.length})`
    }
    // Обработка нажатия на процесс
    function selectProcess(id) {
        return;
        selectedProcessId = id;
        // Визуальная подсветка
        highlightProcess(id)
        // Здесь можно добавить логику загрузки данных выбранного процесса
        fetch("/processes/select", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pr_id: id }),
        })
        const process = processes.find(p => p.id === id)
        const option = process["option"];
        console.log('Выбран процесс:', process.name);
        console.log('Текущая опция:', option);

        if (option === 1) btn1.click();
        if (option === 2) btn2.click();
        if (option === 3) btn3.click();
        if (option === 4) btn4.click();
    }
    // Визуальная подсветка процесса
    function highlightProcess(id) {
        // Обновляем классы у всех элементов
        document.querySelectorAll('.process-item').forEach(item => {
            const itemId = item.data_id;
            if (itemId === id) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }
    // Функция отрисовки списка процессов
    function renderProcesses() {
        processItems.innerHTML = '';
        
        processes.forEach(process => {
            const processElement = document.createElement('div');
            processElement.className = 'process-item';
            processElement.data_id = process.id
            processElement.innerHTML = `
                <div class="process-avatar">${process.avatar}</div>
                <div class="process-info">
                    <div class="process-name-container">
                        <span class="process-name" title="${process.name}">${process.name}</span>
                        
                    </div>
                    <div class="process-meta">
                        <span>${process.meta}</span>
                        <!--<span class="badge">${process.badge}</span>-->
                        <button class="edit-process-btn" data-id="${process.id}" data-type="edit" title="Редактировать процесс">✎</button>
                        <button class="edit-process-btn" data-id="${process.id}" data-type="delete" title="Удалить процесс">❌</button>
                    </div>
                </div>
            `;
            
            processItems.appendChild(processElement);
        });

        // Добавляем обработчики на клик по процессу (для выделения)
        document.querySelectorAll('.process-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Не выделяем, если кликнули на кнопку редактирования или удаления
                if (e.target.classList.contains('edit-process-btn')) return;
                selectProcess(item.data_id);
            });
        });

        // Добавляем обработчики на кнопки редактирования
        document.querySelectorAll('.edit-process-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const type = btn.dataset.type;
                if (type === "delete")
                    openDeleteModal(id);
                else
                    openEditModal(id);
            });
        });

        highlightProcess(selectedProcessId)
        updateProcessCount();
    }
    // Функция сохранения процесса
    async function saveProcess() {
        const name = processNameInput.value.trim();
        
        if (!name) {
            alert('Введите название процесса');
            return;
        }

        if (currentEditId != undefined) {
            // Редактирование/удаление существующего
            const process = processes.find(p => p.id === currentEditId);
            if (process) {
                if (deleteMode) {
                    if (name === process.name)
                        await api_process_delete(process.id)
                    else {
                        alert('Неверно введено название!');
                        return;
                    }
                }
                else
                    await api_process_rename(process.id, name)

                await fetch_processes()
            }
        } else {
            // Создание нового
            await api_process_create(name)

            await fetch_processes()
        }

        renderProcesses();
        closeModal();
    }
    // Сохранение выбранной опции и обновление значения в списке процессов
    function set_option(option) {
        fetch("/processes/set-option", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ option: option }),
        })
        const process = processes.find(p => p.id === selectedProcessId);
        process.option = option;
    }

    // Обработчики для кнопок правой панели
    btn1.addEventListener('click', function(e) {
        setActiveButton(btn1)
        setContent(1)
        if (selectedProcessId == undefined)
            return;
    });

    btn2.addEventListener('click', function(e) {
        setActiveButton(btn2)
        setContent(2)
        if (selectedProcessId == undefined)
            return;
    });

    btn3.addEventListener('click', function(e) {
        setActiveButton(btn3)
        setContent(3)
        if (selectedProcessId == undefined)
            return;
    });

    btn4.addEventListener('click', function(e) {
        setActiveButton(btn4)
        setContent(4)
        if (selectedProcessId == undefined)
            return;
    });

    // ========== СТАРТ ==========
    // await fetch_processes()
    renderProcesses();
}

function startChecker() {
    // Создание проверщика
    const connectionChecker = getConnectionChecker(api_ping, 10000);
    // Устанавливаем обработчики событий
    connectionChecker.onConnectionLost(() => {
        setConnectionStatus(false)
    });
    connectionChecker.onConnectionRestored(() => {
        setConnectionStatus(true)
    });
    connectionChecker.onStatusChange((isConnected, statusCode, error) => {
        console.log(`Статус соединения: ${isConnected ? 'Подключено' : 'Отключено'}`, 
                    statusCode ? `Код: ${statusCode}` : '',
                    error ? `Ошибка: ${error.message}` : '');
    });
    // Запускаем проверку
    connectionChecker.start();
}

function setConnectionStatus(isOnline) {
    const indicator = document.getElementById('statusIndicator');
    
    if (isOnline) {
        indicator.classList.remove('offline');
        indicator.classList.add('online');
    } else {
        indicator.classList.remove('online');
        indicator.classList.add('offline');
    }
}