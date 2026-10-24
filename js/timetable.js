const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const allClasses = CampusStore.schedule();

const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
let selectedDay = weekDays.includes(todayName) ? todayName : "Monday";

const tabs = document.getElementById("dayTabs");
const scheduleList = document.getElementById("scheduleList");

weekDays.forEach((day) => {
  const button = document.createElement("button");
  button.className = "day-tab";
  button.textContent = day.slice(0, 3);
  button.type = "button";
  button.setAttribute("aria-label", day);

  button.addEventListener("click", () => {
    selectedDay = day;
    renderSchedule();
  });

  tabs.append(button);
});

function renderSchedule() {
  tabs.querySelectorAll("button").forEach((button, index) => {
    button.classList.toggle("active", weekDays[index] === selectedDay);
  });

  document.getElementById("selectedDayTitle").textContent = selectedDay + "'s Classes";
  scheduleList.replaceChildren();

  const classes = allClasses.filter((item) => item.day === selectedDay);
  document.getElementById("scheduleEmpty").hidden = classes.length > 0;

  classes.forEach((item) => {
    const row = document.createElement("article");
    row.className = "schedule-item";

    const time = document.createElement("div");
    time.className = "schedule-time";
    time.textContent = item.time;

    const line = document.createElement("div");
    line.className = "schedule-line";

    const detail = document.createElement("div");
    detail.className = "schedule-detail";

    const subject = document.createElement("h3");
    subject.textContent = item.subject;

    const room = document.createElement("p");
    room.textContent = item.room;

    detail.append(subject, room);
    row.append(time, line, detail);
    scheduleList.append(row);
  });
}

renderSchedule();