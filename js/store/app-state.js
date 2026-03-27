// js/store/app-state.js

const AppState = (() => {
  let state = {
    currentPage: "home",
    currentUser: null,
    theme: "dark",
    isLoading: false,
    notifications: [],
  };

  const listeners = {};

  function get(key) {
    return key ? state[key] : { ...state };
  }

  function set(key, value) {
    const prev = state[key];
    state[key] = value;
    if (listeners[key]) {
      listeners[key].forEach((fn) => fn(value, prev));
    }
  }

  function subscribe(key, fn) {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(fn);
    return () => {
      listeners[key] = listeners[key].filter((f) => f !== fn);
    };
  }

  function reset() {
    state = {
      currentPage: "home",
      currentUser: null,
      theme: "dark",
      isLoading: false,
      notifications: [],
    };
  }

  return { get, set, subscribe, reset };
})();