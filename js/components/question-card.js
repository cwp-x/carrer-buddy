// app.js — Main entry point

<<<<<<< HEAD
// ── TOAST UTILITY ────────────────────────────────────────────────────────────
const Toast = (() => {
  function _getContainer() {
    let c = document.getElementById("toast-container");
    if (!c) {
      c = document.createElement("div");
      c.id = "toast-container";
      document.body.appendChild(c);
    }
    return c;
  }

  function show(message, type = "info", duration = 3000) {
    const container = _getContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icons = { success: "✓", error: "✕", info: "ℹ" };
    toast.innerHTML = `<span>${icons[type] || "ℹ"}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("toast-exit");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return { show };
})();

// ── LAYOUT HELPER ─────────────────────────────────────────────────────────────
function _applyLayout(page) {
  const app = document.getElementById("app");
  if (!app) return;
  const noNavPages      = ["auth", "role-select", "plan-select"];
  const fullScreenPages = ["question"];
  if (noNavPages.includes(page) || fullScreenPages.includes(page)) {
    app.style.marginLeft    = "0";
    app.style.paddingBottom = "0";
  } else {
    app.style.marginLeft    = window.innerWidth > 900 ? "240px" : "0";
    app.style.paddingBottom = window.innerWidth <= 900 ? "72px" : "0";
=======
const QuestionCard = (() => {
  const DIFFICULTY_CONFIG = {
    Beginner:     { color: "#10B981", bg: "rgba(16,185,129,0.15)" },
    Intermediate: { color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
    Advanced:     { color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
  };

  // ── Small card (used in home grid) ──────────────────────────────────────────
  function render(question, options = {}) {
    const session = Session.get();
    const solved  = session ? CodeRunner.isSolved(session.userId, question.id) : false;
    const dc      = DIFFICULTY_CONFIG[question.difficulty] || DIFFICULTY_CONFIG.Beginner;

    const card = document.createElement("div");
    card.className = `question-card ${solved ? "question-solved" : ""}`;
    card.dataset.questionId = question.id;

    card.innerHTML = `
      <div class="question-card-top">
        <div class="question-thumb">${question.thumbnail}</div>
        ${solved ? `<span class="solved-check">✓</span>` : ""}
      </div>
      <div class="question-card-body">
        <h3 class="question-title">${question.title}</h3>
        <div class="question-meta">
          <span class="difficulty-badge" style="color:${dc.color};background:${dc.bg}">
            ${question.difficulty}
          </span>
          <span class="question-time">⏱ ${question.estimatedTime}</span>
        </div>
        <div class="question-tags">
          ${question.tags.slice(0, 3).map(t => `<span class="question-tag">${t}</span>`).join("")}
        </div>
      </div>
      <div class="question-card-footer">
        <span class="solve-count">👥 ${question.solveCount.toLocaleString()} solved</span>
        <button class="btn-solve" data-question-id="${question.id}">
          ${solved ? "Review →" : "Solve →"}
        </button>
      </div>
    `;

    card.querySelector(".btn-solve")?.addEventListener("click", (e) => {
      e.stopPropagation();
      Navigate.to("question", { questionId: question.id });
    });
    card.addEventListener("click", () => Navigate.to("question", { questionId: question.id }));

    return card;
  }

  // ── Full-page problem solver (Emergent-style split layout) ───────────────────
  function renderFullPage(container, params = {}) {
    const { questionId } = params;
    const question = QuestionsData.getById(questionId);
    if (!question) { Navigate.to("home"); return; }

    const session  = Session.get();
    const solved   = session ? CodeRunner.isSolved(session.userId, question.id) : false;
    const dc       = DIFFICULTY_CONFIG[question.difficulty] || DIFFICULTY_CONFIG.Beginner;
    const langs    = question.language || ["JavaScript"];
    const defaultLang = langs[0];

    // Full-screen layout — no page-wrap, directly fills viewport
    container.style.cssText = "height:100vh;overflow:hidden;display:flex;flex-direction:column;background:#0d1117;";

    container.innerHTML = `
      <!-- TOP BAR -->
      <div class="qp-topbar">
        <button class="qp-back-btn" id="qp-back">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <div class="qp-title-wrap">
          <span class="qp-difficulty-tag" style="color:${dc.color};background:${dc.bg}">
            ${question.difficulty.toUpperCase()}
          </span>
          <span class="qp-category-tag">${question.category}</span>
          <h1 class="qp-problem-title">${question.title}</h1>
        </div>
        <div class="qp-topbar-right">
          <div class="qp-nav-group">
            <button class="qp-nav-btn" id="qp-prev" title="Previous problem">← Prev</button>
            <button class="qp-nav-btn" id="qp-next" title="Next problem">Next →</button>
          </div>
          <select class="qp-lang-select" id="qp-lang">
            ${langs.map(l => `<option value="${l}">${l}</option>`).join("")}
          </select>
          <button class="qp-run-btn" id="qp-run">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Run
          </button>
          <button class="qp-submit-btn" id="qp-submit">
            Submit
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      <!-- SPLIT BODY -->
      <div class="qp-split-body">

        <!-- LEFT: Problem Details -->
        <div class="qp-left-panel" id="qp-left">
          <div class="qp-panel-tabs">
            <button class="qp-tab active" data-tab="problem">Problem</button>
            <button class="qp-tab" data-tab="examples">Examples</button>
          </div>

          <div class="qp-tab-content" id="qptab-problem">
            <div class="qp-section">
              <p class="qp-statement">${question.statement}</p>
            </div>
            <div class="qp-section">
              <div class="qp-meta-row">
                <div class="qp-meta-item">
                  <span class="qp-meta-label">Languages</span>
                  <span class="qp-meta-value">${langs.join(", ")}</span>
                </div>
                <div class="qp-meta-item">
                  <span class="qp-meta-label">Estimated Time</span>
                  <span class="qp-meta-value">${question.estimatedTime}</span>
                </div>
                <div class="qp-meta-item">
                  <span class="qp-meta-label">Solved by</span>
                  <span class="qp-meta-value">${question.solveCount.toLocaleString()} users</span>
                </div>
              </div>
            </div>
            <div class="qp-section">
              <h4 class="qp-section-title">Constraints</h4>
              <ul class="qp-constraints">
                ${question.constraints.map(c => `<li>${c}</li>`).join("")}
              </ul>
            </div>
            <div class="qp-section">
              <div class="qp-tags-wrap">
                ${question.tags.map(t => `<span class="qp-skill-tag">${t}</span>`).join("")}
              </div>
            </div>
            ${solved ? `<div class="qp-solved-banner">✓ You have already solved this problem!</div>` : ""}
          </div>

          <div class="qp-tab-content hidden" id="qptab-examples">
            ${question.examples.map((ex, i) => `
              <div class="qp-example-block">
                <div class="qp-example-label">Example ${i + 1}</div>
                <div class="qp-example-row">
                  <strong>Input:</strong>
                  <code class="qp-code-inline">${ex.input}</code>
                </div>
                <div class="qp-example-row">
                  <strong>Output:</strong>
                  <code class="qp-code-inline">${ex.output}</code>
                </div>
                ${ex.explanation
                  ? `<div class="qp-example-row"><strong>Explanation:</strong> ${ex.explanation}</div>`
                  : ""}
              </div>
            `).join("")}
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="qp-divider"></div>

        <!-- RIGHT: Code Editor -->
        <div class="qp-right-panel">
          <div class="qp-editor-header">
            <span class="qp-editor-label">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
              Code Editor
            </span>
            <button class="qp-clear-btn" id="qp-clear">Reset</button>
          </div>

          <textarea
            class="qp-code-editor"
            id="qp-editor"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            placeholder="// Write your solution here..."
          >${_getStarterCode(question, defaultLang)}</textarea>

          <!-- Output Panel (hidden until run) -->
          <div class="qp-output-panel" id="qp-output-panel" style="display:none">
            <div class="qp-output-header">
              <span id="qp-output-status">Output</span>
              <button class="qp-close-output" id="qp-close-output">✕</button>
            </div>
            <pre class="qp-output-content" id="qp-output-content"></pre>
          </div>

          <!-- AI Hint floating button -->
          <button class="qp-ai-float-btn" id="qp-ai-hint" title="AI Assistant">
            🤖
            <span class="qp-ai-label">AI</span>
          </button>
        </div>
      </div>
    `;

    _injectQuestionStyles();
    _bindFullPageEvents(container, question, session);
  }

  function _getStarterCode(question, lang) {
    return (question.starterCode && question.starterCode[lang])
      ? question.starterCode[lang]
      : `// Write your ${lang} solution here\n`;
  }

  function _bindFullPageEvents(container, question, session) {
    let currentLang = question.language[0];

    // Back
    container.querySelector("#qp-back")?.addEventListener("click", () => {
      container.style.cssText = "";
      Navigate.to("home");
    });

    // Prev / Next
    container.querySelector("#qp-prev")?.addEventListener("click", () => {
      const prev = QuestionsData.getPrev(question.id);
      if (prev) Navigate.to("question", { questionId: prev.id });
      else Toast.show("This is the first problem!", "info");
    });
    container.querySelector("#qp-next")?.addEventListener("click", () => {
      const next = QuestionsData.getNext(question.id);
      if (next) Navigate.to("question", { questionId: next.id });
      else Toast.show("You've reached the last problem!", "info");
    });

    // Language change
    container.querySelector("#qp-lang")?.addEventListener("change", (e) => {
      currentLang = e.target.value;
      const editor = container.querySelector("#qp-editor");
      if (editor) editor.value = _getStarterCode(question, currentLang);
      // Hide output when switching language
      container.querySelector("#qp-output-panel").style.display = "none";
    });

    // Tabs
    container.querySelectorAll(".qp-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        container.querySelectorAll(".qp-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        container.querySelectorAll(".qp-tab-content").forEach(c => c.classList.add("hidden"));
        container.querySelector(`#qptab-${tab.dataset.tab}`)?.classList.remove("hidden");
      });
    });

    // Reset / Clear
    container.querySelector("#qp-clear")?.addEventListener("click", () => {
      const editor = container.querySelector("#qp-editor");
      if (editor) editor.value = _getStarterCode(question, currentLang);
      container.querySelector("#qp-output-panel").style.display = "none";
    });

    // Close output
    container.querySelector("#qp-close-output")?.addEventListener("click", () => {
      container.querySelector("#qp-output-panel").style.display = "none";
    });

    // RUN CODE
    container.querySelector("#qp-run")?.addEventListener("click", () => {
      const code   = container.querySelector("#qp-editor")?.value || "";
      const runBtn = container.querySelector("#qp-run");

      runBtn.disabled   = true;
      runBtn.textContent = "Running...";

      setTimeout(() => {
        const result      = CodeRunner.run(code, currentLang, question);
        const outputPanel = container.querySelector("#qp-output-panel");
        const outputContent = container.querySelector("#qp-output-content");
        const outputStatus  = container.querySelector("#qp-output-status");

        outputPanel.style.display = "flex";

        if (result.error) {
          outputStatus.textContent = "❌ Error";
          outputStatus.style.color = "#EF4444";
          outputContent.style.color = "#EF4444";
          outputContent.textContent = result.error;
        } else {
          outputStatus.textContent = "✅ Output";
          outputStatus.style.color = "#10B981";
          outputContent.style.color = "#10B981";
          outputContent.textContent = result.output;
        }

        runBtn.disabled   = false;
        runBtn.innerHTML  = `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run`;
      }, 600);
    });

    // SUBMIT
    container.querySelector("#qp-submit")?.addEventListener("click", () => {
      const code      = container.querySelector("#qp-editor")?.value || "";
      const submitBtn = container.querySelector("#qp-submit");

      if (!session) { Navigate.to("auth"); return; }
      if (!code || code.trim().length < 10) {
        Toast.show("Please write some code before submitting!", "error");
        return;
      }

      submitBtn.disabled   = true;
      submitBtn.textContent = "Submitting...";

      setTimeout(() => {
        const result = CodeRunner.submit(code, currentLang, session.userId, question.id);
        if (result.success) {
          Toast.show("✅ Solution submitted! Analyzing with AI...", "success");
          submitBtn.disabled   = false;
          submitBtn.innerHTML  = `Submit <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
          setTimeout(() => {
            AIScoreCard.showAnalysisModal({ userId: session.userId, questionId: question.id });
          }, 500);
        } else {
          Toast.show(result.error || "Submission failed.", "error");
          submitBtn.disabled   = false;
          submitBtn.innerHTML  = `Submit <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
        }
      }, 800);
    });

    // AI Hint
    container.querySelector("#qp-ai-hint")?.addEventListener("click", () => {
      _showAIHintModal(question);
    });

    // Tab key in editor — insert spaces
    container.querySelector("#qp-editor")?.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta  = e.target;
        const start = ta.selectionStart;
        const end   = ta.selectionEnd;
        ta.value = ta.value.substring(0, start) + "  " + ta.value.substring(end);
        ta.selectionStart = ta.selectionEnd = start + 2;
      }
    });
>>>>>>> 99f8d9b (updated changes)
  }
}

<<<<<<< HEAD
// ── APP INIT ──────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // 1. Apply saved theme
  const theme = Storage.get(CONFIG.THEME.STORAGE_KEY, "dark");
  document.documentElement.setAttribute("data-theme", theme);
  AppState.set("theme", theme);

  // 2. Seed mock data
  UsersData.seedIfEmpty();
  JobsData.seedIfEmpty();
  PostsData.seedIfEmpty();

  // 3. Restore session
  const session = Session.get();
  if (session) AppState.set("currentUser", session);

  // 4. Apply layout whenever page changes
  AppState.subscribe("currentPage", (page) => {
    _applyLayout(page);
  });

  // 5. Re-apply layout on resize
  window.addEventListener("resize", () => {
    const page = AppState.get("currentPage");
    _applyLayout(page);
  });

  // 6. Route to correct starting page
  if (!session) {
    Navigate.to("auth");
  } else if (!Session.hasRole()) {
    Navigate.to("role-select");
  } else if (session.role === CONFIG.ROLES.HIRER && !Session.hasPlan()) {
    Navigate.to("plan-select");
  } else {
    Navigate.to("home");
  }
});
=======
  function _showAIHintModal(question) {
    document.getElementById("ai-hint-modal")?.remove();

    const hintsByTag = {
      "Array":     "Think about iterating through the array and using a helper data structure to track what you've seen.",
      "Hash Map":  "A hash map gives O(1) lookup — can you store something as you iterate to avoid a nested loop?",
      "Stack":     "Stacks are LIFO — push when you open something, pop when you close it.",
      "Binary Search": "Binary search only works on sorted data. What are your left and right bounds?",
      "Dynamic Programming": "Break it into subproblems. What's the recurrence relation?",
      "Linked List": "Keep track of previous and current nodes as you traverse.",
      "Backtracking": "Try a path, and if it doesn't work — undo and try another (recursion + state reset).",
    };

    const tag    = question.tags[0] || "Array";
    const hint   = hintsByTag[tag] || `Think about using ${tag} concepts to simplify the problem.`;

    const modal = document.createElement("div");
    modal.id = "ai-hint-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-card hint-modal-card">
        <button class="modal-close" id="close-hint">✕</button>
        <div class="hint-modal-header">
          <span class="hint-robot">🤖</span>
          <div>
            <h3>AI Assistant</h3>
            <p style="color:var(--text-muted);font-size:0.8rem">${question.title}</p>
          </div>
        </div>
        <div class="hint-options">
          <button class="hint-btn" data-hint="hint">💡 Hint</button>
          <button class="hint-btn" data-hint="explain">📖 Explain</button>
          <button class="hint-btn" data-hint="check">✅ Check Approach</button>
        </div>
        <div class="hint-output" id="hint-output" style="display:none">
          <div class="hint-thinking" id="hint-thinking">
            <span class="hint-dot"></span><span class="hint-dot"></span><span class="hint-dot"></span>
            AI thinking...
          </div>
          <div class="hint-result" id="hint-result" style="display:none"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector("#close-hint")?.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

    modal.querySelectorAll(".hint-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        modal.querySelectorAll(".hint-btn").forEach(b => b.classList.remove("hint-btn-active"));
        btn.classList.add("hint-btn-active");

        const output   = modal.querySelector("#hint-output");
        const thinking = modal.querySelector("#hint-thinking");
        const result   = modal.querySelector("#hint-result");

        output.style.display  = "block";
        thinking.style.display = "flex";
        result.style.display   = "none";

        setTimeout(() => {
          const type = btn.dataset.hint;
          let text = "";
          if (type === "hint") {
            text = `💡 ${hint}`;
          } else if (type === "explain") {
            text = `📖 Problem Breakdown:\n\n${question.statement}\n\nKey Concepts: ${question.tags.join(", ")}\n\nEstimated Time: ${question.estimatedTime}`;
          } else {
            text = `✅ Good starting points:\n\n• ${question.constraints[0]}\n• Think about edge cases: empty input, single element, duplicates\n• Aim for O(n) or O(n log n) time complexity`;
          }

          thinking.style.display = "none";
          result.style.display   = "block";
          result.textContent     = text;
        }, 1200);
      });
    });
  }

  // ── Inject styles (only once) ─────────────────────────────────────────────
  function _injectQuestionStyles() {
    if (document.getElementById("qp-styles")) return;
    const style = document.createElement("style");
    style.id = "qp-styles";
    style.textContent = `
      /* ── QUESTION PAGE FULL-SCREEN LAYOUT ── */
      .qp-topbar {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0 1.25rem;
        height: 52px;
        min-height: 52px;
        background: #161b22;
        border-bottom: 1px solid #30363d;
        flex-shrink: 0;
        overflow: hidden;
      }
      .qp-back-btn {
        display: flex; align-items: center; gap: 6px;
        background: transparent;
        border: 1px solid #30363d;
        color: #8b949e;
        padding: 5px 12px;
        border-radius: 6px;
        font-size: 0.82rem;
        cursor: pointer;
        flex-shrink: 0;
        transition: border-color 0.2s, color 0.2s;
      }
      .qp-back-btn:hover { border-color: #58a6ff; color: #58a6ff; }

      .qp-title-wrap {
        display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;
      }
      .qp-difficulty-tag {
        padding: 2px 8px; border-radius: 4px;
        font-size: 0.68rem; font-weight: 700;
        letter-spacing: 0.06em; flex-shrink: 0;
      }
      .qp-category-tag {
        color: #58a6ff; font-size: 0.75rem; font-weight: 500;
        flex-shrink: 0;
      }
      .qp-problem-title {
        font-size: 0.95rem; font-weight: 600;
        color: #e6edf3; white-space: nowrap;
        overflow: hidden; text-overflow: ellipsis;
        margin: 0;
      }

      .qp-topbar-right {
        display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;
      }
      .qp-nav-group { display: flex; gap: 4px; }
      .qp-nav-btn {
        background: transparent; border: 1px solid #30363d;
        color: #8b949e; padding: 5px 10px;
        border-radius: 6px; font-size: 0.78rem;
        cursor: pointer; transition: all 0.2s;
      }
      .qp-nav-btn:hover { border-color: #58a6ff; color: #58a6ff; }

      .qp-lang-select {
        background: #21262d; border: 1px solid #30363d;
        color: #e6edf3; padding: 5px 10px;
        border-radius: 6px; font-size: 0.82rem;
        cursor: pointer;
      }
      .qp-run-btn {
        display: flex; align-items: center; gap: 6px;
        background: #1f6feb; color: #fff;
        border: none; padding: 6px 16px;
        border-radius: 6px; font-size: 0.82rem;
        font-weight: 600; cursor: pointer;
        transition: background 0.2s;
      }
      .qp-run-btn:hover:not(:disabled) { background: #388bfd; }
      .qp-run-btn:disabled { opacity: 0.6; cursor: not-allowed; }

      .qp-submit-btn {
        display: flex; align-items: center; gap: 6px;
        background: transparent; color: #3fb950;
        border: 1px solid #3fb950; padding: 5px 14px;
        border-radius: 6px; font-size: 0.82rem;
        font-weight: 600; cursor: pointer;
        transition: all 0.2s;
      }
      .qp-submit-btn:hover:not(:disabled) { background: #3fb950; color: #0d1117; }
      .qp-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

      /* ── SPLIT BODY ── */
      .qp-split-body {
        display: flex;
        flex: 1;
        min-height: 0;
        overflow: hidden;
      }

      /* ── LEFT PANEL ── */
      .qp-left-panel {
        width: 48%;
        min-width: 320px;
        display: flex;
        flex-direction: column;
        background: #0d1117;
        overflow: hidden;
      }
      .qp-panel-tabs {
        display: flex;
        border-bottom: 1px solid #30363d;
        background: #161b22;
        flex-shrink: 0;
      }
      .qp-tab {
        padding: 10px 20px;
        font-size: 0.83rem;
        font-weight: 500;
        color: #8b949e;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s;
        background: transparent;
        border-top: none; border-left: none; border-right: none;
      }
      .qp-tab.active { color: #58a6ff; border-bottom-color: #58a6ff; }
      .qp-tab:hover:not(.active) { color: #e6edf3; }

      .qp-tab-content {
        flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem;
      }
      .qp-tab-content.hidden { display: none; }

      .qp-section { margin-bottom: 1.5rem; }
      .qp-section-title {
        font-size: 0.82rem; font-weight: 600;
        color: #8b949e; text-transform: uppercase;
        letter-spacing: 0.06em; margin-bottom: 0.6rem;
      }
      .qp-statement {
        color: #c9d1d9; font-size: 0.9rem; line-height: 1.7;
        margin: 0;
      }
      .qp-meta-row {
        display: flex; flex-direction: column; gap: 0.5rem;
      }
      .qp-meta-item {
        display: flex; align-items: center; gap: 0.75rem;
      }
      .qp-meta-label {
        font-size: 0.78rem; color: #8b949e;
        font-weight: 600; min-width: 110px;
      }
      .qp-meta-value { font-size: 0.82rem; color: #c9d1d9; }
      .qp-constraints {
        list-style: none; padding: 0; margin: 0;
        display: flex; flex-direction: column; gap: 0.4rem;
      }
      .qp-constraints li {
        font-size: 0.82rem; color: #c9d1d9;
        padding: 4px 10px;
        background: #161b22;
        border-left: 2px solid #30363d;
        border-radius: 0 4px 4px 0;
      }
      .qp-tags-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .qp-skill-tag {
        padding: 3px 10px; border-radius: 20px;
        background: rgba(88,166,255,0.1);
        color: #58a6ff; font-size: 0.75rem;
        border: 1px solid rgba(88,166,255,0.2);
      }
      .qp-solved-banner {
        background: rgba(63,185,80,0.1);
        border: 1px solid rgba(63,185,80,0.3);
        color: #3fb950;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-top: 1rem;
      }
      .qp-example-block {
        background: #161b22;
        border: 1px solid #30363d;
        border-radius: 8px;
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
      }
      .qp-example-label {
        font-size: 0.75rem; font-weight: 700;
        color: #8b949e; text-transform: uppercase;
        letter-spacing: 0.06em; margin-bottom: 0.75rem;
      }
      .qp-example-row {
        font-size: 0.83rem; color: #c9d1d9;
        margin-bottom: 0.5rem;
        display: flex; align-items: flex-start; gap: 0.5rem;
        flex-wrap: wrap;
      }
      .qp-code-inline {
        background: #0d1117; padding: 2px 8px;
        border-radius: 4px; font-family: monospace;
        font-size: 0.82rem; color: #f0883e;
        border: 1px solid #30363d;
      }

      /* ── DIVIDER ── */
      .qp-divider {
        width: 4px;
        background: #21262d;
        cursor: col-resize;
        flex-shrink: 0;
        transition: background 0.2s;
      }
      .qp-divider:hover { background: #58a6ff; }

      /* ── RIGHT PANEL ── */
      .qp-right-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #0d1117;
        position: relative;
        overflow: hidden;
      }
      .qp-editor-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 16px;
        background: #161b22;
        border-bottom: 1px solid #30363d;
        flex-shrink: 0;
      }
      .qp-editor-label {
        display: flex; align-items: center; gap: 6px;
        font-size: 0.78rem; color: #8b949e; font-weight: 600;
      }
      .qp-clear-btn {
        background: transparent; border: 1px solid #30363d;
        color: #8b949e; padding: 3px 10px;
        border-radius: 5px; font-size: 0.75rem;
        cursor: pointer; transition: all 0.2s;
      }
      .qp-clear-btn:hover { border-color: #f85149; color: #f85149; }

      .qp-code-editor {
        flex: 1;
        width: 100%;
        background: #0d1117;
        color: #e6edf3;
        border: none;
        outline: none;
        resize: none;
        padding: 1.25rem 1.5rem;
        font-family: "Fira Code", "Cascadia Code", "JetBrains Mono", "Courier New", monospace;
        font-size: 0.88rem;
        line-height: 1.65;
        tab-size: 2;
        caret-color: #58a6ff;
        min-height: 0;
      }
      .qp-code-editor::placeholder { color: #484f58; }
      .qp-code-editor:focus { background: #0d1117; }

      /* ── OUTPUT PANEL ── */
      .qp-output-panel {
        display: flex;
        flex-direction: column;
        border-top: 1px solid #30363d;
        background: #161b22;
        max-height: 200px;
        min-height: 80px;
        flex-shrink: 0;
      }
      .qp-output-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 16px;
        border-bottom: 1px solid #30363d;
        flex-shrink: 0;
      }
      #qp-output-status {
        font-size: 0.8rem; font-weight: 600;
      }
      .qp-close-output {
        background: transparent; border: none;
        color: #8b949e; cursor: pointer; font-size: 0.85rem;
        padding: 2px 6px; border-radius: 4px;
      }
      .qp-close-output:hover { color: #f85149; }
      .qp-output-content {
        flex: 1; overflow-y: auto;
        padding: 0.75rem 1rem;
        font-family: monospace;
        font-size: 0.83rem;
        line-height: 1.55;
        margin: 0; white-space: pre-wrap;
      }

      /* ── AI FLOAT BTN ── */
      .qp-ai-float-btn {
        position: absolute;
        bottom: 1rem; right: 1rem;
        width: 52px; height: 52px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1f6feb, #6e40c9);
        border: none; color: white;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 1px;
        box-shadow: 0 4px 20px rgba(31,111,235,0.4);
        transition: transform 0.2s, box-shadow 0.2s;
        z-index: 10;
      }
      .qp-ai-float-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 28px rgba(31,111,235,0.6);
      }
      .qp-ai-label { font-size: 0.58rem; font-weight: 700; }

      /* ── AI HINT MODAL ── */
      .hint-modal-card { max-width: 480px; }
      .hint-modal-header {
        display: flex; align-items: center; gap: 1rem;
        margin-bottom: 1.25rem;
      }
      .hint-robot { font-size: 2rem; }
      .hint-modal-header h3 { margin: 0; font-size: 1rem; }
      .hint-options { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
      .hint-btn {
        flex: 1; padding: 8px 12px;
        background: var(--card); border: 1px solid var(--border);
        color: var(--text); border-radius: 8px;
        font-size: 0.82rem; cursor: pointer;
        transition: all 0.2s;
      }
      .hint-btn:hover, .hint-btn.hint-btn-active {
        border-color: #58a6ff; color: #58a6ff; background: rgba(88,166,255,0.08);
      }
      .hint-output {
        background: rgba(88,166,255,0.05);
        border: 1px solid rgba(88,166,255,0.2);
        border-radius: 8px;
        padding: 1rem;
        min-height: 60px;
      }
      .hint-thinking {
        display: flex; align-items: center; gap: 6px;
        color: var(--text-muted); font-size: 0.82rem;
      }
      .hint-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: #58a6ff;
        animation: hintDotBounce 1s infinite;
      }
      .hint-dot:nth-child(2) { animation-delay: 0.15s; }
      .hint-dot:nth-child(3) { animation-delay: 0.3s; }
      @keyframes hintDotBounce {
        0%,100% { transform: translateY(0); opacity:0.4; }
        50% { transform: translateY(-4px); opacity:1; }
      }
      .hint-result {
        color: var(--text); font-size: 0.86rem;
        line-height: 1.65; white-space: pre-wrap;
      }

      /* ── RESPONSIVE ── */
      @media (max-width: 768px) {
        .qp-split-body { flex-direction: column; }
        .qp-left-panel { width: 100%; min-width: 0; max-height: 40vh; border-bottom: 1px solid #30363d; }
        .qp-divider { display: none; }
        .qp-problem-title { font-size: 0.82rem; }
        .qp-topbar { padding: 0 0.75rem; gap: 0.5rem; }
      }
    `;
    document.head.appendChild(style);
  }

  return { render, renderFullPage };
})();
>>>>>>> 99f8d9b (updated changes)
