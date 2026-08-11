/* Commissions page — builder, catalog, cart, checkout (IIFE) */
(function () {
  const D = window.CommissionData;
  if (!D) return;

  const root = document.querySelector("[data-comm-root]");
  if (!root) return;

  const CART_KEY = "commission-cart";
  const CURRENCY_KEY = "commission-currency";
  const PAYMENT_KEY = "commission-payment";
  const ORDER_KEY = "commission-last-order-id";
  const CART_TTL_MS = 7 * 24 * 60 * 60 * 1000;
  const OTHERS_MAX_USD = 15;
  const TABS = ["builder", "custom_bundle", "regular", "character", "bundle"];
  const TAB_LABELS = {
    builder: { short: "Build", full: "Builder" },
    custom_bundle: { short: "Custom", full: "Custom Bundle" },
    regular: { short: "Regular", full: "Regular" },
    character: { short: "Char", full: "Character" },
    bundle: { short: "Bundle", full: "Bundle" },
  };
  const BUILDER_STEPS = ["Illustration", "Type", "Rendering", "Summary"];
  const POSE_OPTS = [
    { id: "user-selected", label: "I choose poses" },
    { id: "artist-designed", label: "Artist designs poses" },
  ];
  const DELIVERABLES = "High-resolution PNG file + optional web-ready version.";

  const els = {
    stepper: root.querySelector("[data-comm-stepper]"),
    progress: root.querySelector("[data-comm-progress]"),
    step0: root.querySelector("[data-step0]"),
    step1: root.querySelector("[data-step1]"),
    success: root.querySelector("[data-success]"),
    tabs: root.querySelector("[data-comm-tabs]"),
    panels: root.querySelector("[data-tab-panels]"),
    builder: root.querySelector("[data-builder-root]"),
    preview: null,
    summary: root.querySelector("[data-order-summary]"),
    mobileBar: root.querySelector("[data-mobile-bar]"),
    dlgGuidelines: document.getElementById("dlg-guidelines"),
    dlgTos: document.getElementById("dlg-tos"),
    dlgSurprise: document.getElementById("dlg-surprise"),
  };

  function uid() {
    return "c" + Math.random().toString(36).slice(2, 10);
  }

  function detectDefaultCurrency() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz === "Asia/Manila") return "PHP";
    } catch (_) {}
    try {
      if ((navigator.language || "").toLowerCase().includes("-ph")) return "PHP";
    } catch (_) {}
    return "USD";
  }

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "null");
      if (!raw || !Array.isArray(raw.items)) return { items: [], updatedAt: Date.now() };
      if (Date.now() - (raw.updatedAt || 0) > CART_TTL_MS) {
        localStorage.removeItem(CART_KEY);
        return { items: [], updatedAt: Date.now() };
      }
      return { items: raw.items, updatedAt: raw.updatedAt };
    } catch (_) {
      return { items: [], updatedAt: Date.now() };
    }
  }

  function saveCart() {
    state.cart.updatedAt = Date.now();
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
  }

  function clearCartStorage() {
    state.cart = { items: [], updatedAt: Date.now() };
    localStorage.removeItem(CART_KEY);
  }

  function tabFromHash() {
    const m = (location.hash || "").match(/^#tab-([\w_]+)$/);
    const id = m && TABS.includes(m[1]) ? m[1] : "builder";
    return id;
  }

  function syncHash(tab) {
    const next = "#tab-" + tab;
    if (location.hash !== next) history.replaceState(null, "", next);
  }

  function toast(msg) {
    const el = document.querySelector("[data-toast]");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 3200);
  }

  function emptyModular() {
    return {
      illustrationTypeId: null,
      commissionTypeId: null,
      renderingStyleId: null,
      doodlePackageId: undefined,
      poseDirection: undefined,
    };
  }

  const state = {
    step: 0,
    tab: tabFromHash(),
    builderStep: 0,
    modularConfig: emptyModular(),
    skebTermsAccepted: false,
    pendingBundleItems: [],
    bundleBuilderStep: 0,
    bundleModularConfig: emptyModular(),
    bundleSkebTermsAccepted: false,
    cart: loadCart(),
    currency: localStorage.getItem(CURRENCY_KEY) || detectDefaultCurrency(),
    payment: localStorage.getItem(PAYMENT_KEY) || "",
    discount: null,
    discountError: "",
    agreedDos: false,
    agreedTerms: false,
    lastOrderId: sessionStorage.getItem(ORDER_KEY) || "",
    selectedCatalogId: null,
    agreeError: false,
  };

  if (!["USD", "PHP", "Others"].includes(state.currency)) state.currency = "USD";
  ensurePaymentValid();

  function ensurePaymentValid() {
    const opts = D.payments[state.currency] || [];
    if (!opts.some((p) => p.id === state.payment)) {
      state.payment = "";
      localStorage.removeItem(PAYMENT_KEY);
    }
  }

  function cartItem() {
    return state.cart.items[0] || null;
  }

  function replaceCart(item) {
    state.cart.items = [item];
    saveCart();
  }

  function lineLabel(item) {
    if (!item) return "";
    if (item.typeId === "modular" && item.modularConfig) return D.getModularLabel(item.modularConfig);
    if (item.typeId === "custom_bundle") {
      return "Custom Bundle (" + (item.bundleItems?.length || 0) + " items)";
    }
    return D.findCatalogType(item.typeId)?.name || item.typeId;
  }

  function previewKey() {
    const item = cartItem();
    if (item?.modularConfig) return D.getModularPreviewKey(item.modularConfig);
    if (item?.typeId && item.typeId !== "custom_bundle" && item.typeId !== "modular") return item.typeId;
    if (state.tab === "builder" || state.tab === "custom_bundle") {
      const cfg = state.tab === "custom_bundle" ? state.bundleModularConfig : state.modularConfig;
      return D.getModularPreviewKey(cfg);
    }
    if (state.selectedCatalogId) return state.selectedCatalogId;
    return null;
  }

  function fileSpec(cfg) {
    if (!cfg?.commissionTypeId) return "—";
    if (cfg.commissionTypeId === "doodlepage" && cfg.doodlePackageId) {
      return D.find(D.doodlePackages, cfg.doodlePackageId)?.dims || "—";
    }
    return D.find(D.commissionTypes, cfg.commissionTypeId)?.file || "—";
  }

  function money(n) {
    return D.formatMoney(n, state.currency === "Others" ? "Others" : state.currency);
  }

  function moneyUsdPhp(usd, php) {
    return D.formatMoney(usd, "USD") + " · " + D.formatMoney(php, "PHP");
  }

  function orderWouldExceedOthers(items) {
    const totals = D.orderTotals(items, "USD", state.discount);
    return totals.total > OTHERS_MAX_USD;
  }

  function setCurrency(cur) {
    if (cur === "Others") {
      const items = state.cart.items;
      if (items.length && orderWouldExceedOthers(items)) {
        toast("Others currency is limited to $15. Keeping USD.");
        return;
      }
    }
    state.currency = cur;
    localStorage.setItem(CURRENCY_KEY, cur);
    ensurePaymentValid();
    if (cur === "Others" && (state.tab === "custom_bundle" || state.tab === "bundle")) {
      setTab("builder");
      return;
    }
    render();
  }

  function setPayment(id) {
    state.payment = id;
    localStorage.setItem(PAYMENT_KEY, id);
    render();
  }

  function setTab(tab) {
    if (state.currency === "Others" && (tab === "custom_bundle" || tab === "bundle")) {
      tab = "builder";
    }
    state.tab = tab;
    syncHash(tab);
    render();
  }

  function setStep(step) {
    state.step = step;
    state.agreeError = false;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function emoteDisabledReason(illId) {
    if (illId === "skeb") return "Not available for Surprise Me";
    if (illId !== "chibi") return "Emotes require Chibi";
    return "";
  }

  function canAdvanceBuilder(cfg, step) {
    if (step === 0) return !!cfg.illustrationTypeId;
    if (step === 1) {
      if (!cfg.commissionTypeId) return false;
      if (cfg.commissionTypeId === "doodlepage") return !!(cfg.doodlePackageId && cfg.poseDirection);
      return true;
    }
    if (step === 2) return !!cfg.renderingStyleId;
    return D.isModularComplete(cfg);
  }

  /* ——— Dialogs ——— */
  function fillDialogs() {
    if (els.dlgGuidelines && !els.dlgGuidelines.dataset.filled) {
      els.dlgGuidelines.dataset.filled = "1";
      els.dlgGuidelines.innerHTML =
        '<div class="comm-dialog-inner"><h2>Guidelines</h2><section><h3>Do</h3><ul>' +
        D.termsDos.map((t) => "<li>" + escapeHtml(t) + "</li>").join("") +
        "</ul></section><section><h3>Don't</h3><ul>" +
        D.termsDonts.map((t) => "<li>" + escapeHtml(t) + "</li>").join("") +
        '</ul></section><button type="button" class="btn btn-outline" data-dlg-close>Close</button></div>';
      els.dlgGuidelines.classList.add("comm-dialog");
    }
    if (els.dlgTos && !els.dlgTos.dataset.filled) {
      els.dlgTos.dataset.filled = "1";
      els.dlgTos.innerHTML =
        '<div class="comm-dialog-inner"><h2>Terms of Service</h2>' +
        D.termsOfService
          .map((s) => "<section><h3>" + escapeHtml(s.h) + "</h3><p>" + escapeHtml(s.p) + "</p></section>")
          .join("") +
        '<button type="button" class="btn btn-outline" data-dlg-close>Close</button></div>';
      els.dlgTos.classList.add("comm-dialog");
    }
    if (els.dlgSurprise && !els.dlgSurprise.dataset.filled) {
      els.dlgSurprise.dataset.filled = "1";
      els.dlgSurprise.innerHTML =
        '<div class="comm-dialog-inner"><h2>Surprise Me Terms</h2><ul>' +
        D.skebHowItWorks.map((t) => "<li>" + escapeHtml(t) + "</li>").join("") +
        '</ul><button type="button" class="btn btn-outline" data-dlg-close>Close</button></div>';
      els.dlgSurprise.classList.add("comm-dialog");
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openDlg(dlg) {
    if (dlg && typeof dlg.showModal === "function") dlg.showModal();
  }

  /* ——— Render helpers ——— */
  function renderStepper() {
    if (!els.stepper) return;
    const s = state.step;
    const a0 = s === 0 ? "active" : s === 1 || s === "success" ? "done" : "";
    const a1 = s === 1 ? "active" : s === "success" ? "done" : "";
    els.stepper.innerHTML =
      '<div class="comm-stepper" role="navigation" aria-label="Commission steps">' +
      '<span class="comm-step ' +
      a0 +
      '"><span class="num">1</span><span class="step-word-short">Commission</span><span class="step-word-full">Commission Sheet</span></span>' +
      '<div class="comm-step-line ' +
      (s !== 0 ? "done" : "") +
      '"></div>' +
      '<span class="comm-step ' +
      a1 +
      '"><span class="num">2</span><span class="step-word-short">Review</span><span class="step-word-full">Review guidelines and submit</span></span>' +
      "</div>";
  }

  function renderProgress() {
    if (!els.progress) return;
    const pct = state.step === 0 ? 50 : 100;
    els.progress.innerHTML =
      '<div class="comm-progress" role="progressbar" aria-valuenow="' +
      pct +
      '" aria-valuemin="0" aria-valuemax="100"><span style="width:' +
      pct +
      '%"></span></div>';
  }

  function renderTabs() {
    if (!els.tabs) return;
    const hideBundle = state.currency === "Others";
    els.tabs.innerHTML =
      '<div class="comm-tabs" role="tablist">' +
      TABS.filter((t) => !(hideBundle && (t === "custom_bundle" || t === "bundle")))
        .map((t) => {
          const L = TAB_LABELS[t];
          return (
            '<button type="button" class="comm-tab' +
            (state.tab === t ? " active" : "") +
            '" role="tab" aria-selected="' +
            (state.tab === t) +
            '" data-set-tab="' +
            t +
            '"><span class="tab-short">' +
            L.short +
            '</span><span class="tab-full">' +
            L.full +
            "</span></button>"
          );
        })
        .join("") +
      "</div>";
  }

  function optionCard(opts) {
    const { id, title, desc, price, badge, selected, disabled, reason, action, extra } = opts;
    return (
      '<button type="button" class="option-card' +
      (selected ? " selected" : "") +
      '"' +
      (disabled ? " disabled" : "") +
      ' data-action="' +
      action +
      '" data-id="' +
      id +
      '">' +
      '<div class="oc-top"><h3>' +
      escapeHtml(title) +
      "</h3>" +
      (badge ? '<span class="note-muted">' + escapeHtml(badge) + "</span>" : "") +
      "</div>" +
      (desc ? "<p>" + escapeHtml(desc) + "</p>" : "") +
      (price ? '<div class="price">' + price + "</div>" : "") +
      (reason && disabled ? '<p class="note-muted">' + escapeHtml(reason) + "</p>" : "") +
      (extra || "") +
      '<span class="check" aria-hidden="true">✓</span></button>'
    );
  }

  function renderBuilderUI(cfg, builderStep, skebOk, prefix) {
    const pills =
      '<div class="builder-steps">' +
      BUILDER_STEPS.map((label, i) => {
        let cls = "builder-step-pill";
        if (i === builderStep) cls += " active";
        else if (i < builderStep || canAdvanceBuilder(cfg, i)) cls += " done";
        return (
          '<button type="button" class="' +
          cls +
          '" data-action="' +
          prefix +
          'step" data-step="' +
          i +
          '">' +
          i +
          " " +
          label +
          "</button>"
        );
      }).join("") +
      "</div>";

    let body = "";
    if (builderStep === 0) {
      body =
        '<div class="option-grid cols-3">' +
        D.illustrationTypes
          .map((t) =>
            optionCard({
              id: t.id,
              title: t.label,
              desc: t.desc,
              badge: t.badge,
              selected: cfg.illustrationTypeId === t.id,
              action: prefix + "ill",
            })
          )
          .join("") +
        "</div>";
      if (cfg.illustrationTypeId === "skeb") {
        body +=
          '<div class="skeb-box"><p class="note-muted" style="margin:0 0 0.5rem">How it works</p><ul style="margin:0;padding-left:1.1rem;font-size:0.85rem;color:hsl(var(--muted-foreground))">' +
          D.skebHowItWorks.map((x) => "<li>" + escapeHtml(x) + "</li>").join("") +
          '</ul><p style="margin:0.75rem 0 0;font-size:0.85rem"><a href="#" data-action="open-surprise">Full Surprise Me terms</a></p>' +
          '<label class="agree-row" style="margin-top:0.75rem"><input type="checkbox" data-action="' +
          prefix +
          'skeb" ' +
          (skebOk ? "checked" : "") +
          " /> I accept Surprise Me terms (no revisions)</label></div>";
      }
    } else if (builderStep === 1) {
      const ill = cfg.illustrationTypeId;
      body =
        '<div class="option-grid cols-2 cols-3">' +
        D.commissionTypes
          .map((t) => {
            const isEmote = t.id === "emote";
            const disabled = isEmote && !D.emoteAllowed(ill);
            const reason = disabled ? emoteDisabledReason(ill) : "";
            let price = "";
            if (t.id === "doodlepage") price = "from " + D.formatMoney(14, "USD");
            else if (ill === "skeb" && t.id !== "emote") {
              /* skip base display for skeb until package known */
              price = "Surprise pricing";
            } else if (ill) {
              const temp = { illustrationTypeId: ill, commissionTypeId: t.id, renderingStyleId: "sketch" };
              if (t.id !== "doodlepage") price = "from " + D.formatMoney(D.modularPriceUsd(temp), "USD");
            }
            return optionCard({
              id: t.id,
              title: t.label,
              desc: "File: " + t.file,
              price,
              selected: cfg.commissionTypeId === t.id,
              disabled,
              reason,
              action: prefix + "type",
            });
          })
          .join("") +
        "</div>";
      if (cfg.commissionTypeId === "doodlepage") {
        body +=
          '<div style="margin-top:1rem"><p class="note-muted">Package</p><div class="option-grid cols-2">' +
          D.doodlePackages
            .map((p) =>
              optionCard({
                id: p.id,
                title: p.label,
                desc: p.dims,
                price: moneyUsdPhp(p.basePriceUsd, p.basePricePhp),
                selected: cfg.doodlePackageId === p.id,
                action: prefix + "pkg",
              })
            )
            .join("") +
          '</div><p class="note-muted" style="margin-top:1rem">Pose direction</p><div class="seg-row">' +
          POSE_OPTS.map(
            (p) =>
              '<button type="button" class="seg-chip' +
              (cfg.poseDirection === p.id ? " active" : "") +
              '" data-action="' +
              prefix +
              'pose" data-id="' +
              p.id +
              '">' +
              escapeHtml(p.label) +
              "</button>"
          ).join("") +
          "</div></div>";
      }
    } else if (builderStep === 2) {
      body =
        '<div class="option-grid cols-2 cols-3">' +
        D.renderingStyles
          .map((s) => {
            const temp = { ...cfg, renderingStyleId: s.id };
            const ready = cfg.illustrationTypeId && cfg.commissionTypeId;
            const price = ready
              ? moneyUsdPhp(D.modularPriceUsd(temp), D.modularPricePhp(temp))
              : "×" + s.multiplier;
            return optionCard({
              id: s.id,
              title: s.label,
              desc: s.desc,
              price,
              selected: cfg.renderingStyleId === s.id,
              action: prefix + "style",
            });
          })
          .join("") +
        "</div>";
    } else {
      if (!D.isModularComplete(cfg)) {
        body =
          '<div class="empty-dashed"><p>Configuration incomplete.</p><button type="button" class="btn btn-outline" data-action="' +
          prefix +
          'reset">Start over</button></div>';
      } else {
        const usd = D.modularPriceUsd(cfg);
        const php = D.modularPricePhp(cfg);
        const needsSkeb = cfg.illustrationTypeId === "skeb" && !skebOk;
        body =
          '<div class="card" style="padding:1.25rem">' +
          "<h3 style=\"margin:0 0 0.5rem;font-size:0.85rem;letter-spacing:0.12em\">" +
          escapeHtml(D.getModularLabel(cfg)) +
          '</h3><p class="price price-pop" style="margin:0">' +
          moneyUsdPhp(usd, php) +
          '</p><p class="note-muted">File: ' +
          escapeHtml(fileSpec(cfg)) +
          "</p>" +
          (needsSkeb
            ? '<p class="discount-error">Accept Surprise Me terms before adding.</p>'
            : "") +
          '<div class="builder-nav"><button type="button" class="btn btn-outline" data-action="' +
          prefix +
          'add"' +
          (needsSkeb ? " disabled" : "") +
          ">" +
          (prefix === "b-" ? "Add item to bundle" : "Add to order") +
          '</button><button type="button" class="btn btn-ghost" data-action="' +
          prefix +
          'reset">Start over</button></div></div>';
      }
    }

    const nav =
      '<div class="builder-nav">' +
      (builderStep > 0
        ? '<button type="button" class="btn btn-ghost" data-action="' + prefix + 'back">Back</button>'
        : "") +
      (builderStep < 3
        ? '<button type="button" class="btn btn-outline" data-action="' +
          prefix +
          'next"' +
          (canAdvanceBuilder(cfg, builderStep) ? "" : " disabled") +
          ">Next</button>"
        : "") +
      "</div>";

    return pills + '<div class="panel-slide">' + body + "</div>" + (builderStep < 3 ? nav : "");
  }

  function renderBuilder() {
    if (!els.builder) return;
    els.builder.innerHTML = renderBuilderUI(
      state.modularConfig,
      state.builderStep,
      state.skebTermsAccepted,
      "m-"
    );
  }

  function renderCustomBundlePanel() {
    const panel = els.panels?.querySelector('[data-panel="custom_bundle"]');
    if (!panel) return;
    if (state.currency === "Others") {
      panel.innerHTML = "";
      panel.hidden = true;
      return;
    }
    const n = state.pendingBundleItems.length;
    const qtyPct = D.bundleQtyPercent(n);
    const sub = state.pendingBundleItems.reduce((s, c) => s + D.modularPriceUsd(c), 0);
    const bonus = D.bundleValueBonus(sub);
    const tiers = [
      { label: "2", pct: 10, active: n === 2 },
      { label: "3–4", pct: 15, active: n >= 3 && n <= 4 },
      { label: "5–7", pct: 20, active: n >= 5 && n <= 7 },
      { label: "8+", pct: 25, active: n >= 8 },
    ];
    const bundleMath = D.customBundleTotalUsd(state.pendingBundleItems);
    let list =
      n === 0
        ? '<div class="empty-dashed">Add 2+ commissions to unlock bundle discount</div>'
        : '<ul style="list-style:none;padding:0;margin:0 0 1rem">' +
          state.pendingBundleItems
            .map(
              (c, i) =>
                '<li class="cart-line bundle-accent" style="margin-bottom:0.5rem"><div class="cart-line-top"><div><h4>' +
                escapeHtml(D.getModularLabel(c)) +
                '</h4><p class="note-muted" style="margin:0">' +
                D.formatMoney(D.modularPriceUsd(c), "USD") +
                '</p></div><button type="button" class="btn btn-ghost" data-action="bundle-remove" data-idx="' +
                i +
                '">Remove</button></div></li>'
            )
            .join("") +
          "</ul>";

    panel.innerHTML =
      '<div class="tier-strip">' +
      tiers
        .map(
          (t) =>
            '<div class="tier-cell' +
            (t.active ? " active" : "") +
            '"><strong>' +
            t.label +
            "</strong>" +
            t.pct +
            "% off</div>"
        )
        .join("") +
      "</div>" +
      (n >= 2
        ? '<p class="note-muted">Qty ' +
          qtyPct +
          "%" +
          (bonus ? " + value bonus " + bonus + "%" : "") +
          " · Total " +
          D.formatMoney(bundleMath.total, "USD") +
          " (" +
          bundleMath.percent +
          "% off)</p>"
        : "") +
      list +
      '<h3 style="font-size:0.75rem;letter-spacing:0.16em;margin:1.25rem 0 0.75rem">Build next item</h3>' +
      renderBuilderUI(state.bundleModularConfig, state.bundleBuilderStep, state.bundleSkebTermsAccepted, "b-") +
      '<div class="builder-nav" style="margin-top:1rem"><button type="button" class="btn btn-outline" data-action="bundle-add-cart"' +
      (n >= 2 ? "" : " disabled") +
      ">Add bundle to order</button></div>";
  }

  function renderCatalog(catKey) {
    const panel = els.panels?.querySelector('[data-panel="' + catKey + '"]');
    if (!panel) return;
    if (catKey === "bundle" && state.currency === "Others") {
      panel.innerHTML = "";
      panel.hidden = true;
      return;
    }
    const list = D.catalog[catKey] || [];
    const allSold = list.length > 0 && list.every((t) => t.slots === 0);
    if (allSold) {
      panel.innerHTML =
        '<div class="card soldout-card"><p>All ' +
        escapeHtml(TAB_LABELS[catKey]?.full || catKey) +
        ' slots are currently filled</p><a class="btn btn-outline" href="' +
        escapeHtml(D.waitlistUrl) +
        '" target="_blank" rel="noopener">+ Join waitlist</a></div>';
      return;
    }
    panel.innerHTML = list
      .map((t) => {
        const disabledOthers = state.currency === "Others" && t.basePriceUsd > OTHERS_MAX_USD;
        const sold = t.slots === 0;
        const selected = state.selectedCatalogId === t.id;
        const pricePhp = t.basePricePhp != null ? t.basePricePhp : D.round2(t.basePriceUsd * D.PHP_RATE);
        const priceStr =
          state.currency === "PHP"
            ? D.formatMoney(pricePhp, "PHP")
            : D.formatMoney(t.basePriceUsd, state.currency === "Others" ? "Others" : "USD");
        const strike =
          t.originalPriceUsd != null
            ? '<span class="strike">' + D.formatMoney(t.originalPriceUsd, "USD") + "</span>"
            : "";
        const pct =
          t.bundleDiscountPercent != null
            ? '<span class="note-muted">' + t.bundleDiscountPercent + "% OFF</span>"
            : "";
        return (
          '<div class="catalog-row' +
          (selected ? " selected" : "") +
          (catKey === "bundle" ? " bundle-accent" : "") +
          '"><div class="catalog-row-head" data-action="catalog-toggle" data-id="' +
          t.id +
          '"><div><strong style="letter-spacing:0.08em">' +
          escapeHtml(t.name) +
          "</strong><div style=\"margin-top:0.35rem\">" +
          strike +
          '<span class="price" style="display:inline">' +
          priceStr +
          "</span> " +
          pct +
          '</div></div><div style="display:flex;gap:0.75rem;align-items:center"><span class="note-muted">Slots: ' +
          t.slots +
          '</span><button type="button" class="btn btn-outline" data-action="catalog-select" data-id="' +
          t.id +
          '"' +
          (sold || disabledOthers ? " disabled" : "") +
          ">" +
          (sold ? "Sold out" : disabledOthers ? ">$15" : "Select") +
          "</button></div></div>" +
          '<div class="catalog-row-body"><p>File: ' +
          escapeHtml(t.file || "—") +
          "</p><p>" +
          escapeHtml(DELIVERABLES) +
          "</p><p>Est. delivery: 2–4 weeks</p></div></div>"
        );
      })
      .join("");
  }

  function renderPanelsVisibility() {
    if (!els.panels) return;
    TABS.forEach((t) => {
      const p = els.panels.querySelector('[data-panel="' + t + '"]');
      if (!p) return;
      const hideTab = state.currency === "Others" && (t === "custom_bundle" || t === "bundle");
      p.hidden = hideTab || state.tab !== t;
    });
  }

  function renderPreview() {
    /* Preview lives inside compact order dock now. */
  }

  function renderSummary() {
    if (!els.summary) return;
    const item = cartItem();
    const payments = D.payments[state.currency] || [];
    const totals = D.orderTotals(state.cart.items, state.currency === "Others" ? "USD" : state.currency, state.discount);
    const fmtCur = state.currency === "Others" ? "Others" : state.currency;
    const canReview = !!item && !!state.payment;
    const totalLabel = D.formatMoney(totals.total, fmtCur);
    const previewKeyVal = previewKey();

    let cartHtml =
      '<div class="order-dock__empty">Pick a commission — it shows here.</div>';
    if (item) {
      const addons = D.visibleAddOns(item, state.currency);
      const thumb = previewKeyVal
        ? '<div class="order-dock__thumb"><img src="images/commissions/' +
          encodeURIComponent(previewKeyVal) +
          '.png" alt="" onerror="this.parentElement.style.display=\'none\'" /></div>'
        : "";
      cartHtml =
        '<div class="cart-line">' +
        thumb +
        '<div class="cart-line-body"><div class="cart-line-top"><div><h4>' +
        escapeHtml(lineLabel(item)) +
        '</h4><p class="note-muted cart-line-meta">Qty ' +
        (item.quantity || 1) +
        " · " +
        D.formatMoney(D.lineSubtotal(item, fmtCur === "Others" ? "USD" : fmtCur), fmtCur) +
        '</p></div><button type="button" class="btn btn-ghost cart-remove" data-action="cart-remove" aria-label="Remove">✕</button></div>' +
        (addons.length
          ? '<div class="addon-list">' +
            addons
              .map((a) => {
                const checked = (item.addOnIds || []).includes(a.id);
                const priceLabel =
                  a.kind === "commercial"
                    ? "+100% base"
                    : "+" + D.formatMoney(fmtCur === "PHP" ? D.round2(a.priceUsd * D.PHP_RATE) : a.priceUsd, fmtCur);
                return (
                  '<label class="addon-row"><input type="checkbox" data-action="addon-toggle" data-id="' +
                  a.id +
                  '" ' +
                  (checked ? "checked" : "") +
                  " /> " +
                  escapeHtml(a.name) +
                  ' <span class="note-muted">' +
                  priceLabel +
                  "</span></label>"
                );
              })
              .join("") +
            "</div>"
          : "") +
        "</div></div>";
    }

    const paymentHtml = item
      ? '<p class="order-dock__label">Payment</p><div class="seg-row seg-row--tight">' +
        payments
          .map(
            (p) =>
              '<button type="button" class="seg-chip' +
              (state.payment === p.id ? " active" : "") +
              '" data-action="payment" data-id="' +
              p.id +
              '">' +
              escapeHtml(p.name) +
              "</button>"
          )
          .join("") +
        "</div>"
      : "";

    const discountOpen = !!(state.discount || state.discountError);
    const discountHtml =
      '<details class="order-dock__details"' +
      (discountOpen ? " open" : "") +
      "><summary>Discount code</summary>" +
      '<div class="discount-row"><input class="form-control" type="text" placeholder="Code" data-discount-input value="" /><button type="button" class="btn btn-outline" data-action="discount-apply">Apply</button></div>' +
      (state.discountError ? '<p class="discount-error">' + escapeHtml(state.discountError) + "</p>" : "") +
      (state.discount
        ? '<p class="discount-badge">' +
          escapeHtml(state.discount.label || state.discount.code) +
          ' <button type="button" class="btn btn-ghost" data-action="discount-clear" style="padding:0 0.35rem">✕</button></p>'
        : "") +
      "</details>";

    els.summary.innerHTML =
      '<header class="order-dock__head">' +
      "<h3>Your order</h3>" +
      '<span class="order-dock__total' +
      (item ? " is-live" : "") +
      '">' +
      (item ? totalLabel : "—") +
      "</span></header>" +
      '<div class="seg-row seg-row--tight order-dock__currency">' +
      ["USD", "PHP", "Others"]
        .map(
          (c) =>
            '<button type="button" class="seg-chip' +
            (state.currency === c ? " active" : "") +
            '" data-action="currency" data-id="' +
            c +
            '">' +
            c +
            "</button>"
        )
        .join("") +
      "</div>" +
      '<div class="order-dock__scroll">' +
      cartHtml +
      paymentHtml +
      discountHtml +
      "</div>" +
      '<footer class="order-dock__foot">' +
      (item
        ? '<div class="totals totals--compact">' +
          (totals.discount
            ? '<div class="totals-row"><span>Discount</span><span class="amt">−' +
              D.formatMoney(totals.discount, fmtCur) +
              "</span></div>"
            : "") +
          '<div class="totals-row total"><span>Total</span><span class="amt price-pop">' +
          totalLabel +
          "</span></div>" +
          '<div class="totals-row"><span>50% down</span><span class="amt">' +
          D.formatMoney(totals.downpayment, fmtCur) +
          "</span></div>" +
          '<p class="note-muted order-dock__delivery">' +
          escapeHtml(D.deliveryCopy(item)) +
          "</p></div>"
        : "") +
      '<button type="button" class="btn btn-outline cta-review" data-action="goto-review"' +
      (canReview ? "" : " disabled") +
      ">Review &amp; submit</button></footer>";
  }

  function renderMobileBar() {
    if (!els.mobileBar) return;
    const item = cartItem();
    const show = !!item && window.innerWidth < 768 && state.step === 0;
    els.mobileBar.className = "mobile-cart-bar" + (show ? " show" : "");
    if (!item) {
      els.mobileBar.innerHTML = "";
      return;
    }
    const fmtCur = state.currency === "Others" ? "Others" : state.currency;
    const totals = D.orderTotals(state.cart.items, fmtCur === "Others" ? "USD" : fmtCur, state.discount);
    els.mobileBar.innerHTML =
      "<span>1 item · " +
      D.formatMoney(totals.total, fmtCur) +
      '</span><button type="button" class="btn btn-outline" data-action="goto-review"' +
      (state.payment ? "" : " disabled") +
      ">Review &amp; submit</button>";
    const sheet = root.querySelector(".commission-sheet");
    sheet?.classList.toggle("has-cart-pad", !!item && state.step === 0);
  }

  function renderStep1() {
    if (!els.step1) return;
    const item = cartItem();
    const fmtCur = state.currency === "Others" ? "Others" : state.currency;
    const totals = D.orderTotals(state.cart.items, fmtCur === "Others" ? "USD" : fmtCur, state.discount);
    const payName = (D.payments[state.currency] || []).find((p) => p.id === state.payment)?.name || state.payment;
    els.step1.innerHTML =
      '<div class="card recap-card"><h2 class="section-h2" style="font-size:1.125rem;margin-bottom:1rem">Order recap</h2>' +
      (item
        ? "<p><strong>" +
          escapeHtml(lineLabel(item)) +
          "</strong></p><p class=\"note-muted\">Add-ons: " +
          (item.addOnIds?.length ? item.addOnIds.join(", ") : "none") +
          "</p>"
        : "<p>No items</p>") +
      "<p>Currency: " +
      escapeHtml(state.currency) +
      " · Payment: " +
      escapeHtml(payName) +
      "</p>" +
      (state.discount ? "<p class=\"discount-badge\">" + escapeHtml(state.discount.label) + "</p>" : "") +
      '<div class="totals"><div class="totals-row total"><span>Total</span><span class="amt">' +
      D.formatMoney(totals.total, fmtCur) +
      '</span></div><div class="totals-row"><span>50% down</span><span class="amt">' +
      D.formatMoney(totals.downpayment, fmtCur) +
      '</span></div><div class="totals-row"><span>Balance</span><span class="amt">' +
      D.formatMoney(totals.balance, fmtCur) +
      '</span></div><div class="totals-row"><span>Delivery</span><span>' +
      escapeHtml(D.deliveryCopy(item)) +
      "</span></div></div></div>" +
      '<div class="agree-block">' +
      '<label class="agree-row"><input type="checkbox" data-action="agree-dos" ' +
      (state.agreedDos ? "checked" : "") +
      ' /> I have read the <a href="#" data-action="open-guidelines">guidelines</a></label>' +
      '<label class="agree-row"><input type="checkbox" data-action="agree-tos" ' +
      (state.agreedTerms ? "checked" : "") +
      ' /> I agree to the <a href="#" data-action="open-tos">Terms of Service</a></label>' +
      '<p class="agree-error' +
      (state.agreeError ? " show" : "") +
      '">Please accept both checkboxes to submit.</p></div>' +
      '<div class="review-actions"><button type="button" class="btn btn-ghost" data-action="back-sheet">Back</button>' +
      '<button type="button" class="btn btn-outline" data-action="submit-order">Submit inquiry</button></div>';
  }

  function renderSuccess() {
    if (!els.success) return;
    const id = state.lastOrderId || "—";
    els.success.innerHTML =
      '<div class="card success-card"><h2 class="section-h2">Thank you</h2><p class="note-muted">Your local demo order is saved.</p>' +
      '<p class="order-id">' +
      escapeHtml(id) +
      '</p><div class="success-actions">' +
      '<button type="button" class="btn btn-outline" data-action="copy-order">Copy</button>' +
      '<a class="btn btn-outline" href="track.html?order=' +
      encodeURIComponent(id) +
      '">Track order</a>' +
      '<button type="button" class="btn btn-ghost" data-action="reset-commissions">Back to commissions</button>' +
      '<a class="btn btn-ghost" href="portfolio.html">Continue browsing</a></div></div>';
  }

  function render() {
    fillDialogs();
    renderStepper();
    renderProgress();

    const show0 = state.step === 0;
    const show1 = state.step === 1;
    const showS = state.step === "success";
    if (els.step0) els.step0.hidden = !show0;
    if (els.step1) els.step1.hidden = !show1;
    if (els.success) els.success.hidden = !showS;

    if (show0) {
      renderTabs();
      renderPanelsVisibility();
      if (state.tab === "builder") renderBuilder();
      if (state.tab === "custom_bundle") renderCustomBundlePanel();
      if (state.tab === "regular") renderCatalog("regular");
      if (state.tab === "character") renderCatalog("character");
      if (state.tab === "bundle") renderCatalog("bundle");
      renderPreview();
      renderSummary();
      renderMobileBar();
    } else if (show1) {
      renderStep1();
      if (els.mobileBar) {
        els.mobileBar.className = "mobile-cart-bar";
        els.mobileBar.innerHTML = "";
      }
    } else if (showS) {
      renderSuccess();
      if (els.mobileBar) {
        els.mobileBar.className = "mobile-cart-bar";
        els.mobileBar.innerHTML = "";
      }
    }
  }

  /* ——— Actions ——— */
  function pickIll(cfgKey, stepKey, skebKey, id) {
    const cfg = state[cfgKey];
    cfg.illustrationTypeId = id;
    if (cfg.commissionTypeId === "emote" && !D.emoteAllowed(id)) {
      cfg.commissionTypeId = null;
    }
    if (id !== "skeb") state[skebKey] = false;
    state[stepKey] = 1;
    render();
  }

  function pickType(cfgKey, stepKey, id) {
    const cfg = state[cfgKey];
    cfg.commissionTypeId = id;
    if (id !== "doodlepage") {
      delete cfg.doodlePackageId;
      delete cfg.poseDirection;
      state[stepKey] = 2;
    }
    render();
  }

  function resetModular(cfgKey, stepKey, skebKey) {
    state[cfgKey] = emptyModular();
    state[stepKey] = 0;
    state[skebKey] = false;
    render();
  }

  function addModularToCart(cfg, skebOk) {
    if (!D.isModularComplete(cfg)) return;
    if (cfg.illustrationTypeId === "skeb" && !skebOk) {
      toast("Accept Surprise Me terms first.");
      return;
    }
    const usd = D.modularPriceUsd(cfg);
    if (state.currency === "Others" && usd > OTHERS_MAX_USD) {
      toast("Others currency limited to $15 — switch to USD for this type.");
      setCurrency("USD");
      return;
    }
    replaceCart({
      id: uid(),
      typeId: "modular",
      quantity: 1,
      addOnIds: [],
      modularConfig: { ...cfg },
    });
    toast("Added to order.");
    render();
  }

  function addPendingBundle(cfg, skebOk) {
    if (!D.isModularComplete(cfg)) return;
    if (cfg.illustrationTypeId === "skeb" && !skebOk) {
      toast("Accept Surprise Me terms first.");
      return;
    }
    state.pendingBundleItems.push({ ...cfg });
    state.bundleModularConfig = emptyModular();
    state.bundleBuilderStep = 0;
    state.bundleSkebTermsAccepted = false;
    toast("Item added to bundle.");
    render();
  }

  function submitOrder() {
    if (!state.agreedDos || !state.agreedTerms) {
      state.agreeError = true;
      render();
      return;
    }
    if (!cartItem() || !state.payment) {
      toast("Cart and payment required.");
      setStep(0);
      return;
    }
    const id = D.makeOrderId();
    state.lastOrderId = id;
    sessionStorage.setItem(ORDER_KEY, id);
    clearCartStorage();
    state.discount = null;
    state.discountError = "";
    state.agreedDos = false;
    state.agreedTerms = false;
    state.modularConfig = emptyModular();
    state.builderStep = 0;
    state.pendingBundleItems = [];
    toast("Order saved locally: " + id);
    setStep("success");
  }

  function resetAll() {
    clearCartStorage();
    state.step = 0;
    state.tab = "builder";
    state.builderStep = 0;
    state.modularConfig = emptyModular();
    state.skebTermsAccepted = false;
    state.pendingBundleItems = [];
    state.bundleBuilderStep = 0;
    state.bundleModularConfig = emptyModular();
    state.bundleSkebTermsAccepted = false;
    state.discount = null;
    state.discountError = "";
    state.agreedDos = false;
    state.agreedTerms = false;
    state.selectedCatalogId = null;
    syncHash("builder");
    render();
  }

  document.addEventListener("click", (e) => {
    const dlgClose = e.target.closest("[data-dlg-close]");
    if (!dlgClose) return;
    dlgClose.closest("dialog")?.close();
  });

  root.addEventListener("click", (e) => {
    const tabBtn = e.target.closest("[data-set-tab]");
    if (tabBtn && root.contains(tabBtn)) {
      setTab(tabBtn.dataset.setTab);
      return;
    }

    const btn = e.target.closest("[data-action]");
    if (!btn || !root.contains(btn)) return;
    if (btn.tagName === "A") e.preventDefault();

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "open-guidelines") return openDlg(els.dlgGuidelines);
    if (action === "open-tos") return openDlg(els.dlgTos);
    if (action === "open-surprise") return openDlg(els.dlgSurprise);

    if (action === "currency") return setCurrency(id);
    if (action === "payment") return setPayment(id);

    if (action === "m-ill") return pickIll("modularConfig", "builderStep", "skebTermsAccepted", id);
    if (action === "m-type") return pickType("modularConfig", "builderStep", id);
    if (action === "m-pkg") {
      state.modularConfig.doodlePackageId = id;
      render();
      return;
    }
    if (action === "m-pose") {
      state.modularConfig.poseDirection = id;
      if (state.modularConfig.doodlePackageId) state.builderStep = 2;
      render();
      return;
    }
    if (action === "m-style") {
      state.modularConfig.renderingStyleId = id;
      state.builderStep = 3;
      render();
      return;
    }
    if (action === "m-skeb") return;
    if (action === "m-step") {
      const s = Number(btn.dataset.step);
      if (s <= state.builderStep || canAdvanceBuilder(state.modularConfig, s - 1)) {
        state.builderStep = s;
        render();
      }
      return;
    }
    if (action === "m-next") {
      if (canAdvanceBuilder(state.modularConfig, state.builderStep)) {
        state.builderStep = Math.min(3, state.builderStep + 1);
        render();
      }
      return;
    }
    if (action === "m-back") {
      state.builderStep = Math.max(0, state.builderStep - 1);
      render();
      return;
    }
    if (action === "m-reset") return resetModular("modularConfig", "builderStep", "skebTermsAccepted");
    if (action === "m-add") return addModularToCart(state.modularConfig, state.skebTermsAccepted);

    if (action === "b-ill") return pickIll("bundleModularConfig", "bundleBuilderStep", "bundleSkebTermsAccepted", id);
    if (action === "b-type") return pickType("bundleModularConfig", "bundleBuilderStep", id);
    if (action === "b-pkg") {
      state.bundleModularConfig.doodlePackageId = id;
      render();
      return;
    }
    if (action === "b-pose") {
      state.bundleModularConfig.poseDirection = id;
      if (state.bundleModularConfig.doodlePackageId) state.bundleBuilderStep = 2;
      render();
      return;
    }
    if (action === "b-style") {
      state.bundleModularConfig.renderingStyleId = id;
      state.bundleBuilderStep = 3;
      render();
      return;
    }
    if (action === "b-skeb") return;
    if (action === "b-step") {
      const s = Number(btn.dataset.step);
      if (s <= state.bundleBuilderStep || canAdvanceBuilder(state.bundleModularConfig, s - 1)) {
        state.bundleBuilderStep = s;
        render();
      }
      return;
    }
    if (action === "b-next") {
      if (canAdvanceBuilder(state.bundleModularConfig, state.bundleBuilderStep)) {
        state.bundleBuilderStep = Math.min(3, state.bundleBuilderStep + 1);
        render();
      }
      return;
    }
    if (action === "b-back") {
      state.bundleBuilderStep = Math.max(0, state.bundleBuilderStep - 1);
      render();
      return;
    }
    if (action === "b-reset")
      return resetModular("bundleModularConfig", "bundleBuilderStep", "bundleSkebTermsAccepted");
    if (action === "b-add") return addPendingBundle(state.bundleModularConfig, state.bundleSkebTermsAccepted);

    if (action === "bundle-remove") {
      state.pendingBundleItems.splice(Number(btn.dataset.idx), 1);
      render();
      return;
    }
    if (action === "bundle-add-cart") {
      if (state.pendingBundleItems.length < 2) return;
      replaceCart({
        id: uid(),
        typeId: "custom_bundle",
        quantity: 1,
        addOnIds: [],
        bundleItems: state.pendingBundleItems.map((c) => ({ ...c })),
      });
      state.pendingBundleItems = [];
      toast("Bundle added to order.");
      render();
      return;
    }

    if (action === "catalog-toggle") {
      state.selectedCatalogId = state.selectedCatalogId === id ? null : id;
      render();
      return;
    }
    if (action === "catalog-select") {
      e.stopPropagation();
      const type = D.findCatalogType(id);
      if (!type || type.slots === 0) return;
      if (state.currency === "Others" && type.basePriceUsd > OTHERS_MAX_USD) {
        toast("Others currency limited to $15.");
        return;
      }
      state.selectedCatalogId = id;
      replaceCart({ id: uid(), typeId: id, quantity: 1, addOnIds: [] });
      toast("Added to order.");
      render();
      return;
    }

    if (action === "cart-remove") {
      clearCartStorage();
      render();
      return;
    }
    if (action === "addon-toggle") {
      /* handled on change */
      return;
    }

    if (action === "discount-apply") {
      const input = els.summary?.querySelector("[data-discount-input]");
      const code = (input?.value || "").trim();
      if (!code) return;
      const res = D.validateDiscount(code, state.cart.items);
      if (!res.ok) {
        state.discount = null;
        state.discountError =
          res.error === "not_applicable" ? "Code not applicable to this order." : "Invalid discount code.";
      } else {
        state.discount = res.discount;
        state.discountError = "";
      }
      render();
      return;
    }
    if (action === "discount-clear") {
      state.discount = null;
      state.discountError = "";
      render();
      return;
    }

    if (action === "goto-review") {
      if (!cartItem() || !state.payment) {
        toast("Select a commission and payment method.");
        return;
      }
      setStep(1);
      return;
    }
    if (action === "back-sheet") return setStep(0);
    if (action === "agree-dos" || action === "agree-tos") return;
    if (action === "submit-order") return submitOrder();
    if (action === "copy-order") {
      const id = state.lastOrderId;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(id).then(
          () => toast("Copied " + id),
          () => toast(id)
        );
      } else toast(id);
      return;
    }
    if (action === "reset-commissions") return resetAll();
  });

  root.addEventListener("change", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el || !root.contains(el)) return;
    const action = el.dataset.action;
    const id = el.dataset.id;
    if (action === "m-skeb") {
      state.skebTermsAccepted = el.checked;
      render();
    } else if (action === "b-skeb") {
      state.bundleSkebTermsAccepted = el.checked;
      render();
    } else if (action === "agree-dos") {
      state.agreedDos = el.checked;
      state.agreeError = false;
    } else if (action === "agree-tos") {
      state.agreedTerms = el.checked;
      state.agreeError = false;
    } else if (action === "addon-toggle") {
      const item = cartItem();
      if (!item) return;
      const set = new Set(item.addOnIds || []);
      if (el.checked) set.add(id);
      else set.delete(id);
      item.addOnIds = [...set];
      if (state.currency === "Others" && orderWouldExceedOthers(state.cart.items)) {
        item.addOnIds = item.addOnIds.filter((x) => x !== id);
        toast("Others currency limited to $15 — use USD for larger orders.");
        setCurrency("USD");
        return;
      }
      saveCart();
      render();
    }
  });

  window.addEventListener("hashchange", () => {
    const t = tabFromHash();
    if (t !== state.tab) {
      state.tab = t;
      if (state.step === 0) render();
    }
  });

  window.addEventListener("resize", () => {
    if (state.step === 0) renderMobileBar();
  });

  syncHash(state.tab);

  const statusEl = document.querySelector("[data-comm-status]");
  if (statusEl && D.status) {
    const st = D.status;
    if (!st.open) {
      statusEl.textContent = "Closed · Next opening: " + st.nextOpening;
      statusEl.dataset.state = "closed";
    } else if (st.remainingSlots <= 3) {
      statusEl.textContent =
        "Limited Slots · Currently accepting " + st.remainingSlots + " slot(s).";
      statusEl.dataset.state = "limited";
    } else {
      statusEl.textContent = "Open · Currently accepting " + st.remainingSlots + " slots.";
      statusEl.dataset.state = "open";
    }
  }

  render();
})();
