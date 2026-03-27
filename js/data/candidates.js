// js/data/candidates.js

const CandidatesData = (() => {
  const MOCK_CANDIDATES = [
    {
      id: "c_001", name: "Aarav Singh", role: "Frontend Developer",
      location: "Pune", experience: "2 years",
      skills: ["JavaScript", "React", "CSS", "Node.js"],
      aiScore: 92, codeQuality: 90, uiUx: 94, logic: 91,
      summary: "Strong React developer with excellent UI instincts.",
      verified: true, recentlyActive: true, highDemand: true,
      projectPreview: "E-commerce dashboard with real-time analytics",
      email: "aarav@example.com", phone: "+91 98765 43210",
      github: "github.com/aaravsingh", portfolio: "aarav.dev",
      status: "available", appliedJobIds: ["job_001", "job_005"],
    },
    {
      id: "c_002", name: "Priya Sharma", role: "Data Scientist",
      location: "Mumbai", experience: "3 years",
      skills: ["Python", "ML", "TensorFlow", "SQL", "Tableau"],
      aiScore: 88, codeQuality: 85, uiUx: 78, logic: 93,
      summary: "ML engineer specializing in NLP and recommendation systems.",
      verified: true, recentlyActive: false, highDemand: true,
      projectPreview: "Sentiment analysis engine for e-commerce reviews",
      email: "priya@example.com", phone: "+91 91234 56789",
      github: "github.com/priyasharma", portfolio: "priya.ml",
      status: "available", appliedJobIds: ["job_003"],
    },
    {
      id: "c_003", name: "Rohan Verma", role: "Backend Engineer",
      location: "Bengaluru", experience: "4 years",
      skills: ["Node.js", "MongoDB", "AWS", "Docker", "GraphQL"],
      aiScore: 85, codeQuality: 88, uiUx: 72, logic: 87,
      summary: "Backend specialist with cloud-native architecture expertise.",
      verified: false, recentlyActive: true, highDemand: false,
      projectPreview: "Microservices platform handling 1M+ daily requests",
      email: "rohan@example.com", phone: "+91 99887 76655",
      github: "github.com/rohanverma", portfolio: "",
      status: "available", appliedJobIds: ["job_002"],
    },
    {
      id: "c_004", name: "Sneha Patil", role: "UI/UX Designer",
      location: "Remote", experience: "2 years",
      skills: ["Figma", "Adobe XD", "CSS", "Prototyping", "Research"],
      aiScore: 91, codeQuality: 80, uiUx: 97, logic: 82,
      summary: "Award-winning designer creating accessible, beautiful interfaces.",
      verified: true, recentlyActive: true, highDemand: true,
      projectPreview: "Fintech app redesign with 40% better conversion",
      email: "sneha@example.com", phone: "+91 97654 32109",
      github: "", portfolio: "snehadesigns.com",
      status: "available", appliedJobIds: ["job_004"],
    },
    {
      id: "c_005", name: "Karan Joshi", role: "DevOps Engineer",
      location: "Hyderabad", experience: "5 years",
      skills: ["Kubernetes", "Docker", "CI/CD", "Terraform", "Linux"],
      aiScore: 86, codeQuality: 89, uiUx: 70, logic: 88,
      summary: "DevOps veteran building zero-downtime deployment pipelines.",
      verified: true, recentlyActive: false, highDemand: false,
      projectPreview: "Multi-cloud infra serving 500K+ concurrent users",
      email: "karan@example.com", phone: "+91 95432 10987",
      github: "github.com/karanjoshi", portfolio: "",
      status: "available", appliedJobIds: ["job_005"],
    },
    {
      id: "c_006", name: "Meera Nair", role: "Android Developer",
      location: "Chennai", experience: "3 years",
      skills: ["Kotlin", "Java", "Firebase", "Jetpack Compose"],
      aiScore: 83, codeQuality: 84, uiUx: 86, logic: 81,
      summary: "Android developer with focus on smooth UX and performance.",
      verified: false, recentlyActive: true, highDemand: false,
      projectPreview: "Food delivery app with 4.8★ Play Store rating",
      email: "meera@example.com", phone: "+91 93210 98765",
      github: "github.com/meeranair", portfolio: "",
      status: "available", appliedJobIds: ["job_006"],
    },
    {
      id: "c_007", name: "Dev Anand", role: "AI/ML Engineer",
      location: "Bengaluru", experience: "3 years",
      skills: ["Python", "PyTorch", "NLP", "Computer Vision", "FastAPI"],
      aiScore: 94, codeQuality: 92, uiUx: 75, logic: 96,
      summary: "Deep learning researcher with production AI deployment experience.",
      verified: true, recentlyActive: true, highDemand: true,
      projectPreview: "Real-time object detection system at 60fps",
      email: "dev@example.com", phone: "+91 98001 23456",
      github: "github.com/devanand", portfolio: "devai.io",
      status: "available", appliedJobIds: ["job_008"],
    },
    {
      id: "c_008", name: "Ishaan Kapoor", role: "Cybersecurity Analyst",
      location: "Delhi", experience: "4 years",
      skills: ["Ethical Hacking", "SIEM", "Network Security", "Python"],
      aiScore: 79, codeQuality: 82, uiUx: 68, logic: 84,
      summary: "Certified ethical hacker with enterprise security experience.",
      verified: true, recentlyActive: false, highDemand: false,
      projectPreview: "Vulnerability scanner for enterprise networks",
      email: "ishaan@example.com", phone: "+91 96543 21098",
      github: "github.com/ishaank", portfolio: "",
      status: "available", appliedJobIds: ["job_007"],
    },
    {
      id: "c_009", name: "Tanvi Desai", role: "Product Manager",
      location: "Mumbai", experience: "5 years",
      skills: ["Product Strategy", "Agile", "Analytics", "Figma", "SQL"],
      aiScore: 89, codeQuality: 76, uiUx: 91, logic: 88,
      summary: "Product leader who shipped 3 products from 0 to 1.",
      verified: true, recentlyActive: true, highDemand: true,
      projectPreview: "B2B SaaS product scaling to 10K+ users",
      email: "tanvi@example.com", phone: "+91 94321 09876",
      github: "", portfolio: "tanvipm.com",
      status: "available", appliedJobIds: ["job_009"],
    },
  ];

  function getAll() {
    return MOCK_CANDIDATES;
  }

  function getById(id) {
    return MOCK_CANDIDATES.find((c) => c.id === id) || null;
  }

  function getTopCandidates(threshold = 88) {
    return MOCK_CANDIDATES.filter((c) => c.aiScore >= threshold);
  }

  function getBySkill(skill) {
    return MOCK_CANDIDATES.filter((c) =>
      c.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  function search(query) {
    const q = query.toLowerCase();
    return MOCK_CANDIDATES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)) ||
        c.location.toLowerCase().includes(q)
    );
  }

  function isUnlocked(candidateId) {
    const session = Session.get();
    if (!session) return false;
    const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user = users.find((u) => u.id === session.userId);
    return user && user.unlockedContacts && user.unlockedContacts.includes(candidateId);
  }

  function unlock(candidateId) {
    const session = Session.get();
    if (!session) return { success: false, error: "Not logged in." };

    const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user = users.find((u) => u.id === session.userId);
    if (!user) return { success: false, error: "User not found." };

    const plan = PlansData.getById(user.plan);
    if (!plan) return { success: false, error: "No active plan." };

    const unlocked = user.unlockedContacts || [];
    if (unlocked.includes(candidateId)) return { success: true, alreadyUnlocked: true };

    if (unlocked.length >= plan.limits.contacts) {
      return { success: false, error: `Contact limit reached. Upgrade your plan to unlock more.` };
    }

    const updated = [...unlocked, candidateId];
    Storage.update(CONFIG.STORAGE_KEYS.USERS, (list) =>
      list.map((u) =>
        u.id === session.userId ? { ...u, unlockedContacts: updated } : u
      )
    );
    Session.update({ unlockedContacts: updated });
    return { success: true };
  }

  return { getAll, getById, getTopCandidates, getBySkill, search, isUnlocked, unlock };
})();