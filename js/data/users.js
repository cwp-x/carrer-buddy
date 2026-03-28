// js/data/users.js

const UsersData = (() => {
  function seedIfEmpty() {
    const existing = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    if (existing.length > 0) return;

    const mockUsers = [
      {
        id: "u_seed_001",
        name: "Aarav Singh",
        email: "aarav@example.com",
        password: "password123",
        role: CONFIG.ROLES.JOB_SEEKER,
        plan: null,
        avatar: null,
        bio: "Passionate full-stack developer",
        skills: ["JavaScript", "React", "Node.js"],
        appliedJobs: [],
        unlockedContacts: [],
        jobPostsUsed: 0,
        problemsSolved: 42,
        streak: 7,
        aiScore: 87,
        createdAt: Date.now() - 86400000 * 10,
      },
      {
        id: "u_seed_002",
        name: "Neha Kulkarni",
        email: "neha@example.com",
        password: "password123",
        role: CONFIG.ROLES.HIRER,
        plan: CONFIG.PLANS.PRO,
        avatar: null,
        company: "TechCorp India",
        bio: "HR Lead at TechCorp",
        unlockedContacts: [],
        jobPostsUsed: 0,   // ← fixed: starts at 0
        appliedJobs: [],
        createdAt: Date.now() - 86400000 * 20,
      },
    ];

    Storage.set(CONFIG.STORAGE_KEYS.USERS, mockUsers);
  }

  function getAll() {
    return Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
  }

  function getById(id) {
    return getAll().find(u => u.id === id) || null;
  }

  function updateUser(id, fields) {
    return Storage.update(CONFIG.STORAGE_KEYS.USERS, users =>
      users.map(u => (u.id === id ? { ...u, ...fields } : u))
    );
  }

  function getCurrentUserFull() {
    const session = Session.get();
    if (!session) return null;
    return getById(session.userId);
  }

  return { seedIfEmpty, getAll, getById, updateUser, getCurrentUserFull };
})();
