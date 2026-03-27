// js/utils/navigation.js

const Navigate = (() => {
  const JOB_SEEKER_PAGES = ["home", "posts", "jobs", "profile"];
  const HIRER_PAGES      = ["home", "posts", "hire", "profile"];

  function to(page, params = {}) {
    const session = Session.get();

    if (page === "auth") { _render("auth", params); return; }
    if (!session)        { _render("auth", {}); return; }
    if (!Session.hasRole()) { _render("role-select", {}); return; }
    if (session.role === CONFIG.ROLES.HIRER && !Session.hasPlan()) {
      _render("plan-select", {}); return;
    }

    // question page is accessible to all logged-in seekers
    if (page === "question") { _render("question", params); return; }

    const allowed = session.role === CONFIG.ROLES.HIRER ? HIRER_PAGES : JOB_SEEKER_PAGES;
    const target  = allowed.includes(page) ? page : "home";
    _render(target, params);
  }

  function _render(page, params) {
    AppState.set("currentPage", page);
    AppState.set("pageParams", params);

    const app = document.getElementById("app");
    if (!app) return;

    // Full-screen pages — hide navbar, no margin
    const fullScreenPages = ["question"];
    const noNavPages      = ["auth", "role-select", "plan-select"];

    if (fullScreenPages.includes(page)) {
      // Hide sidebars immediately
      document.getElementById("cb-navbar")?.remove();
      document.getElementById("cb-mobile-nav")?.remove();
      app.style.marginLeft   = "0";
      app.style.paddingBottom = "0";
      app.innerHTML = "";
      _mountPage(page, params, app);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Normal loading skeleton
    app.innerHTML = `<div class="page-loading">
      <div class="skeleton skeleton-header"></div>
      <div class="skeleton skeleton-body"></div>
      <div class="skeleton skeleton-body"></div>
    </div>`;

    setTimeout(() => {
      _mountPage(page, params, app);
      Navbar.render();
      _applyLayout(page, noNavPages);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 120);
  }

  function _applyLayout(page, noNavPages) {
    const app = document.getElementById("app");
    if (!app) return;
    if (noNavPages.includes(page)) {
      app.style.marginLeft   = "0";
      app.style.paddingBottom = "0";
    } else {
      app.style.marginLeft   = window.innerWidth > 900 ? "240px" : "0";
      app.style.paddingBottom = window.innerWidth <= 900 ? "72px" : "0";
    }
  }

  function _mountPage(page, params, container) {
    switch (page) {
      case "auth":        AuthPage.render(container);              break;
      case "role-select": AuthPage.renderRoleSelect(container);    break;
      case "plan-select": AuthPage.renderPlanSelect(container);    break;
      case "home":        HomePage.render(container, params);      break;
      case "jobs":        JobsPage.render(container, params);      break;
      case "posts":       PostsPage.render(container, params);     break;
      case "hire":        HirePage.render(container, params);      break;
      case "profile":     ProfilePage.render(container, params);   break;
      case "question":    QuestionCard.renderFullPage(container, params); break;
      default:            HomePage.render(container, params);
    }
  }

  function current()   { return AppState.get("currentPage"); }
  function getParams() { return AppState.get("pageParams") || {}; }

  return { to, current, getParams };
})();
