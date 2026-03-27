// js/data/posts.js

const PostsData = (() => {
  const SEED_POSTS = [
    {
      id: "post_001",
      authorId: "u_seed_001",
      authorName: "Aarav Singh",
      authorRole: "job_seeker",
      type: "achievement",
      content: "Just solved my 100th DSA problem on CarrerBuddy! 🎉 Consistency is key. Keep grinding everyone!",
      likes: 42, comments: 8, shares: 5,
      tags: ["DSA", "Achievement", "Coding"],
      createdAt: Date.now() - 3600000 * 5,
    },
    {
      id: "post_002",
      authorId: "u_seed_002",
      authorName: "TechCorp India",
      authorRole: "hirer",
      type: "hiring",
      content: "🚀 We're hiring! Looking for a talented Frontend Developer to join our growing team in Pune. Apply now and showcase your skills through our AI-powered evaluation.",
      likes: 89, comments: 23, shares: 31,
      tags: ["Hiring", "Frontend", "Pune"],
      createdAt: Date.now() - 3600000 * 12,
    },
    {
      id: "post_003",
      authorId: "u_seed_001",
      authorName: "Aarav Singh",
      authorRole: "job_seeker",
      type: "progress",
      content: "Week 3 of learning React hooks. Finally understanding useEffect properly! Built a real-time search filter from scratch. Check out my project! 💪",
      likes: 31, comments: 12, shares: 7,
      tags: ["React", "Learning", "WebDev"],
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: "post_004",
      authorId: "u_seed_002",
      authorName: "TechCorp India",
      authorRole: "hirer",
      type: "announcement",
      content: "Excited to announce that CarrerBuddy's AI evaluation system helped us reduce hiring time by 60%! The quality of candidates has been exceptional. #FutureOfHiring",
      likes: 156, comments: 34, shares: 67,
      tags: ["AI", "Hiring", "Announcement"],
      createdAt: Date.now() - 86400000 * 4,
    },
    {
      id: "post_005",
      authorId: "u_seed_001",
      authorName: "Aarav Singh",
      authorRole: "job_seeker",
      type: "achievement",
      content: "Got my AI score to 87%! The feedback on code quality helped me refactor my projects significantly. Feeling job-ready! 🔥",
      likes: 67, comments: 19, shares: 11,
      tags: ["AIScore", "Progress", "JobReady"],
      createdAt: Date.now() - 86400000 * 6,
    },
  ];

  function seedIfEmpty() {
    const existing = Storage.get(CONFIG.STORAGE_KEYS.POSTS, []);
    if (existing.length === 0) {
      Storage.set(CONFIG.STORAGE_KEYS.POSTS, SEED_POSTS);
    }
  }

  function getAll() {
    return Storage.get(CONFIG.STORAGE_KEYS.POSTS, []).sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }

  function create(postData) {
    const session = Session.get();
    if (!session) return null;

    const newPost = {
      id: "post_" + Date.now(),
      authorId: session.userId,
      authorName: session.name,
      authorRole: session.role,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: Date.now(),
      likedBy: [],
      ...postData,
    };

    Storage.update(CONFIG.STORAGE_KEYS.POSTS, (posts) => [newPost, ...posts]);
    return newPost;
  }

  function toggleLike(postId) {
    const session = Session.get();
    if (!session) return;

    Storage.update(CONFIG.STORAGE_KEYS.POSTS, (posts) =>
      posts.map((p) => {
        if (p.id !== postId) return p;
        const likedBy = p.likedBy || [];
        const hasLiked = likedBy.includes(session.userId);
        return {
          ...p,
          likes: hasLiked ? p.likes - 1 : p.likes + 1,
          likedBy: hasLiked
            ? likedBy.filter((id) => id !== session.userId)
            : [...likedBy, session.userId],
        };
      })
    );
  }

  function hasLiked(postId) {
    const session = Session.get();
    if (!session) return false;
    const posts = getAll();
    const post = posts.find((p) => p.id === postId);
    return post && (post.likedBy || []).includes(session.userId);
  }

  function timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  }

  return { seedIfEmpty, getAll, create, toggleLike, hasLiked, timeAgo };
})();