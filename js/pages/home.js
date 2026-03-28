// js/pages/home.js

const HomePage = (() => {

  let _state = {
    category: "All",
    language: "All",
    difficulty: "All",
    search: "",
  };

  const CATEGORIES = ["All", "DSA", "Web Dev", "AI", "Cyber"];
  const LANGUAGES_BY_CATEGORY = {
    DSA:       ["All", "C", "C++", "Java", "Python", "JavaScript"],
    "Web Dev": ["All", "JavaScript", "Python"],
    AI:        ["All", "Python", "JavaScript"],
    Cyber:     ["All", "Python", "C"],
  };
  const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

  function render(container) {
    const session = Session.get();
    const isHirer = session?.role === CONFIG.ROLES.HIRER;
    isHirer ? _renderHirerHome(container, session) : _renderSeekerHome(container, session);
  }

  // ── JOB SEEKER HOME ────────────────────────────────────────────────────────
  function _renderSeekerHome(container, session) {
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

        <div class="filter-row" id="filter-row-category">
          <span class="filter-row-label">Category</span>
          <div class="filter-chips" id="chips-category">
            ${CATEGORIES.map(c => `
              <button class="chip ${c === "All" ? "chip-active" : ""}" data-category="${c}">${c}</button>
            `).join("")}
          </div>
        </div>

        <div class="filter-row hidden" id="filter-row-language">
          <span class="filter-row-label">Language</span>
          <div class="filter-chips" id="chips-language"></div>
        </div>

        <div class="filter-row hidden" id="filter-row-difficulty">
          <span class="filter-row-label">Difficulty</span>
          <div class="filter-chips" id="chips-difficulty">
            ${DIFFICULTIES.map(d => `
              <button class="chip ${d === "All" ? "chip-active" : ""}" data-difficulty="${d}">${d}</button>
            `).join("")}
          </div>
        </div>

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
    if (_state.category !== "All")   questions = questions.filter(q => q.category === _state.category);
    if (_state.language  !== "All")  questions = questions.filter(q => q.language?.some(l => l.toLowerCase() === _state.language.toLowerCase()));
    if (_state.difficulty !== "All") questions = questions.filter(q => q.difficulty === _state.difficulty);
    if (_state.search) {
      const q = _state.search.toLowerCase();
      questions = questions.filter(qn => qn.title.toLowerCase().includes(q) || qn.tags.some(t => t.toLowerCase().includes(q)));
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
    container.querySelector("#chips-category")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-category]");
      if (!btn) return;
      const cat = btn.dataset.category;
      _state.category = cat; _state.language = "All"; _state.difficulty = "All";
      container.querySelectorAll("#chips-category .chip").forEach(c => c.classList.remove("chip-active"));
      btn.classList.add("chip-active");

      const langRow   = container.querySelector("#filter-row-language");
      const diffRow   = container.querySelector("#filter-row-difficulty");
      const langChips = container.querySelector("#chips-language");

      if (cat === "All") {
        langRow?.classList.add("hidden");
        diffRow?.classList.add("hidden");
      } else {
        const langs = LANGUAGES_BY_CATEGORY[cat] || ["All"];
        langChips.innerHTML = langs.map(l => `<button class="chip ${l === "All" ? "chip-active" : ""}" data-language="${l}">${l}</button>`).join("");
        langRow?.classList.remove("hidden");
        container.querySelectorAll("#chips-difficulty .chip").forEach(c => { c.classList.toggle("chip-active", c.dataset.difficulty === "All"); });
        diffRow?.classList.remove("hidden");
      }
      _renderQuestions(container);
    });

    container.querySelector("#chips-language")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-language]");
      if (!btn) return;
      _state.language = btn.dataset.language;
      container.querySelectorAll("#chips-language .chip").forEach(c => c.classList.remove("chip-active"));
      btn.classList.add("chip-active");
      _renderQuestions(container);
    });

    container.querySelector("#chips-difficulty")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-difficulty]");
      if (!btn) return;
      _state.difficulty = btn.dataset.difficulty;
      container.querySelectorAll("#chips-difficulty .chip").forEach(c => c.classList.remove("chip-active"));
      btn.classList.add("chip-active");
      _renderQuestions(container);
    });

    let searchTimeout;
    container.querySelector("#home-search")?.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => { _state.search = e.target.value; _renderQuestions(container); }, 300);
    });
  }

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

  // ── HIRER HOME ─────────────────────────────────────────────────────────────
  function _renderHirerHome(container, session) {
    // Always read fresh user data from storage (not session cache)
    const users     = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user      = users.find(u => u.id === session?.userId);
    const plan      = PlansData.getById(user?.plan);

    // Get ALL jobs by this hirer (from shared jobs storage)
    const allJobs   = JobsData.getAll();
    const myJobs    = allJobs.filter(j => j.postedBy === session?.userId);
    const activeJobs = myJobs.filter(j => j.status === "active");

    const jobPostsUsed  = user?.jobPostsUsed || 0;
    const jobPostsLimit = plan?.limits?.jobPosts || 0;

    const topCandidates = CandidatesData.getTopCandidates(75);
    const allCandidates = CandidatesData.getAll();
    const trending      = allCandidates.filter(c => c.recentlyActive).slice(0, 5);

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

        <!-- Quick Filters -->
        <div class="filter-chips" id="hirer-filters" style="margin-bottom:1.5rem">
          <button class="chip chip-active" data-filter="all">All</button>
          <button class="chip" data-filter="my-jobs">My Jobs</button>
          <button class="chip" data-filter="top-score">AI Score &gt; 60%</button>
          <button class="chip" data-filter="top-candidates">⭐ Top Candidates</button>
          <button class="chip" data-filter="remote">Remote</button>
        </div>

        <!-- Stats Row -->
        <div class="stats-grid">
          ${_statCard("Active Jobs", activeJobs.length, "📋", "#06B6D4")}
          ${_statCard("Job Posts Used", `${jobPostsUsed}/${jobPostsLimit}`, "📝", jobPostsUsed >= jobPostsLimit ? "#EF4444" : "#F59E0B")}
          ${_statCard("Contacts Used", `${user?.unlockedContacts?.length || 0}/${plan?.contacts || 0}`, "🔓", "#10B981")}
          ${_statCard("Top Candidates", topCandidates.length, "⭐", "#8B5CF6")}
        </div>

        <!-- Active Jobs Section -->
        <div class="section-header" style="margin-top:1.5rem">
          <h2 class="section-title">📋 Active Jobs</h2>
          <button class="btn-link" id="see-all-jobs">See All →</button>
        </div>
        <div id="active-jobs-grid" class="hirer-jobs-grid"></div>

        <!-- AI Elite Talent -->
        <div class="section-header" style="margin-top:2rem">
          <h2 class="section-title">⭐ AI Elite Talent</h2>
          <button class="btn-link" id="see-all-candidates">View All →</button>
        </div>
        <div class="candidates-scroll" id="elite-candidates-wrap"></div>

        <!-- Trending Candidates -->
        <div class="section-header" style="margin-top:2rem">
          <h2 class="section-title">🔥 Trending Candidates</h2>
        </div>
        <div class="trending-list" id="trending-list"></div>
      </div>
    `;

    _injectHirerJobGridStyles();
    _renderActiveJobs(container, activeJobs, session, user, plan);
    _renderEliteCandidates(container, topCandidates, plan);
    _renderTrending(container, trending);
    _bindHirerEvents(container, session, user, plan);
  }

  // ── Render posted jobs as cards ──────────────────────────────────────────
  function _renderActiveJobs(container, activeJobs, session, user, plan) {
    const grid = container.querySelector("#active-jobs-grid");
    if (!grid) return;

    if (activeJobs.length === 0) {
      grid.innerHTML = `
        <div class="hirer-empty-jobs">
          <div class="hirer-empty-icon">📭</div>
          <p class="hirer-empty-text">No active jobs yet.</p>
          <button class="btn-link" id="post-first-job">Post your first job →</button>
        </div>`;
      grid.querySelector("#post-first-job")?.addEventListener("click", () => _showPostJobModal(session, user, plan));
      return;
    }

    // Show up to 6 active jobs as hirer job cards
    activeJobs.slice(0, 6).forEach(job => {
      const card = _buildHirerJobCard(job);
      grid.appendChild(card);
    });
  }

  function _buildHirerJobCard(job) {
    const fillPct  = Math.round((job.applications / job.maxApplications) * 100);
    const barColor = job.applications >= 76 ? "#EF4444" : job.applications >= 50 ? "#F59E0B" : "#10B981";
    const statusLabel = job.status === "active"
      ? (job.applications >= 76 ? "Closing Soon" : "Active")
      : "Closed";
    const statusColor = statusLabel === "Active" ? "#10B981" : statusLabel === "Closing Soon" ? "#F59E0B" : "#EF4444";

    const card = document.createElement("div");
    card.className = "hirer-job-card";
    card.innerHTML = `
      <div class="hjc-header">
        <div class="hjc-title-wrap">
          <h3 class="hjc-title">${job.title}</h3>
          <span class="hjc-company">${job.company}</span>
        </div>
        <span class="hjc-status-badge" style="color:${statusColor};border-color:${statusColor};background:${statusColor}18">
          ● ${statusLabel}
        </span>
      </div>

      <div class="hjc-meta">
        <span class="hjc-meta-item">📍 ${job.location}</span>
        <span class="hjc-meta-item">💼 ${job.type}</span>
        ${job.remote ? `<span class="hjc-meta-item hjc-remote">Remote</span>` : ""}
      </div>

      <div class="hjc-skills">
        ${job.skills.slice(0, 3).map(s => `<span class="skill-tag">${s}</span>`).join("")}
        ${job.skills.length > 3 ? `<span class="skill-tag">+${job.skills.length - 3}</span>` : ""}
      </div>

      <div class="hjc-footer">
        <div class="hjc-applicants-wrap">
          <div class="hjc-bar-track">
            <div class="hjc-bar-fill" style="width:${fillPct}%;background:${barColor}"></div>
          </div>
          <span class="hjc-applicants-label" style="color:${barColor}">
            ${job.applications}/${job.maxApplications} applicants
          </span>
        </div>
        <div class="hjc-actions">
          ${job.salary ? `<span class="job-salary">${job.salary}</span>` : ""}
        </div>
      </div>
    `;
    return card;
  }

  function _injectHirerJobGridStyles() {
    if (document.getElementById("hirer-job-grid-styles")) return;
    const style = document.createElement("style");
    style.id = "hirer-job-grid-styles";
    style.textContent = `
      .hirer-jobs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }
      .hirer-job-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.25rem;
        transition: border-color 0.2s, transform 0.2s;
      }
      .hirer-job-card:hover { border-color: var(--accent); transform: translateY(-2px); }

      .hjc-header {
        display: flex; justify-content: space-between; align-items: flex-start;
        margin-bottom: 0.75rem; gap: 0.5rem;
      }
      .hjc-title-wrap { flex: 1; min-width: 0; }
      .hjc-title {
        font-size: 1rem; font-weight: 700; color: var(--text);
        margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .hjc-company { font-size: 0.78rem; color: var(--text-muted); }
      .hjc-status-badge {
        font-size: 0.72rem; font-weight: 600;
        padding: 3px 10px; border-radius: 20px;
        border: 1px solid; white-space: nowrap; flex-shrink: 0;
      }
      .hjc-meta {
        display: flex; flex-wrap: wrap; gap: 0.5rem;
        margin-bottom: 0.75rem;
      }
      .hjc-meta-item { font-size: 0.78rem; color: var(--text-muted); }
      .hjc-remote {
        color: #10B981; background: rgba(16,185,129,0.1);
        padding: 2px 8px; border-radius: 4px;
        font-weight: 600;
      }
      .hjc-skills {
        display: flex; flex-wrap: wrap; gap: 0.4rem;
        margin-bottom: 0.85rem;
      }
      .hjc-footer {
        display: flex; align-items: center; justify-content: space-between; gap: 1rem;
      }
      .hjc-applicants-wrap { flex: 1; }
      .hjc-bar-track {
        height: 5px; background: rgba(255,255,255,0.08);
        border-radius: 99px; overflow: hidden; margin-bottom: 4px;
      }
      .hjc-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
      .hjc-applicants-label { font-size: 0.75rem; font-weight: 600; }
      .hjc-actions { display: flex; align-items: center; gap: 0.5rem; }

      .hirer-empty-jobs {
        grid-column: 1/-1;
        text-align: center; padding: 2.5rem 1rem;
        background: var(--card); border: 1px dashed var(--border);
        border-radius: var(--radius);
      }
      .hirer-empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }
      .hirer-empty-text { color: var(--text-muted); margin: 0 0 0.5rem; }
    `;
    document.head.appendChild(style);
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
      const scoreColor = c.aiScore >= 75 ? "#10B981" : "#F59E0B";
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
          ${c.highDemand     ? `<span class="activity-tag tag-demand">🔥 Hot</span>` : ""}
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

    // Quick filter chips (visual only)
    container.querySelectorAll("#hirer-filters .chip").forEach(chip => {
      chip.addEventListener("click", () => {
        container.querySelectorAll("#hirer-filters .chip").forEach(c => c.classList.remove("chip-active"));
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

  // ── Post Job Modal ─────────────────────────────────────────────────────────
  function _showPostJobModal(session, user, plan) {
    document.getElementById("post-job-modal")?.remove();

    // Re-read fresh user data
    const freshUsers = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const freshUser  = freshUsers.find(u => u.id === session?.userId);
    const usedPosts  = freshUser?.jobPostsUsed || 0;
    const planLimits = plan?.limits?.jobPosts || 0;

    if (plan && usedPosts >= planLimits) {
      PlanSelector.showUpgradeModal(() => Navigate.to("home"));
      return;
    }

    const modal = document.createElement("div");
    modal.id = "post-job-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-card post-job-modal-card">
        <button class="modal-close" id="close-post-job">✕</button>
        <h2 class="modal-title">Post a New Job</h2>
        ${plan ? `<p class="modal-sub" style="color:var(--text-muted);font-size:0.82rem;margin-bottom:1rem">
          Using <strong style="color:var(--accent)">${usedPosts}/${planLimits}</strong> job posts on ${plan.name} Plan
        </p>` : ""}
        <form class="auth-form" id="post-job-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Job Title *</label>
              <input class="form-input" id="pj-title" placeholder="e.g. Frontend Developer" required/>
            </div>
            <div class="form-group">
              <label class="form-label">Company *</label>
              <input class="form-input" id="pj-company" placeholder="Your company name"
                value="${freshUser?.company || ""}" required/>
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

      // 1. Add job to shared jobs storage — postedBy = session.userId
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

      // 2. Increment jobPostsUsed in users storage
      Storage.update(CONFIG.STORAGE_KEYS.USERS, users =>
        users.map(u =>
          u.id === session?.userId
            ? { ...u, jobPostsUsed: (u.jobPostsUsed || 0) + 1 }
            : u
        )
      );

      modal.remove();
      Toast.show(`✅ Job "${newJob.title}" posted! It's now live for job seekers.`, "success");

      // Re-render home to reflect new job immediately
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
