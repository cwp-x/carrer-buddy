// js/pages/jobs-page.js

const JobsPage = (() => {
  let currentFilter = "all";
  let searchQuery   = "";

  function render(container) {
    const session = Session.get();
    const jobs    = JobsData.getAll();

    container.innerHTML = `
      <div class="page-wrap">
        <div class="page-header">
          <div>
            <h1 class="page-title">Browse Jobs</h1>
            <p class="page-sub" id="jobs-count">${jobs.length} opportunities available</p>
          </div>
          <div class="header-search">
            <input class="search-input" id="jobs-search" placeholder="Search role, company, skill..."/>
          </div>
        </div>

        <div class="filter-chips" id="jobs-filters">
          <button class="chip chip-active" data-filter="all">All Jobs</button>
          <button class="chip" data-filter="open">Open</button>
          <button class="chip" data-filter="remote">Remote</button>
          <button class="chip" data-filter="applied">Applied</button>
          <button class="chip" data-filter="closing">Filling Fast</button>
        </div>

        <div class="jobs-grid" id="jobs-grid"></div>
        <div class="empty-state hidden" id="jobs-empty">
          <div class="empty-icon">💼</div>
          <h3>No jobs found</h3>
          <p>Try a different filter or search term</p>
        </div>
      </div>
    `;

    currentFilter = "all";
    searchQuery   = "";
    _renderJobs(container, session);
    _bindEvents(container, session);
  }

  function _renderJobs(container, session) {
    // Always read fresh from localStorage so hirer-posted jobs appear immediately
    const allJobs = JobsData.getAll();
    const grid    = container.querySelector("#jobs-grid");
    const empty   = container.querySelector("#jobs-empty");
    const counter = container.querySelector("#jobs-count");
    if (!grid) return;

    const users  = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user   = users.find(u => u.id === session?.userId);
    const applied = user?.appliedJobs || [];

    let filtered = [...allJobs];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(q)   ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)||
        j.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Filter tabs
    switch (currentFilter) {
      case "open":
        filtered = filtered.filter(j => j.applications < CONFIG.JOBS.MAX_APPLICATIONS);
        break;
      case "remote":
        filtered = filtered.filter(j => j.remote);
        break;
      case "applied":
        filtered = filtered.filter(j => applied.includes(j.id));
        break;
      case "closing":
        filtered = filtered.filter(j =>
          j.applications >= 50 && j.applications < CONFIG.JOBS.MAX_APPLICATIONS
        );
        break;
    }

    // Update count
    if (counter) counter.textContent = `${filtered.length} opportunit${filtered.length === 1 ? "y" : "ies"} available`;

    grid.innerHTML = "";
    if (filtered.length === 0) {
      grid.style.display = "none";
      empty?.classList.remove("hidden");
    } else {
      grid.style.display = "";
      empty?.classList.add("hidden");
      filtered.forEach(job => grid.appendChild(JobCard.render(job, { showApply: true })));
    }
  }

  function _bindEvents(container, session) {
    container.querySelectorAll("#jobs-filters .chip").forEach(chip => {
      chip.addEventListener("click", () => {
        container.querySelectorAll("#jobs-filters .chip").forEach(c => c.classList.remove("chip-active"));
        chip.classList.add("chip-active");
        currentFilter = chip.dataset.filter;
        _renderJobs(container, session);
      });
    });

    let searchTimeout;
    container.querySelector("#jobs-search")?.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = e.target.value;
        _renderJobs(container, session);
      }, 300);
    });
  }

  return { render };
})();
