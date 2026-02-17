let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filters button");
const themeToggle = document.getElementById("themeToggle");

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent =
        document.body.classList.contains("dark") ? "☀" : "🌙";
});

// Add task
addTaskBtn.addEventListener("click", () => {
    const title = taskInput.value.trim();
    if (!title) return;

    const newTask = {
        id: Date.now(),
        title,
        priority: prioritySelect.value,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = "";
    renderTasks();
});

// Filter
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filters .active").classList.remove("active");
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

searchInput.addEventListener("input", renderTasks);

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    let filtered = tasks;

    if (currentFilter === "completed")
        filtered = tasks.filter(t => t.completed);
    if (currentFilter === "pending")
        filtered = tasks.filter(t => !t.completed);

    const search = searchInput.value.toLowerCase();
    filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search)
    );

    filtered.forEach(task => {
        const div = document.createElement("div");
        div.className = `task ${task.completed ? "completed" : ""}`;

        div.innerHTML = `
            <div>
                <span>${task.title}</span>
                <span class="priority ${task.priority}">
                    ${task.priority}
                </span>
            </div>
            <div>
                <button onclick="toggleComplete(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">✖</button>
            </div>
        `;

        taskList.appendChild(div);
    });

    updateCount();
}

function updateCount() {
    const pending = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${pending} task(s) pending`;
}

renderTasks();
