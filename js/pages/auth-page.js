// js/pages/auth-page.js

const AuthPage = (() => {
  function render(container) {
    const theme = Storage.get(CONFIG.THEME.STORAGE_KEY, "dark");
    container.innerHTML = `
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-logo">
            <span class="auth-logo-text">Carrer<span class="accent">Buddy</span></span>
            <p class="auth-tagline">Your AI-powered career launchpad</p>
          </div>
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">Sign In</button>
            <button class="auth-tab" data-tab="signup">Sign Up</button>
          </div>
          <div id="auth-form-wrap"></div>
          <div class="auth-divider"><span>or</span></div>
          <button class="btn-google" id="btn-google-auth">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    `;
    _renderLoginForm(container);
    _bindAuthTabs(container);
    document.getElementById("btn-google-auth")?.addEventListener("click", () => {
      GoogleMock.showPopup((user) => _afterAuth(user));
    });
  }

  function _renderLoginForm(container) {
    const wrap = container.querySelector("#auth-form-wrap");
    if (!wrap) return;
    wrap.innerHTML = `
      <form class="auth-form" id="login-form" autocomplete="off">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" type="email" id="login-email" placeholder="you@example.com"/>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-password-wrap">
            <input class="form-input" type="password" id="login-password" placeholder="••••••••"/>
            <button type="button" class="btn-toggle-pw" data-target="login-password">👁</button>
          </div>
        </div>
        <div class="form-error hidden" id="login-error"></div>
        <button class="btn-auth-submit" type="submit" id="login-submit">Sign In</button>
        <div class="auth-demo-hint">
          <span>Demo:</span>
          <button type="button" class="btn-demo" data-email="aarav@example.com" data-pw="password123" data-role="seeker">Job Seeker</button>
          <button type="button" class="btn-demo" data-email="neha@example.com" data-pw="password123" data-role="hirer">Hirer</button>
        </div>
      </form>
    `;
    _bindLoginForm(container);
  }

  function _renderSignupForm(container) {
    const wrap = container.querySelector("#auth-form-wrap");
    if (!wrap) return;
    wrap.innerHTML = `
      <form class="auth-form" id="signup-form" autocomplete="off">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input class="form-input" type="text" id="signup-name" placeholder="Your full name"/>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" type="email" id="signup-email" placeholder="you@example.com"/>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-password-wrap">
            <input class="form-input" type="password" id="signup-password" placeholder="Min 6 characters"/>
            <button type="button" class="btn-toggle-pw" data-target="signup-password">👁</button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <div class="input-password-wrap">
            <input class="form-input" type="password" id="signup-confirm" placeholder="Repeat password"/>
            <button type="button" class="btn-toggle-pw" data-target="signup-confirm">👁</button>
          </div>
        </div>
        <div class="form-error hidden" id="signup-error"></div>
        <button class="btn-auth-submit" type="submit" id="signup-submit">Create Account</button>
      </form>
    `;
    _bindSignupForm(container);
  }

  function _bindAuthTabs(container) {
    container.querySelectorAll(".auth-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        container.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        if (tab.dataset.tab === "login") _renderLoginForm(container);
        else _renderSignupForm(container);
      });
    });
  }

  function _bindLoginForm(container) {
    container.querySelector("#login-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = container.querySelector("#login-email")?.value || "";
      const password = container.querySelector("#login-password")?.value || "";
      const btn = container.querySelector("#login-submit");
      _setLoading(btn, true, "Signing in...");
      setTimeout(() => {
        const result = Login.attempt(email, password);
        if (result.success) {
          _afterAuth(result.user);
        } else {
          _showError(container, "#login-error", result.error);
          _setLoading(btn, false, "Sign In");
        }
      }, 700);
    });

    container.querySelectorAll(".btn-toggle-pw").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = container.querySelector(`#${btn.dataset.target}`);
        if (input) input.type = input.type === "password" ? "text" : "password";
      });
    });

    container.querySelectorAll(".btn-demo").forEach(btn => {
      btn.addEventListener("click", () => {
        const emailEl = container.querySelector("#login-email");
        const pwEl = container.querySelector("#login-password");
        if (emailEl) emailEl.value = btn.dataset.email;
        if (pwEl) pwEl.value = btn.dataset.pw;
      });
    });
  }

  function _bindSignupForm(container) {
    container.querySelector("#signup-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name     = container.querySelector("#signup-name")?.value || "";
      const email    = container.querySelector("#signup-email")?.value || "";
      const password = container.querySelector("#signup-password")?.value || "";
      const confirm  = container.querySelector("#signup-confirm")?.value || "";
      const btn = container.querySelector("#signup-submit");
      _setLoading(btn, true, "Creating account...");
      setTimeout(() => {
        const result = Signup.attempt(name, email, password, confirm);
        if (result.success) {
          _afterAuth(result.user);
        } else {
          _showError(container, "#signup-error", result.error);
          _setLoading(btn, false, "Create Account");
        }
      }, 700);
    });

    container.querySelectorAll(".btn-toggle-pw").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = container.querySelector(`#${btn.dataset.target}`);
        if (input) input.type = input.type === "password" ? "text" : "password";
      });
    });
  }

  function _afterAuth(user) {
    if (!user.role) { Navigate.to("role-select"); return; }
    if (user.role === CONFIG.ROLES.HIRER && !user.plan) { Navigate.to("plan-select"); return; }
    Navigate.to("home");
  }

  function renderRoleSelect(container) {
    container.innerHTML = `
      <div class="auth-page">
        <div class="auth-card role-card">
          <div class="auth-logo">
            <span class="auth-logo-text">Carrer<span class="accent">Buddy</span></span>
          </div>
          <h2 class="role-title">What brings you here?</h2>
          <p class="role-sub">Choose your role to personalize your experience</p>
          <div class="role-options">
            <div class="role-option" data-role="${CONFIG.ROLES.JOB_SEEKER}">
              <div class="role-icon">🎯</div>
              <h3>Job Seeker</h3>
              <p>Practice coding, build your profile, and apply to top jobs</p>
            </div>
            <div class="role-option" data-role="${CONFIG.ROLES.HIRER}">
              <div class="role-icon">🏢</div>
              <h3>Hirer</h3>
              <p>Discover AI-scored candidates and post jobs for free</p>
            </div>
          </div>
          <div class="form-error hidden" id="role-error">Please select a role to continue.</div>
        </div>
      </div>
    `;

    container.querySelectorAll(".role-option").forEach(opt => {
      opt.addEventListener("click", () => {
        const role = opt.dataset.role;
        const session = Session.get();
        if (!session) { Navigate.to("auth"); return; }

        Storage.update(CONFIG.STORAGE_KEYS.USERS, users =>
          users.map(u => u.id === session.userId ? { ...u, role } : u)
        );
        Session.update({ role });

        if (role === CONFIG.ROLES.HIRER) Navigate.to("plan-select");
        else Navigate.to("home");
      });
    });
  }

  function renderPlanSelect(container) {
    const inner = document.createElement("div");
    inner.className = "plan-select-page";
    container.innerHTML = "";
    container.appendChild(inner);

    PlanSelector.render(inner, {
      isUpgrade: false,
      onSelect: (planId, plan) => {
        Toast.show(`${plan.name} plan activated! Welcome to CarrerBuddy 🎉`, "success");
        setTimeout(() => Navigate.to("home"), 600);
      },
    });
  }

  function _showError(container, selector, message) {
    const el = container.querySelector(selector);
    if (!el) return;
    el.textContent = message;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 4000);
  }

  function _setLoading(btn, loading, text) {
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = text;
  }

  return { render, renderRoleSelect, renderPlanSelect };
})();