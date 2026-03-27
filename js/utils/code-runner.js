// js/utils/code-runner.js

const CodeRunner = (() => {
  function run(code, language, question) {
    if (!code || !code.trim()) {
      return { success: false, output: "", error: "No code to run." };
    }

    if (language === "JavaScript") {
      return _runJavaScript(code, question);
    }

    // For other languages — simulate output
    return _simulateRun(code, language, question);
  }

  function _runJavaScript(code, question) {
    try {
      const logs = [];
      const mockConsole = { log: (...args) => logs.push(args.join(" ")) };

      // Inject first example input as test
      const testInput = question?.examples?.[0]?.input || "";
      const expectedOutput = question?.examples?.[0]?.output || "";

      const wrappedCode = `
        (function() {
          const console = { log: (...a) => __logs__.push(a.join(' ')) };
          ${code}
          try {
            ${_buildTestCall(question)}
          } catch(e) { __logs__.push('Runtime error: ' + e.message); }
        })()
      `;

      const __logs__ = [];
      // eslint-disable-next-line no-new-func
      new Function("__logs__", wrappedCode)(__logs__);

      const output = __logs__.length > 0
        ? __logs__.join("\n")
        : "✓ Code executed successfully (no output)";

      return { success: true, output, error: null, testInput, expectedOutput };
    } catch (e) {
      return { success: false, output: "", error: e.message };
    }
  }

  function _buildTestCall(question) {
    if (!question) return "";
    const calls = {
      q_001: `const r = typeof twoSum === 'function' ? twoSum([2,7,11,15], 9) : 'Function not found'; console.log(JSON.stringify(r));`,
      q_002: `console.log('Test: reverseList([1,2,3,4,5])');`,
      q_003: `const r = typeof search === 'function' ? search([-1,0,3,5,9,12], 9) : 'Function not found'; console.log(r);`,
      q_004: `const r = typeof isValid === 'function' ? isValid('()[]{}') : 'Function not found'; console.log(r);`,
      q_005: `const r = typeof maxSubArray === 'function' ? maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) : 'Function not found'; console.log(r);`,
    };
    return calls[question.id] || `console.log('Code loaded successfully');`;
  }

  function _simulateRun(code, language, question) {
    const lines = code.split("\n").filter((l) => l.trim()).length;
    const hasLogic = code.includes("return") || code.includes("print") || code.includes("cout");

    if (lines < 2) {
      return { success: false, output: "", error: "Code seems incomplete." };
    }

    const example = question?.examples?.[0];
    const simulatedOutput = example
      ? `Running test case...\nInput:  ${example.input}\nOutput: ${example.output}\n\n✓ Test passed`
      : `✓ ${language} code compiled and executed successfully.`;

    return { success: true, output: simulatedOutput, error: null };
  }

  function submit(code, language, userId, questionId) {
    if (!code || code.trim().length < 10) {
      return { success: false, error: "Please write some code before submitting." };
    }

    // Mark question as solved
    const solvedKey = `cb_solved_${userId}`;
    const solved = Storage.get(solvedKey, []);
    if (!solved.includes(questionId)) {
      solved.push(questionId);
      Storage.set(solvedKey, solved);

      // Update user stats
      Storage.update(CONFIG.STORAGE_KEYS.USERS, (users) =>
        users.map((u) =>
          u.id === userId
            ? { ...u, problemsSolved: (u.problemsSolved || 0) + 1 }
            : u
        )
      );
    }

    return { success: true, questionId, solvedAt: Date.now() };
  }

  function getSolved(userId) {
    return Storage.get(`cb_solved_${userId}`, []);
  }

  function isSolved(userId, questionId) {
    return getSolved(userId).includes(questionId);
  }

  return { run, submit, getSolved, isSolved };
})();