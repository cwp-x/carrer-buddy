// js/data/questions.js

const QuestionsData = (() => {
  const QUESTIONS = [
    {
      id: "q_001", title: "Two Sum", difficulty: "Beginner",
      category: "DSA", language: ["C++", "Java", "Python", "JavaScript"],
      solveCount: 12453, estimatedTime: "15 min",
      thumbnail: "🔢",
      statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "Only one valid answer exists."],
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6" },
      ],
      starterCode: {
        JavaScript: `function twoSum(nums, target) {\n  // Your code here\n}`,
        Python: `def two_sum(nums, target):\n    # Your code here\n    pass`,
        Java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}`,
        "C++": `vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}`,
      },
      tags: ["Array", "Hash Map"],
    },
    {
      id: "q_002", title: "Reverse a Linked List", difficulty: "Beginner",
      category: "DSA", language: ["C++", "Java", "Python", "JavaScript"],
      solveCount: 9821, estimatedTime: "20 min",
      thumbnail: "🔗",
      statement: "Given the head of a singly linked list, reverse the list and return the reversed list.",
      constraints: ["0 ≤ Number of nodes ≤ 5000", "-5000 ≤ Node.val ≤ 5000"],
      examples: [
        { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "Reversed linked list" },
        { input: "head = [1,2]", output: "[2,1]", explanation: "Reversed linked list" },
      ],
      starterCode: {
        JavaScript: `function reverseList(head) {\n  // Your code here\n}`,
        Python: `def reverse_list(head):\n    # Your code here\n    pass`,
        Java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n    }\n}`,
        "C++": `ListNode* reverseList(ListNode* head) {\n    // Your code here\n}`,
      },
      tags: ["Linked List", "Recursion"],
    },
    {
      id: "q_003", title: "Binary Search", difficulty: "Beginner",
      category: "DSA", language: ["C++", "Java", "Python", "JavaScript"],
      solveCount: 11234, estimatedTime: "15 min",
      thumbnail: "🔍",
      statement: "Given a sorted array of integers and a target value, return the index of target, or -1 if not found.",
      constraints: ["1 ≤ nums.length ≤ 10⁴", "All elements are unique", "Array is sorted ascending"],
      examples: [
        { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists at index 4" },
        { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist" },
      ],
      starterCode: {
        JavaScript: `function search(nums, target) {\n  // Your code here\n}`,
        Python: `def search(nums, target):\n    # Your code here\n    pass`,
        Java: `class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n    }\n}`,
        "C++": `int search(vector<int>& nums, int target) {\n    // Your code here\n}`,
      },
      tags: ["Array", "Binary Search"],
    },
    {
      id: "q_004", title: "Valid Parentheses", difficulty: "Beginner",
      category: "DSA", language: ["C++", "Java", "Python", "JavaScript"],
      solveCount: 8765, estimatedTime: "20 min",
      thumbnail: "🔣",
      statement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of brackets only"],
      examples: [
        { input: 's = "()"', output: "true", explanation: "Matching brackets" },
        { input: 's = "()[]{}"', output: "true", explanation: "All brackets match" },
        { input: 's = "(]"', output: "false", explanation: "Mismatched brackets" },
      ],
      starterCode: {
        JavaScript: `function isValid(s) {\n  // Your code here\n}`,
        Python: `def is_valid(s):\n    # Your code here\n    pass`,
        Java: `class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}`,
        "C++": `bool isValid(string s) {\n    // Your code here\n}`,
      },
      tags: ["Stack", "String"],
    },
    {
      id: "q_005", title: "Maximum Subarray", difficulty: "Intermediate",
      category: "DSA", language: ["C++", "Java", "Python", "JavaScript"],
      solveCount: 7432, estimatedTime: "25 min",
      thumbnail: "📈",
      statement: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
      examples: [
        { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6" },
        { input: "nums = [1]", output: "1", explanation: "Single element" },
      ],
      starterCode: {
        JavaScript: `function maxSubArray(nums) {\n  // Your code here\n}`,
        Python: `def max_sub_array(nums):\n    # Your code here\n    pass`,
        Java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n    }\n}`,
        "C++": `int maxSubArray(vector<int>& nums) {\n    // Your code here\n}`,
      },
      tags: ["Array", "Dynamic Programming", "Kadane's Algorithm"],
    },
    {
      id: "q_006", title: "LRU Cache", difficulty: "Intermediate",
      category: "DSA", language: ["C++", "Java", "Python", "JavaScript"],
      solveCount: 5123, estimatedTime: "35 min",
      thumbnail: "💾",
      statement: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
      constraints: ["1 ≤ capacity ≤ 3000", "0 ≤ key ≤ 10⁴", "Operations must be O(1) average"],
      examples: [
        { input: 'LRUCache(2), put(1,1), put(2,2), get(1)', output: "1", explanation: "Returns 1" },
        { input: 'put(3,3), get(2)', output: "-1", explanation: "Key 2 was evicted" },
      ],
      starterCode: {
        JavaScript: `class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n  get(key) {}\n  put(key, value) {}\n}`,
        Python: `class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key): pass\n    def put(self, key, value): pass`,
        Java: `class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`,
        "C++": `class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`,
      },
      tags: ["Hash Map", "Doubly Linked List", "Design"],
    },
    {
      id: "q_007", title: "Word Search", difficulty: "Intermediate",
      category: "DSA", language: ["C++", "Java", "Python", "JavaScript"],
      solveCount: 4987, estimatedTime: "30 min",
      thumbnail: "🔤",
      statement: "Given an m×n grid of characters and a string word, return true if word exists in the grid (horizontally or vertically adjacent).",
      constraints: ["1 ≤ m, n ≤ 6", "1 ≤ word.length ≤ 15"],
      examples: [
        { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: "true", explanation: "Word found in grid" },
      ],
      starterCode: {
        JavaScript: `function exist(board, word) {\n  // Your code here\n}`,
        Python: `def exist(board, word):\n    # Your code here\n    pass`,
        Java: `class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Your code here\n    }\n}`,
        "C++": `bool exist(vector<vector<char>>& board, string word) {\n    // Your code here\n}`,
      },
      tags: ["Backtracking", "DFS", "Matrix"],
    },
    {
      id: "q_008", title: "Merge K Sorted Lists", difficulty: "Advanced",
      category: "DSA", language: ["C++", "Java", "Python", "JavaScript"],
      solveCount: 3241, estimatedTime: "40 min",
      thumbnail: "🔀",
      statement: "You are given an array of k linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      constraints: ["0 ≤ k ≤ 10⁴", "0 ≤ lists[i].length ≤ 500", "-10⁴ ≤ lists[i][j] ≤ 10⁴"],
      examples: [
        { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", explanation: "Merged sorted list" },
      ],
      starterCode: {
        JavaScript: `function mergeKLists(lists) {\n  // Your code here\n}`,
        Python: `def merge_k_lists(lists):\n    # Your code here\n    pass`,
        Java: `class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Your code here\n    }\n}`,
        "C++": `ListNode* mergeKLists(vector<ListNode*>& lists) {\n    // Your code here\n}`,
      },
      tags: ["Heap", "Divide & Conquer", "Linked List"],
    },
    {
      id: "q_009", title: "Trapping Rain Water", difficulty: "Advanced",
      category: "DSA", language: ["C++", "Java", "Python", "JavaScript"],
      solveCount: 2876, estimatedTime: "35 min",
      thumbnail: "🌧️",
      statement: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      constraints: ["n == height.length", "1 ≤ n ≤ 2×10⁴", "0 ≤ height[i] ≤ 10⁵"],
      examples: [
        { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "6 units of water trapped" },
        { input: "height = [4,2,0,3,2,5]", output: "9", explanation: "9 units of water trapped" },
      ],
      starterCode: {
        JavaScript: `function trap(height) {\n  // Your code here\n}`,
        Python: `def trap(height):\n    # Your code here\n    pass`,
        Java: `class Solution {\n    public int trap(int[] height) {\n        // Your code here\n    }\n}`,
        "C++": `int trap(vector<int>& height) {\n    // Your code here\n}`,
      },
      tags: ["Two Pointers", "Stack", "Dynamic Programming"],
    },
    {
      id: "q_010", title: "Median of Two Sorted Arrays", difficulty: "Advanced",
      category: "DSA", language: ["C++", "Java", "Python", "JavaScript"],
      solveCount: 2134, estimatedTime: "45 min",
      thumbnail: "➗",
      statement: "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).",
      constraints: ["0 ≤ nums1.length ≤ 1000", "0 ≤ nums2.length ≤ 1000", "Arrays are sorted"],
      examples: [
        { input: "nums1 = [1,3], nums2 = [2]", output: "2.0", explanation: "Merged: [1,2,3], median = 2" },
        { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5", explanation: "Merged: [1,2,3,4], median = 2.5" },
      ],
      starterCode: {
        JavaScript: `function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}`,
        Python: `def find_median_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass`,
        Java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Your code here\n    }\n}`,
        "C++": `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // Your code here\n}`,
      },
      tags: ["Binary Search", "Divide & Conquer"],
    },

    // ── WEB DEV ────────────────────────────────────────────────────
    {
      id: "q_011", title: "Build a Responsive Navbar", difficulty: "Beginner",
      category: "Web Dev", language: ["JavaScript"],
      solveCount: 7432, estimatedTime: "25 min", thumbnail: "🌐",
      statement: "Create a responsive navigation bar that collapses into a hamburger menu on mobile screens.",
      constraints: ["Must work on screens below 768px", "Hamburger toggles menu", "Smooth transition"],
      examples: [
        { input: "width < 768px", output: "Hamburger shown, menu hidden", explanation: "Mobile view" },
        { input: "width >= 768px", output: "Full nav links shown", explanation: "Desktop view" },
      ],
      starterCode: {
        JavaScript: "const hamburger = document.querySelector('.hamburger');\nconst navMenu = document.querySelector('.nav-menu');\n\nfunction toggleMenu() {\n  // Your code here\n}\n\nhamburger.addEventListener('click', toggleMenu);",
      },
      tags: ["HTML", "CSS", "Responsive", "DOM"],
    },
    {
      id: "q_012", title: "Fetch & Display API Data", difficulty: "Beginner",
      category: "Web Dev", language: ["JavaScript"],
      solveCount: 6891, estimatedTime: "20 min", thumbnail: "📡",
      statement: "Write a function that fetches user data from a mock API endpoint and displays it in a card format.",
      constraints: ["Handle loading state", "Handle error gracefully", "Display name, email, avatar"],
      examples: [
        { input: "fetchUser(url)", output: "Card rendered with user data", explanation: "Successful fetch" },
        { input: "Network error", output: "Error message shown", explanation: "Graceful error handling" },
      ],
      starterCode: {
        JavaScript: "async function fetchAndDisplay(url) {\n  const container = document.getElementById('user-container');\n  container.innerHTML = '<p>Loading...</p>';\n  try {\n    // Your fetch code here\n  } catch (error) {\n    // Handle error\n  }\n}",
      },
      tags: ["Fetch API", "Async/Await", "DOM", "Error Handling"],
    },
    {
      id: "q_013", title: "Build a Todo App", difficulty: "Intermediate",
      category: "Web Dev", language: ["JavaScript"],
      solveCount: 5234, estimatedTime: "40 min", thumbnail: "✅",
      statement: "Build a fully functional Todo app with add, delete, complete, and filter functionality. Persist data in localStorage.",
      constraints: ["Add on Enter key", "Filter without page reload", "Data persists on refresh"],
      examples: [
        { input: "Add 'Buy groceries'", output: "Item appears with checkbox", explanation: "Todo added" },
        { input: "Click checkbox", output: "Item marked with strikethrough", explanation: "Todo completed" },
      ],
      starterCode: {
        JavaScript: "const todos = JSON.parse(localStorage.getItem('todos')) || [];\n\nfunction addTodo(text) {\n  // Your code here\n}\n\nfunction deleteTodo(id) {\n  // Your code here\n}\n\nfunction toggleTodo(id) {\n  // Your code here\n}\n\nfunction renderTodos(filter = 'all') {\n  // Your code here\n}\n\nfunction saveTodos() {\n  localStorage.setItem('todos', JSON.stringify(todos));\n}",
      },
      tags: ["localStorage", "CRUD", "DOM", "Filter"],
    },
    {
      id: "q_014", title: "Infinite Scroll", difficulty: "Advanced",
      category: "Web Dev", language: ["JavaScript"],
      solveCount: 2341, estimatedTime: "50 min", thumbnail: "♾️",
      statement: "Implement infinite scroll that loads more content when the user reaches the bottom using IntersectionObserver API.",
      constraints: ["Use IntersectionObserver", "Show loading spinner", "Prevent duplicate fetches"],
      examples: [
        { input: "User scrolls to bottom", output: "Spinner shows, new items load", explanation: "Observer triggered" },
        { input: "Already loading", output: "No duplicate request", explanation: "Guard prevents duplicate" },
      ],
      starterCode: {
        JavaScript: "let page = 1;\nlet loading = false;\nconst sentinel = document.getElementById('sentinel');\n\nconst observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting && !loading) {\n      loadMore();\n    }\n  });\n});\n\nobserver.observe(sentinel);\n\nasync function loadMore() {\n  // Your code here\n}",
      },
      tags: ["IntersectionObserver", "Async", "Performance", "UX"],
    },

    // ── AI ────────────────────────────────────────────────────────
    {
      id: "q_015", title: "Linear Regression from Scratch", difficulty: "Beginner",
      category: "AI", language: ["Python", "JavaScript"],
      solveCount: 4321, estimatedTime: "30 min", thumbnail: "📈",
      statement: "Implement linear regression using gradient descent. Given (x, y) pairs, find the best fit line y = mx + b.",
      constraints: ["Use gradient descent", "Run 1000 iterations", "Return final m and b"],
      examples: [
        { input: "X=[1,2,3,4], y=[2,4,6,8]", output: "m≈2.0, b≈0.0", explanation: "Perfect linear relationship" },
        { input: "X=[1,2,3], y=[1,3,2]", output: "m≈0.5, b≈1.17", explanation: "Best fit with noise" },
      ],
      starterCode: {
        Python: "def linear_regression(X, y, lr=0.01, epochs=1000):\n    m, b = 0, 0\n    n = len(X)\n    for _ in range(epochs):\n        y_pred = [m * x + b for x in X]\n        # Calculate gradients\n        # Your code here\n        # Update parameters\n        # Your code here\n    return m, b",
        JavaScript: "function linearRegression(X, y, lr = 0.01, epochs = 1000) {\n  let m = 0, b = 0;\n  const n = X.length;\n  for (let i = 0; i < epochs; i++) {\n    // Calculate predictions and gradients\n    // Your code here\n  }\n  return { m, b };\n}",
      },
      tags: ["Machine Learning", "Gradient Descent", "Math"],
    },
    {
      id: "q_016", title: "K-Nearest Neighbors", difficulty: "Intermediate",
      category: "AI", language: ["Python"],
      solveCount: 3102, estimatedTime: "40 min", thumbnail: "🎯",
      statement: "Implement KNN classification. Given training data and a new point, classify it based on K nearest neighbors.",
      constraints: ["Use Euclidean distance", "Handle ties by smallest class", "K is a parameter"],
      examples: [
        { input: "train=[(1,1,'A'),(2,2,'B')], point=(1.5,1.5), k=1", output: "Nearest neighbor label", explanation: "KNN classification" },
      ],
      starterCode: {
        Python: "def knn_classify(train_data, new_point, k=3):\n    # Step 1: Calculate distances\n    # Your code here\n    \n    # Step 2: Sort and get k nearest\n    # Your code here\n    \n    # Step 3: Vote for majority label\n    # Your code here\n    pass",
      },
      tags: ["Classification", "Distance", "Supervised Learning"],
    },
    {
      id: "q_017", title: "Neural Network Forward Pass", difficulty: "Advanced",
      category: "AI", language: ["Python"],
      solveCount: 1876, estimatedTime: "60 min", thumbnail: "🧠",
      statement: "Implement the forward pass of a 3-layer neural network (input → hidden → output) using only NumPy.",
      constraints: ["Sigmoid in hidden layer", "Softmax in output layer", "No ML libraries"],
      examples: [
        { input: "X=[0.5,0.3], W1 shape=(2,4), W2 shape=(4,2)", output: "Probability distribution over 2 classes", explanation: "Forward pass" },
      ],
      starterCode: {
        Python: "import numpy as np\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\ndef softmax(z):\n    exp_z = np.exp(z - np.max(z))\n    return exp_z / exp_z.sum()\n\ndef forward_pass(X, W1, b1, W2, b2):\n    # Layer 1\n    # Your code here\n    \n    # Layer 2\n    # Your code here\n    \n    return output",
      },
      tags: ["Neural Networks", "NumPy", "Activation Functions"],
    },

    // ── CYBER ─────────────────────────────────────────────────────
    {
      id: "q_018", title: "Caesar Cipher", difficulty: "Beginner",
      category: "Cyber", language: ["Python", "C"],
      solveCount: 8920, estimatedTime: "15 min", thumbnail: "🔐",
      statement: "Implement the Caesar cipher — a substitution cipher that shifts letters by a fixed number. Support encrypt and decrypt.",
      constraints: ["Handle uppercase and lowercase", "Non-alphabet characters unchanged", "Shift wraps (z+1=a)"],
      examples: [
        { input: "text='Hello', shift=3", output: "'Khoor'", explanation: "Each letter shifted by 3" },
        { input: "text='Khoor', shift=3, decrypt=True", output: "'Hello'", explanation: "Reversed by shifting back" },
      ],
      starterCode: {
        Python: "def caesar_cipher(text, shift, decrypt=False):\n    if decrypt:\n        shift = -shift\n    result = []\n    for char in text:\n        if char.isalpha():\n            # Your code here\n            pass\n        else:\n            result.append(char)\n    return ''.join(result)",
        C: "#include <stdio.h>\n#include <ctype.h>\n\nchar* caesar_cipher(char* text, int shift, int decrypt) {\n    if (decrypt) shift = -shift;\n    // Your code here\n    return text;\n}",
      },
      tags: ["Cryptography", "String", "Encryption"],
    },
    {
      id: "q_019", title: "Password Strength Checker", difficulty: "Intermediate",
      category: "Cyber", language: ["Python", "C"],
      solveCount: 5430, estimatedTime: "25 min", thumbnail: "🛡️",
      statement: "Write a function that evaluates password strength scoring 0-100 based on length, uppercase, digits, and special chars.",
      constraints: ["Min length 8 for any score", "80+ = Strong, 50-79 = Medium, <50 = Weak", "Return score and feedback"],
      examples: [
        { input: "'abc'", output: "Score: 0, Level: Too Short", explanation: "Too short" },
        { input: "'Tr0ub4dor&3'", output: "Score: 95, Level: Strong", explanation: "All criteria met" },
      ],
      starterCode: {
        Python: "def check_password_strength(password):\n    score = 0\n    feedback = []\n    if len(password) < 8:\n        return {'score': 0, 'level': 'Too Short', 'feedback': ['Min 8 characters']}\n    # Check uppercase\n    # Your code here\n    # Check digits\n    # Your code here\n    # Check special chars\n    # Your code here\n    level = 'Strong' if score >= 80 else 'Medium' if score >= 50 else 'Weak'\n    return {'score': score, 'level': level, 'feedback': feedback}",
        C: "#include <string.h>\n#include <ctype.h>\n\nint check_strength(char* password) {\n    int score = 0;\n    int len = strlen(password);\n    if (len < 8) return 0;\n    // Your code here\n    return score;\n}",
      },
      tags: ["Security", "String", "Validation"],
    },
    {
      id: "q_020", title: "Hash Function Analysis", difficulty: "Advanced",
      category: "Cyber", language: ["Python"],
      solveCount: 1654, estimatedTime: "55 min", thumbnail: "🔢",
      statement: "Implement a simple 32-bit hash function and analyze its collision rate across 10,000 random inputs.",
      constraints: ["Output 32-bit hash", "Collision rate < 1% target", "Use polynomial rolling hash"],
      examples: [
        { input: "'hello'", output: "32-bit integer", explanation: "Deterministic hash output" },
        { input: "10000 strings", output: "Collision rate < 1%", explanation: "Good distribution" },
      ],
      starterCode: {
        Python: "def simple_hash(text):\n    hash_val = 0\n    prime = 31\n    MOD = 2**32\n    for char in text:\n        hash_val = (hash_val * prime + ord(char)) % MOD\n    return hash_val\n\ndef analyze_collisions(num_inputs=10000):\n    import random, string\n    hashes = set()\n    collisions = 0\n    for _ in range(num_inputs):\n        s = ''.join(random.choices(string.ascii_lowercase, k=10))\n        h = simple_hash(s)\n        if h in hashes:\n            collisions += 1\n        hashes.add(h)\n    return collisions / num_inputs * 100",
      },
      tags: ["Hashing", "Cryptography", "Analysis"],
    },
  ];

  function getAll() { return QUESTIONS; }
  function getById(id) { return QUESTIONS.find((q) => q.id === id) || null; }
  function getByDifficulty(level) { return QUESTIONS.filter((q) => q.difficulty === level); }
  function getByCategory(cat) { return QUESTIONS.filter((q) => q.category === cat); }
  function getNext(currentId) {
    const idx = QUESTIONS.findIndex((q) => q.id === currentId);
    return idx < QUESTIONS.length - 1 ? QUESTIONS[idx + 1] : null;
  }
  function getPrev(currentId) {
    const idx = QUESTIONS.findIndex((q) => q.id === currentId);
    return idx > 0 ? QUESTIONS[idx - 1] : null;
  }

  return { getAll, getById, getByDifficulty, getByCategory, getNext, getPrev };
})();