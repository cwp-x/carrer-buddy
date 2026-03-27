// js/components/navbar.js

const Navbar = (() => {
  function render() {
    const session = Session.get();
    const page = AppState.get("currentPage");

    // Remove BOTH existing navbars cleanly
    document.getElementById("cb-navbar")?.remove();
    document.getElementById("cb-mobile-nav")?.remove();

    // Don't show nav on auth screens
    if (!session || page === "auth" || page === "role-select" || page === "plan-select") return;

    const isHirer = session.role === CONFIG.ROLES.HIRER;
    const navItems = isHirer
      ? [
          { id: "home",    label: "Home",    icon: _icon("home") },
          { id: "posts",   label: "Posts",   icon: _icon("posts") },
          { id: "hire",    label: "Hire",    icon: _icon("hire") },
          { id: "profile", label: "Profile", icon: _icon("profile") },
        ]
      : [
          { id: "home",    label: "Home",    icon: _icon("home") },
          { id: "posts",   label: "Posts",   icon: _icon("posts") },
          { id: "jobs",    label: "Jobs",    icon: _icon("jobs") },
          { id: "profile", label: "Profile", icon: _icon("profile") },
        ];

    // ── Desktop sidebar ──────────────────────────────────────────
    const sidebar = document.createElement("nav");
    sidebar.id = "cb-navbar";
    sidebar.className = "navbar-sidebar";
    sidebar.innerHTML = `
      <div class="navbar-logo">
        <span class="navbar-logo-text">Carrer<span class="accent">Buddy</span></span>
      </div>
      <ul class="navbar-links">
        ${navItems.map((item) => `
          <li class="navbar-item ${page === item.id ? "active" : ""}" data-page="${item.id}">
            <span class="navbar-icon">${item.icon}</span>
            <span class="navbar-label">${item.label}</span>
            ${page === item.id ? '<span class="navbar-active-bar"></span>' : ""}
          </li>
        `).join("")}
      </ul>
      <div class="navbar-bottom">
        <div class="navbar-user">
          <div class="navbar-avatar">${session.name.charAt(0).toUpperCase()}</div>
          <div class="navbar-user-info">
            <div class="navbar-user-name">${session.name}</div>
            <div class="navbar-user-role">${isHirer ? "Hirer" : "Job Seeker"}</div>
          </div>
        </div>
        <button class="navbar-logout-btn" id="navbar-logout">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    `;

    // ── Mobile bottom nav ────────────────────────────────────────
    const mobileNav = document.createElement("nav");
    mobileNav.id = "cb-mobile-nav";
    mobileNav.className = "navbar-mobile";
    mobileNav.innerHTML = navItems.map((item) => `
      <div class="mobile-nav-item ${page === item.id ? "active" : ""}" data-page="${item.id}">
        <span class="mobile-nav-icon">${item.icon}</span>
        <span class="mobile-nav-label">${item.label}</span>
      </div>
    `).join("");

    document.body.appendChild(sidebar);
    document.body.appendChild(mobileNav);

    // ── Events ───────────────────────────────────────────────────
    sidebar.querySelectorAll(".navbar-item").forEach((el) => {
      el.addEventListener("click", () => Navigate.to(el.dataset.page));
    });

    document.getElementById("navbar-logout")?.addEventListener("click", () => {
      Login.logout();
    });

    mobileNav.querySelectorAll(".mobile-nav-item").forEach((el) => {
      el.addEventListener("click", () => Navigate.to(el.dataset.page));
    });
  }

  function _icon(type) {
    const icons = {
      home:    `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      posts:   `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      jobs:    `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`,
      hire:    `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      profile: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    };
    return icons[type] || icons.home;
  }

  return { render };
})();