// js/components/plan-selector.js

const PlanSelector = (() => {
  function render(container, options = {}) {
    const { onSelect, currentPlan = null, isUpgrade = false } = options;
    const plans = PlansData.getAll();

    container.innerHTML = `
      <div class="plan-selector-wrap">
        <div class="plan-selector-header">
          <h2 class="plan-selector-title">
            ${isUpgrade ? "Upgrade Your Plan" : "Choose Your Plan"}
          </h2>
          <p class="plan-selector-sub">
            ${isUpgrade
              ? "Unlock more contacts and job posts to find the best talent faster."
              : "Select a plan to start discovering top candidates."}
          </p>
        </div>
        <div class="plans-grid">
          ${plans.map(plan => _renderPlanCard(plan, currentPlan)).join("")}
        </div>
        ${isUpgrade ? `<button class="btn-plan-cancel" id="plan-cancel">Cancel</button>` : ""}
      </div>
    `;

    container.querySelectorAll(".plan-card").forEach(card => {
      card.addEventListener("click", () => {
        const planId = card.dataset.planId;
        if (planId === currentPlan && !isUpgrade) return;

        container.querySelectorAll(".plan-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");

        setTimeout(() => {
          _confirmSelect(planId, onSelect);
        }, 200);
      });
    });

    container.querySelector("#plan-cancel")?.addEventListener("click", () => {
      const modal = document.getElementById("plan-upgrade-modal");
      if (modal) modal.remove();
    });
  }

  function _renderPlanCard(plan, currentPlan) {
    const isCurrent = plan.id === currentPlan;
    const isPopular = plan.badge === "MOST POPULAR";

    return `
      <div class="plan-card ${isCurrent ? "plan-card-current" : ""} ${isPopular ? "plan-card-popular" : ""}"
        data-plan-id="${plan.id}" style="--plan-color:${plan.color}">
        ${isPopular ? `<div class="plan-popular-badge">⭐ MOST POPULAR</div>` : ""}
        ${isCurrent ? `<div class="plan-current-badge">Current Plan</div>` : ""}

        <div class="plan-card-header">
          <h3 class="plan-name" style="color:${plan.color}">${plan.name}</h3>
          <div class="plan-price">
            <span class="plan-currency">₹</span>
            <span class="plan-amount">${plan.price.toLocaleString()}</span>
            <span class="plan-period">/${plan.period}</span>
          </div>
          <div class="plan-ai-label" style="color:${plan.color}">${plan.aiLabel}</div>
        </div>

        <div class="plan-highlights">
          <div class="plan-highlight-item">
            <span class="plan-highlight-value" style="color:${plan.color}">${plan.contacts}</span>
            <span class="plan-highlight-label">Contact Unlocks</span>
          </div>
          <div class="plan-highlight-divider"></div>
          <div class="plan-highlight-item">
            <span class="plan-highlight-value" style="color:${plan.color}">${plan.jobPosts}</span>
            <span class="plan-highlight-label">Job Posts</span>
          </div>
        </div>

        <ul class="plan-features">
          ${plan.features.map(f => `
            <li class="plan-feature-item">
              <svg width="14" height="14" fill="none" stroke="${plan.color}" stroke-width="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              ${f}
            </li>
          `).join("")}
        </ul>

        <button class="btn-select-plan ${isCurrent ? "btn-plan-active" : ""}"
          style="background:${isPopular ? plan.color : "transparent"};
                 border:1.5px solid ${plan.color};
                 color:${isPopular ? "#fff" : plan.color}">
          ${isCurrent ? "Current Plan" : "Select Plan"}
        </button>
      </div>
    `;
  }

  function _confirmSelect(planId, onSelect) {
    const plan = PlansData.getById(planId);
    if (!plan) return;

    const session = Session.get();
    if (!session) return;

    // Update user plan in storage
    Storage.update(CONFIG.STORAGE_KEYS.USERS, users =>
      users.map(u => u.id === session.userId ? { ...u, plan: planId } : u)
    );
    Session.update({ plan: planId });

    if (onSelect) onSelect(planId, plan);
  }

  function showUpgradeModal(onSuccess) {
    const existing = document.getElementById("plan-upgrade-modal");
    if (existing) existing.remove();

    const session = Session.get();
    const modal = document.createElement("div");
    modal.id = "plan-upgrade-modal";
    modal.className = "modal-overlay";

    const inner = document.createElement("div");
    inner.className = "modal-card upgrade-modal-card";
    modal.appendChild(inner);
    document.body.appendChild(modal);

    PlanSelector.render(inner, {
      currentPlan: session?.plan,
      isUpgrade: true,
      onSelect: (planId, plan) => {
        modal.remove();
        Toast.show(`Upgraded to ${plan.name} plan! ✓`, "success");
        if (onSuccess) onSuccess(planId, plan);
      },
    });

    modal.addEventListener("click", e => {
      if (e.target === modal) modal.remove();
    });
  }

  return { render, showUpgradeModal };
})();