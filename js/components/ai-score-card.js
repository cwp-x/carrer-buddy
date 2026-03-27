// js/components/ai-score-card.js

const AIScoreCard = (() => {
  function render(scores, options = {}) {
    const { aiLabel = "AI Score", compact = false } = options;

    const card = document.createElement("div");
    card.className = `ai-score-card ${compact ? "ai-score-compact" : ""}`;

    const color = scores.color || Scoring._getColor?.(scores.overall) || "#06B6D4";

    card.innerHTML = `
      <div class="ai-score-card-header">
        <span class="ai-score-icon">🤖</span>
        <div>
          <div class="ai-score-label">${aiLabel}</div>
          <div class="ai-overall-score" style="color:${color}">${scores.overall}<span class="ai-score-unit">/100</span></div>
          <div class="ai-score-sublabel" style="color:${color}">${scores.label}</div>
        </div>
        <div class="ai-score-ring-wrap">
          <svg viewBox="0 0 36 36" width="70" height="70">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${color}" stroke-width="3"
              stroke-dasharray="${scores.overall} 100"
              stroke-dashoffset="25" stroke-linecap="round"
              class="ai-ring-fill"/>
          </svg>
          <div class="ai-ring-center" style="color:${color}">${scores.overall}</div>
        </div>
      </div>

      <div class="ai-score-bars">
        ${_bar("Code Quality", scores.codeQuality, color)}
        ${_bar("UI / UX", scores.uiUx, color)}
        ${_bar("Logic", scores.logic, color)}
      </div>
    `;

    return card;
  }

  function _bar(label, value, color) {
    return `
      <div class="ai-bar-row">
        <span class="ai-bar-label">${label}</span>
        <div class="ai-bar-track">
          <div class="ai-bar-fill" style="width:0%;background:${color}"
            data-target="${value}"></div>
        </div>
        <span class="ai-bar-value" style="color:${color}">${value}%</span>
      </div>`;
  }

  function animateBars(cardEl) {
    cardEl.querySelectorAll(".ai-bar-fill").forEach((bar) => {
      const target = bar.dataset.target;
      setTimeout(() => {
        bar.style.transition = "width 0.8s ease";
        bar.style.width = target + "%";
      }, 100);
    });
  }

  function showAnalysisModal(options = {}) {
    const { userId, questionId, planId } = options;
    const existing = document.getElementById("ai-analysis-modal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "ai-analysis-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-card analysis-modal-card">
        <div class="analysis-loading" id="analysis-loading">
          <div class="analysis-robot">🤖</div>
          <h3 class="analysis-title">AI Analyzing Your Code</h3>
          <div class="analysis-step" id="analysis-step">Initializing...</div>
          <div class="analysis-progress-track">
            <div class="analysis-progress-fill" id="analysis-progress" style="width:0%"></div>
          </div>
          <div class="analysis-progress-pct" id="analysis-pct">0%</div>
        </div>
        <div class="analysis-result" id="analysis-result" style="display:none">
          <button class="modal-close" id="close-analysis">✕</button>
          <h3 class="analysis-result-title">🎯 AI Evaluation Complete</h3>
          <div id="analysis-score-card"></div>
          <div class="analysis-insights" id="analysis-insights"></div>
          <button class="btn-analysis-continue" id="analysis-continue">Continue Practicing →</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    Analyzer.analyze({
      userId: userId || "guest",
      questionId: questionId || "q_001",
      onStep: (step) => {
        const el = document.getElementById("analysis-step");
        if (el) el.textContent = step;
      },
      onProgress: (pct) => {
        const bar = document.getElementById("analysis-progress");
        const pctEl = document.getElementById("analysis-pct");
        if (bar) bar.style.width = pct + "%";
        if (pctEl) pctEl.textContent = pct + "%";
      },
      onComplete: ({ scores, insights }) => {
        const loadingEl = document.getElementById("analysis-loading");
        const resultEl = document.getElementById("analysis-result");
        if (loadingEl) loadingEl.style.display = "none";
        if (resultEl) resultEl.style.display = "block";

        const scoreCardWrap = document.getElementById("analysis-score-card");
        if (scoreCardWrap) {
          const card = AIScoreCard.render(scores, { aiLabel: "Your Score" });
          scoreCardWrap.appendChild(card);
          setTimeout(() => animateBars(card), 200);
        }

        const insightsEl = document.getElementById("analysis-insights");
        if (insightsEl) {
          insightsEl.innerHTML = `
            <h4>AI Insights</h4>
            <ul>${insights.map(i => `<li>${i}</li>`).join("")}</ul>
          `;
        }
      },
    });

    modal.querySelector("#close-analysis")?.addEventListener("click", () => modal.remove());
    modal.querySelector("#analysis-continue")?.addEventListener("click", () => {
      modal.remove();
      Navigate.to("home");
    });
  }

  return { render, animateBars, showAnalysisModal };
})();