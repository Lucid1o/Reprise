const $ = selector => document.querySelector(selector);

const state = {
  tabs: [],
  windows: [],
  sessions: []
};

document.addEventListener("DOMContentLoaded", async () => {
  await refreshCurrentBrowser();
  await loadSessions();
  bindEvents();
});

async function refreshCurrentBrowser() {
  const windows = await chrome.windows.getAll({ populate: true });
  state.windows = windows;
  state.tabs = windows.flatMap(window =>
    (window.tabs || [])
      .filter(tab => /^https?:\/\//i.test(tab.url || ""))
      .map(tab => ({ ...tab, windowId: window.id }))
  );

  $("#tabCounter").textContent = `${state.tabs.length} tabs · ${windows.length} windows`;
}

async function loadSessions() {
  const result = await chrome.storage.local.get({ sessions: [] });
  state.sessions = result.sessions.sort((a, b) => b.createdAt - a.createdAt);
  renderSessions();
}

function bindEvents() {
  $("#saveButton").addEventListener("click", saveSession);
  $("#restoreLatestButton").addEventListener("click", () => {
    if (state.sessions[0]) restoreSession(state.sessions[0]);
    else showToast("Save a session first");
  });

  $("#toggleSessionsButton").addEventListener("click", () => {
    const section = $("#savedSection");
    section.classList.toggle("hidden");
    $("#toggleSessionsButton").innerHTML = section.classList.contains("hidden")
      ? 'View saved sessions <span>⌄</span>'
      : 'Hide saved sessions <span>⌃</span>';
  });

  $("#clearButton").addEventListener("click", async () => {
    if (!state.sessions.length) return;
    if (!confirm("Delete all saved sessions?")) return;
    await chrome.storage.local.set({ sessions: [] });
    state.sessions = [];
    renderSessions();
    showToast("Saved sessions cleared");
  });
}

async function saveSession() {
  await refreshCurrentBrowser();

  if (!state.tabs.length) {
    showToast("No browser tabs available to save");
    return;
  }

  const name = clean($("#sessionName").value) || inferName(state.tabs);
  const context = clean($("#sessionContext").value);
  const nextStep = clean($("#nextStep").value);
  const summary = summarizeSession(state.tabs, context, nextStep);

  const session = {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    tabs: state.tabs.map(tab => ({
      url: tab.url,
      title: tab.title,
      pinned: Boolean(tab.pinned),
      index: tab.index,
      windowId: tab.windowId
    })),
    summary
  };

  state.sessions.unshift(session);
  await chrome.storage.local.set({ sessions: state.sessions });
  renderSessions();

  $("#sessionName").value = "";
  $("#sessionContext").value = "";
  $("#nextStep").value = "";
  $("#savedSection").classList.remove("hidden");
  $("#toggleSessionsButton").innerHTML = 'Hide saved sessions <span>⌃</span>';
  showToast("Session saved locally");
}

function inferName(tabs) {
  const firstTitle = clean(tabs[0]?.title);
  if (firstTitle) return firstTitle.slice(0, 48);
  return "Untitled session";
}

function renderSessions() {
  const list = $("#sessionList");

  if (!state.sessions.length) {
    list.innerHTML = '<div class="empty-state">Your saved sessions will appear here.</div>';
    return;
  }

  list.innerHTML = state.sessions.map(session => {
    const summary = session.summary || {};
    const date = formatRelativeTime(session.createdAt);
    const sites = (summary.importantSites || []).slice(0, 3).join(" · ");
    return `
      <article class="session-item">
        <div class="session-main">
          <div class="session-title" title="${escapeHtml(session.name)}">${escapeHtml(session.name)}</div>
          <div class="session-time">${date}</div>
        </div>
        <div class="session-meta">${summary.tabCount || session.tabs.length} tabs · ${summary.windowCount || 1} windows${sites ? ` · ${escapeHtml(sites)}` : ""}</div>
        <p class="session-summary">${escapeHtml(summary.overview || "Saved browser session")}</p>
        <div class="session-actions">
          <button class="small-button restore" data-action="restore" data-id="${session.id}">Restore</button>
          <button class="small-button delete" data-action="delete" data-id="${session.id}">Delete</button>
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll("[data-action='restore']").forEach(button => {
    button.addEventListener("click", () => {
      const session = state.sessions.find(item => item.id === button.dataset.id);
      if (session) restoreSession(session);
    });
  });

  list.querySelectorAll("[data-action='delete']").forEach(button => {
    button.addEventListener("click", async () => {
      state.sessions = state.sessions.filter(item => item.id !== button.dataset.id);
      await chrome.storage.local.set({ sessions: state.sessions });
      renderSessions();
      showToast("Session deleted");
    });
  });
}

async function restoreSession(session) {
  const grouped = new Map();

  session.tabs.forEach(tab => {
    if (!grouped.has(tab.windowId)) grouped.set(tab.windowId, []);
    grouped.get(tab.windowId).push(tab);
  });

  let created = 0;

  for (const tabs of grouped.values()) {
    const ordered = [...tabs].sort((a, b) => a.index - b.index);
    const first = ordered[0];
    const createdWindow = await chrome.windows.create({
      url: first.url,
      focused: created === 0
    });

    created++;

    if (first.pinned) {
      await chrome.tabs.update(createdWindow.tabs[0].id, { pinned: true });
    }

    for (const tab of ordered.slice(1)) {
      const newTab = await chrome.tabs.create({
        windowId: createdWindow.id,
        url: tab.url,
        pinned: Boolean(tab.pinned),
        active: false
      });
      if (newTab) created++;
    }
  }

  showToast("Session restored");
}

function formatRelativeTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString([], { day: "numeric", month: "short" });
}

function clean(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
