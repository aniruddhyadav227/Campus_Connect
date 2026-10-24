
let attendanceRecords = CampusStore.attendance();
let editingIndex = -1;

function renderAttendance() {
  const tbody = document.getElementById("attendanceRows");
  tbody.replaceChildren();

  let attendedSum = 0;
  let totalSum = 0;

  attendanceRecords.forEach((item, index) => {
    attendedSum += item.attended;
    totalSum += item.total;

    const percent = item.total > 0
      ? Math.round((item.attended / item.total) * 100)
      : 0;

    const row = document.createElement("tr");
    const values = [
      item.subject,
      item.attended,
      item.total,
      percent + "%"
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = "status " + (percent >= 75 ? "good" : percent >= 65 ? "warn" : "bad");
    status.textContent = percent >= 75 ? "On track" : percent >= 65 ? "Low" : "Critical";
    statusCell.append(status);
    row.append(statusCell);

    const actionCell = document.createElement("td");
    const edit = document.createElement("button");
    edit.className = "button secondary";
    edit.type = "button";
    edit.textContent = "Edit";

    edit.addEventListener("click", () => {
      editingIndex = index;
      document.getElementById("subject").value = item.subject;
      document.getElementById("attended").value = item.attended;
      document.getElementById("total").value = item.total;
      document.getElementById("subject").focus();
    });

    const remove = document.createElement("button");
    remove.className = "icon-button";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      if (!confirm("Delete this subject record?")) return;

      const previous = attendanceRecords;
      attendanceRecords = attendanceRecords.filter((_, i) => i !== index);

      if (!CampusStore.saveAttendance(attendanceRecords)) {
        attendanceRecords = previous;
        alert("Unable to save changes.");
        return;
      }

      editingIndex = -1;
      renderAttendance();
    });

    actionCell.append(edit, remove);
    row.append(actionCell);
    tbody.append(row);
  });

  document.getElementById("attendanceEmpty").hidden = attendanceRecords.length > 0;
  document.getElementById("attendedCount").textContent = attendedSum;
  document.getElementById("totalCount").textContent = totalSum;
  document.getElementById("overallPercent").textContent =
    (totalSum ? Math.round(attendedSum / totalSum * 100) : 0) + "%";
}

document.getElementById("attendanceForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const subject = document.getElementById("subject").value.trim();
  const attended = Number(document.getElementById("attended").value);
  const total = Number(document.getElementById("total").value);
  const message = document.getElementById("attendanceMessage");

  if (!subject || !Number.isInteger(attended) || !Number.isInteger(total) ||
      attended < 0 || total < 1 || attended > total) {
    message.textContent = "Enter valid numbers. Attended classes cannot exceed total classes.";
    message.style.color = "var(--red)";
    return;
  }

  const previous = attendanceRecords.map((item) => ({ ...item }));
  const duplicateIndex = attendanceRecords.findIndex((item, i) =>
    item.subject.toLowerCase() === subject.toLowerCase() && i !== editingIndex
  );

  if (duplicateIndex >= 0) {
    message.textContent = "This subject already exists. Edit that record instead.";
    message.style.color = "var(--red)";
    return;
  }

  const record = { subject, attended, total };

  if (editingIndex >= 0) attendanceRecords[editingIndex] = record;
  else attendanceRecords.push(record);

  if (!CampusStore.saveAttendance(attendanceRecords)) {
    attendanceRecords = previous;
    message.textContent = "Unable to save changes.";
    message.style.color = "var(--red)";
    return;
  }

  editingIndex = -1;
  event.target.reset();
  message.textContent = "Attendance record saved.";
  message.style.color = "var(--green)";
  renderAttendance();
});

renderAttendance();
