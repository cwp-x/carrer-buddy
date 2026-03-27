// js/utils/storage.js

const Storage = (() => {
  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Storage.set error:", e);
      return false;
    }
  }

  function get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error("Storage.get error:", e);
      return fallback;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  function clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  }

  function exists(key) {
    return localStorage.getItem(key) !== null;
  }

  function update(key, updaterFn, fallback = {}) {
    const current = get(key, fallback);
    const updated = updaterFn(current);
    set(key, updated);
    return updated;
  }

  return { set, get, remove, clear, exists, update };
})();