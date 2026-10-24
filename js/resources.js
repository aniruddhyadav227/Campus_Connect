let resourceData = CampusStore.resources();

const resourceGrid = document.getElementById("resourceGrid");

document.getElementById("resourceForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("resourceTitle").value.trim();
  const subject = document.getElementById("resourceSubject").value.trim();
  const urlText = document.getElementById("resourceUrl").value.trim();
  const message = document.getElementById("resourceMessage");

  let url;

  try {
    url = new URL(urlText);
  } catch {
    message.textContent = "Enter a valid website URL.";
    message.style.color = "var(--red)";
    return;
  }

  if (!["https:", "http:"].includes(url.protocol)) {
    message.textContent = "Only HTTP or HTTPS links are allowed.";
    message.style.color = "var(--red)";
    return;
  }

  const resource = {
    id: "res-" + Date.now(),
    title,
    subject,
    url: url.href
  };

  resourceData.push(resource);

  if (!CampusStore.saveResources(resourceData)) {
    resourceData.pop();
    message.textContent = "Could not save resource.";
    message.style.color = "var(--red)";
    return;
  }

  event.target.reset();
  message.textContent = "Resource saved!";
  message.style.color = "var(--green)";
  renderResources();
});

function renderResources() {
  resourceGrid.replaceChildren();

  const query = document.getElementById("resourceSearch").value.trim().toLowerCase();

  const filtered = resourceData.filter((resource) =>
    resource.title.toLowerCase().includes(query) ||
    resource.subject.toLowerCase().includes(query)
  );

  document.getElementById("resourceCount").textContent = `${resourceData.length} links`;
  document.getElementById("resourceEmpty").hidden = filtered.length > 0;

  filtered.forEach((resource) => {
    const card = document.createElement("article");
    card.className = "panel";
    card.style.padding = "18px";

    const icon = document.createElement("div");
    icon.className = "announcement-icon";
    icon.textContent = "📚";
    icon.style.marginBottom = "13px";

    const title = document.createElement("h3");
    title.textContent = resource.title;
    title.style.marginBottom = "6px";

    const subject = document.createElement("p");
    subject.textContent = resource.subject;
    subject.style.color = "var(--muted)";
    subject.style.fontSize = "12px";
    subject.style.marginBottom = "15px";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "10px";
    actions.style.flexWrap = "wrap";

    const link = document.createElement("a");
    link.className = "button secondary";
    link.textContent = "Open link ↗";
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const remove = document.createElement("button");
    remove.className = "button";
    remove.style.background = "#fff0f1";
    remove.style.color = "var(--red)";
    remove.textContent = "Delete";
    remove.type = "button";

    remove.addEventListener("click", () => {
      if (!confirm("Delete this resource?")) return;

      const previous = resourceData;
      resourceData = resourceData.filter((item) => item.id !== resource.id);

      if (!CampusStore.saveResources(resourceData)) {
        resourceData = previous;
        alert("Could not delete resource.");
        return;
      }

      renderResources();
    });

    actions.append(link, remove);
    card.append(icon, title, subject, actions);
    resourceGrid.append(card);
  });
}

document.getElementById("resourceSearch").addEventListener("input", renderResources);

const resourceStyle = document.createElement("style");
resourceStyle.textContent = ".resource-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}@media(max-width:850px){.resource-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.resource-grid{grid-template-columns:1fr}}";
document.head.append(resourceStyle);

renderResources();