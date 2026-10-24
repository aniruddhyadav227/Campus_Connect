const profileForm = document.getElementById("profileForm");
const fields = {
  name: document.getElementById("profileName"),
  course: document.getElementById("profileCourse"),
  semester: document.getElementById("profileSemester"),
  college: document.getElementById("profileCollege"),
  email: document.getElementById("profileEmail")
};

function loadProfileForm() {
  const profile = CampusStore.profile();

  Object.entries(fields).forEach(([key, field]) => {
    field.value = profile[key] || "";
  });

  updateProfileAvatar();
}

function updateProfileAvatar() {
  const first = fields.name.value.trim().charAt(0).toUpperCase() || "S";
  document.getElementById("profileAvatar").textContent = first;
}

fields.name.addEventListener("input", updateProfileAvatar);

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const profile = {};
  Object.entries(fields).forEach(([key, field]) => {
    profile[key] = field.value.trim();
  });

  if (!profile.name || !profile.course || !profile.college || !profile.email) {
    document.getElementById("profileMessage").textContent = "Please fill in all required fields.";
    return;
  }

  if (!CampusStore.saveProfile(profile)) {
    document.getElementById("profileMessage").textContent =
      "Could not save your profile. Check browser storage.";
    return;
  }

  document.getElementById("profileMessage").textContent =
    "Profile saved! Refresh the page to update the navigation name.";

  const sideName = document.getElementById("sideName");
  if (sideName) sideName.textContent = profile.name;

  const headerAvatar = document.getElementById("headerAvatar");
  if (headerAvatar) headerAvatar.textContent = profile.name.charAt(0).toUpperCase();
});

loadProfileForm();