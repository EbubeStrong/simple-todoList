// Select DOM elements
const taskInput = document.getElementById("new-task");
const dueDateInput = document.getElementById("due-date");
const prioritySelect = document.getElementById("priority");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clear-completed-btn");

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `<h2 class="noTask">No task added, please add a task</h2>`;
    taskList.appendChild(li);
    return;  // Stop further execution
  }

  const filteredTasks = tasks.filter(
    (task) =>
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed)
  );

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <div class="taskViewContainer">
        <div class="task-view">
          <strong class="task-name">${task.name}</strong>
          <small>(Due: ${task.dueDate || "N/A"})</small>
          <em> - ${task.priority} priority</em>
        </div>
        <div class="task-actions">
          <button class="edit-btn">Edit</button>
          <button class="complete-btn">${task.completed ? "Undo" : "Complete"}</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;

    const editBtn = li.querySelector(".edit-btn");
    const completeBtn = li.querySelector(".complete-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    // Event Listeners
    editBtn.addEventListener("click", () => editDiv(li, index));
    completeBtn.addEventListener("click", () => toggleComplete(index));
    deleteBtn.addEventListener("click", () => deleteTask(index));

    taskList.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Enable in-place edit
function editDiv(li, index) {
  const taskNameElem = li.querySelector(".task-name");
  const originalText = tasks[index].name;

  const input = document.createElement("input");
  input.type = "text";
  input.value = originalText;
  input.className = "edit-input";

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.className = "done-btn";

  taskNameElem.replaceWith(input);
  li.querySelector(".edit-btn").replaceWith(doneBtn);

  doneBtn.addEventListener("click", () => {
    const newText = formatText(input.value.trim());
    tasks[index].name = newText;
    renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
  });
}

// Toggle task completion
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter);
}

// Format text to lowercase with the first letter capitalized
function formatText(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Add task on button click or Enter key
taskInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") addTask();
});
addTaskBtn.addEventListener("click", addTask);

function addTask() {
  const taskName = formatText(taskInput.value.trim());
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (!taskName) return;

  tasks.push({ name: taskName, dueDate, priority, completed: false });
  taskInput.value = "";
  dueDateInput.value = "";
  renderTasks();
}

// Filter tasks
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderTasks(btn.getAttribute("data-filter"));
  });
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
});

// Initial render
renderTasks();