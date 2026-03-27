// js/config/config.js

const CONFIG = {
  APP_NAME: "CarrerBuddy",
  VERSION: "1.0.0",
  THEME: {
    DEFAULT: "dark",
    STORAGE_KEY: "cb_theme",
  },
  STORAGE_KEYS: {
    SESSION: "cb_session",
    USERS: "cb_users",
    JOBS: "cb_jobs",
    POSTS: "cb_posts",
    APPLICATIONS: "cb_applications",
    UNLOCKED_CONTACTS: "cb_unlocked_contacts",
    PLAN: "cb_plan",
    THEME: "cb_theme",
    QUESTIONS: "cb_questions",
  },
  PLANS: {
    BASIC: "basic",
    PRO: "pro",
    ADVANCED: "advanced",
  },
  ROLES: {
    JOB_SEEKER: "job_seeker",
    HIRER: "hirer",
  },
  JOBS: {
    MAX_APPLICATIONS: 100,
    GREEN_THRESHOLD: 50,
    YELLOW_THRESHOLD: 99,
  },
  AI: {
    LOADING_DURATION: 2200,
    SCORE_MIN: 60,
    SCORE_MAX: 99,
  },
  PAGINATION: {
    JOBS_PER_PAGE: 9,
    CANDIDATES_PER_PAGE: 9,
    POSTS_PER_PAGE: 10,
  },
};