// js/auth/signup.js

const Signup = (() => {
  function attempt(name, email, password, confirmPassword) {
    if (!name || !email || !password || !confirmPassword) {
      return { success: false, error: "Please fill in all fields." };
    }

    if (name.trim().length < 2) {
      return { success: false, error: "Name must be at least 2 characters." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match." };
    }

    const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const exists = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser = {
      id: "u_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: null,
      plan: null,
      avatar: null,
      appliedJobs: [],
      unlockedContacts: [],
      jobPostsUsed: 0,
      createdAt: Date.now(),
    };

    users.push(newUser);
    Storage.set(CONFIG.STORAGE_KEYS.USERS, users);
    Session.create(newUser);

    return { success: true, user: newUser };
  }

  return { attempt };
})();