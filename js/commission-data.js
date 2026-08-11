/* Commission sheet — catalog + pricing (static rebuild) */
window.CommissionData = (function () {
  const PHP_RATE = 58.5;

  const illustrationTypes = [
    { id: "normal", label: "Normal", multiplier: 1, desc: "Standard proportions" },
    { id: "chibi", label: "Chibi", multiplier: 0.8, desc: "Cute proportions · discounted base" },
    {
      id: "skeb",
      label: "Surprise Me",
      multiplier: 1,
      desc: "No revision process · fast turnaround",
      badge: "Fast Turnaround",
    },
  ];

  const commissionTypes = [
    { id: "emote", label: "Emote", basePriceUsd: 15, file: "112×112px" },
    { id: "icon", label: "Icon", basePriceUsd: 25, file: "500×500px" },
    { id: "bust", label: "Bust / Portrait", basePriceUsd: 30, file: "1000×1200px" },
    { id: "halfbody", label: "Half Body", basePriceUsd: 40, file: "1500×1500px" },
    { id: "fullbody", label: "Full Body", basePriceUsd: 50, file: "2000×2500px" },
    { id: "doodlepage", label: "Doodle Page", basePriceUsd: 14, file: "Custom 2000×2500 – 3000×4000" },
  ];

  const renderingStyles = [
    { id: "sketch", label: "Sketch", multiplier: 1, desc: "Line work focus" },
    { id: "colored_sketch", label: "Colored Sketch", multiplier: 1.3, desc: "Flat color washes" },
    { id: "experimental", label: "Experimental", multiplier: 1.45, desc: "Stylized exploration" },
    { id: "cel_shaded", label: "Cel Shaded", multiplier: 1.6, desc: "Clean anime shading" },
    { id: "semi_rendered", label: "Semi Rendered", multiplier: 2, desc: "Soft form + light" },
    { id: "fully_rendered", label: "Fully Rendered", multiplier: 2.5, desc: "Full polish" },
  ];

  const doodlePackages = [
    { id: "small", label: "2–3 Poses", basePriceUsd: 14, basePricePhp: 800, dims: "~2000×2500px" },
    { id: "large", label: "4–5 Poses", basePriceUsd: 24, basePricePhp: 1400, dims: "~3000×4000px" },
  ];

  const skebBaseUsd = {
    icon: 6,
    bust: 10.26,
    halfbody: 13.68,
    fullbody: 17.09,
    "doodlepage:small": 20.51,
    "doodlepage:large": 30.77,
  };

  const phpExclusive = {
    "chibi:icon": 200,
    "chibi:halfbody": 400,
    "chibi:fullbody": 250,
    "normal:icon": 300,
    "normal:halfbody": 500,
    "normal:fullbody": 750,
    "normal:doodlepage:small": 800,
    "normal:doodlepage:large": 1400,
    "chibi:doodlepage:small": 640,
    "chibi:doodlepage:large": 1120,
    "skeb:icon": 350,
    "skeb:bust": 600,
    "skeb:halfbody": 800,
    "skeb:fullbody": 1000,
    "skeb:doodlepage:small": 1200,
    "skeb:doodlepage:large": 1800,
  };

  const catalog = {
    regular: [
      { id: "chs", name: "Chibi Headshot Icon", basePriceUsd: 20, basePricePhp: 200, slots: 6, file: "500×500px" },
      { id: "cfb", name: "Chibi Full-Body Illustration", basePriceUsd: 30, basePricePhp: 250, slots: 3, file: "—" },
      { id: "hs", name: "Headshot Icon", basePriceUsd: 30, basePricePhp: 300, slots: 9, file: "500×500px" },
      { id: "hb", name: "Half-Body Illustration", basePriceUsd: 40, basePricePhp: 500, slots: 6, file: "1500×1500px", maxQty: 5 },
      { id: "fb", name: "Full-Body Illustration", basePriceUsd: 50, basePricePhp: 750, slots: 0, file: "—" },
    ],
    character: [
      { id: "char_design", name: "Character Design", basePriceUsd: 80, slots: 2 },
      { id: "char_revamp", name: "Character Revamp", basePriceUsd: 45, slots: 1 },
      { id: "chibify", name: "Chibify Character", basePriceUsd: 40, slots: 0 },
      { id: "clothes", name: "Clothes Design", basePriceUsd: 40, slots: 0 },
    ],
    bundle: [
      { id: "bundle_chibi_pfp", name: "Chibi PFP (2× CHS)", originalPriceUsd: 40, basePriceUsd: 34, bundleDiscountPercent: 15, slots: 5 },
      { id: "bundle_couple_pfp", name: "Couple PFP (2× HS)", originalPriceUsd: 60, basePriceUsd: 51, bundleDiscountPercent: 15, slots: 5 },
      { id: "bundle_a", name: "Character Package A", originalPriceUsd: 140, basePriceUsd: 119, bundleDiscountPercent: 15, slots: 2 },
      { id: "bundle_b", name: "Character Package B", originalPriceUsd: 340, basePriceUsd: 170, bundleDiscountPercent: 50, slots: 1 },
      { id: "bundle_c", name: "Character Package C", originalPriceUsd: 350, basePriceUsd: 175, bundleDiscountPercent: 50, slots: 1 },
      { id: "bundle_d", name: "Character Package D", originalPriceUsd: 360, basePriceUsd: 180, bundleDiscountPercent: 50, slots: 1 },
    ],
  };

  const addOns = [
    { id: "rush", name: "Rush Delivery (3 business days)", priceUsd: 15, kind: "fixed" },
    { id: "commercial", name: "Commercial License", priceUsd: 0, kind: "commercial" },
    { id: "custom_size", name: "Custom Size/Resolution", priceUsd: 10, kind: "fixed" },
    { id: "complex_bg", name: "Complex Background", priceUsd: 25, kind: "fixed" },
    { id: "extra_revisions", name: "Additional Revisions (beyond 2 free)", priceUsd: 10, kind: "fixed" },
  ];

  const addOnsHiddenForSkebDoodle = ["rush", "commercial", "extra_revisions"];
  const addOnsDisabledForOthers = ["rush", "custom_size", "complex_bg", "extra_revisions"];

  const discountCodes = [
    { code: "SPRING15", type: "percent", value: 15, appliesTo: "all", label: "15% OFF - Spring Special" },
    { code: "FULLRENDER25", type: "percent", value: 25, appliesTo: "fb", label: "25% OFF - Full Body Orders" },
    { code: "WELCOME5", type: "fixed", value: 5, appliesTo: "all", label: "$5 OFF - Welcome Discount" },
  ];

  const payments = {
    USD: [
      { id: "paypal", name: "PayPal" },
      { id: "kofi", name: "Ko-Fi" },
      { id: "bank", name: "Bank Transfer" },
    ],
    PHP: [
      { id: "gcash", name: "GCash" },
      { id: "maya", name: "QR PH (Maya)" },
      { id: "bank", name: "Bank Transfer" },
    ],
    Others: [
      { id: "discord_nitro", name: "Discord Nitro" },
      { id: "robux", name: "Robux (Covered Tax)" },
    ],
  };

  const termsDos = [
    "Provide clear references and descriptions for your commission request.",
    "Communicate openly during the process — feedback is welcome!",
    "Credit the artist when sharing commissioned work online.",
    "Use commissioned art for personal, non-commercial purposes (unless commercial license purchased).",
    "Request revisions during the designated revision phase.",
    "Be patient — quality art takes time.",
  ];

  const termsDonts = [
    "Claim the artwork as your own creation.",
    "Resell, redistribute, or use for NFTs without explicit written permission.",
    "Rush the artist outside of paid rush delivery options.",
    "Request excessive revisions beyond the agreed scope.",
    "Use AI to alter or reproduce the commissioned artwork.",
    "Chargeback after receiving the completed work.",
  ];

  const termsOfService = [
    {
      h: "1. Acceptable Content",
      p: "Human-faced characters, kemonomimi, fan art, ship art, simple backgrounds, mild gore/body horror, mild mecha, and NSFW/R-18 themes are acceptable. Not accepted: hateful/offensive themes, excessive gore, overly-detailed backgrounds, furries, animal-faced humanoids, full mecha, mimicry of another artist's style, or elderly subjects. The artist may reject any request outside expertise or comfort.",
    },
    {
      h: "2. Payment",
      p: "International clients pay USD via PayPal (Goods & Services). Local PH clients pay PHP via GCash. 50% downpayment before work begins; remaining 50% due on completion before delivery. Commercial use +100% of base. Installments only for eligible large types.",
    },
    {
      h: "3. Commission Process",
      p: "Clear references required. Sketch approval and revisions, then color checks, then final rendering. Major changes after final approval are not permitted. Progress via Trello/Discord. Digital delivery only unless arranged.",
    },
    {
      h: "4. Revisions",
      p: "Up to 2 free revisions during the sketch phase. Minor tweaks free at appropriate stages. Major post-color changes may incur fees. No tracing or mimicking another artist's style.",
    },
    {
      h: "5. Delivery",
      p: "Standard 2–4 weeks. Rush (3 business days) when purchased. High-res PNG + optional web-ready. Surprise Me 3–7 days. Doodle pages 1–2 days (max 5).",
    },
    {
      h: "6. Usage Rights",
      p: "Personal use included with credit. Commercial license required for merch/business. Artist retains copyright and portfolio display rights unless confidentiality requested.",
    },
    {
      h: "7. Cancellations & Refunds",
      p: "Sales final once sketching begins. Full refund before work; 50% during sketch; none after coloring. Artist may cancel with full refund for unforeseen circumstances.",
    },
    {
      h: "8–12. Conduct & Legal",
      p: "Primary contact via email/site form; ~48h business response. Harassment ends the commission. No AI training/NFT use without written permission. By ordering you agree to these Terms, governed by applicable law.",
    },
  ];

  const skebHowItWorks = [
    "You send character reference and direction; I create with full artistic freedom — no sketch approval or revision rounds.",
    "Delivery in 3–7 days. You receive one final PNG; personal use included.",
    "Commercial use requires a separate license (+100% fee).",
    "No revisions. Artist's interpretation is final.",
  ];

  const waitlistUrl = "https://discord.gg/example";
  const status = {
    open: false,
    remainingSlots: 0,
    nextOpening: "March 2026",
    waitlistUrl,
  };

  const illustrationTypeCopy = {
    normal:
      "Standard proportions — your character as they are! My prices are for one character per piece, and we can go from simple portraits to full scenes. You get full control over pose, expression, and details so it feels exactly right.",
    chibi:
      "Cute, super-deformed style with big heads and tiny bodies — perfect for that adorable charm! Chibi art is slightly faster to create, so you'll get a small discount on the base price. Great for icons, stickers, or when you want your character looking extra precious and huggable!",
    skeb:
      "You give me your character and a bit of direction, and I run with it! Fast turnaround, no revision rounds — just my full creative take. Perfect if you love surprise and trust the process.",
  };

  const renderingCopy = {
    sketch: "Clean lines and a light, expressive feel — no full color or heavy shading! Great for concepts, emotes, or when you want that raw sketch look. Quick and full of personality!",
    colored_sketch:
      "Your sketch gets a splash of color! Still loose and sketchy, but with mood and life. Perfect if you want more than black-and-white without going full rendered.",
    experimental:
      "Where I try new techniques, mixes, or styles — priced a bit more than Colored Sketch but lighter than Cel Shaded. You get something unique and one-of-a-kind.",
    cel_shaded:
      "Flat colors with clear, crisp shading — that classic anime and game look! Clean and readable, and it pops. One of my most popular styles for character art and icons!",
    semi_rendered:
      "A sweet spot between cel-shaded and fully rendered! More depth and soft shading, but we keep the focus on your character.",
    fully_rendered:
      "The full treatment — detailed lighting, shading, and finish! Best when you want maximum polish and that premium look.",
  };

  illustrationTypes.forEach((t) => {
    if (illustrationTypeCopy[t.id]) t.desc = illustrationTypeCopy[t.id];
  });
  renderingStyles.forEach((t) => {
    if (renderingCopy[t.id]) t.desc = renderingCopy[t.id];
  });
  catalog.character.forEach((t) => {
    if (t.id === "char_design") t.description = "Design a new character based on given inspirations and references";
    if (t.id === "char_revamp") t.description = "Redesign your existing character";
    if (t.id === "chibify") t.description = "Make a chibi version of your character";
    if (t.id === "clothes") t.description = "Add a new outfit design";
  });
  catalog.bundle.forEach((t) => {
    if (t.id === "bundle_chibi_pfp") {
      t.name = "Chibi PFP";
      t.description = "Includes 2 Chibi Headshot Icons.";
    }
    if (t.id === "bundle_couple_pfp") {
      t.name = "Couple PFP";
      t.description = "Includes 2 Headshot Icons.";
    }
    if (t.id === "bundle_a") t.description = "Includes 2 Full-Body Illustrations and 1 Half-Body Illustration.";
    if (t.id === "bundle_b")
      t.description = "Includes 4 Full-Body Illustrations, 2 Half-Body Illustrations, and 2 Headshot Icons.";
    if (t.id === "bundle_c")
      t.description =
        "Includes 2 Full-Body Illustrations, 4 Half-Body Illustrations, 2 Headshot Icons, and 1 Chibi Full-Body Illustration.";
    if (t.id === "bundle_d")
      t.description =
        "Includes 3 Full-Body Illustrations, 2 Half-Body Illustrations, 1 Headshot Icon, 2 Chibi Full-Body Illustrations, and 2 Chibi Headshot Icons.";
  });

  function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  function find(arr, id) {
    return arr.find((x) => x.id === id);
  }

  function modularPhpKey(cfg) {
    const ill = cfg.illustrationTypeId;
    const type = cfg.commissionTypeId;
    if (type === "doodlepage" && cfg.doodlePackageId) {
      return `${ill}:doodlepage:${cfg.doodlePackageId}`;
    }
    return `${ill}:${type}`;
  }

  function modularBaseUsd(cfg) {
    const ill = find(illustrationTypes, cfg.illustrationTypeId);
    const type = find(commissionTypes, cfg.commissionTypeId);
    if (!ill || !type) return 0;

    if (cfg.illustrationTypeId === "skeb") {
      const key =
        cfg.commissionTypeId === "doodlepage" && cfg.doodlePackageId
          ? `doodlepage:${cfg.doodlePackageId}`
          : cfg.commissionTypeId;
      return skebBaseUsd[key] || 0;
    }

    if (cfg.commissionTypeId === "doodlepage") {
      const pkg = find(doodlePackages, cfg.doodlePackageId);
      if (!pkg) return 0;
      return pkg.basePriceUsd * ill.multiplier;
    }

    return type.basePriceUsd * ill.multiplier;
  }

  function modularPriceUsd(cfg) {
    const style = find(renderingStyles, cfg.renderingStyleId);
    if (!style) return 0;
    return round2(modularBaseUsd(cfg) * style.multiplier);
  }

  function modularPricePhp(cfg) {
    const style = find(renderingStyles, cfg.renderingStyleId);
    if (!style) return 0;
    const key = modularPhpKey(cfg);
    if (phpExclusive[key] != null) {
      return round2(phpExclusive[key] * style.multiplier);
    }
    return round2(modularPriceUsd(cfg) * PHP_RATE);
  }

  function getModularLabel(cfg) {
    const ill = find(illustrationTypes, cfg.illustrationTypeId)?.label || "?";
    const type = find(commissionTypes, cfg.commissionTypeId)?.label || "?";
    const style = find(renderingStyles, cfg.renderingStyleId)?.label || "?";
    let label = `${ill} · ${type} · ${style}`;
    if (cfg.commissionTypeId === "doodlepage" && cfg.doodlePackageId) {
      const pkg = find(doodlePackages, cfg.doodlePackageId)?.label;
      if (pkg) label += ` · ${pkg}`;
    }
    return label;
  }

  function getModularPreviewKey(cfg) {
    if (!cfg?.illustrationTypeId || !cfg?.commissionTypeId || !cfg?.renderingStyleId) return null;
    let key = `preview_${cfg.illustrationTypeId}_${cfg.commissionTypeId}_${cfg.renderingStyleId}`;
    if (cfg.commissionTypeId === "doodlepage" && cfg.doodlePackageId) {
      key += `_${cfg.doodlePackageId}`;
    }
    return key;
  }

  function catalogUnitUsd(typeId) {
    for (const cat of Object.values(catalog)) {
      const t = cat.find((x) => x.id === typeId);
      if (t) return t.basePriceUsd;
    }
    return 0;
  }

  function catalogUnitPhp(typeId) {
    for (const cat of Object.values(catalog)) {
      const t = cat.find((x) => x.id === typeId);
      if (t) {
        if (t.basePricePhp != null) return t.basePricePhp;
        return round2(t.basePriceUsd * PHP_RATE);
      }
    }
    return 0;
  }

  function findCatalogType(typeId) {
    for (const [cat, list] of Object.entries(catalog)) {
      const t = list.find((x) => x.id === typeId);
      if (t) return { ...t, category: cat };
    }
    return null;
  }

  function bundleQtyPercent(count) {
    if (count < 2) return 0;
    if (count === 2) return 10;
    if (count <= 4) return 15;
    if (count <= 7) return 20;
    return 25;
  }

  function bundleValueBonus(subtotalUsd) {
    if (subtotalUsd < 100) return 0;
    if (subtotalUsd < 200) return 2;
    if (subtotalUsd < 300) return 5;
    return 7;
  }

  function customBundleTotalUsd(configs) {
    const sub = configs.reduce((s, c) => s + modularPriceUsd(c), 0);
    const pct = Math.min(99, bundleQtyPercent(configs.length) + bundleValueBonus(sub));
    return { subtotal: round2(sub), percent: pct, total: round2(sub * (1 - pct / 100)) };
  }

  function lineBaseInCurrency(item, currency) {
    if (item.typeId === "modular" && item.modularConfig) {
      return currency === "PHP" ? modularPricePhp(item.modularConfig) : modularPriceUsd(item.modularConfig);
    }
    if (item.typeId === "custom_bundle" && item.bundleItems) {
      const { total } = customBundleTotalUsd(item.bundleItems);
      return currency === "PHP" ? round2(total * PHP_RATE) : total;
    }
    if (currency === "PHP") return catalogUnitPhp(item.typeId);
    return catalogUnitUsd(item.typeId);
  }

  function lineSubtotal(item, currency) {
    const unit = lineBaseInCurrency(item, currency);
    let add = 0;
    const qty = item.quantity || 1;
    (item.addOnIds || []).forEach((aid) => {
      const a = find(addOns, aid);
      if (!a) return;
      if (a.kind === "commercial") {
        add += unit;
      } else {
        const p = currency === "PHP" ? round2(a.priceUsd * PHP_RATE) : a.priceUsd;
        add += p * qty;
      }
    });
    return round2(unit * qty + add);
  }

  function validateDiscount(code, items) {
    const c = discountCodes.find((d) => d.code === code.toUpperCase());
    if (!c) return { ok: false, error: "invalid" };
    if (c.appliesTo !== "all") {
      const hit = items.some((i) => i.typeId === c.appliesTo);
      if (!hit) return { ok: false, error: "not_applicable" };
    }
    return { ok: true, discount: c };
  }

  function discountAmountUsd(discount, items) {
    if (!discount) return 0;
    const subUsd = items.reduce((s, i) => s + lineSubtotal(i, "USD"), 0);
    if (discount.type === "percent") return round2(subUsd * (discount.value / 100));
    return Math.min(discount.value, subUsd);
  }

  function orderTotals(items, currency, discount) {
    const rate = currency === "PHP" ? PHP_RATE : 1;
    const subtotal = round2(items.reduce((s, i) => s + lineSubtotal(i, currency), 0));
    const discUsd = discountAmountUsd(discount, items);
    const disc = round2(discUsd * rate);
    const total = Math.max(0, round2(subtotal - disc));
    const downpayment = round2(total * 0.5);
    return {
      subtotal,
      discount: disc,
      total,
      downpayment,
      balance: round2(total - downpayment),
    };
  }

  function deliveryCopy(item) {
    if (!item) return "2–4 weeks";
    if ((item.addOnIds || []).includes("rush")) return "3 business days";
    if (item.modularConfig?.illustrationTypeId === "skeb") return "3–7 days";
    if (item.modularConfig?.commissionTypeId === "doodlepage") return "1–2 days (max 5)";
    if (item.typeId === "custom_bundle" && item.bundleItems?.some((b) => b.illustrationTypeId === "skeb")) {
      return "3–7 days (Surprise Me items)";
    }
    return "2–4 weeks";
  }

  function visibleAddOns(item, currency) {
    let list = addOns.slice();
    const cfg = item?.modularConfig;
    const isSkeb = cfg?.illustrationTypeId === "skeb";
    const isDoodle = cfg?.commissionTypeId === "doodlepage";
    if (isSkeb || isDoodle) {
      list = list.filter((a) => !addOnsHiddenForSkebDoodle.includes(a.id));
    }
    if (currency === "Others") {
      list = list.filter((a) => !addOnsDisabledForOthers.includes(a.id));
    }
    return list;
  }

  function formatMoney(amount, currency) {
    if (currency === "PHP") return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    if (currency === "Others") return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*`;
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function makeOrderId() {
    const y = new Date().getFullYear();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `C${y}-${rand}`;
  }

  function isModularComplete(cfg) {
    if (!cfg?.illustrationTypeId || !cfg?.commissionTypeId || !cfg?.renderingStyleId) return false;
    if (cfg.commissionTypeId === "doodlepage") {
      return !!(cfg.doodlePackageId && cfg.poseDirection);
    }
    return true;
  }

  function emoteAllowed(illId) {
    return illId === "chibi";
  }

  return {
    PHP_RATE,
    illustrationTypes,
    commissionTypes,
    renderingStyles,
    doodlePackages,
    catalog,
    addOns,
    discountCodes,
    payments,
    termsDos,
    termsDonts,
    termsOfService,
    skebHowItWorks,
    waitlistUrl,
    status,
    round2,
    modularPriceUsd,
    modularPricePhp,
    getModularLabel,
    getModularPreviewKey,
    findCatalogType,
    customBundleTotalUsd,
    bundleQtyPercent,
    bundleValueBonus,
    lineSubtotal,
    lineBaseInCurrency,
    validateDiscount,
    orderTotals,
    deliveryCopy,
    visibleAddOns,
    formatMoney,
    makeOrderId,
    isModularComplete,
    emoteAllowed,
    find,
  };
})();
