// js/pages/posts-page.js

const PostsPage = (() => {
  function render(container) {
    const session = Session.get();
    const isHirer = session?.role === CONFIG.ROLES.HIRER;

    container.innerHTML = `
      <div class="page-wrap posts-page">
        <div class="page-header">
          <div>
            <h1 class="page-title">Community Feed</h1>
            <p class="page-sub">Updates, achievements & hiring news</p>
          </div>
        </div>

        <div class="posts-layout">
          <div class="posts-main">
            <div class="create-post-card" id="create-post-trigger">
              <div class="create-post-avatar">${session?.name?.charAt(0) || "?"}</div>
              <div class="create-post-input-fake">
                ${isHirer ? "Share a hiring update or announcement..." : "Share your progress or achievement..."}
              </div>
              <button class="btn-create-post">+ Post</button>
            </div>

            <div class="posts-filter-row">
              <button class="chip chip-active" data-filter="all">All</button>
              <button class="chip" data-filter="hiring">Hiring</button>
              <button class="chip" data-filter="achievement">Achievements</button>
              <button class="chip" data-filter="progress">Progress</button>
            </div>

            <div class="posts-feed" id="posts-feed"></div>
          </div>

          <div class="posts-sidebar">
            <div class="sidebar-card">
              <h3 class="sidebar-card-title">Trending Tags</h3>
              <div class="trending-tags">
                ${["#DSA","#Hiring","#React","#AIScore","#WebDev","#Python","#Achievement","#Remote"]
                  .map(t => `<span class="post-tag trending-tag-item">${t}</span>`).join("")}
              </div>
            </div>
            <div class="sidebar-card" style="margin-top:1rem">
              <h3 class="sidebar-card-title">Your Stats</h3>
              <div class="sidebar-stats">
                <div class="sidebar-stat-row">
                  <span>Posts</span>
                  <span class="accent-text">${_getUserPostCount(session)}</span>
                </div>
                <div class="sidebar-stat-row">
                  <span>Role</span>
                  <span class="accent-text">${isHirer ? "Hirer" : "Job Seeker"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    _renderFeed(container, "all");
    _bindEvents(container, session);
  }

  function _renderFeed(container, filter) {
    const feed = container.querySelector("#posts-feed");
    if (!feed) return;
    let posts = PostsData.getAll();
    if (filter !== "all") posts = posts.filter(p => p.type === filter);
    feed.innerHTML = "";
    if (posts.length === 0) {
      feed.innerHTML = `<div class="empty-state"><div class="empty-icon">💬</div><p>No posts yet. Be the first!</p></div>`;
      return;
    }
    posts.forEach(p => feed.appendChild(PostCard.render(p)));
  }

  function _getUserPostCount(session) {
    if (!session) return 0;
    return PostsData.getAll().filter(p => p.authorId === session.userId).length;
  }

  function _bindEvents(container, session) {
    container.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        container.querySelectorAll(".chip").forEach(c => c.classList.remove("chip-active"));
        chip.classList.add("chip-active");
        _renderFeed(container, chip.dataset.filter);
      });
    });

    const trigger = container.querySelector("#create-post-trigger");
    trigger?.addEventListener("click", () => _showCreatePostModal(container, session));
    container.querySelector(".btn-create-post")?.addEventListener("click", (e) => {
      e.stopPropagation();
      _showCreatePostModal(container, session);
    });
  }

  function _showCreatePostModal(container, session) {
    const existing = document.getElementById("create-post-modal");
    if (existing) existing.remove();

    const isHirer = session?.role === CONFIG.ROLES.HIRER;
    const types = isHirer
      ? ["hiring", "announcement", "general"]
      : ["achievement", "progress", "general"];

    const modal = document.createElement("div");
    modal.id = "create-post-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-card create-post-modal-card">
        <button class="modal-close" id="close-create-post">✕</button>
        <h2 class="modal-title">Create a Post</h2>
        <div class="create-post-type-row">
          ${types.map((t, i) => `
            <button class="post-type-btn ${i === 0 ? "active" : ""}" data-type="${t}">
              ${_typeEmoji(t)} ${_capitalize(t)}
            </button>
          `).join("")}
        </div>
        <textarea class="form-input form-textarea create-post-textarea" id="post-content"
          rows="5" placeholder="What's on your mind? Share your progress, hiring news, or achievements..."></textarea>
        <div class="form-group">
          <label class="form-label">Tags (comma separated, optional)</label>
          <input class="form-input" id="post-tags" placeholder="DSA, React, Hiring..."/>
        </div>
        <div class="create-post-footer">
          <span class="post-char-count" id="post-char-count">0/280</span>
          <button class="btn-auth-submit" id="submit-post" style="width:auto;padding:0.6rem 1.8rem">
            Publish Post
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    let selectedType = types[0];

    modal.querySelectorAll(".post-type-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        modal.querySelectorAll(".post-type-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedType = btn.dataset.type;
      });
    });

    const textarea = modal.querySelector("#post-content");
    textarea?.addEventListener("input", () => {
      const count = modal.querySelector("#post-char-count");
      if (count) count.textContent = `${textarea.value.length}/280`;
    });

    modal.querySelector("#close-create-post")?.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

    modal.querySelector("#submit-post")?.addEventListener("click", () => {
      const content = textarea?.value?.trim();
      if (!content || content.length < 5) {
        Toast.show("Please write something before posting.", "error"); return;
      }
      if (content.length > 280) {
        Toast.show("Post is too long (max 280 characters).", "error"); return;
      }
      const tagsRaw = modal.querySelector("#post-tags")?.value || "";
      const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
      PostsData.create({ content, type: selectedType, tags });
      modal.remove();
      Toast.show("Post published! 🎉", "success");
      _renderFeed(container, "all");
    });
  }

  function _typeEmoji(type) {
    const map = { hiring: "🚀", announcement: "📢", achievement: "🏆", progress: "📈", general: "💬" };
    return map[type] || "💬";
  }

  function _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return { render };
})();