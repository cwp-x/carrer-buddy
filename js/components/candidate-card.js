// js/components/candidate-card.js

const CandidateCard = (() => {
  function render(candidate, options = {}) {
    const { isTop = false, planId = "basic" } = options;
    const unlocked = CandidatesData.isUnlocked(candidate.id);
    const scoreColor = candidate.aiScore >= 88 ? "#10B981"
      : candidate.aiScore >= 75 ? "#06B6D4" : "#F59E0B";

    const card = document.createElement("div");
    card.className = `candidate-card ${isTop ? "candidate-card-top" : ""}`;
    card.dataset.candidateId = candidate.id;

    card.innerHTML = `
      ${isTop ? `<div class="candidate-top-badge">⭐ Top Candidate</div>` : ""}

      <div class="candidate-card-header">
        <div class="candidate-avatar-wrap">
          <div class="candidate-avatar">${candidate.name.charAt(0)}</div>
          ${candidate.verified
            ? `<span class="verified-badge" title="Verified">
                <svg width="12" height="12" fill="#06B6D4" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
               </span>`
            : ""}
        </div>
        <div class="candidate-info">
          <h3 class="candidate-name">${candidate.name}</h3>
          <span class="candidate-role">${candidate.role}</span>
          <div class="candidate-meta-row">
            <span class="candidate-location">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              ${candidate.location}
            </span>
            <span class="candidate-exp">${candidate.experience}</span>
          </div>
        </div>
        <div class="candidate-score-ring" style="--score-color:${scoreColor}">
          <svg viewBox="0 0 36 36" width="56" height="56">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${scoreColor}" stroke-width="3"
              stroke-dasharray="${candidate.aiScore}, 100"
              stroke-dashoffset="25" stroke-linecap="round"/>
          </svg>
          <div class="score-ring-label">
            <span class="score-ring-value">${candidate.aiScore}</span>
            <span class="score-ring-unit">AI</span>
          </div>
        </div>
      </div>

      <div class="candidate-tags-row">
        ${candidate.recentlyActive
          ? `<span class="activity-tag tag-active">● Recently Active</span>` : ""}
        ${candidate.highDemand
          ? `<span class="activity-tag tag-demand">🔥 High Demand</span>` : ""}
      </div>

      <div class="candidate-project-preview">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
        <span>${candidate.projectPreview}</span>
      </div>

      <div class="candidate-skills">
        ${candidate.skills.slice(0, 4).map(s =>
          `<span class="skill-tag">${s}</span>`
        ).join("")}
        ${candidate.skills.length > 4
          ? `<span class="skill-tag skill-tag-more">+${candidate.skills.length - 4}</span>`
          : ""}
      </div>

      <div class="candidate-card-footer">
        <div class="candidate-score-bars">
          ${_miniBar("Code", candidate.codeQuality, scoreColor)}
          ${_miniBar("Logic", candidate.logic, scoreColor)}
          ${_miniBar("UI/UX", candidate.uiUx, scoreColor)}
        </div>
        <div class="candidate-actions">
          <button class="btn-shortlist" data-id="${candidate.id}" title="Shortlist">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <button class="btn-unlock-contact ${unlocked ? "btn-unlocked" : ""}"
            data-id="${candidate.id}">
            ${unlocked
              ? `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                   <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                 </svg> Unlocked`
              : `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                   <rect x="3" y="11" width="18" height="11" rx="2"/>
                   <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                 </svg> Unlock Contact`}
          </button>
          <button class="btn-view-profile" data-id="${candidate.id}">View Profile</button>
        </div>
      </div>
    `;

    _bindEvents(card, candidate);
    return card;
  }

  function _miniBar(label, value, color) {
    return `
      <div class="mini-bar-wrap">
        <span class="mini-bar-label">${label}</span>
        <div class="mini-bar-track">
          <div class="mini-bar-fill" style="width:${value}%;background:${color}"></div>
        </div>
        <span class="mini-bar-value">${value}</span>
      </div>`;
  }

  function _bindEvents(card, candidate) {
    card.querySelector(".btn-shortlist")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      btn.classList.toggle("btn-shortlisted");
      Toast.show(
        btn.classList.contains("btn-shortlisted")
          ? `${candidate.name} shortlisted!`
          : `${candidate.name} removed from shortlist`,
        "success"
      );
    });

    card.querySelector(".btn-unlock-contact")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (CandidatesData.isUnlocked(candidate.id)) {
        Toast.show(`Contact already unlocked for ${candidate.name}`, "info");
        return;
      }
      const result = CandidatesData.unlock(candidate.id);
      if (result.success) {
        const btn = e.currentTarget;
        btn.classList.add("btn-unlocked");
        btn.innerHTML = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg> Unlocked`;
        Toast.show(`Contact unlocked: ${candidate.email}`, "success");
      } else {
        Toast.show(result.error, "error");
      }
    });

    card.querySelector(".btn-view-profile")?.addEventListener("click", (e) => {
      e.stopPropagation();
      _showCandidateModal(candidate);
    });

    card.addEventListener("click", () => _showCandidateModal(candidate));
  }

  function _showCandidateModal(candidate) {
    const existing = document.getElementById("candidate-modal");
    if (existing) existing.remove();

    const unlocked = CandidatesData.isUnlocked(candidate.id);
    const scoreColor = candidate.aiScore >= 88 ? "#10B981"
      : candidate.aiScore >= 75 ? "#06B6D4" : "#F59E0B";

    const modal = document.createElement("div");
    modal.id = "candidate-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-card candidate-modal-card">
        <button class="modal-close" id="close-candidate-modal">✕</button>

        <div class="cmodal-header">
          <div class="cmodal-avatar">${candidate.name.charAt(0)}</div>
          <div class="cmodal-info">
            <h2>${candidate.name}
              ${candidate.verified
                ? `<svg width="16" height="16" fill="#06B6D4" viewBox="0 0 24 24" style="margin-left:6px;vertical-align:middle">
                     <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                   </svg>`
                : ""}
            </h2>
            <p>${candidate.role} · ${candidate.location} · ${candidate.experience}</p>
            <p class="cmodal-summary">${candidate.summary}</p>
          </div>
          <div class="cmodal-score" style="color:${scoreColor}">
            <span class="cmodal-score-value">${candidate.aiScore}</span>
            <span class="cmodal-score-label">AI Score</span>
          </div>
        </div>

        <div class="cmodal-scores">
          ${_scoreBar("Code Quality", candidate.codeQuality, scoreColor)}
          ${_scoreBar("UI / UX", candidate.uiUx, scoreColor)}
          ${_scoreBar("Logic", candidate.logic, scoreColor)}
        </div>

        <div class="cmodal-project">
          <h4>Project Preview</h4>
          <div class="cmodal-project-box">${candidate.projectPreview}</div>
        </div>

        <div class="cmodal-skills">
          <h4>Skills</h4>
          <div class="skills-wrap">
            ${candidate.skills.map(s => `<span class="skill-tag">${s}</span>`).join("")}
          </div>
        </div>

        ${unlocked ? `
          <div class="cmodal-contact">
            <h4>Contact Details</h4>
            <div class="contact-details-grid">
              <div class="contact-detail-item">📧 ${candidate.email}</div>
              <div class="contact-detail-item">📞 ${candidate.phone}</div>
              ${candidate.github ? `<div class="contact-detail-item">💻 ${candidate.github}</div>` : ""}
              ${candidate.portfolio ? `<div class="contact-detail-item">🌐 ${candidate.portfolio}</div>` : ""}
            </div>
          </div>
        ` : ""}

        <div class="cmodal-actions">
          <button class="btn-modal-shortlist">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            Shortlist
          </button>
          ${!unlocked ? `
            <button class="btn-modal-unlock" data-id="${candidate.id}">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
              </svg>
              Unlock Contact
            </button>
          ` : ""}
          <button class="btn-modal-interview btn-static">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Schedule Interview
          </button>
          <button class="btn-modal-share btn-static">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share with Team
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#close-candidate-modal")?.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector(".btn-modal-shortlist")?.addEventListener("click", () => {
      Toast.show(`${candidate.name} shortlisted! ✓`, "success");
    });

    modal.querySelector(".btn-modal-unlock")?.addEventListener("click", () => {
      const result = CandidatesData.unlock(candidate.id);
      if (result.success) {
        modal.remove();
        _showCandidateModal(candidate);
        Toast.show("Contact unlocked successfully!", "success");
      } else {
        Toast.show(result.error, "error");
      }
    });
  }

  function _scoreBar(label, value, color) {
    return `
      <div class="score-bar-row">
        <span class="score-bar-label">${label}</span>
        <div class="score-bar-track">
          <div class="score-bar-fill" style="width:${value}%;background:${color}"></div>
        </div>
        <span class="score-bar-value" style="color:${color}">${value}%</span>
      </div>`;
  }

  return { render };
})();