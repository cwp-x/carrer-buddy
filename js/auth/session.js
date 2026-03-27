// js/auth/session.js

const Session = (() => {
  const KEY = CONFIG.STORAGE_KEYS.SESSION;

  function create(userData) {
    const session = {
      userId: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role || null,
      plan: userData.plan || null,
      avatar: userData.avatar || null,
      createdAt: Date.now(),
    };
    Storage.set(KEY, session);
    AppState.set("currentUser", session);
    return session;
  }

  function get() {
    return Storage.get(KEY, null);
  }

  function update(fields) {
    const session = get();
    if (!session) return null;
    const updated = { ...session, ...fields };
    Storage.set(KEY, updated);
    AppState.set("currentUser", updated);
    return updated;
  }

  function destroy() {
    Storage.remove(KEY);
    AppState.set("currentUser", null);
  }

  function isLoggedIn() {
    return get() !== null;
  }

  function hasRole() {
    const s = get();
    return s && s.role !== null;
  }

  function hasPlan() {
    const s = get();
    return s && (s.role === CONFIG.ROLES.JOB_SEEKER || s.plan !== null);
  }

  return { create, get, update, destroy, isLoggedIn, hasRole, hasPlan };
})();