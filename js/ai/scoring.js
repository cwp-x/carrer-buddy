// js/ai/scoring.js

const Scoring = (() => {
  // Deterministic-ish score from string seed
  function _seededRandom(seed, min, max) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const norm = (Math.abs(hash) % 1000) / 1000;
    return Math.floor(min + norm * (max - min));
  }

  function generateScore(userId, questionId) {
    const seed = userId + "_" + questionId;
    const codeQuality  = _seededRandom(seed + "cq",  55, 99);
    const uiUx         = _seededRandom(seed + "ux",  50, 99);
    const logic        = _seededRandom(seed + "lg",  58, 99);
    const overall      = Math.round((codeQuality + uiUx + logic) / 3);

    return {
      codeQuality,
      uiUx,
      logic,
      overall,
      label: _getLabel(overall),
      color: _getColor(overall),
      generatedAt: Date.now(),
    };
  }

  function generateCandidateScore(candidateId) {
    const seed = "candidate_" + candidateId;
    const codeQuality  = _seededRandom(seed + "cq",  65, 99);
    const uiUx         = _seededRandom(seed + "ux",  60, 99);
    const logic        = _seededRandom(seed + "lg",  68, 99);
    const overall      = Math.round((codeQuality + uiUx + logic) / 3);

    return { codeQuality, uiUx, logic, overall,
      label: _getLabel(overall), color: _getColor(overall) };
  }

  function _getLabel(score) {
    if (score >= 90) return "Exceptional";
    if (score >= 80) return "Strong";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Needs Work";
  }

  function _getColor(score) {
    if (score >= 85) return "#10B981";
    if (score >= 70) return "#06B6D4";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  }

  function getInsights(scores) {
    const insights = [];
    if (scores.codeQuality >= 85)
      insights.push("Clean, well-structured code with good naming conventions.");
    else if (scores.codeQuality < 70)
      insights.push("Code structure can be improved with better modularization.");

    if (scores.logic >= 85)
      insights.push("Strong algorithmic thinking and problem-solving approach.");
    else if (scores.logic < 70)
      insights.push("Consider optimizing time/space complexity.");

    if (scores.uiUx >= 85)
      insights.push("Excellent attention to UI/UX and user experience details.");
    else if (scores.uiUx < 70)
      insights.push("UI/UX aspects could be refined for better usability.");

    if (scores.overall >= 88)
      insights.push("Top-tier candidate — highly recommended.");
    else if (scores.overall >= 75)
      insights.push("Solid performer with good potential.");
    else
      insights.push("Shows foundational skills with room for growth.");

    return insights;
  }

  return { generateScore, generateCandidateScore, getInsights };
})();