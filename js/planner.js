let taskData = CampusStore.tasks();

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("taskTitle").value.trim();
  const subject = document.getElementById("taskSubject").value;
  const due = document.getElementById("taskDue").value;
  const message = document.getElementById("taskMessage");

  if (!title) {
    message.textContent = "Please enter a task title.";
    return;
  }

  const task = {
    id: "task-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
    title,
    subject,
    due,
    done: false
  };

  taskData.push(task);

  if (!CampusStore.saveTasks(taskData)) {
    taskData.pop();
    message.textContent = "Could not save task. Check browser storage.";
    return;
  }

  taskForm.reset();
  message.textContent = "Task added successfully!";
  renderTasks();
});

function renderTasks() {
  taskList.replaceChildren();

  const filter = document.getElementById("taskFilter").value;
  const subject = document.getElementById("subjectFilter").value;

  const filtered = taskData.filter((task) => {
    const statusMatch = filter === "all" ||
      (filter === "done" && task.done) ||
      (filter === "pending" && !task.done);

    return statusMatch && (subject === "all" || task.subject === subject);
  });

  document.getElementById("taskEmpty").hidden = filtered.length > 0;
  document.getElementById("taskCount").textContent =
    `${taskData.filter((task) => !task.done).length} pending · ${taskData.filter((task) => task.done).length} completed`;

  filtered.forEach((task) => {
    const card = document.createElement("article");
    card.className = "task-card" + (task.done ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark task complete");

    checkbox.addEventListener("change", () => {
      const previous = task.done;
      task.done = checkbox.checked;

      if (!CampusStore.saveTasks(taskData)) {
        task.done = previous;
        checkbox.checked = previous;
        alert("Could not save task status.");
        return;
      }

      renderTasks();
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("h3");
    title.textContent = task.title;

    const meta = document.createElement("p");
    meta.textContent = task.subject + (task.due ? " · Due " + task.due : " · No due date");

    content.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "icon-button";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      if (!confirm("Delete this task?")) return;

      const previous = taskData;
      taskData = taskData.filter((item) => item.id !== task.id);

      if (!CampusStore.saveTasks(taskData)) {
        taskData = previous;
        alert("Could not delete task.");
        return;
      }

      renderTasks();
    });

    actions.append(remove);
    card.append(checkbox, content, actions);
    taskList.append(card);
  });
}

document.getElementById("taskFilter").addEventListener("change", renderTasks);
document.getElementById("subjectFilter").addEventListener("change", renderTasks);

renderTasks();