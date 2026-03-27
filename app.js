// app.js — Main entry point

// ── TOAST UTILITY ────────────────────────────────────────────────────────────
const Toast = (() => {
  function _getContainer() {
    let c = document.getElementById("toast-container");
    if (!c) {
      c = document.createElement("div");
      c.id = "toast-container";
      document.body.appendChild(c);
    }
    return c;
  }

  function show(message, type = "info", duration = 3000) {
    const container = _getContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icons = { success: "✓", error: "✕", info: "ℹ" };
    toast.innerHTML = `<span>${icons[type] || "ℹ"}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("toast-exit");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return { show };
})();

// ── LAYOUT HELPER ─────────────────────────────────────────────────────────────
function _applyLayout(page) {
  const app = document.getElementById("app");
  if (!app) return;
  const noNavPages      = ["auth", "role-select", "plan-select"];
  const fullScreenPages = ["question"];
  if (noNavPages.includes(page) || fullScreenPages.includes(page)) {
    app.style.marginLeft    = "0";
    app.style.paddingBottom = "0";
  } else {
    app.style.marginLeft    = window.innerWidth > 900 ? "240px" : "0";
    app.style.paddingBottom = window.innerWidth <= 900 ? "72px" : "0";
  }
}

// ── APP INIT ──────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // 1. Apply saved theme
  const theme = Storage.get(CONFIG.THEME.STORAGE_KEY, "dark");
  document.documentElement.setAttribute("data-theme", theme);
  AppState.set("theme", theme);

  // 2. Seed mock data
  UsersData.seedIfEmpty();
  JobsData.seedIfEmpty();
  PostsData.seedIfEmpty();

  // 3. Restore session
  const session = Session.get();
  if (session) AppState.set("currentUser", session);

  // 4. Apply layout whenever page changes
  AppState.subscribe("currentPage", (page) => {
    _applyLayout(page);
  });

  // 5. Re-apply layout on resize
  window.addEventListener("resize", () => {
    const page = AppState.get("currentPage");
    _applyLayout(page);
  });

  // 6. Route to correct starting page
  if (!session) {
    Navigate.to("auth");
  } else if (!Session.hasRole()) {
    Navigate.to("role-select");
  } else if (session.role === CONFIG.ROLES.HIRER && !Session.hasPlan()) {
    Navigate.to("plan-select");
  } else {
    Navigate.to("home");
  }
});
