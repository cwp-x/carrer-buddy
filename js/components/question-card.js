// js/components/question-card.js

const QuestionCard = (() => {
  const DIFFICULTY_CONFIG = {
    Beginner:     { color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    Intermediate: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    Advanced:     { color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  };

  function render(question, options = {}) {
    const session = Session.get();
    const solved = session
      ? CodeRunner.isSolved(session.userId, question.id)
      : false;
    const dc = DIFFICULTY_CONFIG[question.difficulty] || DIFFICULTY_CONFIG.Beginner;

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
          <span class="difficulty-badge"
            style="color:${dc.color};background:${dc.bg}">
            ${question.difficulty}
          </span>
          <span class="question-time">⏱ ${question.estimatedTime}</span>
        </div>
        <div class="question-tags">
          ${question.tags.slice(0, 3).map(t =>
            `<span class="question-tag">${t}</span>`
          ).join("")}
        </div>
      </div>
      <div class="question-card-footer">
        <span class="solve-count">👥 ${question.solveCount.toLocaleString()} solved</span>
        <button class="btn-solve" data-question-id="${question.id}">
          ${solved ? "Review" : "Solve →"}
        </button>
      </div>
    `;

    card.querySelector(".btn-solve")?.addEventListener("click", (e) => {
      e.stopPropagation();
      Navigate.to("question", { questionId: question.id });
    });

    card.addEventListener("click", () => {
      Navigate.to("question", { questionId: question.id });
    });

    return card;
  }

  function renderFullPage(container, params = {}) {
    const { questionId } = params;
    const question = QuestionsData.getById(questionId);
    if (!question) { Navigate.to("home"); return; }

    const session = Session.get();
    const solved = session ? CodeRunner.isSolved(session.userId, question.id) : false;
    const dc = DIFFICULTY_CONFIG[question.difficulty];
    const langs = question.language;
    const defaultLang = langs[0];

    container.innerHTML = `
      <div class="question-page">
        <div class="question-page-header">
          <button class="btn-back" id="qp-back">← Back</button>
          <div class="question-page-title">
            <span class="question-thumb-lg">${question.thumbnail}</span>
            <div>
              <h1>${question.title}</h1>
              <div class="question-page-meta">
                <span class="difficulty-badge" style="color:${dc.color};background:${dc.bg}">
                  ${question.difficulty}
                </span>
                <span>⏱ ${question.estimatedTime}</span>
                <span>👥 ${question.solveCount.toLocaleString()} solved</span>
                ${solved ? `<span class="solved-indicator">✓ Solved</span>` : ""}
              </div>
            </div>
          </div>
          <div class="qp-lang-select-wrap">
            <select class="qp-lang-select" id="qp-lang">
              ${langs.map(l => `<option value="${l}">${l}</option>`).join("")}
            </select>
          </div>
          <div class="qp-nav-btns">
            <button class="btn-qp-nav" id="qp-prev">← Prev</button>
            <button class="btn-qp-nav" id="qp-next">Next →</button>
          </div>
        </div>

        <div class="question-page-body">
          <div class="question-left-panel">
            <div class="panel-tabs">
              <button class="panel-tab active" data-tab="problem">Problem</button>
              <button class="panel-tab" data-tab="examples">Examples</button>
            </div>
            <div class="panel-content" id="tab-problem">
              <div class="problem-statement">${question.statement}</div>
              <div class="problem-constraints">
                <h4>Constraints</h4>
                <ul>${question.constraints.map(c => `<li>${c}</li>`).join("")}</ul>
              </div>
              <div class="problem-tags-wrap">
                ${question.tags.map(t => `<span class="skill-tag">${t}</span>`).join("")}
              </div>
            </div>
            <div class="panel-content hidden" id="tab-examples">
              ${question.examples.map((ex, i) => `
                <div class="example-block">
                  <div class="example-label">Example ${i + 1}</div>
                  <div class="example-row"><strong>Input:</strong> <code>${ex.input}</code></div>
                  <div class="example-row"><strong>Output:</strong> <code>${ex.output}</code></div>
                  ${ex.explanation
                    ? `<div class="example-row"><strong>Explanation:</strong> ${ex.explanation}</div>`
                    : ""}
                </div>
              `).join("")}
            </div>
          </div>

          <div class="question-right-panel">
            <div class="code-editor-wrap">
              <div class="code-editor-header">
                <span>Code Editor</span>
                <button class="btn-clear-code" id="qp-clear">Clear</button>
              </div>
              <textarea class="code-editor" id="qp-editor" spellcheck="false"
                placeholder="Write your solution here...">${question.starterCode[defaultLang] || ""}</textarea>
            </div>

            <div class="code-output-wrap" id="qp-output" style="display:none">
              <div class="output-header">
                <span>Output</span>
                <button class="btn-close-output" id="qp-close-output">✕</button>
              </div>
              <pre class="output-content" id="qp-output-content"></pre>
            </div>

            <div class="code-actions">
              <button class="btn-run-code" id="qp-run">▶ Run Code</button>
              <button class="btn-submit-code" id="qp-submit">Submit →</button>
              <button class="btn-ai-hint" id="qp-ai-hint">🤖 AI Hint</button>
            </div>
          </div>
        </div>
      </div>
    `;

    _bindFullPageEvents(container, question, session);
  }

  function _bindFullPageEvents(container, question, session) {
    let currentLang = question.language[0];

    container.querySelector("#qp-back")?.addEventListener("click", () => Navigate.to("home"));
    container.querySelector("#qp-prev")?.addEventListener("click", () => {
      const prev = QuestionsData.getPrev(question.id);
      if (prev) Navigate.to("question", { questionId: prev.id });
      else Toast.show("This is the first problem!", "info");
    });
    container.querySelector("#qp-next")?.addEventListener("click", () => {
      const next = QuestionsData.getNext(question.id);
      if (next) Navigate.to("question", { questionId: next.id });
      else Toast.show("This is the last problem!", "info");
    });

    container.querySelector("#qp-lang")?.addEventListener("change", (e) => {
      currentLang = e.target.value;
      const editor = container.querySelector("#qp-editor");
      if (editor) editor.value = question.starterCode[currentLang] || "";
    });

    container.querySelectorAll(".panel-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        container.querySelectorAll(".panel-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        container.querySelectorAll(".panel-content").forEach(c => c.classList.add("hidden"));
        container.querySelector(`#tab-${tab.dataset.tab}`)?.classList.remove("hidden");
      });
    });

    container.querySelector("#qp-clear")?.addEventListener("click", () => {
      const editor = container.querySelector("#qp-editor");
      if (editor) editor.value = question.starterCode[currentLang] || "";
    });

    container.querySelector("#qp-run")?.addEventListener("click", () => {
      const code = container.querySelector("#qp-editor")?.value || "";
      const result = CodeRunner.run(code, currentLang, question);
      const outputEl = container.querySelector("#qp-output");
      const contentEl = container.querySelector("#qp-output-content");
      if (outputEl) outputEl.style.display = "block";
      if (contentEl) {
        contentEl.textContent = result.error
          ? `Error: ${result.error}`
          : result.output;
        contentEl.style.color = result.error ? "#EF4444" : "#10B981";
      }
    });

    container.querySelector("#qp-close-output")?.addEventListener("click", () => {
      const outputEl = container.querySelector("#qp-output");
      if (outputEl) outputEl.style.display = "none";
    });

    container.querySelector("#qp-submit")?.addEventListener("click", () => {
      const code = container.querySelector("#qp-editor")?.value || "";
      if (!session) { Navigate.to("auth"); return; }
      const result = CodeRunner.submit(code, currentLang, session.userId, question.id);
      if (result.success) {
        Toast.show("Solution submitted! Starting AI analysis...", "success");
        setTimeout(() => {
          AIScoreCard.showAnalysisModal({
            userId: session.userId,
            questionId: question.id,
          });
        }, 500);
      } else {
        Toast.show(result.error, "error");
      }
    });

    container.querySelector("#qp-ai-hint")?.addEventListener("click", () => {
      _showAIHintModal(question);
    });
  }

  function _showAIHintModal(question) {
    const existing = document.getElementById("ai-hint-modal");
    if (existing) existing.remove();

    const hints = [
      `💡 Think about using a ${question.tags[0] || "hash map"} for O(1) lookup.`,
      `💡 Consider the time complexity — can you do better than O(n²)?`,
      `💡 Try breaking the problem into smaller subproblems.`,
      `💡 Edge cases: empty input, single element, duplicates.`,
    ];

    const modal = document.createElement("div");
    modal.id = "ai-hint-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-card hint-modal-card">
        <button class="modal-close" id="close-hint">✕</button>
        <div class="hint-modal-header">
          <span class="hint-robot">🤖</span>
          <h3>AI Assistant — ${question.title}</h3>
        </div>
        <div class="hint-options">
          <button class="hint-btn" data-hint="hint">💡 Get a Hint</button>
          <button class="hint-btn" data-hint="explain">📖 Explain Problem</button>
          <button class="hint-btn" data-hint="check">✅ Check Approach</button>
        </div>
        <div class="hint-output" id="hint-output" style="display:none"></div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#close-hint")?.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

    modal.querySelectorAll(".hint-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.hint;
        const output = modal.querySelector("#hint-output");
        output.style.display = "block";
        output.textContent = "AI thinking...";
        setTimeout(() => {
          if (type === "hint")
            output.textContent = hints[Math.floor(Math.random() * hints.length)];
          else if (type === "explain")
            output.textContent = `📖 ${question.statement}\n\nKey insight: ${question.tags.join(", ")} concepts apply here.`;
          else
            output.textContent = `✅ Your approach looks reasonable! Focus on:\n• ${question.constraints[0]}\n• Optimize for the given constraints.`;
        }, 1000);
      });
    });
  }

  return { render, renderFullPage };
})();