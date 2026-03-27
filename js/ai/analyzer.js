// js/ai/analyzer.js

const Analyzer = (() => {
  const LOADING_STEPS = [
    "Initializing AI engine...",
    "Parsing code structure...",
    "Evaluating logic complexity...",
    "Analyzing UI/UX patterns...",
    "Scoring code quality...",
    "Generating insights...",
    "Finalizing results...",
  ];

  function analyze(options = {}) {
    const {
      userId = "guest",
      questionId = "q_001",
      onStep = () => {},
      onProgress = () => {},
      onComplete = () => {},
      duration = CONFIG.AI.LOADING_DURATION,
    } = options;

    let stepIndex = 0;
    const stepInterval = duration / LOADING_STEPS.length;

    const stepTimer = setInterval(() => {
      if (stepIndex < LOADING_STEPS.length) {
        onStep(LOADING_STEPS[stepIndex], stepIndex);
        onProgress(Math.round(((stepIndex + 1) / LOADING_STEPS.length) * 100));
        stepIndex++;
      } else {
        clearInterval(stepTimer);
      }
    }, stepInterval);

    setTimeout(() => {
      clearInterval(stepTimer);
      onProgress(100);
      const scores = Scoring.generateScore(userId, questionId);
      const insights = Scoring.getInsights(scores);
      onComplete({ scores, insights });
    }, duration + 200);
  }

  function analyzeCandidate(options = {}) {
    const {
      candidateId = "c_001",
      planId = "basic",
      onStep = () => {},
      onProgress = () => {},
      onComplete = () => {},
    } = options;

    const plan = PlansData.getById(planId);
    const aiLabel = plan ? plan.aiLabel : "Basic AI";
    const duration = planId === "advanced" ? 3000
      : planId === "pro" ? 2500 : 2000;

    const steps = [
      `${aiLabel}: Loading candidate profile...`,
      "Scanning project submissions...",
      "Evaluating technical depth...",
      "Cross-referencing skill benchmarks...",
      "Computing final score...",
    ];

    let i = 0;
    const interval = duration / steps.length;
    const timer = setInterval(() => {
      if (i < steps.length) {
        onStep(steps[i], i);
        onProgress(Math.round(((i + 1) / steps.length) * 100));
        i++;
      } else {
        clearInterval(timer);
      }
    }, interval);

    setTimeout(() => {
      clearInterval(timer);
      onProgress(100);
      const scores = Scoring.generateCandidateScore(candidateId);
      const insights = Scoring.getInsights(scores);
      const whyThis = _generateWhyThis(scores);
      onComplete({ scores, insights, whyThis, aiLabel });
    }, duration + 200);
  }

  function _generateWhyThis(scores) {
    const parts = [];
    if (scores.codeQuality >= 85)
      parts.push("writes production-quality code");
    if (scores.logic >= 85)
      parts.push("demonstrates strong problem-solving skills");
    if (scores.uiUx >= 85)
      parts.push("shows excellent UI/UX sensibility");
    if (scores.overall >= 88)
      parts.push("ranks in the top 10% of evaluated candidates");
    if (parts.length === 0)
      parts.push("shows solid foundational skills across all areas");

    return `This candidate ${parts.join(", ")}.`;
  }

  return { analyze, analyzeCandidate };
})();