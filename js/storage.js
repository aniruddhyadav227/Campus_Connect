const CampusStore = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem("campusconnect_" + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  write(key, value) {
    try {
      localStorage.setItem("campusconnect_" + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  profile() {
    return this.read("profile", {
      name: "Student",
      course: "B.Tech CSE",
      semester: "Semester 1",
      college: "My College",
      email: "student@example.com"
    });
  },

  saveProfile(profile) {
    return this.write("profile", profile);
  },

  tasks() {
    const tasks = this.read("tasks", null);
    if (Array.isArray(tasks)) return tasks;

    const sample = [
      { id: "task-1", title: "Revise C++ basics", subject: "Programming", due: "", done: false },
      { id: "task-2", title: "Complete Maths practice", subject: "Mathematics", due: "", done: false },
      { id: "task-3", title: "Read class notes", subject: "Other", due: "", done: true }
    ];

    this.write("tasks", sample);
    return sample;
  },

  saveTasks(tasks) {
    return this.write("tasks", tasks);
  },

  attendance() {
    return this.read("attendance", [
      { subject: "Mathematics", attended: 24, total: 30 },
      { subject: "Programming", attended: 27, total: 30 },
      { subject: "Physics", attended: 20, total: 28 },
      { subject: "English", attended: 18, total: 20 },
      { subject: "Computer Fundamentals", attended: 25, total: 30 }
    ]);
  },

  saveAttendance(data) {
    return this.write("attendance", data);
  },

  schedule() {
    return [
      { day: "Monday", time: "09:00 - 10:00", subject: "Mathematics", room: "Room 101" },
      { day: "Monday", time: "10:15 - 11:15", subject: "Programming", room: "Lab 2" },
      { day: "Monday", time: "11:30 - 12:30", subject: "Physics", room: "Room 204" },
      { day: "Tuesday", time: "09:00 - 10:00", subject: "English", room: "Room 105" },
      { day: "Tuesday", time: "10:15 - 11:15", subject: "Computer Fundamentals", room: "Room 201" },
      { day: "Wednesday", time: "09:00 - 10:00", subject: "Programming", room: "Lab 2" },
      { day: "Wednesday", time: "10:15 - 11:15", subject: "Mathematics", room: "Room 101" },
      { day: "Thursday", time: "09:00 - 10:00", subject: "Physics", room: "Room 204" },
      { day: "Thursday", time: "10:15 - 11:15", subject: "English", room: "Room 105" },
      { day: "Friday", time: "09:00 - 10:00", subject: "Computer Fundamentals", room: "Room 201" },
      { day: "Friday", time: "10:15 - 11:15", subject: "Programming", room: "Lab 2" }
    ];
  },

  resources() {
    const saved = this.read("resources", null);
    if (Array.isArray(saved)) return saved;

    const sample = [
      { id: "res-1", title: "MDN Web Docs", subject: "Web Development", url: "https://developer.mozilla.org/" },
      { id: "res-2", title: "W3Schools", subject: "Programming", url: "https://www.w3schools.com/" },
      { id: "res-3", title: "GeeksforGeeks", subject: "Computer Science", url: "https://www.geeksforgeeks.org/" },
      { id: "res-4", title: "freeCodeCamp", subject: "Web Development", url: "https://www.freecodecamp.org/" },
      { id: "res-5", title: "Python Documentation", subject: "Python", url: "https://docs.python.org/3/" },
      { id: "res-6", title: "GitHub Docs", subject: "Git & GitHub", url: "https://docs.github.com/" }
    ];

    this.write("resources", sample);
    return sample;
  },

  saveResources(resources) {
    return this.write("resources", resources);
  }
};