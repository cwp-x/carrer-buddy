// js/components/post-card.js

const PostCard = (() => {
  const TYPE_CONFIG = {
    hiring:       { icon: "🚀", label: "Hiring",       color: "#06B6D4" },
    achievement:  { icon: "🏆", label: "Achievement",  color: "#F59E0B" },
    progress:     { icon: "📈", label: "Progress",     color: "#10B981" },
    announcement: { icon: "📢", label: "Announcement", color: "#8B5CF6" },
    general:      { icon: "💬", label: "Post",         color: "#9CA3AF" },
  };

  function render(post) {
    const tc = TYPE_CONFIG[post.type] || TYPE_CONFIG.general;
    const liked = PostsData.hasLiked(post.id);
    const timeAgo = PostsData.timeAgo(post.createdAt);
    const isHirer = post.authorRole === CONFIG.ROLES.HIRER;

    const card = document.createElement("div");
    card.className = "post-card";
    card.dataset.postId = post.id;

    card.innerHTML = `
      <div class="post-card-header">
        <div class="post-author-wrap">
          <div class="post-avatar" style="background:${isHirer ? "rgba(6,182,212,0.2)" : "rgba(139,92,246,0.2)"}">
            ${post.authorName.charAt(0)}
          </div>
          <div class="post-author-info">
            <span class="post-author-name">${post.authorName}</span>
            <span class="post-author-meta">
              <span class="post-role-badge" style="color:${isHirer ? "#06B6D4" : "#8B5CF6"}">
                ${isHirer ? "Hirer" : "Job Seeker"}
              </span>
              · ${timeAgo}
            </span>
          </div>
        </div>
        <span class="post-type-badge" style="background:${tc.color}22;color:${tc.color}">
          ${tc.icon} ${tc.label}
        </span>
      </div>

      <div class="post-content">${_formatContent(post.content)}</div>

      ${post.tags && post.tags.length > 0 ? `
        <div class="post-tags">
          ${post.tags.map(t => `<span class="post-tag">#${t}</span>`).join("")}
        </div>
      ` : ""}

      <div class="post-card-footer">
        <div class="post-actions">
          <button class="post-action-btn like-btn ${liked ? "liked" : ""}" data-post-id="${post.id}">
            <svg width="16" height="16" fill="${liked ? "currentColor" : "none"}"
              stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="like-count">${post.likes}</span>
          </button>
          <button class="post-action-btn comment-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>${post.comments}</span>
          </button>
          <button class="post-action-btn share-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span>${post.shares}</span>
          </button>
        </div>
      </div>
    `;

    card.querySelector(".like-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      PostsData.toggleLike(post.id);
      const btn = card.querySelector(".like-btn");
      const countEl = btn.querySelector(".like-count");
      const isNowLiked = PostsData.hasLiked(post.id);
      btn.classList.toggle("liked", isNowLiked);
      btn.querySelector("svg").setAttribute("fill", isNowLiked ? "currentColor" : "none");
      const updated = PostsData.getAll().find(p => p.id === post.id);
      if (updated) countEl.textContent = updated.likes;
    });

    card.querySelector(".comment-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      Toast.show("Comments coming soon!", "info");
    });

    card.querySelector(".share-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      Toast.show("Post link copied!", "success");
    });

    return card;
  }

  function _formatContent(text) {
    return text
      .replace(/\n/g, "<br>")
      .replace(/#(\w+)/g, '<span class="inline-tag">#$1</span>');
  }

  return { render };
})();