const profile = CampusStore.profile();

const name = profile.name || "Student";
const firstName = name.trim().split(/\s+/)[0] || "Student";

const sideName = document.getElementById("sideName");
if (sideName) sideName.textContent = name;

const headerAvatar = document.getElementById("headerAvatar");
if (headerAvatar) headerAvatar.textContent = firstName.charAt(0).toUpperCase();

const welcomeName = document.getElementById("welcomeName");
if (welcomeName) welcomeName.textContent = firstName;

const headerDate = document.getElementById("headerDate");
if (headerDate) {
  headerDate.textContent = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-link").forEach((link) => {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const target = link.getAttribute("href").split("/").pop();

  if (current === target) link.classList.add("active");
  else link.classList.remove("active");
});