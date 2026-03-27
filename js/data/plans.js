// js/data/plans.js

const PlansData = (() => {
  const PLANS = [
    {
      id: "basic",
      name: "Basic",
      price: 999,
      period: "mo",
      badge: null,
      color: "#6B7280",
      contacts: 30,
      jobPosts: 2,
      aiLabel: "Basic AI",
      aiDescription: "Standard candidate scoring",
      features: [
        "30 contact unlocks/month",
        "2 job posts/month",
        "Basic AI scoring",
        "Candidate search & filters",
        "Email support",
      ],
      limits: {
        contacts: 30,
        jobPosts: 2,
      },
    },
    {
      id: "pro",
      name: "Pro",
      price: 2999,
      period: "mo",
      badge: "MOST POPULAR",
      color: "#06B6D4",
      contacts: 50,
      jobPosts: 5,
      aiLabel: "Enhanced AI",
      aiDescription: "Deeper candidate analysis",
      features: [
        "50 contact unlocks/month",
        "5 job posts/month",
        "Enhanced AI scoring",
        "Priority candidate listing",
        "Advanced filters",
        "Priority support",
      ],
      limits: {
        contacts: 50,
        jobPosts: 5,
      },
    },
    {
      id: "advanced",
      name: "Advanced",
      price: 4999,
      period: "mo",
      badge: null,
      color: "#8B5CF6",
      contacts: 100,
      jobPosts: 10,
      aiLabel: "Deep AI",
      aiDescription: "Full-spectrum talent intelligence",
      features: [
        "100 contact unlocks/month",
        "10 job posts/month",
        "Deep AI scoring & insights",
        "Top placement in searches",
        "Team collaboration tools",
        "Dedicated account manager",
      ],
      limits: {
        contacts: 100,
        jobPosts: 10,
      },
    },
  ];

  function getAll() {
    return PLANS;
  }

  function getById(id) {
    return PLANS.find((p) => p.id === id) || null;
  }

  function getLimits(planId) {
    const plan = getById(planId);
    return plan ? plan.limits : { contacts: 0, jobPosts: 0 };
  }

  return { getAll, getById, getLimits };
})();