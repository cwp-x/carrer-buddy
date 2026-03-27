// js/auth/google-mock.js

const GoogleMock = (() => {
  const FAKE_GOOGLE_USERS = [
    { name: "Aryan Mehta", email: "aryan.mehta@gmail.com" },
    { name: "Priya Sharma", email: "priya.sharma@gmail.com" },
    { name: "Rohan Verma", email: "rohan.verma@gmail.com" },
    { name: "Sneha Patil", email: "sneha.patil@gmail.com" },
    { name: "Karan Joshi", email: "karan.joshi@gmail.com" },
  ];

  function showPopup(onSuccess) {
    // Remove existing popup if any
    const existing = document.getElementById("google-mock-popup");
    if (existing) existing.remove();

    const randomUser =
      FAKE_GOOGLE_USERS[Math.floor(Math.random() * FAKE_GOOGLE_USERS.length)];

    const overlay = document.createElement("div");
    overlay.id = "google-mock-popup";
    overlay.innerHTML = `
      <div class="google-popup-overlay">
        <div class="google-popup-card">
          <div class="google-popup-header">
            <img src="assets/icons/google.svg" alt="Google" width="24" height="24"/>
            <span>Sign in with Google</span>
          </div>
          <div class="google-popup-body">
            <div class="google-account-item" data-email="${randomUser.email}" data-name="${randomUser.name}">
              <div class="google-avatar">${randomUser.name.charAt(0)}</div>
              <div class="google-account-info">
                <div class="google-account-name">${randomUser.name}</div>
                <div class="google-account-email">${randomUser.email}</div>
              </div>
            </div>
            <div class="google-popup-divider"></div>
            <div class="google-use-another">Use another account</div>
          </div>
          <div class="google-popup-footer">
            <button class="google-cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Account click
    overlay.querySelector(".google-account-item").addEventListener("click", () => {
      overlay.remove();
      _handleGoogleLogin(randomUser, onSuccess);
    });

    // Use another account — pick a different random user
    overlay.querySelector(".google-use-another").addEventListener("click", () => {
      overlay.remove();
      const another =
        FAKE_GOOGLE_USERS[Math.floor(Math.random() * FAKE_GOOGLE_USERS.length)];
      _handleGoogleLogin(another, onSuccess);
    });

    // Cancel
    overlay.querySelector(".google-cancel-btn").addEventListener("click", () => {
      overlay.remove();
    });

    // Click outside
    overlay.querySelector(".google-popup-overlay").addEventListener("click", (e) => {
      if (e.target.classList.contains("google-popup-overlay")) overlay.remove();
    });
  }

  function _handleGoogleLogin(googleUser, onSuccess) {
    const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    let user = users.find(
      (u) => u.email.toLowerCase() === googleUser.email.toLowerCase()
    );

    if (!user) {
      user = {
        id: "u_g_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
        name: googleUser.name,
        email: googleUser.email.toLowerCase(),
        password: null,
        role: null,
        plan: null,
        avatar: null,
        appliedJobs: [],
        unlockedContacts: [],
        jobPostsUsed: 0,
        createdAt: Date.now(),
        isGoogleUser: true,
      };
      users.push(user);
      Storage.set(CONFIG.STORAGE_KEYS.USERS, users);
    }

    Session.create(user);
    if (onSuccess) onSuccess(user);
  }

  return { showPopup };
})();