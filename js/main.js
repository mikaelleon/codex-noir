/* Mikaelleon — theme, profile, chrome, interactions */

(function () {
  const THEME_KEY = "mikaelleon-theme";
  const PROFILE_KEY = "home-profile-mode";
  const html = document.documentElement;

  /* Theme */
  function applyTheme(mode) {
    if (mode === "light") {
      html.classList.add("light");
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
      html.classList.remove("light");
    }
    localStorage.setItem(THEME_KEY, mode);
    document.querySelectorAll("[data-theme-icon]").forEach((el) => {
      el.textContent = mode === "light" ? "☀" : "☾";
      el.setAttribute("aria-label", mode === "light" ? "Switch to dark" : "Switch to light");
    });
  }

  const storedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(storedTheme === "light" ? "light" : "dark");

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    const next = html.classList.contains("light") ? "dark" : "light";
    applyTheme(next);
  });

  /* Profile mode (home) */
  function applyProfile(mode) {
    const m = mode === "developer" ? "developer" : "artist";
    document.body.dataset.profile = m;
    localStorage.setItem(PROFILE_KEY, m);
    document.querySelectorAll("[data-profile-btn]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.profileBtn === m);
    });
    document.querySelectorAll("[data-profile-copy]").forEach((el) => {
      const key = el.dataset.profileCopy;
      const val = el.dataset[m];
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll("[data-artist-href], [data-developer-href]").forEach((el) => {
      const href = m === "developer" ? el.dataset.developerHref : el.dataset.artistHref;
      if (href) el.setAttribute("href", href);
    });
  }

  const storedProfile = localStorage.getItem(PROFILE_KEY) || "artist";
  if (document.body) applyProfile(storedProfile);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-profile-btn]");
    if (!btn) return;
    applyProfile(btn.dataset.profileBtn);
  });

  /* Mobile nav */
  const sheet = document.querySelector("[data-nav-sheet]");
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-nav-open]")) {
      sheet?.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    if (e.target.closest("[data-nav-close]")) {
      sheet?.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  /* Active nav link */
  const path = location.pathname.replace(/\/$/, "") || "/";
  const file = path.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav] a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const name = href.split("/").pop();
    if (
      (file === "index.html" && (name === "index.html" || name === "" || href === "./" || href === "/")) ||
      (name && name === file)
    ) {
      a.classList.add("active");
    }
  });

  /* Scroll top */
  const scrollBtn = document.querySelector("[data-scroll-top]");
  let lastY = 0;
  let idleTimer;
  function updateScrollTop() {
    const y = window.scrollY;
    const past = y > 400;
    const goingUp = y < lastY;
    if (past && (goingUp || scrollBtn?.dataset.forceShow === "1")) {
      scrollBtn?.classList.add("visible");
    } else if (!past) {
      scrollBtn?.classList.remove("visible");
    } else {
      scrollBtn?.classList.add("visible");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => scrollBtn?.classList.add("visible"), 150);
    }
    lastY = y;
  }
  window.addEventListener("scroll", updateScrollTop, { passive: true });
  scrollBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* Hero parallax */
  const heroBg = document.querySelector("[data-hero-bg]");
  const hero = document.querySelector("[data-hero]");
  if (heroBg && hero) {
    window.addEventListener(
      "scroll",
      () => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
        heroBg.style.transform = `translateY(${progress * 25}%)`;
      },
      { passive: true }
    );
  }

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "-80px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* Progress meters */
  document.querySelectorAll("[data-meter]").forEach((el) => {
    const target = el.dataset.meter;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              el.style.width = target + "%";
              io.unobserve(el);
            }
          });
        },
        { threshold: 0.3 }
      );
      io.observe(el);
    } else {
      el.style.width = target + "%";
    }
  });

  /* FAQ accordion */
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-faq-trigger]");
    if (!trigger) return;
    const item = trigger.closest(".faq-item");
    item?.classList.toggle("open");
  });

  /* Archive tabs */
  document.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-archive-tab]");
    if (!tab) return;
    const id = tab.dataset.archiveTab;
    document.querySelectorAll("[data-archive-tab]").forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll("[data-archive-panel]").forEach((p) => {
      p.classList.toggle("hidden", p.dataset.archivePanel !== id);
    });
    document.querySelectorAll("[data-archive-img]").forEach((img) => {
      img.classList.toggle("active", img.dataset.archiveImg === id);
    });
  });

  /* Inquiry / contact toast */
  function showToast(msg) {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3200);
  }

  document.querySelectorAll("[data-inquiry-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast(
        (window.SiteData && window.SiteData.contact.toastForm) ||
          "Thanks for reaching out — I'll respond within 48 hours."
      );
      form.reset();
    });
  });

  window.Mikaelleon = Object.assign(window.Mikaelleon || {}, { toast: showToast });

  /* Portfolio filters + load more + lightbox */
  const gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    const FILTER_KEY = "gallery-filters";
    let state = { view: "all", category: "all" };
    try {
      state = { ...state, ...JSON.parse(localStorage.getItem(FILTER_KEY) || "{}") };
    } catch (_) {}

    const tiles = [...gallery.querySelectorAll("[data-tile]")];
    let shown = 16;

    function save() {
      localStorage.setItem(FILTER_KEY, JSON.stringify(state));
    }

    function matches(tile) {
      const cat = tile.dataset.category || "";
      const featured = tile.dataset.featured === "1";
      const recent = tile.dataset.recent === "1";
      if (state.category !== "all" && cat !== state.category) return false;
      if (state.view === "featured" && !featured) return false;
      if (state.view === "recent" && !recent) return false;
      return true;
    }

    function render() {
      let count = 0;
      tiles.forEach((tile) => {
        const ok = matches(tile);
        if (!ok) {
          tile.classList.add("hidden");
          return;
        }
        count++;
        tile.classList.toggle("hidden", count > shown);
      });
      const btn = document.querySelector("[data-load-more]");
      const total = tiles.filter(matches).length;
      if (btn) btn.classList.toggle("hidden", shown >= total);
      document.querySelectorAll("[data-filter-view]").forEach((b) => {
        b.classList.toggle("active", b.dataset.filterView === state.view);
      });
      document.querySelectorAll("[data-filter-cat]").forEach((b) => {
        b.classList.toggle("active", b.dataset.filterCat === state.category);
      });
    }

    document.addEventListener("click", (e) => {
      const v = e.target.closest("[data-filter-view]");
      const c = e.target.closest("[data-filter-cat]");
      const more = e.target.closest("[data-load-more]");
      const tile = e.target.closest("[data-tile]");
      if (v) {
        state.view = v.dataset.filterView;
        shown = 16;
        save();
        render();
      }
      if (c) {
        state.category = c.dataset.filterCat;
        shown = 16;
        save();
        render();
      }
      if (more) {
        shown += 16;
        render();
      }
      if (tile && gallery.contains(tile)) {
        const lb = document.querySelector("[data-lightbox]");
        const img = lb?.querySelector("img");
        const src = tile.dataset.full || tile.querySelector("img")?.src;
        if (lb && img && src) {
          img.src = src;
          img.alt = tile.dataset.title || "";
          lb.classList.add("open");
        }
      }
    });

    document.querySelector("[data-lightbox-close]")?.addEventListener("click", () => {
      document.querySelector("[data-lightbox]")?.classList.remove("open");
    });
    document.querySelector("[data-lightbox]")?.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-lightbox")) {
        e.currentTarget.classList.remove("open");
      }
    });

    render();
  }

  /* Commissions UI lives in js/commissions.js (data-comm-root). */

  /* Track lookup */
  document.querySelector("[data-track-form]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("[name='order']");
    const id = (input?.value || "").trim().toUpperCase();
    const demo = { "C2026-001": "In Progress", "C2026-002": "Queued" };
    const result = document.querySelector("[data-track-result]");
    if (!result) return;
    if (demo[id]) {
      result.innerHTML = `<div class="card" style="padding:1.25rem"><h2 class="section-h2" style="font-size:1rem;margin-bottom:0.5rem">${id}</h2><p class="text-muted" style="margin:0">Status: <span class="text-primary-accent">${demo[id]}</span></p><p class="text-muted" style="margin:0.75rem 0 0;font-size:0.875rem">Demo timeline · ETA placeholder · WIP notes n/a.</p></div>`;
    } else {
      result.innerHTML = `<p class="text-muted">No order found. Try C2026-001 or C2026-002.</p>`;
    }
  });
  const params = new URLSearchParams(location.search);
  if (params.get("order") && document.querySelector("[data-track-form]")) {
    const input = document.querySelector("[name='order']");
    if (input) {
      input.value = params.get("order");
      document.querySelector("[data-track-form]").requestSubmit();
    }
  }

  /* 404 redirect */
  if (document.body.dataset.notFound === "1") {
    setTimeout(() => {
      location.href = "index.html";
    }, 10000);
  }
})();
