// js/pages/home.js

const HomePage = (() => {

  // ── State for seeker filters ───────────────────────────────────────────────
  let _state = {
    category: "All",   // All | DSA | Web Dev | AI | Cyber
    language: "All",   // All | C | C++ | Java | Python | JavaScript
    difficulty: "All", // All | Beginner | Intermediate | Advanced
    search: "",
  };

  const CATEGORIES = ["All", "DSA", "Web Dev", "AI", "Cyber"];

  const LANGUAGES_BY_CATEGORY = {
    DSA:     ["All", "C", "C++", "Java", "Python", "JavaScript"],
    "Web Dev": ["All", "JavaScript", "Python"],
    AI:      ["All", "Python", "JavaScript"],
    Cyber:   ["All", "Python", "C"],
  };

  const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

  function render(container) {
    const session = Session.get();
    const isHirer = session?.role === CONFIG.ROLES.HIRER;
    isHirer ? _renderHirerHome(container, session) : _renderSeekerHome(container, session);
  }

  // ── JOB SEEKER HOME ────────────────────────────────────────────────────────
  function _renderSeekerHome(container, session) {
    // Reset state on fresh render
    _state = { category: "All", language: "All", difficulty: "All", search: "" };

    const solved = session ? CodeRunner.getSolved(session.userId) : [];
    const users  = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user   = users.find(u => u.id === session?.userId);

    container.innerHTML = `
      <div class="page-wrap">
        <div class="page-header">
          <div>
            <h1 class="page-title">Hey, ${session?.name?.split(" ")[0] || "there"} 👋</h1>
            <p class="page-sub">Ready to level up today?</p>
          </div>
          <div class="header-search">
            <input class="search-input" id="home-search" placeholder="Search problems..."/>
          </div>
        </div>

        <div class="stats-grid">
          ${_statCard("Problems Solved", solved.length, "🎯", "#10B981")}
          ${_statCard("Current Streak", `${user?.streak || 0} days`, "🔥", "#F59E0B")}
          ${_statCard("AI Score", `${user?.aiScore || "--"}%`, "🤖", "#06B6D4")}
          ${_statCard("Applied Jobs", (user?.appliedJobs?.length || 0), "💼", "#8B5CF6")}
        </div>

        <div class="section-header">
          <h2 class="section-title">Practice Problems</h2>
        </div>

        <!-- LEVEL 1: Category -->
        <div class="filter-row" id="filter-row-category">
          <span class="filter-row-label">Category</span>
          <div class="filter-chips" id="chips-category">
            ${CATEGORIES.map(c => `
              <button class="chip ${c === "All" ? "chip-active" : ""}" data-category="${c}">${c}</button>
            `).join("")}
          </div>
        </div>

        <!-- LEVEL 2: Language (hidden until category selected) -->
        <div class="filter-row hidden" id="filter-row-language">
          <span class="filter-row-label">Language</span>
          <div class="filter-chips" id="chips-language"></div>
        </div>

        <!-- LEVEL 3: Difficulty (hidden until language selected) -->
        <div class="filter-row hidden" id="filter-row-difficulty">
          <span class="filter-row-label">Difficulty</span>
          <div class="filter-chips" id="chips-difficulty">
            ${DIFFICULTIES.map(d => `
              <button class="chip ${d === "All" ? "chip-active" : ""}" data-difficulty="${d}">${d}</button>
            `).join("")}
          </div>
        </div>

        <!-- Questions Grid -->
        <div class="questions-grid" id="questions-grid"></div>
        <div class="empty-state hidden" id="questions-empty">
          <div class="empty-icon">🔍</div>
          <h3>No problems found</h3>
          <p>Try a different filter or search term</p>
        </div>
      </div>
    `;

    _injectFilterStyles();
    _renderQuestions(container);
    _bindSeekerEvents(container);
  }

  function _renderQuestions(container) {
    const grid  = container.querySelector("#questions-grid");
    const empty = container.querySelector("#questions-empty");
    if (!grid) return;

    let questions = QuestionsData.getAll();

    // Category filter
    if (_state.category !== "All") {
      questions = questions.filter(q => q.category === _state.category);
    }

    // Language filter
    if (_state.language !== "All") {
      questions = questions.filter(q =>
        q.language && q.language.some(l =>
          l.toLowerCase() === _state.language.toLowerCase()
        )
      );
    }

    // Difficulty filter
    if (_state.difficulty !== "All") {
      questions = questions.filter(q => q.difficulty === _state.difficulty);
    }

    // Search filter
    if (_state.search) {
      const q = _state.search.toLowerCase();
      questions = questions.filter(qn =>
        qn.title.toLowerCase().includes(q) ||
        qn.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    grid.innerHTML = "";
    if (questions.length === 0) {
      grid.style.display = "none";
      empty?.classList.remove("hidden");
    } else {
      grid.style.display = "";
      empty?.classList.add("hidden");
      questions.forEach(q => grid.appendChild(QuestionCard.render(q)));
    }
  }

  function _bindSeekerEvents(container) {
    // ── Category chips ────────────────────────────────────────────────
    container.querySelector("#chips-category")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-category]");
      if (!btn) return;

      const cat = btn.dataset.category;
      _state.category = cat;
      _state.language  = "All";
      _state.difficulty = "All";

      // Active state
      container.querySelectorAll("#chips-category .chip").forEach(c => c.classList.remove("chip-active"));
      btn.classList.add("chip-active");

      // Show/hide language row
      const langRow  = container.querySelector("#filter-row-language");
      const diffRow  = container.querySelector("#filter-row-difficulty");
      const langChips = container.querySelector("#chips-language");

      if (cat === "All") {
        langRow?.classList.add("hidden");
        diffRow?.classList.add("hidden");
      } else {
        // Populate language chips
        const langs = LANGUAGES_BY_CATEGORY[cat] || ["All"];
        langChips.innerHTML = langs.map(l => `
          <button class="chip ${l === "All" ? "chip-active" : ""}" data-language="${l}">${l}</button>
        `).join("");
        langRow?.classList.remove("hidden");

        // Show difficulty row too
        container.querySelectorAll("#chips-difficulty .chip").forEach(c => {
          c.classList.toggle("chip-active", c.dataset.difficulty === "All");
        });
        diffRow?.classList.remove("hidden");
      }

      _renderQuestions(container);
    });

    // ── Language chips (delegated — chips are rebuilt dynamically) ────
    container.querySelector("#chips-language")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-language]");
      if (!btn) return;
      _state.language = btn.dataset.language;
      container.querySelectorAll("#chips-language .chip").forEach(c => c.classList.remove("chip-active"));
      btn.classList.add("chip-active");
      _renderQuestions(container);
    });

    // ── Difficulty chips ──────────────────────────────────────────────
    container.querySelector("#chips-difficulty")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-difficulty]");
      if (!btn) return;
      _state.difficulty = btn.dataset.difficulty;
      container.querySelectorAll("#chips-difficulty .chip").forEach(c => c.classList.remove("chip-active"));
      btn.classList.add("chip-active");
      _renderQuestions(container);
    });

    // ── Search ────────────────────────────────────────────────────────
    let searchTimeout;
    container.querySelector("#home-search")?.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        _state.search = e.target.value;
        _renderQuestions(container);
      }, 300);
    });
  }

  // ── Filter row style (injected once) ──────────────────────────────────────
  function _injectFilterStyles() {
    if (document.getElementById("home-filter-styles")) return;
    const style = document.createElement("style");
    style.id = "home-filter-styles";
    style.textContent = `
      .filter-row {
        display: flex; align-items: center; gap: 12px;
        margin-bottom: 12px; flex-wrap: wrap;
        animation: filterFadeIn 0.25s ease;
      }
      @keyframes filterFadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
      .filter-row-label {
        font-size: 12px; font-weight: 600; color: var(--text-secondary, #9CA3AF);
        text-transform: uppercase; letter-spacing: 0.06em;
        min-width: 72px; flex-shrink: 0;
      }
      .filter-row .filter-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    `;
    document.head.appendChild(style);
  }

  // ── HIRER HOME (unchanged) ─────────────────────────────────────────────────
  function _renderHirerHome(container, session) {
    const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user  = users.find(u => u.id === session?.userId);
    const plan  = PlansData.getById(user?.plan);
    const myJobs = JobsData.getByPoster(session?.userId);
    const topCandidates = CandidatesData.getTopCandidates(88);
    const allCandidates = CandidatesData.getAll();
    const trending = allCandidates.filter(c => c.recentlyActive).slice(0, 5);

    container.innerHTML = `
      <div class="page-wrap">
        <div class="page-header">
          <div>
            <h1 class="page-title">Welcome back, ${session?.name?.split(" ")[0]} 👋</h1>
            <p class="page-sub">${plan ? plan.name + " Plan · " + plan.aiLabel : "Set up your plan"}</p>
          </div>
          <div class="header-actions">
            <div class="header-search">
              <input class="search-input" id="hirer-search" placeholder="Search by skill, role..."/>
            </div>
            <button class="btn-post-job" id="btn-post-job-home">+ Post Job</button>
          </div>
        </div>

        <div class="filter-chips" id="hirer-filters">
          <button class="chip chip-active" data-filter="all">All</button>
          <button class="chip" data-filter="my-jobs">My Jobs</button>
          <button class="chip" data-filter="top-score">AI Score &gt; 88%</button>
          <button class="chip" data-filter="remote">Remote</button>
        </div>

        <div class="stats-grid">
          ${_statCard("Active Jobs", myJobs.filter(j => j.status === "active").length, "📋", "#06B6D4")}
          ${_statCard("Contacts Used", `${user?.unlockedContacts?.length || 0}/${plan?.contacts || 0}`, "🔓", "#10B981")}
          ${_statCard("Job Posts Used", `${user?.jobPostsUsed || 0}/${plan?.jobPosts || 0}`, "📝", "#F59E0B")}
          ${_statCard("Top Candidates", topCandidates.length, "⭐", "#8B5CF6")}
        </div>

        <div class="section-header">
          <h2 class="section-title">Active Jobs</h2>
          <button class="btn-link" id="see-all-jobs">See All →</button>
        </div>
        <div class="jobs-mini-grid" id="active-jobs-grid"></div>

        <div class="section-header" style="margin-top:2rem">
          <h2 class="section-title">⭐ AI Elite Talent</h2>
          <button class="btn-link" id="see-all-candidates">View All →</button>
        </div>
        <div class="candidates-scroll" id="elite-candidates-wrap"></div>

        <div class="section-header" style="margin-top:2rem">
          <h2 class="section-title">🔥 Trending Candidates</h2>
        </div>
        <div class="trending-list" id="trending-list"></div>
      </div>
    `;

    _renderActiveJobs(container, myJobs);
    _renderEliteCandidates(container, topCandidates, plan);
    _renderTrending(container, trending);
    _bindHirerEvents(container, session, user, plan);
  }

  function _renderActiveJobs(container, jobs) {
    const grid = container.querySelector("#active-jobs-grid");
    if (!grid) return;
    const active = jobs.filter(j => j.status === "active").slice(0, 3);
    if (active.length === 0) {
      grid.innerHTML = `<div class="empty-state">No active jobs yet. <button class="btn-link" id="post-first-job">Post your first job →</button></div>`;
      grid.querySelector("#post-first-job")?.addEventListener("click", () => _showPostJobModal());
      return;
    }
    active.forEach(job => grid.appendChild(JobCard.render(job, { isHirer: true })));
  }

  function _renderEliteCandidates(container, candidates, plan) {
    const wrap = container.querySelector("#elite-candidates-wrap");
    if (!wrap) return;
    candidates.slice(0, 6).forEach((c, i) =>
      wrap.appendChild(CandidateCard.render(c, { isTop: i < 3, planId: plan?.id }))
    );
  }

  function _renderTrending(container, candidates) {
    const list = container.querySelector("#trending-list");
    if (!list) return;
    candidates.forEach(c => {
      const scoreColor = c.aiScore >= 88 ? "#10B981" : "#06B6D4";
      const item = document.createElement("div");
      item.className = "trending-item";
      item.innerHTML = `
        <div class="trending-avatar">${c.name.charAt(0)}</div>
        <div class="trending-info">
          <span class="trending-name">${c.name}</span>
          <span class="trending-role">${c.role} · ${c.location}</span>
        </div>
        <div class="trending-badges">
          ${c.recentlyActive ? `<span class="activity-tag tag-active">● Active</span>` : ""}
          ${c.highDemand ? `<span class="activity-tag tag-demand">🔥 Hot</span>` : ""}
        </div>
        <div class="trending-score" style="color:${scoreColor}">${c.aiScore}</div>
      `;
      list.appendChild(item);
    });
  }

  function _bindHirerEvents(container, session, user, plan) {
    container.querySelector("#btn-post-job-home")?.addEventListener("click", () =>
      _showPostJobModal(session, user, plan)
    );
    container.querySelector("#see-all-jobs")?.addEventListener("click", () => Navigate.to("hire"));
    container.querySelector("#see-all-candidates")?.addEventListener("click", () => Navigate.to("hire"));

    container.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        container.querySelectorAll(".chip").forEach(c => c.classList.remove("chip-active"));
        chip.classList.add("chip-active");
      });
    });

    container.querySelector("#hirer-search")?.addEventListener("input", (e) => {
      const q = e.target.value;
      if (q.length < 2) return;
      const results = CandidatesData.search(q);
      const wrap = container.querySelector("#elite-candidates-wrap");
      if (wrap) {
        wrap.innerHTML = "";
        results.forEach(c => wrap.appendChild(CandidateCard.render(c, { planId: plan?.id })));
      }
    });
  }

  function _showPostJobModal(session, user, plan) {
    const existing = document.getElementById("post-job-modal");
    if (existing) existing.remove();

    if (plan) {
      const usedPosts = user?.jobPostsUsed || 0;
      if (usedPosts >= plan.limits.jobPosts) {
        PlanSelector.showUpgradeModal(() => Navigate.to("home"));
        return;
      }
    }

    const modal = document.createElement("div");
    modal.id = "post-job-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-card post-job-modal-card">
        <button class="modal-close" id="close-post-job">✕</button>
        <h2 class="modal-title">Post a New Job</h2>
        <form class="auth-form" id="post-job-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Job Title *</label>
              <input class="form-input" id="pj-title" placeholder="e.g. Frontend Developer" required/>
            </div>
            <div class="form-group">
              <label class="form-label">Company *</label>
              <input class="form-input" id="pj-company" placeholder="Your company name" required/>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Location</label>
              <input class="form-input" id="pj-location" placeholder="City or Remote"/>
            </div>
            <div class="form-group">
              <label class="form-label">Salary Range</label>
              <input class="form-input" id="pj-salary" placeholder="₹6L – ₹10L"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Required Skills (comma separated)</label>
            <input class="form-input" id="pj-skills" placeholder="JavaScript, React, Node.js"/>
          </div>
          <div class="form-group">
            <label class="form-label">Job Description</label>
            <textarea class="form-input form-textarea" id="pj-desc" rows="3"
              placeholder="Describe the role and responsibilities..."></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Job Type</label>
              <select class="form-input" id="pj-type">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div class="form-group" style="justify-content:flex-end;padding-top:1.5rem">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                <input type="checkbox" id="pj-remote"/> Remote OK
              </label>
            </div>
          </div>
          <div class="form-error hidden" id="pj-error"></div>
          <button class="btn-auth-submit" type="submit">Post Job</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector("#close-post-job")?.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

    modal.querySelector("#post-job-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const title   = modal.querySelector("#pj-title")?.value?.trim();
      const company = modal.querySelector("#pj-company")?.value?.trim();
      if (!title || !company) {
        const err = modal.querySelector("#pj-error");
        if (err) { err.textContent = "Title and company are required."; err.classList.remove("hidden"); }
        return;
      }
      const skillsRaw = modal.querySelector("#pj-skills")?.value || "";
      const newJob = JobsData.addJob({
        title, company,
        location:    modal.querySelector("#pj-location")?.value || "Remote",
        salary:      modal.querySelector("#pj-salary")?.value || "",
        skills:      skillsRaw.split(",").map(s => s.trim()).filter(Boolean),
        description: modal.querySelector("#pj-desc")?.value || "",
        type:        modal.querySelector("#pj-type")?.value || "Full-time",
        remote:      modal.querySelector("#pj-remote")?.checked || false,
        postedBy:    session?.userId,
      });
      if (session) {
        Storage.update(CONFIG.STORAGE_KEYS.USERS, users =>
          users.map(u => u.id === session.userId
            ? { ...u, jobPostsUsed: (u.jobPostsUsed || 0) + 1 } : u)
        );
      }
      modal.remove();
      Toast.show(`Job "${newJob.title}" posted successfully! 🎉`, "success");
      Navigate.to("home");
    });
  }

  function _statCard(label, value, icon, color) {
    return `
      <div class="stat-card" style="--stat-color:${color}">
        <div class="stat-icon" style="background:${color}22">${icon}</div>
        <div class="stat-info">
          <div class="stat-value" style="color:${color}">${value}</div>
          <div class="stat-label">${label}</div>
        </div>
      </div>`;
  }

  return { render };
})();