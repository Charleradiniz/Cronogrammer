// Variáveis globais
const taskModal = document.getElementById('taskModal');
const addTaskModal = document.getElementById('addTaskModal');
const addCategoryModal = document.getElementById('addCategoryModal');
const addTaskBtn = document.getElementById('addTaskBtn');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const submitCategoryBtn = document.getElementById('submitCategoryBtn');
const closeBtns = document.querySelectorAll('.close');
const taskForm = document.getElementById('taskForm');
const filterSelect = document.getElementById('filterSelect');
const categoryForm = document.getElementById('categoryForm');
const categoryInput = document.getElementById('categoryInput');
const progressFill = document.getElementById('progressFill');
const scheduleTableBody = document.querySelector('#scheduleTable tbody');
const scheduleTableHeader = document.querySelector('#scheduleTable thead tr');
let tasks = [];
let categories = [];

// Inicialização do calendário e destaque da data atual
document.addEventListener('DOMContentLoaded', () => {
    generateScheduleTable();
    highlightToday();
    updateProgress();
});

// Função para gerar a tabela de cronograma
function generateScheduleTable() {
    const today = new Date();
    const daysInMonth = 30;
    const startHour = 5;
    const endHour = 28; // Terminando às 4h do próximo dia

    scheduleTableHeader.innerHTML = '<th>Hora</th>'; // Reinicializa apenas a coluna Hora

    // Adiciona as datas ao cabeçalho da tabela
    for (let i = 0; i < daysInMonth; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateCell = document.createElement('th');
        dateCell.textContent = date.toLocaleDateString('pt-BR', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' });
        scheduleTableHeader.appendChild(dateCell);
    }

    // Limpa a tabela antes de regenerar
    scheduleTableBody.innerHTML = '';

    // Loop pelos horários de 5h às 4h do outro dia
    for (let hour = startHour; hour <= endHour; hour++) {
        const timeRow = document.createElement('tr');
        const timeCell = document.createElement('td');
        const displayHour = (hour % 24).toString().padStart(2, '0') + ':00';
        timeCell.textContent = displayHour;
        timeRow.appendChild(timeCell);

        // Adiciona células para cada dia do mês
        for (let i = 0; i < daysInMonth; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const taskCell = document.createElement('td');
            taskCell.classList.add('task-cell');
            taskCell.setAttribute('data-date', date.toISOString().split('T')[0]);
            taskCell.setAttribute('data-hour', displayHour);

            // Adiciona o evento de clique à célula
            taskCell.addEventListener('click', () => openTaskModal(taskCell));
            timeRow.appendChild(taskCell);
        }

        scheduleTableBody.appendChild(timeRow);
    }
}

// Função para destacar o dia atual
function highlightToday() {
    const today = new Date().toISOString().split('T')[0];
    const todayCells = document.querySelectorAll(`td[data-date="${today}"]`);

    todayCells.forEach(cell => {
        cell.classList.add('today');
    });
}

// Evento para abrir modal de adicionar tarefa
addTaskBtn.addEventListener('click', () => {
    addTaskModal.style.display = 'flex';
});

// Evento para abrir modal de adicionar categoria
addCategoryBtn.addEventListener('click', () => {
    addCategoryModal.style.display = 'flex';
});

// Função para fechar os modais
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        taskModal.style.display = 'none';
        addTaskModal.style.display = 'none';
        addCategoryModal.style.display = 'none';
    });
});

// Função para abrir o modal com os detalhes da tarefa
function openTaskModal(taskCell) {
    const taskDate = taskCell.getAttribute('data-date');
    const taskHour = taskCell.getAttribute('data-hour');
    const task = tasks.find(t => t.date === taskDate && t.start === taskHour);

    // Referência aos elementos do modal de detalhes da tarefa
    const taskTitleModal = document.getElementById('taskTitleModal');
    const taskNotesModal = document.getElementById('taskNotesModal');
    const taskCategoryModal = document.getElementById('taskCategoryModal');
    const taskDateModal = document.getElementById('taskDateModal');
    const taskStartModal = document.getElementById('taskStartModal');
    const taskDurationModal = document.getElementById('taskDurationModal');

    // Títulos para cada campo
    const titleLabel = "Título:";
    const descriptionLabel = "Descrição:";
    const categoryLabel = "Categoria:";
    const dateLabel = "Data:";
    const startLabel = "Início:";
    const durationLabel = "Duração:";

    if (task) {
        // Popula os campos do modal com os dados da tarefa
        taskTitleModal.innerHTML = `<strong>${titleLabel}</strong>`;
        taskNotesModal.value = task.description;
        taskCategoryModal.innerHTML = `<strong>${categoryLabel}</strong>`;
        taskDateModal.innerHTML = `<strong>${dateLabel}</strong>`;
        taskStartModal.innerHTML = `<strong>${startLabel}</strong>`;
        taskDurationModal.innerHTML = `<strong>${durationLabel}</strong>`;

        // Adiciona as informações em blocos separados
        taskTitleModal.nextElementSibling.textContent = task.title;
        taskNotesModal.value = task.description;
        taskCategoryModal.nextElementSibling.textContent = task.category;
        taskDateModal.nextElementSibling.textContent = task.date;
        taskStartModal.nextElementSibling.textContent = task.start;
        taskDurationModal.nextElementSibling.textContent = task.duration;
    } else {
        // Caso não haja tarefa correspondente
        taskTitleModal.innerHTML = `<strong>${titleLabel}</strong>`;
        taskTitleModal.nextElementSibling.textContent = "Nenhuma tarefa";
        taskNotesModal.value = "Sem informações para este horário.";
        taskCategoryModal.innerHTML = `<strong>${categoryLabel}</strong>`;
        taskCategoryModal.nextElementSibling.textContent = "-";
        taskDateModal.innerHTML = `<strong>${dateLabel}</strong>`;
        taskDateModal.nextElementSibling.textContent = "-";
        taskStartModal.innerHTML = `<strong>${startLabel}</strong>`;
        taskStartModal.nextElementSibling.textContent = "-";
        taskDurationModal.innerHTML = `<strong>${durationLabel}</strong>`;
        taskDurationModal.nextElementSibling.textContent = "-";
    }

    taskModal.style.display = 'flex';
}

// Evento de adicionar tarefa
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const task = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        category: document.getElementById('taskCategory').value,
        date: document.getElementById('taskDate').value,
        start: document.getElementById('taskStart').value,
        duration: document.getElementById('taskDuration').value
    };
    
    tasks.push(task);
    renderTasks();
    addTaskModal.style.display = 'none';
    taskForm.reset();
});

// Função para renderizar tarefas na tabela
function renderTasks() {
    const taskCells = document.querySelectorAll('.task-cell');
    
    // Limpa as células da tabela antes de renderizar as tarefas
    taskCells.forEach(cell => {
        cell.innerHTML = ''; 
        cell.classList.remove('has-task');
    });

    tasks.forEach(task => {
        const taskDate = task.date;
        const taskHour = task.start;

        // Encontra a célula correspondente à data e hora da tarefa
        const startCell = Array.from(taskCells).find(cell =>
            cell.getAttribute('data-date') === taskDate && cell.getAttribute('data-hour') === taskHour
        );

        if (startCell) {
            const taskDiv = document.createElement('div'); 
            taskDiv.classList.add('task-title'); 
            taskDiv.textContent = task.title; 

            // Adiciona o evento de clique ao taskDiv
            taskDiv.addEventListener('click', (event) => {
                event.stopPropagation();  // Para evitar conflitos com o clique na célula
                openTaskModal(startCell);
            });

            const height = calculateTaskHeight(task);
            taskDiv.style.height = height + 'px'; 
            taskDiv.style.position = 'absolute'; 
            taskDiv.style.width = startCell.offsetWidth + 'px'; 

            startCell.appendChild(taskDiv);

            // Marcar célula como contendo uma tarefa
            startCell.classList.add('has-task');
        }
    });
}

// Função para calcular a altura da tarefa em pixels com base na duração
function calculateTaskHeight(task) {
    const durationParts = task.duration.split(':');
    const hours = parseInt(durationParts[0]);
    const minutes = parseInt(durationParts[1]);

    const heightPerMinute = 1; // Altura de 1px por minuto
    const totalHeight = (hours * 60 + minutes) * heightPerMinute;

    return totalHeight;
}

// Evento de adicionar categoria
categoryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newCategory = categoryInput.value.trim();
    if (newCategory) {
        categories.push(newCategory);
        updateCategorySelect();
        addCategoryModal.style.display = 'none';
        categoryForm.reset();
    }
});

// Função para atualizar o seletor de categorias
function updateCategorySelect() {
    const taskCategorySelect = document.getElementById('taskCategory');
    taskCategorySelect.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        taskCategorySelect.appendChild(option);
    });
}

// Função para atualizar a barra de progresso
function updateProgress() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progressPercent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    progressFill.style.width = `${progressPercent}%`;
    progressFill.textContent = `${Math.round(progressPercent)}%`;
}
