// js/pages/profile.js

const ProfilePage = (() => {
  function render(container) {
    const session = Session.get();
    const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.id === session?.userId);
    const isHirer = session?.role === CONFIG.ROLES.HIRER;
    const theme = Storage.get(CONFIG.THEME.STORAGE_KEY, "dark");

    container.innerHTML = `
      <div class="page-wrap profile-page">
        <div class="profile-header-card">
          <div class="profile-avatar-lg">${session?.name?.charAt(0)}</div>
          <div class="profile-header-info">
            <h1 class="profile-name">${session?.name}</h1>
            <p class="profile-email">${session?.email}</p>
            <div class="profile-badges">
              <span class="role-badge-lg">${isHirer ? "🏢 Hirer" : "🎯 Job Seeker"}</span>
              ${isHirer && user?.plan
                ? `<span class="plan-badge-lg" style="color:${PlansData.getById(user.plan)?.color}">
                    ${PlansData.getById(user.plan)?.name} Plan
                   </span>` : ""}
            </div>
          </div>
          <button class="btn-edit-profile" id="btn-edit-profile">Edit Profile</button>
        </div>

        ${isHirer ? _renderHirerProfile(user) : _renderSeekerProfile(user, session)}

        <div class="profile-section">
          <h2 class="section-title">Preferences</h2>
          <div class="preferences-card">
            <div class="pref-row">
              <div class="pref-info">
                <span class="pref-label">Theme</span>
                <span class="pref-sub">Switch between dark and light mode</span>
              </div>
              <div class="theme-toggle" id="theme-toggle">
                <span class="theme-icon">🌙</span>
                <div class="toggle-track ${theme === "light" ? "toggle-on" : ""}">
                  <div class="toggle-thumb"></div>
                </div>
                <span class="theme-icon">☀️</span>
              </div>
            </div>
            <div class="pref-row">
              <div class="pref-info">
                <span class="pref-label">Switch Role</span>
                <span class="pref-sub">Change between Job Seeker and Hirer</span>
              </div>
              <button class="btn-switch-role" id="btn-switch-role">
                Switch to ${isHirer ? "Job Seeker" : "Hirer"}
              </button>
            </div>
          </div>
        </div>

        ${isHirer ? _renderPlanSection(user) : ""}

        <div class="profile-section">
          <h2 class="section-title">Account</h2>
          <div class="preferences-card">
            <div class="pref-row">
              <div class="pref-info">
                <span class="pref-label">Privacy & Terms</span>
                <span class="pref-sub">Review our privacy policy</span>
              </div>
              <button class="btn-link" id="btn-privacy">View →</button>
            </div>
            <div class="pref-row" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:1rem;margin-top:0.5rem">
              <div class="pref-info">
                <span class="pref-label" style="color:#EF4444">Sign Out</span>
                <span class="pref-sub">Log out of your account</span>
              </div>
              <button class="btn-logout-profile" id="btn-logout-profile">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    `;

    _bindEvents(container, session, user, isHirer);
  }

  function _renderSeekerProfile(user, session) {
    const solved = session ? CodeRunner.getSolved(session.userId) : [];
    return `
      <div class="profile-section">
        <h2 class="section-title">Your Progress</h2>
        <div class="stats-grid">
          <div class="stat-card" style="--stat-color:#10B981">
            <div class="stat-icon" style="background:rgba(16,185,129,0.1)">🎯</div>
            <div class="stat-info">
              <div class="stat-value" style="color:#10B981">${solved.length}</div>
              <div class="stat-label">Problems Solved</div>
            </div>
          </div>
          <div class="stat-card" style="--stat-color:#F59E0B">
            <div class="stat-icon" style="background:rgba(245,158,11,0.1)">🔥</div>
            <div class="stat-info">
              <div class="stat-value" style="color:#F59E0B">${user?.streak || 0}</div>
              <div class="stat-label">Day Streak</div>
            </div>
          </div>
          <div class="stat-card" style="--stat-color:#06B6D4">
            <div class="stat-icon" style="background:rgba(6,182,212,0.1)">🤖</div>
            <div class="stat-info">
              <div class="stat-value" style="color:#06B6D4">${user?.aiScore || "--"}</div>
              <div class="stat-label">AI Score</div>
            </div>
          </div>
          <div class="stat-card" style="--stat-color:#8B5CF6">
            <div class="stat-icon" style="background:rgba(139,92,246,0.1)">💼</div>
            <div class="stat-info">
              <div class="stat-value" style="color:#8B5CF6">${user?.appliedJobs?.length || 0}</div>
              <div class="stat-label">Jobs Applied</div>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-section">
        <h2 class="section-title">Skills & Info</h2>
        <div class="preferences-card">
          <div class="profile-skills-wrap">
            ${(user?.skills || ["JavaScript","React","Node.js"]).map(s =>
              `<span class="skill-tag">${s}</span>`
            ).join("")}
          </div>
          ${user?.bio ? `<p class="profile-bio">${user.bio}</p>` : ""}
        </div>
      </div>
    `;
  }

  function _renderHirerProfile(user) {
    const plan = PlansData.getById(user?.plan);
    const myJobs = JobsData.getByPoster(user?.id);
    return `
      <div class="profile-section">
        <h2 class="section-title">Company Overview</h2>
        <div class="preferences-card">
          <div class="pref-row">
            <span class="pref-label">Company</span>
            <span class="accent-text">${user?.company || "Not set"}</span>
          </div>
          <div class="pref-row">
            <span class="pref-label">Active Jobs</span>
            <span class="accent-text">${myJobs.filter(j => j.status === "active").length}</span>
          </div>
          <div class="pref-row">
            <span class="pref-label">Contacts Unlocked</span>
            <span class="accent-text">${user?.unlockedContacts?.length || 0} / ${plan?.contacts || 0}</span>
          </div>
          <div class="pref-row">
            <span class="pref-label">Job Posts Used</span>
            <span class="accent-text">${user?.jobPostsUsed || 0} / ${plan?.jobPosts || 0}</span>
          </div>
        </div>
      </div>
    `;
  }

  function _renderPlanSection(user) {
    const plan = PlansData.getById(user?.plan);
    if (!plan) return "";
    return `
      <div class="profile-section">
        <h2 class="section-title">Your Plan</h2>
        <div class="plan-info-card" style="border-color:${plan.color}22">
          <div class="plan-info-header">
            <div>
              <span class="plan-info-name" style="color:${plan.color}">${plan.name} Plan</span>
              <span class="plan-info-price">₹${plan.price.toLocaleString()}/mo</span>
            </div>
            <button class="btn-upgrade-plan" id="btn-upgrade-plan">Upgrade Plan</button>
          </div>
          <div class="plan-info-usage">
            <div class="usage-bar-wrap">
              <div class="usage-bar-label">
                <span>Contact Unlocks</span>
                <span>${user?.unlockedContacts?.length || 0}/${plan.contacts}</span>
              </div>
              <div class="usage-bar-track">
                <div class="usage-bar-fill" style="width:${((user?.unlockedContacts?.length || 0)/plan.contacts)*100}%;background:${plan.color}"></div>
              </div>
            </div>
            <div class="usage-bar-wrap" style="margin-top:0.75rem">
              <div class="usage-bar-label">
                <span>Job Posts</span>
                <span>${user?.jobPostsUsed || 0}/${plan.jobPosts}</span>
              </div>
              <div class="usage-bar-track">
                <div class="usage-bar-fill" style="width:${((user?.jobPostsUsed || 0)/plan.jobPosts)*100}%;background:${plan.color}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function _bindEvents(container, session, user, isHirer) {
    // Theme toggle
    container.querySelector("#theme-toggle")?.addEventListener("click", () => {
      const current = Storage.get(CONFIG.THEME.STORAGE_KEY, "dark");
      const next = current === "dark" ? "light" : "dark";
      Storage.set(CONFIG.THEME.STORAGE_KEY, next);
      document.documentElement.setAttribute("data-theme", next);
      AppState.set("theme", next);
      const track = container.querySelector(".toggle-track");
      track?.classList.toggle("toggle-on", next === "light");
      Toast.show(`Switched to ${next} mode`, "success");
    });

    // Switch role
    container.querySelector("#btn-switch-role")?.addEventListener("click", () => {
      const newRole = isHirer ? CONFIG.ROLES.JOB_SEEKER : CONFIG.ROLES.HIRER;
      Storage.update(CONFIG.STORAGE_KEYS.USERS, users =>
        users.map(u => u.id === session.userId ? { ...u, role: newRole } : u)
      );
      Session.update({ role: newRole });
      if (newRole === CONFIG.ROLES.HIRER && !user?.plan) {
        Navigate.to("plan-select");
      } else {
        Toast.show(`Switched to ${newRole === CONFIG.ROLES.HIRER ? "Hirer" : "Job Seeker"} mode`, "success");
        Navigate.to("home");
      }
    });

    // Edit profile
    container.querySelector("#btn-edit-profile")?.addEventListener("click", () =>
      _showEditProfileModal(container, session, user)
    );

    // Upgrade plan
    container.querySelector("#btn-upgrade-plan")?.addEventListener("click", () => {
      PlanSelector.showUpgradeModal(() => Navigate.to("profile"));
    });

    // Privacy
    container.querySelector("#btn-privacy")?.addEventListener("click", () =>
      Toast.show("Privacy policy: All data is stored locally on your device only.", "info")
    );

    // Logout
    container.querySelector("#btn-logout-profile")?.addEventListener("click", () =>
      Login.logout()
    );
  }

  function _showEditProfileModal(container, session, user) {
    const existing = document.getElementById("edit-profile-modal");
    if (existing) existing.remove();

    const isHirer = session?.role === CONFIG.ROLES.HIRER;
    const modal = document.createElement("div");
    modal.id = "edit-profile-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-card edit-profile-modal-card">
        <button class="modal-close" id="close-edit-profile">✕</button>
        <h2 class="modal-title">Edit Profile</h2>
        <form class="auth-form" id="edit-profile-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input class="form-input" id="ep-name" value="${session?.name || ""}"/>
          </div>
          ${isHirer ? `
            <div class="form-group">
              <label class="form-label">Company</label>
              <input class="form-input" id="ep-company" value="${user?.company || ""}"/>
            </div>
          ` : `
            <div class="form-group">
              <label class="form-label">Bio</label>
              <textarea class="form-input form-textarea" id="ep-bio" rows="2">${user?.bio || ""}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Skills (comma separated)</label>
              <input class="form-input" id="ep-skills" value="${(user?.skills || []).join(", ")}"/>
            </div>
          `}
          <button class="btn-auth-submit" type="submit">Save Changes</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector("#close-edit-profile")?.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

    modal.querySelector("#edit-profile-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = modal.querySelector("#ep-name")?.value?.trim();
      if (!name) { Toast.show("Name cannot be empty.", "error"); return; }

      const updates = { name };
      if (isHirer) {
        updates.company = modal.querySelector("#ep-company")?.value?.trim();
      } else {
        updates.bio = modal.querySelector("#ep-bio")?.value?.trim();
        const skillsRaw = modal.querySelector("#ep-skills")?.value || "";
        updates.skills = skillsRaw.split(",").map(s => s.trim()).filter(Boolean);
      }

      Storage.update(CONFIG.STORAGE_KEYS.USERS, users =>
        users.map(u => u.id === session.userId ? { ...u, ...updates } : u)
      );
      Session.update(updates);
      modal.remove();
      Toast.show("Profile updated! ✓", "success");
      Navigate.to("profile");
    });
  }

  return { render };
})();