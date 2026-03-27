// js/utils/navigation.js

const Navigate = (() => {
  const JOB_SEEKER_PAGES = ["home", "posts", "jobs", "profile"];
  const HIRER_PAGES      = ["home", "posts", "hire", "profile"];

  function to(page, params = {}) {
    const session = Session.get();

    // Always allow auth page
    if (page === "auth") {
      _render("auth", params);
      return;
    }

    // Not logged in → redirect to auth
    if (!session) {
      _render("auth", {});
      return;
    }

    // No role yet → role selection
    if (!Session.hasRole()) {
      _render("role-select", {});
      return;
    }

    // Hirer with no plan → plan selection
    if (session.role === CONFIG.ROLES.HIRER && !Session.hasPlan()) {
      _render("plan-select", {});
      return;
    }

    // Validate page access by role
    const allowed = session.role === CONFIG.ROLES.HIRER
      ? HIRER_PAGES : JOB_SEEKER_PAGES;

    const target = allowed.includes(page) ? page : "home";
    _render(target, params);
  }

  function _render(page, params) {
    AppState.set("currentPage", page);
    AppState.set("pageParams", params);

    const app = document.getElementById("app");
    if (!app) return;

    // Show loading skeleton briefly
    app.innerHTML = `<div class="page-loading">
      <div class="skeleton skeleton-header"></div>
      <div class="skeleton skeleton-body"></div>
      <div class="skeleton skeleton-body"></div>
    </div>`;

    setTimeout(() => {
      _mountPage(page, params, app);
      Navbar.render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 120);
  }

  function _mountPage(page, params, container) {
    switch (page) {
      case "auth":        AuthPage.render(container);       break;
      case "role-select": AuthPage.renderRoleSelect(container); break;
      case "plan-select": AuthPage.renderPlanSelect(container); break;
      case "home":        HomePage.render(container, params); break;
      case "jobs":        JobsPage.render(container, params); break;
      case "posts":       PostsPage.render(container, params); break;
      case "hire":        HirePage.render(container, params); break;
      case "profile":     ProfilePage.render(container, params); break;
      case "question":    QuestionCard.renderFullPage(container, params); break;
      default:            HomePage.render(container, params);
    }
  }

  function current() {
    return AppState.get("currentPage");
  }

  function getParams() {
    return AppState.get("pageParams") || {};
  }

  return { to, current, getParams };
})();