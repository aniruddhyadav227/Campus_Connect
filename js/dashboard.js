const tasks = CampusStore.tasks();
const schedule = CampusStore.schedule();
const attendance = CampusStore.attendance();
const resources = CampusStore.resources();

const completedTasks = tasks.filter((task) => task.done).length;
const pendingTasks = tasks.length - completedTasks;

document.getElementById("dashTasks").textContent = pendingTasks;
document.getElementById("dashResources").textContent = resources.length;

const attended = attendance.reduce((sum, item) => sum + item.attended, 0);
const total = attendance.reduce((sum, item) => sum + item.total, 0);

document.getElementById("dashAttendance").textContent =
  total ? Math.round((attended / total) * 100) + "%" : "0%";

const todayName = new Date().toLocaleDateString("en-US", {
  weekday: "long"
});

const todayClasses = schedule.filter((item) => item.day === todayName);
document.getElementById("dashClasses").textContent = todayClasses.length;

const classContainer = document.getElementById("todayClasses");

if (todayClasses.length === 0) {
  classContainer.innerHTML = '<p class="empty-state">No sample classes for today. Check the full timetable.</p>';
} else {
  todayClasses.forEach((item) => {
    const row = document.createElement("div");
    row.className = "class-item";

    const time = document.createElement("div");
    time.className = "class-time";
    time.textContent = item.time;

    const dot = document.createElement("span");
    dot.className = "class-dot";

    const detail = document.createElement("div");
    detail.className = "class-detail";

    const subject = document.createElement("strong");
    subject.textContent = item.subject;

    const room = document.createElement("small");
    room.textContent = item.room;

    detail.append(subject, room);
    row.append(time, dot, detail);
    classContainer.append(row);
  });
}

const taskContainer = document.getElementById("dashboardTasks");
const previewTasks = tasks.slice(0, 4);

if (previewTasks.length === 0) {
  taskContainer.innerHTML = '<p class="empty-state">No tasks yet. Add your first task!</p>';
}

previewTasks.forEach((task) => {
  const row = document.createElement("label");
  row.className = "preview-task" + (task.done ? " done" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", "Complete " + task.title);

  checkbox.addEventListener("change", () => {
    const latestTasks = CampusStore.tasks();
    const target = latestTasks.find((item) => item.id === task.id);
    if (!target) return;

    target.done = checkbox.checked;

    if (!CampusStore.saveTasks(latestTasks)) {
      checkbox.checked = !checkbox.checked;
      alert("Could not save your task. Check browser storage.");
      return;
    }

    row.classList.toggle("done", target.done);
    document.getElementById("dashTasks").textContent =
      latestTasks.filter((item) => !item.done).length;
  });

  const text = document.createElement("span");
  text.textContent = task.title;

  row.append(checkbox, text);
  taskContainer.append(row);
});