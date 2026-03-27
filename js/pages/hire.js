// js/pages/hire.js

const HirePage = (() => {
  let activeFilters = { role: "", skills: [], location: "", experience: "", minScore: 0 };
  let searchQuery = "";

  function render(container) {
    const session = Session.get();
    const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.id === session?.userId);
    const plan = PlansData.getById(user?.plan);
    const candidates = CandidatesData.getAll();

    container.innerHTML = `
      <div class="page-wrap hire-page">
        <div class="page-header">
          <div>
            <h1 class="page-title">Hire Talent</h1>
            <p class="page-sub">
              ${candidates.length} candidates · 
              <span style="color:#06B6D4">${plan?.aiLabel || "AI"}</span>
            </p>
          </div>
          <div class="header-actions">
            <div class="header-search">
              <input class="search-input" id="hire-search" placeholder="Search by name, skill, role..."/>
            </div>
            <button class="btn-post-job" id="hire-post-job">+ Post Job</button>
          </div>
        </div>

        <div class="hire-layout">
          <aside class="hire-filters-panel">
            <div class="filter-panel-header">
              <span>Filters</span>
              <button class="btn-link" id="clear-filters">Clear All</button>
            </div>

            <div class="filter-section">
              <label class="filter-label">Role</label>
              <input class="form-input filter-input" id="filter-role" placeholder="e.g. Frontend Developer"/>
            </div>

            <div class="filter-section">
              <label class="filter-label">Location</label>
              <input class="form-input filter-input" id="filter-location" placeholder="e.g. Pune, Remote"/>
            </div>

            <div class="filter-section">
              <label class="filter-label">Experience</label>
              <select class="form-input filter-input" id="filter-exp">
                <option value="">Any</option>
                <option value="1">1+ years</option>
                <option value="2">2+ years</option>
                <option value="3">3+ years</option>
                <option value="5">5+ years</option>
              </select>
            </div>

            <div class="filter-section">
              <label class="filter-label">Min AI Score: <span id="score-display">0</span></label>
              <input type="range" class="filter-range" id="filter-score"
                min="0" max="100" value="0" step="5"/>
            </div>

            <div class="filter-section">
              <label class="filter-label">Skills</label>
              <div class="skill-filter-chips">
                ${["JavaScript","Python","React","Node.js","ML","Figma","DevOps","Java"].map(s => `
                  <button class="chip skill-chip" data-skill="${s}">${s}</button>
                `).join("")}
              </div>
            </div>
          </aside>

          <div class="hire-main">
            <div class="hire-results-header">
              <span class="results-count" id="results-count"></span>
              <div class="sort-wrap">
                <select class="form-input sort-select" id="sort-candidates">
                  <option value="score">Sort: AI Score</option>
                  <option value="name">Sort: Name</option>
                  <option value="exp">Sort: Experience</option>
                </select>
              </div>
            </div>
            <div class="candidates-grid" id="hire-candidates-grid"></div>
            <div class="empty-state hidden" id="hire-empty">
              <div class="empty-icon">🔍</div>
              <h3>No candidates match your filters</h3>
              <button class="btn-link" id="clear-filters-empty">Clear filters</button>
            </div>
          </div>
        </div>
      </div>
    `;

    _renderCandidates(container, candidates, plan);
    _bindEvents(container, candidates, session, user, plan);
  }

  function _renderCandidates(container, candidates, plan) {
    const grid = container.querySelector("#hire-candidates-grid");
    const empty = container.querySelector("#hire-empty");
    const count = container.querySelector("#results-count");
    if (!grid) return;

    let filtered = [...candidates];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (activeFilters.role)
      filtered = filtered.filter(c => c.role.toLowerCase().includes(activeFilters.role.toLowerCase()));
    if (activeFilters.location)
      filtered = filtered.filter(c => c.location.toLowerCase().includes(activeFilters.location.toLowerCase()));
    if (activeFilters.minScore > 0)
      filtered = filtered.filter(c => c.aiScore >= activeFilters.minScore);
    if (activeFilters.skills.length > 0)
      filtered = filtered.filter(c =>
        activeFilters.skills.every(sk =>
          c.skills.some(cs => cs.toLowerCase().includes(sk.toLowerCase()))
        )
      );
    if (activeFilters.experience) {
      const minExp = parseInt(activeFilters.experience);
      filtered = filtered.filter(c => parseInt(c.experience) >= minExp);
    }

    const sort = container.querySelector("#sort-candidates")?.value || "score";
    if (sort === "score") filtered.sort((a, b) => b.aiScore - a.aiScore);
    else if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "exp") filtered.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));

    grid.innerHTML = "";
    if (count) count.textContent = `${filtered.length} candidate${filtered.length !== 1 ? "s" : ""} found`;

    if (filtered.length === 0) {
      grid.style.display = "none";
      empty?.classList.remove("hidden");
    } else {
      grid.style.display = "";
      empty?.classList.add("hidden");
      filtered.forEach((c, i) => {
        const isTop = c.aiScore >= 88;
        grid.appendChild(CandidateCard.render(c, { isTop, planId: plan?.id }));
      });
    }
  }

  function _bindEvents(container, candidates, session, user, plan) {
    let debounce;
    const rerender = () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => _renderCandidates(container, candidates, plan), 250);
    };

    container.querySelector("#hire-search")?.addEventListener("input", e => {
      searchQuery = e.target.value;
      rerender();
    });

    container.querySelector("#filter-role")?.addEventListener("input", e => {
      activeFilters.role = e.target.value;
      rerender();
    });

    container.querySelector("#filter-location")?.addEventListener("input", e => {
      activeFilters.location = e.target.value;
      rerender();
    });

    container.querySelector("#filter-exp")?.addEventListener("change", e => {
      activeFilters.experience = e.target.value;
      rerender();
    });

    const scoreRange = container.querySelector("#filter-score");
    scoreRange?.addEventListener("input", e => {
      activeFilters.minScore = parseInt(e.target.value);
      const display = container.querySelector("#score-display");
      if (display) display.textContent = e.target.value;
      rerender();
    });

    container.querySelectorAll(".skill-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const skill = chip.dataset.skill;
        chip.classList.toggle("chip-active");
        if (activeFilters.skills.includes(skill))
          activeFilters.skills = activeFilters.skills.filter(s => s !== skill);
        else
          activeFilters.skills.push(skill);
        rerender();
      });
    });

    container.querySelector("#sort-candidates")?.addEventListener("change", rerender);

    const clearAll = () => {
      activeFilters = { role: "", skills: [], location: "", experience: "", minScore: 0 };
      searchQuery = "";
      container.querySelectorAll(".filter-input").forEach(i => i.value = "");
      container.querySelectorAll(".skill-chip").forEach(c => c.classList.remove("chip-active"));
      const scoreEl = container.querySelector("#filter-score");
      const dispEl = container.querySelector("#score-display");
      if (scoreEl) scoreEl.value = 0;
      if (dispEl) dispEl.textContent = "0";
      _renderCandidates(container, candidates, plan);
    };

    container.querySelector("#clear-filters")?.addEventListener("click", clearAll);
    container.querySelector("#clear-filters-empty")?.addEventListener("click", clearAll);

    container.querySelector("#hire-post-job")?.addEventListener("click", () => {
      Navigate.to("home");
      setTimeout(() => document.querySelector("#btn-post-job-home")?.click(), 300);
    });
  }

  return { render };
})();