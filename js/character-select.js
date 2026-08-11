/* Character select — dialogue / confirm / unlock; depth cards owned by Vue (cs-vue.js) */

(function () {
  const PROFILE_KEY = "home-profile-mode";
  const CHOSEN_KEY = "home-profile-chosen";
  const DIALOGUE = "Choose your character";
  const gate = document.querySelector("[data-realm-select]");
  if (!gate) return;

  const body = document.body;
  const dialogueEl = gate.querySelector("[data-cs-dialogue]");
  const dialogueText = gate.querySelector("[data-cs-dialogue-text]");
  const modal = gate.querySelector("[data-cs-modal]");
  const modalStatus = gate.querySelector("[data-cs-modal-status]");
  const unlock = gate.querySelector("[data-cs-unlock]");
  const fxLayer = gate.querySelector("[data-cs-fx]");
  const stageEl = gate.querySelector("#cs-vue-stage");

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.Mikaelleon = Object.assign(window.Mikaelleon || {}, {
    prefersReducedMotion: reducedMotion,
  });

  let focusedSide = null;
  let hoverTimer = null;
  let locked = false;
  let vueStage = null;

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function setFocused(side) {
    focusedSide = side === "developer" || side === "artist" ? side : null;
    gate.dataset.focused = focusedSide === null ? "null" : focusedSide;
  }

  function applyProfile(mode) {
    const m = mode === "developer" ? "developer" : "artist";
    body.dataset.profile = m;
    localStorage.setItem(PROFILE_KEY, m);
    document.querySelectorAll("[data-profile-copy]").forEach((el) => {
      const val = el.dataset[m];
      if (val != null) el.textContent = val;
    });
  }

  function bootShell() {
    if (window.AppShell?.applyProfileCopy) window.AppShell.applyProfileCopy();
    if (window.AppShell?.setView) {
      const boot = (location.hash || "#home").slice(1);
      const map = { portfolio: "projects", commissions: "home", work: "projects" };
      const id = map[boot] || boot;
      window.AppShell.setView(
        ["home", "about", "projects", "contact"].includes(id) ? id : "home"
      );
    }
  }

  function spawnSparks(originEl, count) {
    if (!fxLayer || reducedMotion()) return;
    const rect = (originEl || gate).getBoundingClientRect();
    const gateRect = gate.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - gateRect.left;
    const cy = rect.top + rect.height / 2 - gateRect.top;
    const n = count || 10;

    for (let i = 0; i < n; i += 1) {
      const spark = document.createElement("span");
      spark.className = "cs-spark animate-cs-spark";
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const dist = 48 + Math.random() * 72;
      spark.style.left = cx + "px";
      spark.style.top = cy + "px";
      spark.style.setProperty("--sx", Math.cos(angle) * dist + "px");
      spark.style.setProperty("--sy", Math.sin(angle) * dist + "px");
      spark.style.animationDelay = Math.random() * 80 + "ms";
      fxLayer.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove(), { once: true });
    }
  }

  function showModal(side) {
    if (!modal || !modalStatus) return;
    modalStatus.textContent =
      side === "developer"
        ? "Entering the Developer wing…"
        : "Entering the Artist wing…";
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    gate.classList.add("is-modal-open");
    modal.classList.add("animate-in");
  }

  function hideModal() {
    if (!modal) return;
    modal.classList.remove("is-flash", "animate-in");
    gate.classList.remove("is-modal-open");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  }

  async function runUnlock() {
    if (!unlock) return;
    unlock.hidden = false;
    unlock.setAttribute("aria-hidden", "false");
    if (modal) modal.classList.add("is-flash");
    const chosen =
      vueStage?.getCardEl?.(
        gate.querySelector(".cs-card.is-confirming")?.dataset.selectProfile
      ) || gate.querySelector(".cs-card.is-confirming .cs-tarot");
    spawnSparks(chosen?.querySelector?.("[data-cs-card]") || chosen, 14);
    await wait(150);
    unlock.classList.add("is-bloom", "is-open");
    body.classList.add("cs-unlocking");
    body.classList.remove("realm-gate");
    bootShell();
    await wait(480);
    hideModal();
    await wait(350);
    unlock.classList.remove("is-bloom", "is-open");
    unlock.hidden = true;
    unlock.setAttribute("aria-hidden", "true");
    body.classList.remove("cs-unlocking");
    gate.classList.add("is-gone");
    gate.classList.remove("is-confirming", "is-modal-open", "is-cards-in");
  }

  async function enterReduced(side) {
    gate.classList.add("is-confirming");
    if (modal && modalStatus) {
      modalStatus.textContent =
        side === "developer"
          ? "Entering the Developer wing…"
          : "Entering the Artist wing…";
      modal.hidden = false;
      gate.classList.add("is-modal-open");
    }
    await wait(120);
    body.classList.remove("realm-gate");
    bootShell();
    await wait(300);
    hideModal();
    gate.classList.add("is-gone");
    gate.classList.remove("is-confirming", "is-modal-open");
    body.classList.remove("cs-unlocking");
  }

  async function selectProfile(mode) {
    if (locked) return;
    locked = true;
    vueStage?.setLocked(true);

    const side = mode === "developer" ? "developer" : "artist";
    setFocused(side);

    vueStage?.setConfirming(side);
    vueStage?.setHot(null);
    vueStage?.resetDepth();

    const chosen =
      vueStage?.getCardEl?.(side)?.querySelector("[data-cs-card]") ||
      gate.querySelector(".cs-card.is-confirming .cs-tarot");
    spawnSparks(chosen, 12);

    applyProfile(side);
    localStorage.setItem(CHOSEN_KEY, "1");

    if (reducedMotion()) {
      await enterReduced(side);
      locked = false;
      vueStage?.setLocked(false);
      return;
    }

    await wait(220);
    gate.classList.add("is-confirming");
    showModal(side);
    await wait(1000);
    await runUnlock();
    locked = false;
    vueStage?.setLocked(false);
  }

  function scheduleFocus(side) {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      if (!locked) setFocused(side);
    }, reducedMotion() ? 0 : 40);
  }

  function clearFocus() {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      if (locked) return;
      const active = document.activeElement;
      const stillOnCard = active && active.closest?.("[data-select-profile]");
      if (stillOnCard) {
        setFocused(stillOnCard.dataset.selectProfile);
        return;
      }
      setFocused(null);
    }, reducedMotion() ? 0 : 40);
  }

  function typeDialogue() {
    return new Promise((resolve) => {
      if (!dialogueEl || !dialogueText) {
        resolve();
        return;
      }
      dialogueEl.classList.add("is-ready");
      if (reducedMotion()) {
        dialogueText.textContent = DIALOGUE;
        resolve();
        return;
      }
      dialogueEl.classList.add("is-typing");
      dialogueText.textContent = "";
      let i = 0;
      const tick = () => {
        dialogueText.textContent = DIALOGUE.slice(0, i);
        i += 1;
        if (i <= DIALOGUE.length) {
          setTimeout(tick, 34);
        } else {
          dialogueEl.classList.remove("is-typing");
          resolve();
        }
      };
      tick();
    });
  }

  async function runEntrance() {
    await wait(120);
    await typeDialogue();
    gate.classList.add("is-cards-in");
  }

  function reopenGate() {
    locked = false;
    vueStage?.setLocked(false);
    vueStage?.setConfirming(null);
    vueStage?.setHot(null);
    vueStage?.resetDepth();
    gate.classList.remove(
      "is-gone",
      "is-confirming",
      "is-modal-open",
      "is-cards-in"
    );
    hideModal();
    if (unlock) {
      unlock.hidden = true;
      unlock.classList.remove("is-bloom", "is-open");
    }
    if (fxLayer) fxLayer.innerHTML = "";
    setFocused(null);
    body.classList.add("realm-gate");
    body.classList.remove("cs-unlocking");
    if (dialogueText) dialogueText.textContent = "";
    if (dialogueEl) {
      dialogueEl.classList.remove("is-ready", "is-typing");
    }
    window.scrollTo({ top: 0 });
    runEntrance();
  }

  document.querySelector("[data-realm-reopen]")?.addEventListener("click", reopenGate);

  window.addEventListener("keydown", (e) => {
    if (!body.classList.contains("realm-gate") || locked) return;
    if (e.key === "1") selectProfile("developer");
    if (e.key === "2") selectProfile("artist");
  });

  if (reducedMotion()) {
    gate.classList.add("cs-reduced");
    gate.querySelector(".cs-bg")?.classList.remove("animate-cs-bg-drift");
  }

  setFocused(null);
  body.classList.add("realm-gate");
  applyProfile(localStorage.getItem(PROFILE_KEY) || "artist");

  if (!window.CsVue?.createStage || !stageEl) {
    console.error("[character-select] Vue stage missing — load vue + cs-vue.js first");
    runEntrance();
    return;
  }

  vueStage = window.CsVue.createStage(stageEl, {
    reducedMotion,
    onSelect: selectProfile,
    onFocusSide: scheduleFocus,
    onClearFocus: clearFocus,
    onHoverSparks: (_id, cardEl) => {
      const face = cardEl?.querySelector("[data-cs-card]");
      if (face) spawnSparks(face, 4);
    },
    onReady: () => {
      runEntrance();
    },
  });
})();
