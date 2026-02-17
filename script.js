let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filters button");

addTaskBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", renderTasks);

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filters .active").classList.remove("active");
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

function addTask() {
    const title = taskInput.value.trim();
    if (title === "") return;

    const newTask = {
        id: Date.now(),
        title: title,
        priority: prioritySelect.value,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = "";
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    const searchTerm = searchInput.value.toLowerCase();
    filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm)
    );

    filteredTasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.className = `task ${task.completed ? "completed" : ""}`;

        taskDiv.innerHTML = `
            <div>
                <span>${task.title}</span>
                <span class="priority ${task.priority}">${task.priority}</span>
            </div>
            <div>
                <button onclick="toggleComplete(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">✖</button>
            </div>
        `;

        taskList.appendChild(taskDiv);
    });

    updateCount();
}

function updateCount() {
    const pending = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${pending} task(s) pending`;
}

renderTasks();
