// js/data/jobs.js

const JobsData = (() => {
  const SEED_JOBS = [
    {
      id: "job_001", title: "Frontend Developer", company: "TechCorp India",
      location: "Pune", type: "Full-time", remote: true,
      skills: ["HTML", "CSS", "JavaScript", "React"],
      description: "Build modern web interfaces for our SaaS platform.",
      salary: "₹6L – ₹10L", applications: 38, maxApplications: 100,
      postedBy: "u_seed_002", status: "active",
      postedAt: Date.now() - 86400000 * 2,
    },
    {
      id: "job_002", title: "Backend Engineer", company: "Infosys",
      location: "Bengaluru", type: "Full-time", remote: false,
      skills: ["Node.js", "MongoDB", "Express", "AWS"],
      description: "Develop scalable APIs and microservices.",
      salary: "₹8L – ₹14L", applications: 72, maxApplications: 100,
      postedBy: "u_seed_002", status: "active",
      postedAt: Date.now() - 86400000 * 5,
    },
    {
      id: "job_003", title: "Data Scientist", company: "Analytics Hub",
      location: "Mumbai", type: "Full-time", remote: true,
      skills: ["Python", "ML", "TensorFlow", "SQL"],
      description: "Build ML models and data pipelines.",
      salary: "₹10L – ₹18L", applications: 100, maxApplications: 100,
      postedBy: "u_seed_002", status: "closed",
      postedAt: Date.now() - 86400000 * 8,
    },
    {
      id: "job_004", title: "UI/UX Designer", company: "DesignStudio",
      location: "Remote", type: "Contract", remote: true,
      skills: ["Figma", "Adobe XD", "Prototyping"],
      description: "Design intuitive user experiences.",
      salary: "₹5L – ₹8L", applications: 55, maxApplications: 100,
      postedBy: "u_seed_002", status: "active",
      postedAt: Date.now() - 86400000 * 3,
    },
    {
      id: "job_005", title: "DevOps Engineer", company: "CloudBase",
      location: "Hyderabad", type: "Full-time", remote: false,
      skills: ["Docker", "Kubernetes", "CI/CD", "Linux"],
      description: "Manage cloud infrastructure and deployments.",
      salary: "₹9L – ₹15L", applications: 21, maxApplications: 100,
      postedBy: "u_seed_002", status: "active",
      postedAt: Date.now() - 86400000 * 1,
    },
    {
      id: "job_006", title: "Android Developer", company: "AppWorks",
      location: "Pune", type: "Full-time", remote: true,
      skills: ["Kotlin", "Java", "Android SDK", "Firebase"],
      description: "Build high-performance Android applications.",
      salary: "₹7L – ₹12L", applications: 44, maxApplications: 100,
      postedBy: "u_seed_002", status: "active",
      postedAt: Date.now() - 86400000 * 4,
    },
    {
      id: "job_007", title: "Cybersecurity Analyst", company: "SecureNet",
      location: "Delhi", type: "Full-time", remote: false,
      skills: ["Network Security", "Ethical Hacking", "SIEM"],
      description: "Protect systems from cyber threats.",
      salary: "₹8L – ₹13L", applications: 88, maxApplications: 100,
      postedBy: "u_seed_002", status: "active",
      postedAt: Date.now() - 86400000 * 6,
    },
    {
      id: "job_008", title: "AI/ML Engineer", company: "DeepMind Labs",
      location: "Bengaluru", type: "Full-time", remote: true,
      skills: ["Python", "PyTorch", "NLP", "Deep Learning"],
      description: "Research and deploy AI models at scale.",
      salary: "₹15L – ₹25L", applications: 12, maxApplications: 100,
      postedBy: "u_seed_002", status: "active",
      postedAt: Date.now() - 86400000 * 1,
    },
    {
      id: "job_009", title: "Product Manager", company: "GrowthBase",
      location: "Mumbai", type: "Full-time", remote: true,
      skills: ["Product Strategy", "Agile", "Analytics", "Roadmapping"],
      description: "Lead product vision and cross-functional teams.",
      salary: "₹12L – ₹20L", applications: 63, maxApplications: 100,
      postedBy: "u_seed_002", status: "active",
      postedAt: Date.now() - 86400000 * 7,
    },
  ];

  function seedIfEmpty() {
    const existing = Storage.get(CONFIG.STORAGE_KEYS.JOBS, []);
    if (existing.length === 0) {
      Storage.set(CONFIG.STORAGE_KEYS.JOBS, SEED_JOBS);
    }
  }

  function getAll() {
    return Storage.get(CONFIG.STORAGE_KEYS.JOBS, []);
  }

  function getById(id) {
    return getAll().find((j) => j.id === id) || null;
  }

  function getColor(applications) {
    if (applications >= CONFIG.JOBS.MAX_APPLICATIONS) return "red";
    if (applications >= CONFIG.JOBS.GREEN_THRESHOLD) return "yellow";
    return "green";
  }

  function apply(jobId, userId) {
    const jobs = getAll();
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, error: "Job not found." };
    if (job.applications >= CONFIG.JOBS.MAX_APPLICATIONS)
      return { success: false, error: "This job is closed." };

    const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, error: "User not found." };
    if (user.appliedJobs && user.appliedJobs.includes(jobId))
      return { success: false, error: "Already applied." };

    // Increment applications
    Storage.update(CONFIG.STORAGE_KEYS.JOBS, (list) =>
      list.map((j) =>
        j.id === jobId
          ? { ...j, applications: j.applications + 1,
              status: j.applications + 1 >= 100 ? "closed" : j.status }
          : j
      )
    );

    // Update user applied jobs
    Storage.update(CONFIG.STORAGE_KEYS.USERS, (list) =>
      list.map((u) =>
        u.id === userId
          ? { ...u, appliedJobs: [...(u.appliedJobs || []), jobId] }
          : u
      )
    );

    Session.update({ appliedJobs: [...(user.appliedJobs || []), jobId] });
    return { success: true };
  }

  function addJob(jobData) {
    const jobs = getAll();
    const newJob = {
      id: "job_" + Date.now(),
      applications: 0,
      maxApplications: 100,
      status: "active",
      postedAt: Date.now(),
      ...jobData,
    };
    jobs.push(newJob);
    Storage.set(CONFIG.STORAGE_KEYS.JOBS, jobs);
    return newJob;
  }

  function getByPoster(userId) {
    return getAll().filter((j) => j.postedBy === userId);
  }

  return { seedIfEmpty, getAll, getById, getColor, apply, addJob, getByPoster };
})();