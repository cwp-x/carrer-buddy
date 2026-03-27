// js/components/job-card.js

const JobCard = (() => {

  // ── Resume Upload + AI Analysis Modal ──────────────────────────────────────
  function _showResumeModal(job, onSuccess) {
    // Remove any existing modal
    document.getElementById("resume-modal-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "resume-modal-overlay";
    overlay.innerHTML = `
      <div class="resume-modal-backdrop"></div>
      <div class="resume-modal-box" id="resume-modal-box">

        <!-- STEP 1: Upload -->
        <div id="rm-step-upload">
          <div class="rm-header">
            <div class="rm-job-info">
              <span class="rm-company-badge">${job.company}</span>
              <h2 class="rm-title">Apply for ${job.title}</h2>
            </div>
            <button class="rm-close" id="rm-close-btn">✕</button>
          </div>

          <div class="rm-upload-zone" id="rm-upload-zone">
            <div class="rm-upload-icon">
              <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p class="rm-upload-title">Drop your resume here</p>
            <p class="rm-upload-sub">PDF, DOC, DOCX — max 5MB</p>
            <input type="file" id="rm-file-input" accept=".pdf,.doc,.docx" style="display:none"/>
            <button class="rm-browse-btn" id="rm-browse-btn">Browse File</button>
          </div>

          <div class="rm-file-preview hidden" id="rm-file-preview">
            <div class="rm-file-icon">📄</div>
            <div class="rm-file-details">
              <span class="rm-file-name" id="rm-file-name">resume.pdf</span>
              <span class="rm-file-size" id="rm-file-size">0 KB</span>
            </div>
            <button class="rm-file-remove" id="rm-file-remove">✕</button>
          </div>

          <button class="rm-submit-btn" id="rm-submit-btn" disabled>
            Analyze & Apply
          </button>
        </div>

        <!-- STEP 2: AI Analyzing -->
        <div id="rm-step-analyzing" class="hidden">
          <div class="rm-analyzing-wrap">
            <div class="rm-ai-logo">
              <div class="rm-ai-pulse"></div>
              <svg width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </div>
            <h2 class="rm-analyzing-title">AI is analyzing your resume</h2>
            <p class="rm-analyzing-sub" id="rm-step-label">Initializing AI engine...</p>

            <div class="rm-progress-bar-wrap">
              <div class="rm-progress-bar" id="rm-progress-bar" style="width:0%"></div>
            </div>
            <span class="rm-progress-pct" id="rm-progress-pct">0%</span>

            <div class="rm-steps-list" id="rm-steps-list"></div>
          </div>
        </div>

        <!-- STEP 3: Result — Accepted -->
        <div id="rm-step-accepted" class="hidden">
          <div class="rm-result-wrap rm-result-success">
            <div class="rm-result-icon rm-result-icon-success">
              <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 class="rm-result-title">Application Accepted! 🎉</h2>
            <p class="rm-result-sub">Your resume scored above the threshold</p>

            <div class="rm-score-ring-wrap">
              <svg class="rm-score-ring" viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(16,185,129,0.15)" stroke-width="10"/>
                <circle id="rm-score-circle" cx="60" cy="60" r="50" fill="none"
                  stroke="#10B981" stroke-width="10" stroke-linecap="round"
                  stroke-dasharray="314" stroke-dashoffset="314"
                  transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 1.2s ease"/>
              </svg>
              <div class="rm-score-center">
                <span class="rm-score-number" id="rm-score-number">0</span>
                <span class="rm-score-label">/ 100</span>
              </div>
            </div>

            <div class="rm-score-breakdown" id="rm-score-breakdown"></div>
            <div class="rm-insights-list" id="rm-insights-list"></div>

            <button class="rm-done-btn rm-done-success" id="rm-done-btn">
              Done — View My Applications
            </button>
          </div>
        </div>

        <!-- STEP 4: Result — Rejected -->
        <div id="rm-step-rejected" class="hidden">
          <div class="rm-result-wrap rm-result-fail">
            <div class="rm-result-icon rm-result-icon-fail">
              <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h2 class="rm-result-title">Score Below Threshold</h2>
            <p class="rm-result-sub">Your resume did not meet the minimum requirements for this role</p>

            <div class="rm-score-ring-wrap">
              <svg class="rm-score-ring" viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(239,68,68,0.15)" stroke-width="10"/>
                <circle id="rm-score-circle-fail" cx="60" cy="60" r="50" fill="none"
                  stroke="#EF4444" stroke-width="10" stroke-linecap="round"
                  stroke-dasharray="314" stroke-dashoffset="314"
                  transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 1.2s ease"/>
              </svg>
              <div class="rm-score-center">
                <span class="rm-score-number rm-score-number-fail" id="rm-score-number-fail">0</span>
                <span class="rm-score-label">/ 100</span>
              </div>
            </div>

            <div class="rm-fail-message">
              <p class="rm-fail-reason">
                <strong>Minimum required score: 60</strong><br/>
                Your resume scored below the threshold. Here's what the AI found:
              </p>
              <div class="rm-score-breakdown" id="rm-score-breakdown-fail"></div>
              <div class="rm-improvement-tips">
                <p class="rm-tips-title">💡 How to improve:</p>
                <ul id="rm-tips-list"></ul>
              </div>
            </div>

            <button class="rm-done-btn rm-done-fail" id="rm-retry-btn">
              Close & Try Another Job
            </button>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(overlay);
    _injectModalStyles();
    _bindModalEvents(overlay, job, onSuccess);

    // Animate in
    requestAnimationFrame(() => {
      overlay.querySelector(".resume-modal-box").style.opacity = "1";
      overlay.querySelector(".resume-modal-box").style.transform = "translateY(0) scale(1)";
    });
  }

  function _bindModalEvents(overlay, job, onSuccess) {
    const fileInput  = overlay.querySelector("#rm-file-input");
    const browseBtn  = overlay.querySelector("#rm-browse-btn");
    const uploadZone = overlay.querySelector("#rm-upload-zone");
    const submitBtn  = overlay.querySelector("#rm-submit-btn");
    const removeBtn  = overlay.querySelector("#rm-file-remove");
    const closeBtn   = overlay.querySelector("#rm-close-btn");
    let selectedFile = null;

    // Close
    closeBtn.addEventListener("click", () => overlay.remove());
    overlay.querySelector(".resume-modal-backdrop").addEventListener("click", () => overlay.remove());

    // Browse
    browseBtn.addEventListener("click", () => fileInput.click());

    // Drag & Drop
    uploadZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadZone.classList.add("rm-drag-over");
    });
    uploadZone.addEventListener("dragleave", () => uploadZone.classList.remove("rm-drag-over"));
    uploadZone.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadZone.classList.remove("rm-drag-over");
      const file = e.dataTransfer.files[0];
      if (file) _handleFile(file);
    });

    // File input change
    fileInput.addEventListener("change", () => {
      if (fileInput.files[0]) _handleFile(fileInput.files[0]);
    });

    // Remove file
    removeBtn.addEventListener("click", () => {
      selectedFile = null;
      overlay.querySelector("#rm-file-preview").classList.add("hidden");
      uploadZone.classList.remove("hidden");
      submitBtn.disabled = true;
      fileInput.value = "";
    });

    // Submit → start AI flow
    submitBtn.addEventListener("click", () => {
      if (!selectedFile) return;
      _startAIAnalysis(overlay, job, selectedFile, onSuccess);
    });

    // Done buttons
    overlay.querySelector("#rm-done-btn")?.addEventListener("click", () => overlay.remove());
    overlay.querySelector("#rm-retry-btn")?.addEventListener("click", () => overlay.remove());

    function _handleFile(file) {
      selectedFile = file;
      const sizeMB = (file.size / 1024).toFixed(1);
      overlay.querySelector("#rm-file-name").textContent = file.name;
      overlay.querySelector("#rm-file-size").textContent = sizeMB + " KB";
      overlay.querySelector("#rm-file-preview").classList.remove("hidden");
      uploadZone.classList.add("hidden");
      submitBtn.disabled = false;
    }
  }

  function _startAIAnalysis(overlay, job, file, onSuccess) {
    // Switch to analyzing step
    overlay.querySelector("#rm-step-upload").classList.add("hidden");
    overlay.querySelector("#rm-step-analyzing").classList.remove("hidden");

    const STEPS = [
      "Initializing AI engine...",
      `Parsing resume: ${file.name}`,
      "Extracting skills & experience...",
      "Matching against job requirements...",
      "Evaluating technical depth...",
      "Cross-referencing role: " + job.title,
      "Computing compatibility score...",
      "Finalizing AI report...",
    ];

    const progressBar  = overlay.querySelector("#rm-progress-bar");
    const progressPct  = overlay.querySelector("#rm-progress-pct");
    const stepLabel    = overlay.querySelector("#rm-step-label");
    const stepsList    = overlay.querySelector("#rm-steps-list");
    const DURATION     = 3500;
    const stepInterval = DURATION / STEPS.length;
    let i = 0;

    const timer = setInterval(() => {
      if (i < STEPS.length) {
        const pct = Math.round(((i + 1) / STEPS.length) * 100);
        progressBar.style.width = pct + "%";
        progressPct.textContent = pct + "%";
        stepLabel.textContent = STEPS[i];

        // Add step to list
        const stepEl = document.createElement("div");
        stepEl.className = "rm-step-item rm-step-done";
        stepEl.innerHTML = `<span class="rm-step-tick">✓</span> ${STEPS[i]}`;
        stepsList.appendChild(stepEl);
        stepsList.scrollTop = stepsList.scrollHeight;
        i++;
      } else {
        clearInterval(timer);
      }
    }, stepInterval);

    // After analysis done
    setTimeout(() => {
      clearInterval(timer);
      progressBar.style.width = "100%";
      progressPct.textContent = "100%";

      // Generate score — seeded by userId + jobId for consistency
      const session = Session.get();
      const seed = (session?.userId || "guest") + "_" + job.id;
      const scores = _generateResumeScore(seed, job);

      _showResult(overlay, scores, job, onSuccess);
    }, DURATION + 400);
  }

  function _generateResumeScore(seed, job) {
    // Seeded random — same user+job always gets same score
    function seeded(s, min, max) {
      let h = 0;
      for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
      const n = (Math.abs(h) % 1000) / 1000;
      return Math.floor(min + n * (max - min));
    }
    const skillMatch    = seeded(seed + "skill",  40, 99);
    const experience    = seeded(seed + "exp",    35, 99);
    const techDepth     = seeded(seed + "tech",   38, 99);
    const roleMatch     = seeded(seed + "role",   42, 99);
    const overall       = Math.round((skillMatch + experience + techDepth + roleMatch) / 4);

    return { skillMatch, experience, techDepth, roleMatch, overall };
  }

  function _showResult(overlay, scores, job, onSuccess) {
    overlay.querySelector("#rm-step-analyzing").classList.add("hidden");
    const passed = scores.overall >= 60;

    if (passed) {
      overlay.querySelector("#rm-step-accepted").classList.remove("hidden");

      // Animate score ring
      const circumference = 314;
      const offset = circumference - (scores.overall / 100) * circumference;
      setTimeout(() => {
        overlay.querySelector("#rm-score-circle").style.strokeDashoffset = offset;
        _countUp(overlay.querySelector("#rm-score-number"), 0, scores.overall, 1200);
      }, 100);

      // Score breakdown
      overlay.querySelector("#rm-score-breakdown").innerHTML = _buildBreakdown(scores, true);

      // Insights
      const insights = _buildInsights(scores, true);
      overlay.querySelector("#rm-insights-list").innerHTML = insights
        .map(i => `<div class="rm-insight-item">✦ ${i}</div>`).join("");

      // Mark as applied in localStorage
      const session = Session.get();
      if (session) JobsData.apply(job.id, session.userId);
      if (onSuccess) onSuccess();

      overlay.querySelector("#rm-done-btn").addEventListener("click", () => overlay.remove());

    } else {
      overlay.querySelector("#rm-step-rejected").classList.remove("hidden");

      // Animate score ring (red)
      const circumference = 314;
      const offset = circumference - (scores.overall / 100) * circumference;
      setTimeout(() => {
        overlay.querySelector("#rm-score-circle-fail").style.strokeDashoffset = offset;
        _countUp(overlay.querySelector("#rm-score-number-fail"), 0, scores.overall, 1200);
      }, 100);

      // Score breakdown
      overlay.querySelector("#rm-score-breakdown-fail").innerHTML = _buildBreakdown(scores, false);

      // Improvement tips
      const tips = _buildTips(scores);
      overlay.querySelector("#rm-tips-list").innerHTML = tips
        .map(t => `<li>${t}</li>`).join("");

      overlay.querySelector("#rm-retry-btn").addEventListener("click", () => overlay.remove());
    }
  }

  function _buildBreakdown(scores, passed) {
    const items = [
      { label: "Skill Match",   value: scores.skillMatch },
      { label: "Experience",    value: scores.experience },
      { label: "Tech Depth",    value: scores.techDepth },
      { label: "Role Fit",      value: scores.roleMatch },
    ];
    return items.map(item => {
      const color = item.value >= 75 ? "#10B981"
                  : item.value >= 60 ? "#06B6D4"
                  : item.value >= 45 ? "#F59E0B" : "#EF4444";
      return `
        <div class="rm-breakdown-item">
          <span class="rm-breakdown-label">${item.label}</span>
          <div class="rm-breakdown-bar-wrap">
            <div class="rm-breakdown-bar" style="width:${item.value}%;background:${color}"></div>
          </div>
          <span class="rm-breakdown-val" style="color:${color}">${item.value}</span>
        </div>`;
    }).join("");
  }

  function _buildInsights(scores) {
    const out = [];
    if (scores.skillMatch >= 75) out.push("Strong skill alignment with the job requirements.");
    if (scores.experience  >= 75) out.push("Your experience level matches what the company is looking for.");
    if (scores.techDepth   >= 75) out.push("Impressive technical depth detected in your profile.");
    if (scores.roleMatch   >= 75) out.push("Excellent role compatibility — you're a strong match.");
    if (scores.overall     >= 85) out.push("Top 15% of applicants for this role. 🔥");
    if (out.length === 0) out.push("You meet the basic requirements for this position.");
    return out;
  }

  function _buildTips(scores) {
    const tips = [];
    if (scores.skillMatch  < 60) tips.push("Add more relevant skills listed in the job description.");
    if (scores.experience  < 60) tips.push("Highlight specific projects and measurable achievements.");
    if (scores.techDepth   < 60) tips.push("Include technical certifications or side projects to boost depth.");
    if (scores.roleMatch   < 60) tips.push("Tailor your resume summary to match this specific role.");
    tips.push("Try applying to roles that better match your current skill level.");
    return tips;
  }

  function _countUp(el, from, to, duration) {
    if (!el) return;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(from + (to - from) * progress);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── CSS injected once ──────────────────────────────────────────────────────
  function _injectModalStyles() {
    if (document.getElementById("resume-modal-styles")) return;
    const style = document.createElement("style");
    style.id = "resume-modal-styles";
    style.textContent = `
      #resume-modal-overlay {
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
      }
      .resume-modal-backdrop {
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
      }
      .resume-modal-box {
        position: relative; z-index: 1;
        background: #111827; border: 1px solid rgba(6,182,212,0.2);
        border-radius: 20px; padding: 32px;
        width: min(520px, 94vw); max-height: 90vh; overflow-y: auto;
        opacity: 0; transform: translateY(24px) scale(0.97);
        transition: opacity 0.3s ease, transform 0.3s ease;
        box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,182,212,0.1);
      }
      .rm-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
      .rm-company-badge {
        display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
        text-transform: uppercase; color: #06B6D4;
        background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.25);
        border-radius: 6px; padding: 3px 10px; margin-bottom: 6px;
      }
      .rm-title { font-size: 18px; font-weight: 700; color: #F9FAFB; margin: 0; }
      .rm-close {
        background: rgba(255,255,255,0.06); border: none; color: #9CA3AF;
        width: 32px; height: 32px; border-radius: 8px; cursor: pointer;
        font-size: 14px; display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: background 0.2s;
      }
      .rm-close:hover { background: rgba(239,68,68,0.2); color: #EF4444; }

      /* Upload Zone */
      .rm-upload-zone {
        border: 2px dashed rgba(6,182,212,0.3); border-radius: 16px;
        padding: 40px 24px; text-align: center; cursor: pointer;
        transition: all 0.2s; margin-bottom: 20px;
      }
      .rm-upload-zone:hover, .rm-drag-over {
        border-color: #06B6D4; background: rgba(6,182,212,0.05);
      }
      .rm-upload-icon { color: #06B6D4; margin-bottom: 12px; }
      .rm-upload-title { color: #F9FAFB; font-size: 16px; font-weight: 600; margin: 0 0 4px; }
      .rm-upload-sub { color: #6B7280; font-size: 13px; margin: 0 0 16px; }
      .rm-browse-btn {
        background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3);
        color: #06B6D4; border-radius: 8px; padding: 8px 20px;
        font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
      }
      .rm-browse-btn:hover { background: rgba(6,182,212,0.2); }

      /* File Preview */
      .rm-file-preview {
        display: flex; align-items: center; gap: 12px;
        background: rgba(6,182,212,0.06); border: 1px solid rgba(6,182,212,0.2);
        border-radius: 12px; padding: 14px 16px; margin-bottom: 20px;
      }
      .rm-file-icon { font-size: 28px; }
      .rm-file-details { flex: 1; }
      .rm-file-name { display: block; color: #F9FAFB; font-size: 14px; font-weight: 600; }
      .rm-file-size { display: block; color: #6B7280; font-size: 12px; margin-top: 2px; }
      .rm-file-remove {
        background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
        color: #EF4444; width: 28px; height: 28px; border-radius: 6px;
        cursor: pointer; font-size: 12px;
      }

      /* Submit Button */
      .rm-submit-btn {
        width: 100%; padding: 14px;
        background: linear-gradient(135deg, #06B6D4, #3B82F6);
        border: none; border-radius: 12px; color: #fff;
        font-size: 15px; font-weight: 700; cursor: pointer;
        transition: all 0.2s; letter-spacing: 0.02em;
      }
      .rm-submit-btn:disabled {
        opacity: 0.4; cursor: not-allowed;
        background: rgba(107,114,128,0.3);
      }
      .rm-submit-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(6,182,212,0.3); }

      /* Analyzing Step */
      .rm-analyzing-wrap { text-align: center; padding: 8px 0; }
      .rm-ai-logo {
        position: relative; display: inline-flex;
        align-items: center; justify-content: center;
        width: 72px; height: 72px; margin-bottom: 20px;
      }
      .rm-ai-pulse {
        position: absolute; inset: 0; border-radius: 50%;
        background: rgba(6,182,212,0.15);
        animation: rmPulse 1.5s ease-in-out infinite;
      }
      @keyframes rmPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.2);opacity:0.6} }
      .rm-ai-logo svg { color: #06B6D4; position: relative; }
      .rm-analyzing-title { font-size: 18px; font-weight: 700; color: #F9FAFB; margin: 0 0 6px; }
      .rm-analyzing-sub { color: #06B6D4; font-size: 13px; margin: 0 0 20px; min-height: 20px; }
      .rm-progress-bar-wrap {
        background: rgba(255,255,255,0.08); border-radius: 99px;
        height: 8px; margin-bottom: 6px; overflow: hidden;
      }
      .rm-progress-bar {
        height: 100%; border-radius: 99px;
        background: linear-gradient(90deg, #06B6D4, #3B82F6);
        transition: width 0.4s ease;
      }
      .rm-progress-pct { color: #9CA3AF; font-size: 12px; }
      .rm-steps-list {
        text-align: left; margin-top: 16px;
        max-height: 140px; overflow-y: auto;
        border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;
        padding: 10px 14px; background: rgba(0,0,0,0.2);
      }
      .rm-step-item {
        font-size: 12px; color: #6B7280; padding: 3px 0;
        animation: rmFadeIn 0.3s ease;
      }
      @keyframes rmFadeIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:none} }
      .rm-step-done { color: #10B981; }
      .rm-step-tick { margin-right: 6px; }

      /* Result Steps */
      .rm-result-wrap { text-align: center; padding: 8px 0; }
      .rm-result-icon {
        width: 72px; height: 72px; border-radius: 50%;
        display: inline-flex; align-items: center; justify-content: center;
        margin-bottom: 16px;
      }
      .rm-result-icon-success { background: rgba(16,185,129,0.15); color: #10B981; }
      .rm-result-icon-fail    { background: rgba(239,68,68,0.15); color: #EF4444; }
      .rm-result-title { font-size: 20px; font-weight: 800; color: #F9FAFB; margin: 0 0 6px; }
      .rm-result-sub { color: #9CA3AF; font-size: 14px; margin: 0 0 20px; }

      /* Score Ring */
      .rm-score-ring-wrap { position: relative; display: inline-block; margin-bottom: 20px; }
      .rm-score-center {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
      }
      .rm-score-number { font-size: 28px; font-weight: 800; color: #10B981; line-height: 1; }
      .rm-score-number-fail { color: #EF4444; }
      .rm-score-label { font-size: 12px; color: #6B7280; }

      /* Breakdown bars */
      .rm-score-breakdown { text-align: left; margin-bottom: 16px; }
      .rm-breakdown-item {
        display: flex; align-items: center; gap: 10px;
        margin-bottom: 10px;
      }
      .rm-breakdown-label { font-size: 12px; color: #9CA3AF; width: 90px; flex-shrink: 0; }
      .rm-breakdown-bar-wrap {
        flex: 1; height: 6px; background: rgba(255,255,255,0.08);
        border-radius: 99px; overflow: hidden;
      }
      .rm-breakdown-bar { height: 100%; border-radius: 99px; transition: width 1s ease; }
      .rm-breakdown-val { font-size: 12px; font-weight: 700; width: 28px; text-align: right; flex-shrink: 0; }

      /* Insights */
      .rm-insights-list { margin-bottom: 20px; text-align: left; }
      .rm-insight-item {
        font-size: 13px; color: #D1FAE5;
        background: rgba(16,185,129,0.08); border-left: 3px solid #10B981;
        border-radius: 0 8px 8px 0; padding: 8px 12px; margin-bottom: 8px;
      }

      /* Fail extras */
      .rm-fail-message { text-align: left; margin-bottom: 20px; }
      .rm-fail-reason { color: #9CA3AF; font-size: 13px; margin: 0 0 14px; line-height: 1.6; }
      .rm-fail-reason strong { color: #EF4444; }
      .rm-improvement-tips {
        background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);
        border-radius: 12px; padding: 14px 16px;
      }
      .rm-tips-title { color: #F59E0B; font-size: 13px; font-weight: 700; margin: 0 0 8px; }
      .rm-improvement-tips ul { margin: 0; padding-left: 18px; }
      .rm-improvement-tips li { color: #D1D5DB; font-size: 13px; margin-bottom: 6px; line-height: 1.5; }

      /* Done buttons */
      .rm-done-btn {
        width: 100%; padding: 14px; border: none; border-radius: 12px;
        font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s;
      }
      .rm-done-success {
        background: linear-gradient(135deg, #10B981, #06B6D4); color: #fff;
      }
      .rm-done-success:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(16,185,129,0.3); }
      .rm-done-fail {
        background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #EF4444;
      }
      .rm-done-fail:hover { background: rgba(239,68,68,0.2); }

      .hidden { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  // ── Original card render (unchanged structure, apply button updated) ────────
  function render(job, options = {}) {
    const { showApply = true, isHirer = false } = options;
    const session = Session.get();
    const color = JobsData.getColor(job.applications);
    const applied = session &&
      Storage.get(CONFIG.STORAGE_KEYS.USERS, [])
        .find(u => u.id === session.userId)
        ?.appliedJobs?.includes(job.id);

    const colorMap = {
      green:  { bg: "rgba(16,185,129,0.1)",  border: "#10B981", text: "#10B981", label: "Open" },
      yellow: { bg: "rgba(245,158,11,0.1)",  border: "#F59E0B", text: "#F59E0B", label: "Filling Fast" },
      red:    { bg: "rgba(239,68,68,0.1)",   border: "#EF4444", text: "#EF4444", label: "Closed" },
    };
    const c = colorMap[color];

    const card = document.createElement("div");
    card.className = "job-card";
    card.dataset.jobId = job.id;
    card.innerHTML = `
      <div class="job-card-header">
        <div class="job-card-title-wrap">
          <h3 class="job-card-title">${job.title}</h3>
          <span class="job-card-company">${job.company}</span>
        </div>
        <span class="job-status-badge" style="background:${c.bg};color:${c.text};border:1px solid ${c.border}">
          ${c.label}
        </span>
      </div>

      <div class="job-card-meta">
        <span class="job-meta-item">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          ${job.location}
        </span>
        <span class="job-meta-item">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
          ${job.type}
        </span>
        ${job.remote ? `<span class="job-meta-item job-remote-tag">Remote</span>` : ""}
      </div>

      <p class="job-card-desc">${job.description}</p>

      <div class="job-card-skills">
        ${job.skills.slice(0, 4).map(s => `<span class="skill-tag">${s}</span>`).join("")}
        ${job.skills.length > 4
          ? `<span class="skill-tag skill-tag-more">+${job.skills.length - 4}</span>`
          : ""}
      </div>

      <div class="job-card-footer">
        <div class="job-card-stats">
          <div class="job-applicants-bar">
            <div class="job-applicants-fill" style="width:${(job.applications / job.maxApplications) * 100}%;background:${c.text}"></div>
          </div>
          <span class="job-applicants-text" style="color:${c.text}">
            ${job.applications}/${job.maxApplications} applicants
          </span>
        </div>
        <div class="job-card-actions">
          ${job.salary ? `<span class="job-salary">${job.salary}</span>` : ""}
          ${showApply && !isHirer ? `
            <button class="btn-apply ${applied ? "btn-applied" : ""} ${color === "red" ? "btn-disabled" : ""}"
              data-job-id="${job.id}" ${applied || color === "red" ? "disabled" : ""}>
              ${applied ? "✓ Applied" : color === "red" ? "Closed" : "Apply Now"}
            </button>
          ` : ""}
          ${isHirer ? `
            <button class="btn-view-applicants" data-job-id="${job.id}">
              View Applicants
            </button>
          ` : ""}
        </div>
      </div>
    `;

    // ── Apply button → open resume modal ──────────────────────────────────
    if (showApply && !isHirer && color !== "red" && !applied) {
      card.querySelector(".btn-apply")?.addEventListener("click", (e) => {
        e.stopPropagation();
        _showResumeModal(job, () => {
          // Update button on success
          const btn = card.querySelector(".btn-apply");
          if (btn) {
            btn.textContent = "✓ Applied";
            btn.classList.add("btn-applied");
            btn.disabled = true;
          }
          Toast.show("Application submitted successfully! 🎉", "success");
        });
      });
    }

    return card;
  }

  return { render };
})();