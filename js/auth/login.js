// js/auth/login.js

const Login = (() => {
  function attempt(email, password) {
    if (!email || !password) {
      return { success: false, error: "Please fill in all fields." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    Session.create(user);
    return { success: true, user };
  }

  function logout() {
    Session.destroy();
    AppState.reset();
    Navigate.to("auth");
  }

  return { attempt, logout };
})();