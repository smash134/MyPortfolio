
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const count = document.getElementById("task-count");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

let currentFilter = "all";


function updateCount() {
    const remaining = tasks.filter(task => !task.completed).length;
    count.textContent = `${remaining} tasks remaining`;
}

function renderTasks() {
    list.innerHTML = "";

    
const filteredTasks = tasks.filter(function(task) {
    if (currentFilter === "pending") {
        return !task.completed;
    }

    if (currentFilter === "completed") {
        return task.completed;
    }

    return true;
});

filteredTasks.forEach(function(task) {

        const li = document.createElement("li");
        li.className = "todo-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Complete task");

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete task");
        
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";
        editButton.setAttribute("aria-label", "Edit task");

        editButton.addEventListener("click", function() {
            const updatedText = prompt("Edit your task:", task.text);

            if (updatedText !== null && updatedText.trim() !== "") {
                task.text = updatedText.trim();
                renderTasks();
            }
        });


        deleteButton.addEventListener("click", function() {
            tasks = tasks.filter(item => item.id !== task.id);
            renderTasks();
        });

        li.append(checkbox, span, editButton, deleteButton);
        list.appendChild(li);
    });

    updateCount();
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = input.value.trim();

    if (text === "") {
        input.focus();
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    });

    input.value = "";
    input.focus();
    renderTasks();
});
renderTasks();

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});
