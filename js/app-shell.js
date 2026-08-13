/* Codex Noir shell — one job per view; content from SiteData (no duplicate dumps) */
(function () {
  const root = document.querySelector("[data-pf-shell]");
  if (!root) return;

  const D = window.SiteData;
  if (!D) {
    console.error("SiteData missing — load js/site-data.js first");
    return;
  }

  const live = root.querySelector("[data-pf-live]");
  const PROFILE_KEY = "home-profile-mode";
  const SECTIONS = ["home", "about", "projects", "contact"];

  /* IA:
   * Home    → unlock hero, intro, CTAs, featured preview, jump links
   * About   → full bio / journey / tools / education
   * Work    → projects (dev) or gallery (art)
   * Contact → letter, commission status, FAQ (once)
   */

  const state = {
    section: null,
    projectIdx: 0,
    faqOpen: 0,
    galleryFilter: "featured",
    homeWorkFilter: "all",
    nameUnlocked: false,
    aboutOpen: "about",
    cvOpen: { skills: false, interests: false },
    spoilers: { address: false, phone: false, dob: false },
  };

  function icon(name) {
    const common =
      'xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    const paths = {
      mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
      clock:
        '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      heart:
        '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
      briefcase:
        '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
      github:
        '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
      linkedin:
        '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
      twitter:
        '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
      instagram:
        '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
      send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
      unlock:
        '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
      lock:
        '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      download:
        '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
      star: '<path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" fill="currentColor" stroke="none"/>',
      copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
      activity:
        '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
      commit:
        '<circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/>',
      "git-branch":
        '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
      "git-pull-request":
        '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>',
      "git-fork":
        '<circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 2.5-2 4-6 4s-6-1.5-6-4V9"/>',
      "git-issue":
        '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
      "star-outline":
        '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    };
    return "<svg " + common + ">" + (paths[name] || "") + "</svg>";
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function mode() {
    return document.body.dataset.profile === "developer" ? "developer" : "artist";
  }

  function isDev() {
    return mode() === "developer";
  }

  function profile() {
    return D.profiles[mode()];
  }

  function announce(msg) {
    if (!live) return;
    live.textContent = "";
    requestAnimationFrame(() => {
      live.textContent = msg;
    });
  }

  function isNarrow() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function footHtml() {
    const s = D.socials;
    return (
      '<footer class="pf-site-foot">' +
      '<div><div class="pf-site-foot__brand">' +
      escapeHtml(D.brand.name) +
      '</div><span class="pf-site-foot__role">' +
      escapeHtml(D.brand.tagline) +
      "</span></div>" +
      '<div class="pf-site-foot__links">' +
      '<a href="' +
      escapeHtml(s.email) +
      '">' +
      escapeHtml(D.brand.email) +
      "</a>" +
      '<a href="' +
      escapeHtml(s.github) +
      '" target="_blank" rel="noopener">GitHub</a>' +
      '<a href="' +
      escapeHtml(s.instagram) +
      '" target="_blank" rel="noopener">Instagram</a>' +
      '<a href="' +
      escapeHtml(s.linkedin) +
      '" target="_blank" rel="noopener">LinkedIn</a>' +
      "</div>" +
      '<div class="pf-site-foot__copy">© 2026 ' +
      escapeHtml(D.brand.name) +
      ". All rights reserved.</div></footer>"
    );
  }

  function ctaButtonsHtml(ctas) {
    return (
      '<div class="pf-btn-row">' +
      ctas
        .map((c, i) => {
          const solid = i === 0;
          if (c.href) {
            return (
              '<a class="pf-btn ' +
              (solid ? "pf-btn--solid" : "pf-btn--ghost") +
              '" href="' +
              escapeHtml(c.href) +
              '"' +
              (c.download ? " download" : "") +
              ">" +
              escapeHtml(c.label) +
              "</a>"
            );
          }
          return (
            '<button type="button" class="pf-btn ' +
            (solid ? "pf-btn--solid" : "pf-btn--ghost") +
            '" data-pf-nav="' +
            escapeHtml(c.action) +
            '">' +
            escapeHtml(c.label) +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  /* —— HOME: teaser only —— */
  function homeWorkProjects() {
    const f = state.homeWorkFilter || "all";
    return (D.projects || []).filter(
      (p) => p.featured && (f === "all" || p.kind === f)
    );
  }

  function featuredPreviewHtml() {
    const p = profile();
    if (isDev()) {
      const items = homeWorkProjects();
      // Temporarily hide project-type filters on home.
      // const filter = state.homeWorkFilter || "all";
      // const filters = [
      //   { id: "all", label: "All" },
      //   { id: "frontend", label: "Frontend" },
      //   { id: "fullstack", label: "Fullstack" },
      // ];
      // const filtersHtml =
      //   '<div class="pf-work-filters" role="tablist" aria-label="Project type">' +
      //   filters
      //     .map(
      //       (f) =>
      //         '<button type="button" class="pf-work-filter" data-home-work-filter="' +
      //         f.id +
      //         '" role="tab" aria-selected="' +
      //         (filter === f.id) +
      //         '">' +
      //         escapeHtml(f.label) +
      //         "</button>"
      //     )
      //     .join("") +
      //   "</div>";

      return (
        '<div class="pf-sec pf-work-home" data-pf-work-home>' +
        '<header class="pf-work-home__head">' +
        "<div>" +
        '<h3 class="pf-gh__title">Selected Projects</h3>' +
        "</div>" +
        "</header>" +
        '<div class="pf-project-grid">' +
        (items.length
          ? items
              .map((proj) => {
                const kind = (proj.kind || "frontend").toUpperCase();
                const source = proj.source || proj.href || "#";
                const demo = proj.demo || "";
                const sourceExt = /^https?:/i.test(source);
                const demoExt = /^https?:/i.test(demo);
                return (
                  '<article class="pf-pcard">' +
                  '<div class="pf-pcard__topline">' +
                  '<span class="pf-pcard__kind">' +
                  escapeHtml(kind) +
                  "</span>" +
                  (proj.featured
                    ? '<span class="pf-pcard__badge">Featured</span>'
                    : "") +
                  "</div>" +
                  '<h4 class="pf-pcard__title">' +
                  escapeHtml(proj.title) +
                  "</h4>" +
                  '<p class="pf-pcard__desc">' +
                  escapeHtml(proj.description) +
                  "</p>" +
                  '<div class="pf-tags">' +
                  (proj.tags || [])
                    .map((t) => '<span class="pf-tag">' + escapeHtml(t) + "</span>")
                    .join("") +
                  "</div>" +
                  '<div class="pf-pcard__links">' +
                  (demo
                    ? '<a class="pf-pcard__source" href="' +
                      escapeHtml(demo) +
                      '"' +
                      (demoExt ? ' target="_blank" rel="noopener"' : "") +
                      ">Live —▸</a>"
                    : "") +
                  '<a class="pf-pcard__source" href="' +
                  escapeHtml(source) +
                  '"' +
                  (sourceExt ? ' target="_blank" rel="noopener"' : "") +
                  ">" +
                  icon("git-branch") +
                  " Source</a></div></article>"
                );
              })
              .join("")
          : '<p class="pf-gh__status">No projects in this filter.</p>') +
        "</div>" +
        '<div class="pf-work-home__more">' +
        '<button type="button" class="pf-btn pf-btn--ghost" data-pf-nav="projects">View all projects —▸</button>' +
        "</div></div>"
      );
    }

    const items = D.gallery.filter((g) => g.featured).slice(0, 6);
    return (
      '<div class="pf-sec">' +
      '<h3 class="pf-sec__head pf-sec__head--plus">' +
      escapeHtml(p.featuredEyebrow) +
      "</h3>" +
      '<p class="pf-body" style="margin-bottom:18px">' +
      escapeHtml(p.featuredSub) +
      "</p>" +
      '<div class="pf-gallery-grid">' +
      items
        .map(
          (g) =>
            '<button type="button" class="pf-gcell" data-pf-nav="projects" title="' +
            escapeHtml(g.title) +
            '"><img src="' +
            escapeHtml(D.galleryImage(g.id)) +
            '" alt="' +
            escapeHtml(g.title) +
            '" loading="lazy" decoding="async" /></button>'
        )
        .join("") +
      "</div>" +
      '<div style="text-align:center;margin-top:28px">' +
      '<button type="button" class="pf-btn pf-btn--ghost" data-pf-nav="projects">View full portfolio —▸</button>' +
      "</div></div>"
    );
  }

  function jumpHtml() {
    return (
      '<nav class="pf-tabs pf-jumps" aria-label="Continue">' +
      '<button type="button" data-pf-nav="about">About</button>' +
      '<button type="button" data-pf-nav="projects">Work</button>' +
      '<button type="button" data-pf-nav="contact">Contact</button>' +
      "</nav>"
    );
  }

  function githubActivityHtml() {
    if (!isDev()) return "";
    const gh = D.github || {};
    const user = gh.username || "mikaelleon";
    const profileUrl = gh.profileUrl || "https://github.com/" + user;

    return (
      '<section class="pf-sec pf-gh" data-pf-gh aria-label="Coding activity">' +
      '<header class="pf-gh__head">' +
      "<div>" +
      '<p class="pf-gh__kicker">' +
      escapeHtml(gh.eyebrow || "Activity") +
      "</p>" +
      '<h3 class="pf-gh__title">' +
      escapeHtml(gh.title || "Coding Activity") +
      "</h3>" +
      '<p class="pf-gh__sub">' +
      escapeHtml(gh.sub || "My contributions over the last year.") +
      "</p></div>" +
      '<div class="pf-gh__head-stats" aria-live="polite">' +
      '<div class="pf-gh__stat"><strong data-pf-gh-total>—</strong><span>Total</span></div>' +
      '<div class="pf-gh__stat"><strong data-pf-gh-streak>—</strong><span>Streak</span></div>' +
      "</div></header>" +
      '<div class="pf-gh__chart" data-pf-gh-chart role="img" aria-label="GitHub contribution chart for @' +
      escapeHtml(user) +
      '">' +
      '<p class="pf-gh__status">Loading contribution graph…</p>' +
      "</div>" +
      '<div class="pf-gh__split">' +
      '<div class="pf-gh__recent">' +
      '<h4 class="pf-gh__col-head">' +
      icon("activity") +
      " Recent Activity</h4>" +
      '<ul class="pf-gh__feed" data-pf-gh-feed>' +
      '<li class="pf-gh__status">Loading recent activity…</li>' +
      "</ul></div>" +
      '<div class="pf-gh__overview">' +
      '<h4 class="pf-gh__col-head">' +
      icon("star-outline") +
      " Overview</h4>" +
      '<div class="pf-gh__cards" data-pf-gh-overview>' +
      '<p class="pf-gh__status">Loading overview…</p>' +
      "</div></div></div>" +
      '<div class="pf-gh__actions">' +
      '<a class="pf-btn pf-btn--ghost" href="' +
      escapeHtml(profileUrl) +
      '" target="_blank" rel="noopener">' +
      icon("github") +
      " View @" +
      escapeHtml(user) +
      " on GitHub —▸</a>" +
      "</div></section>"
    );
  }

  function renderGithubChart(contributions) {
    const mount = root.querySelector("[data-pf-gh-chart]");
    if (!mount) return;

    const levels = ((D.github && D.github.chartLevels) || [
      "#0C0A10",
      "#5a4528",
      "#8a6b35",
      "#b8935b",
      "#e8c77a",
    ]).slice();
    levels[0] = "var(--gh-empty, #0C0A10)";

    const byDate = new Map();
    (contributions || []).forEach((c) => {
      if (c && c.date) byDate.set(c.date, c);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    while (start.getDay() !== 0) start.setDate(start.getDate() - 1);

    const weeks = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const week = [];
      for (let d = 0; d < 7; d += 1) {
        if (cursor > end) {
          week.push(null);
        } else {
          const key =
            cursor.getFullYear() +
            "-" +
            String(cursor.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(cursor.getDate()).padStart(2, "0");
          const hit = byDate.get(key);
          const level = hit
            ? Math.max(0, Math.min(4, Number(hit.level != null ? hit.level : hit.count > 0 ? 1 : 0)))
            : 0;
          week.push({
            date: key,
            level: cursor > today ? -1 : level,
            count: hit ? hit.count || 0 : 0,
          });
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    const cell = 11;
    const gap = 3;
    const left = 28;
    const top = 18;
    const width = left + weeks.length * (cell + gap);
    const height = top + 7 * (cell + gap) + 4;
    const months = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const day = week.find((d) => d);
      if (!day) return;
      const m = Number(day.date.slice(5, 7)) - 1;
      if (m !== lastMonth) {
        months.push({
          label: new Date(day.date + "T12:00:00").toLocaleString("en", {
            month: "short",
          }),
          x: left + wi * (cell + gap),
        });
        lastMonth = m;
      }
    });

    const dow = [
      { label: "Mon", row: 1 },
      { label: "Wed", row: 3 },
      { label: "Fri", row: 5 },
    ];

    let total = 0;
    let streak = 0;
    let streakBroken = false;
    const dayList = [];
    weeks.forEach((week) => {
      week.forEach((day) => {
        if (day && day.level >= 0) dayList.push(day);
      });
    });
    for (let i = dayList.length - 1; i >= 0; i -= 1) {
      const day = dayList[i];
      total += day.count || 0;
      if (!streakBroken) {
        if (day.count > 0) streak += 1;
        else if (i !== dayList.length - 1) streakBroken = true;
      }
    }

    const totalEl = root.querySelector("[data-pf-gh-total]");
    const streakEl = root.querySelector("[data-pf-gh-streak]");
    if (totalEl) totalEl.textContent = total.toLocaleString();
    if (streakEl) streakEl.textContent = String(streak);

    const year = today.getFullYear();

    let cells = "";
    weeks.forEach((week, wi) => {
      week.forEach((day, di) => {
        if (!day || day.level < 0) return;
        const fill = levels[day.level] || levels[0];
        const x = left + wi * (cell + gap);
        const y = top + di * (cell + gap);
        cells +=
          '<rect x="' +
          x +
          '" y="' +
          y +
          '" width="' +
          cell +
          '" height="' +
          cell +
          '" rx="0" fill="' +
          fill +
          '" stroke="rgba(184,147,91,0.18)" stroke-width="0.5"><title>' +
          escapeHtml(day.date) +
          ": " +
          day.count +
          " contribution" +
          (day.count === 1 ? "" : "s") +
          "</title></rect>";
      });
    });

    mount.innerHTML =
      '<svg class="pf-gh__svg" viewBox="0 0 ' +
      width +
      " " +
      height +
      '" width="' +
      width +
      '" height="' +
      height +
      '" role="presentation">' +
      months
        .map(
          (m) =>
            '<text x="' +
            m.x +
            '" y="10" class="pf-gh__axis">' +
            escapeHtml(m.label) +
            "</text>"
        )
        .join("") +
      dow
        .map(
          (d) =>
            '<text x="0" y="' +
            (top + d.row * (cell + gap) + cell - 1) +
            '" class="pf-gh__axis">' +
            d.label +
            "</text>"
        )
        .join("") +
      cells +
      "</svg>" +
      '<div class="pf-gh__chart-foot">' +
      '<p class="pf-gh__chart-count">' +
      total.toLocaleString() +
      " activities in " +
      year +
      "</p>" +
      '<div class="pf-gh__legend" aria-hidden="true">' +
      '<span class="pf-gh__legend-label">Less</span>' +
      levels
        .map(
          (c) =>
            '<span class="pf-gh__swatch" style="background:' +
            c +
            '"></span>'
        )
        .join("") +
      '<span class="pf-gh__legend-label">More</span>' +
      "</div></div>";
  }

  async function loadGithubChart() {
    const mount = root.querySelector("[data-pf-gh-chart]");
    if (!mount || !isDev()) return;

    const user = (D.github && D.github.username) || "mikaelleon";
    try {
      const res = await fetch(
        "https://github-contributions-api.jogruber.de/v4/" +
          encodeURIComponent(user) +
          "?y=last"
      );
      if (!res.ok) throw new Error("chart " + res.status);
      const data = await res.json();
      const list = Array.isArray(data.contributions) ? data.contributions : [];
      if (!list.length) throw new Error("empty chart");
      renderGithubChart(list);
    } catch (_) {
      mount.innerHTML =
        '<p class="pf-gh__status">Contribution graph unavailable right now.</p>';
    }
  }

  function formatGhTime(iso) {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (_) {
      return "";
    }
  }

  function relativeGhTime(iso) {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "";
    const sec = Math.max(0, Math.floor((Date.now() - then) / 1000));
    if (sec < 60) return "just now";
    if (sec < 3600) {
      const n = Math.floor(sec / 60);
      return n + " minute" + (n === 1 ? "" : "s") + " ago";
    }
    if (sec < 86400) {
      const n = Math.floor(sec / 3600);
      return n + " hour" + (n === 1 ? "" : "s") + " ago";
    }
    if (sec < 604800) {
      const n = Math.floor(sec / 86400);
      return n + " day" + (n === 1 ? "" : "s") + " ago";
    }
    return formatGhTime(iso);
  }

  function parseGhEvent(ev) {
    const repo = ev.repo?.name || "repository";
    const type = ev.type || "";
    const payload = ev.payload || {};
    const url = ev.repo?.name ? "https://github.com/" + ev.repo.name : "#";

    if (type === "PushEvent") {
      const n = (payload.commits && payload.commits.length) || payload.size || 1;
      const ref = String(payload.ref || "main").replace(/^refs\/heads\//, "");
      return {
        icon: "commit",
        repo: repo,
        text: "Pushed " + n + " commit" + (n === 1 ? "" : "s"),
        chip: ref,
        url: url,
      };
    }
    if (type === "CreateEvent") {
      const kind = payload.ref_type || "repository";
      return {
        icon: kind === "branch" ? "git-branch" : "commit",
        repo: repo,
        text: "Created " + kind + (payload.ref ? " " + payload.ref : ""),
        chip: payload.ref || kind,
        url: url,
      };
    }
    if (type === "ForkEvent") {
      return { icon: "git-fork", repo: repo, text: "Forked repository", chip: "fork", url: url };
    }
    if (type === "WatchEvent") {
      return { icon: "star-outline", repo: repo, text: "Starred repository", chip: "starred", url: url };
    }
    if (type === "IssuesEvent") {
      const n = payload.issue?.number;
      return {
        icon: "git-issue",
        repo: repo,
        text: (payload.action || "Updated") + " issue" + (payload.issue?.title ? " — " + payload.issue.title : ""),
        chip: n ? "#" + n : "issue",
        url: payload.issue?.html_url || url,
      };
    }
    if (type === "PullRequestEvent") {
      const n = payload.pull_request?.number;
      return {
        icon: "git-pull-request",
        repo: repo,
        text:
          (payload.action || "Updated") +
          " pull request" +
          (payload.pull_request?.title ? " — " + payload.pull_request.title : ""),
        chip: n ? "#" + n : "pr",
        url: payload.pull_request?.html_url || url,
      };
    }
    if (type === "PullRequestReviewEvent") {
      return {
        icon: "git-pull-request",
        repo: repo,
        text: "Reviewed a pull request",
        chip: "review",
        url: url,
      };
    }
    if (type === "ReleaseEvent") {
      return {
        icon: "star-outline",
        repo: repo,
        text: "Published a release",
        chip: payload.release?.tag_name || "release",
        url: url,
      };
    }
    return {
      icon: "activity",
      repo: repo,
      text: type.replace(/Event$/, "") + " on " + repo,
      chip: "event",
      url: url,
    };
  }

  function ghFeedItemHtml(item) {
    return (
      '<li class="pf-gh__item">' +
      '<a class="pf-gh__row" href="' +
      escapeHtml(item.url) +
      '" target="_blank" rel="noopener">' +
      '<span class="pf-gh__ico">' +
      icon(item.icon) +
      "</span>" +
      "<div>" +
      '<p class="pf-gh__row-top">' +
      '<span class="pf-gh__repo">' +
      escapeHtml(item.repo) +
      "</span>" +
      '<span class="pf-gh__when">· ' +
      escapeHtml(item.when) +
      "</span></p>" +
      '<p class="pf-gh__text">' +
      escapeHtml(item.text) +
      "</p>" +
      (item.chip
        ? '<span class="pf-gh__chip">' + escapeHtml(item.chip) + "</span>"
        : "") +
      "</div></a></li>"
    );
  }

  function githubFallbackHtml() {
    const items = (D.repos || []).slice(0, 4);
    if (!items.length) {
      return '<li class="pf-gh__status">Activity unavailable right now.</li>';
    }
    return items
      .map((r) =>
        ghFeedItemHtml({
          icon: "commit",
          repo: r.name,
          when: r.language || "Repo",
          text: r.description,
          chip: r.language || "repo",
          url: r.url,
        })
      )
      .join("");
  }

  function overviewCardsHtml(stats) {
    const cards = [
      { label: "Public Repos", value: stats.repos, note: "On GitHub" },
      { label: "Pull Requests", value: stats.prs, note: "In recent public events" },
      { label: "Code Reviews", value: stats.reviews, note: "In recent public events" },
    ];
    return cards
      .map(
        (c) =>
          '<article class="pf-gh__metric">' +
          '<p class="pf-gh__metric-label">' +
          escapeHtml(c.label) +
          "</p>" +
          '<p class="pf-gh__metric-value">' +
          escapeHtml(String(c.value)) +
          "</p>" +
          '<p class="pf-gh__metric-note">' +
          escapeHtml(c.note) +
          "</p></article>"
      )
      .join("");
  }

  async function loadGithubActivity() {
    const feed = root.querySelector("[data-pf-gh-feed]");
    const overview = root.querySelector("[data-pf-gh-overview]");
    if (!feed || !isDev()) return;

    const user = (D.github && D.github.username) || "mikaelleon";
    const headers = { Accept: "application/vnd.github+json" };

    try {
      const [evRes, userRes] = await Promise.all([
        fetch(
          "https://api.github.com/users/" +
            encodeURIComponent(user) +
            "/events/public?per_page=30",
          { headers: headers }
        ),
        fetch("https://api.github.com/users/" + encodeURIComponent(user), {
          headers: headers,
        }),
      ]);

      const events = evRes.ok ? await evRes.json() : [];
      const profile = userRes.ok ? await userRes.json() : {};
      const list = Array.isArray(events) ? events : [];

      if (!list.length) {
        feed.innerHTML = githubFallbackHtml();
      } else {
        feed.innerHTML = list
          .slice(0, 5)
          .map((ev) => {
            const parsed = parseGhEvent(ev);
            parsed.when = relativeGhTime(ev.created_at);
            return ghFeedItemHtml(parsed);
          })
          .join("");
      }

      if (overview) {
        overview.innerHTML = overviewCardsHtml({
          repos: profile.public_repos != null ? profile.public_repos : (D.repos || []).length,
          prs: list.filter((e) => e.type === "PullRequestEvent").length,
          reviews: list.filter((e) => e.type === "PullRequestReviewEvent").length,
        });
      }
    } catch (_) {
      feed.innerHTML = githubFallbackHtml();
      if (overview) {
        overview.innerHTML = overviewCardsHtml({
          repos: (D.repos || []).length,
          prs: "—",
          reviews: "—",
        });
      }
    }
  }

  function renderHome() {
    const mount = root.querySelector("[data-pf-home]");
    if (!mount) return;
    const p = profile();
    const portrait = isDev() ? D.brand.avatarDev : D.brand.avatarArtist;

    mount.innerHTML =
      '<header class="pf-hero-unlock">' +
      '<p class="pf-hero-unlock__kicker">Portfolio</p>' +
      '<h1 class="pf-hero-unlock__title">Unlocked</h1>' +
      "</header>" +
      '<div class="pf-intro">' +
      "<div>" +
      '<h2 class="pf-intro__name">' +
      escapeHtml(D.brand.name) +
      "</h2>" +
      '<p class="pf-about-role" style="margin-bottom:12px">' +
      escapeHtml(p.tagline) +
      "</p>" +
      '<p class="pf-body">' +
      escapeHtml(p.heroIntro) +
      "</p>" +
      ctaButtonsHtml(p.ctas) +
      '</div><div class="pf-intro__portrait"><img src="' +
      escapeHtml(portrait) +
      '" alt="" width="640" height="800" decoding="async" fetchpriority="low" /></div></div>' +
      jumpHtml() +
      githubActivityHtml() +
      featuredPreviewHtml() +
      '<div class="pf-cta-band">' +
      "<h2>Have a project in mind?</h2>" +
      "<p>Commissions and collabs land in one inbox.</p>" +
      '<button type="button" class="pf-btn pf-btn--solid" data-pf-nav="contact">Get in touch —▸</button>' +
      "</div>" +
      footHtml();

    if (isDev()) {
      const bootGithub = function () {
        loadGithubChart();
        loadGithubActivity();
      };
      if ("requestIdleCallback" in window) {
        requestIdleCallback(bootGithub, { timeout: 1800 });
      } else {
        setTimeout(bootGithub, 250);
      }
    }
  }

  /* —— ABOUT: timeline + tools/dev columns + unlockable name —— */
  function timelineInnerHtml() {
    return (
      '<ol class="pf-timeline">' +
      D.education
        .map(
          (e) =>
            '<li class="pf-timeline__item">' +
            '<span class="pf-timeline__dot" aria-hidden="true"></span>' +
            '<div class="pf-timeline__years">' +
            escapeHtml(e.years) +
            "</div>" +
            '<div class="pf-timeline__school">' +
            escapeHtml(e.school) +
            "</div>" +
            '<div class="pf-timeline__detail">' +
            escapeHtml(e.detail) +
            "</div></li>"
        )
        .join("") +
      "</ol>"
    );
  }

  function workExperienceInnerHtml() {
    const items = D.workExperience || [];
    return (
      '<ol class="pf-timeline pf-timeline--work">' +
      items
        .map(
          (w) =>
            '<li class="pf-timeline__item">' +
            '<span class="pf-timeline__dot" aria-hidden="true"></span>' +
            '<div class="pf-timeline__school">' +
            escapeHtml(w.title) +
            "</div>" +
            '<div class="pf-timeline__years pf-timeline__years--meta">' +
            escapeHtml(w.meta) +
            "</div>" +
            '<ul class="pf-timeline__bullets">' +
            (w.bullets || [])
              .map((b) => "<li>" + escapeHtml(b) + "</li>")
              .join("") +
            "</ul></li>"
        )
        .join("") +
      "</ol>"
    );
  }

  function personalDataInnerHtml() {
    const pd = D.personalData || {};
    const phone = (pd.phones || []).join(" / ");

    function spoilerCell(key, plain) {
      const open = !!state.spoilers[key];
      return (
        '<dd><button type="button" class="pf-spoiler' +
        (open ? " is-open" : "") +
        '" data-spoiler="' +
        key +
        '" aria-expanded="' +
        open +
        '" title="' +
        (open ? "Hide" : "Reveal") +
        '">' +
        (open
          ? '<span class="pf-spoiler__value">' + escapeHtml(plain) + "</span>"
          : '<span class="pf-spoiler__mask" aria-hidden="true">············</span><span class="pf-sr">Hidden — click to reveal</span>') +
        "</button></dd>"
      );
    }

    const rows = [
      { label: "Address", key: "address", value: pd.address, spoiler: true },
      { label: "Phone", key: "phone", value: phone, spoiler: true },
      { label: "Email", key: "email", value: pd.email, spoiler: false },
      { label: "Date of Birth", key: "dob", value: pd.dateOfBirth, spoiler: true },
      { label: "Citizenship", key: "citizenship", value: pd.citizenship, spoiler: false },
      { label: "Gender", key: "gender", value: pd.gender, spoiler: false },
      { label: "Civil Status", key: "civilStatus", value: pd.civilStatus, spoiler: false },
    ].filter((r) => r.value);

    return (
      '<dl class="pf-data-list">' +
      rows
        .map((r) => {
          let dd;
          if (r.spoiler) {
            dd = spoilerCell(r.key, r.value);
          } else if (r.key === "email") {
            dd =
              '<dd><a href="mailto:' +
              escapeHtml(r.value) +
              '">' +
              escapeHtml(r.value) +
              "</a></dd>";
          } else {
            dd = "<dd>" + escapeHtml(r.value) + "</dd>";
          }
          return (
            '<div class="pf-data-list__row"><dt>' +
            escapeHtml(r.label) +
            "</dt>" +
            dd +
            "</div>"
          );
        })
        .join("") +
      "</dl>"
    );
  }

  function listBodyHtml(items) {
    return (
      '<ul class="pf-spec-list">' +
      (items || []).map((s) => "<li>" + escapeHtml(s) + "</li>").join("") +
      "</ul>"
    );
  }

  function chipRowHtml(items) {
    return (
      '<div class="pf-chip-wrap">' +
      items.map((t) => '<span class="pf-chip">' + escapeHtml(t) + "</span>").join("") +
      "</div>"
    );
  }

  /* starSide: "left" | "right"; group: "story" | "cv" */
  function aboutAcc(id, title, bodyHtml, starSide, group) {
    const g = group || "story";
    const open = g === "cv" ? !!state.cvOpen[id] : state.aboutOpen === id;
    const star =
      '<span class="pf-acc__star" aria-hidden="true">' + icon("star") + "</span>";
    const label = '<span class="pf-acc__label">' + escapeHtml(title) + "</span>";
    return (
      '<div class="pf-acc' +
      (open ? " open" : "") +
      (starSide === "right" ? " pf-acc--star-end" : " pf-acc--star-start") +
      '">' +
      '<button type="button" class="pf-acc__head" data-about-acc="' +
      id +
      '" data-about-group="' +
      g +
      '" aria-expanded="' +
      open +
      '">' +
      (starSide === "right" ? label + star : star + label) +
      "</button>" +
      '<div class="pf-acc__panel"><div class="pf-acc__inner">' +
      bodyHtml +
      "</div></div></div>"
    );
  }

  function aboutActionsHtml() {
    const unlocked = state.nameUnlocked;
    const reveal =
      '<button type="button" class="pf-about-action pf-about-action--ghost' +
      (unlocked ? " is-active" : "") +
      '" data-unlock-name aria-pressed="' +
      unlocked +
      '">' +
      icon(unlocked ? "unlock" : "lock") +
      "<span>" +
      (unlocked ? "Hide legal name" : "Reveal legal name") +
      "</span></button>";
    return (
      '<div class="pf-about__actions">' +
      '<a class="pf-about-action pf-about-action--solid" href="' +
      escapeHtml(D.brand.cv) +
      '" download>' +
      icon("download") +
      "<span>Download CV</span></a>" +
      reveal +
      "</div>"
    );
  }

  function renderAbout() {
    const mount = root.querySelector("[data-pf-about]");
    if (!mount) return;
    const p = profile();
    const portrait = isDev() ? D.brand.avatarDev : D.brand.avatarArtist;
    const showLegal = state.nameUnlocked;
    const displayName = showLegal ? D.brand.legalName : D.brand.name;
    const skillsBody =
      listBodyHtml(D.softSkills) +
      (D.languages
        ? '<p class="pf-about-panel__note"><span>Languages</span> ' +
          escapeHtml(D.languages) +
          "</p>"
        : "");
    const interestsBody = listBodyHtml(D.interests);
    const cvAllOpen = !!(state.cvOpen.skills && state.cvOpen.interests);

    const story =
      aboutAcc(
        "about",
        "About Me",
        '<p class="pf-body">' +
          escapeHtml(D.bios.full) +
          '</p><p class="pf-body pf-body--gap">' +
          escapeHtml(p.shortBio) +
          "</p>",
        "left"
      ) +
      aboutAcc(
        "journey",
        "My Journey",
        '<p class="pf-body">' + escapeHtml(D.bios.journey) + "</p>",
        "left"
      );

    const personalBlock = showLegal
      ? '<section class="pf-about-panel pf-about-panel--reveal" aria-labelledby="pdata-h">' +
        '<h2 id="pdata-h" class="pf-about-panel__title">Personal Data</h2>' +
        personalDataInnerHtml() +
        "</section>"
      : "";

    mount.innerHTML =
      '<div class="pf-about">' +
      '<div class="pf-about__topbar pf-rise">' +
      '<p class="pf-about__kicker">Archive: About</p>' +
      "</div>" +
      '<div class="pf-about__identity pf-rise pf-rise--2">' +
      '<div class="pf-about__photo"><img src="' +
      escapeHtml(portrait) +
      '" alt="' +
      escapeHtml(D.brand.name) +
      '" width="640" height="800" decoding="async" loading="lazy" /></div>' +
      '<div class="pf-about__id-copy">' +
      '<div class="pf-about__id-head">' +
      "<div>" +
      '<h1 class="pf-about-title' +
      (showLegal ? " pf-about-title--unlocked" : "") +
      '">' +
      escapeHtml(displayName) +
      "</h1>" +
      '<p class="pf-about-role">' +
      escapeHtml(p.tagline) +
      "</p></div></div>" +
      '<p class="pf-about__lede">' +
      escapeHtml(D.bios.value || D.bios.full) +
      "</p>" +
      aboutActionsHtml() +
      "</div></div>" +
      '<section class="pf-about-panel pf-rise pf-rise--3" aria-labelledby="obj-h">' +
      '<h2 id="obj-h" class="pf-about-panel__title">Objectives</h2>' +
      '<p class="pf-about-panel__text">' +
      escapeHtml(D.bios.careerObjective || p.objective) +
      "</p></section>" +
      '<div class="pf-about__mid">' +
      '<div class="pf-about__col pf-rise pf-rise--4">' +
      '<section class="pf-about-panel" aria-labelledby="edu-h">' +
      '<h2 id="edu-h" class="pf-about-panel__title">Education</h2>' +
      timelineInnerHtml() +
      "</section>" +
      '<section class="pf-about-panel" aria-labelledby="work-h">' +
      '<h2 id="work-h" class="pf-about-panel__title">Work Experience</h2>' +
      workExperienceInnerHtml() +
      "</section></div>" +
      '<div class="pf-about__rail pf-rise pf-rise--5">' +
      personalBlock +
      '<div class="pf-about__rail-head">' +
      '<span class="pf-about__rail-label">Details</span>' +
      '<button type="button" class="pf-about-expand" data-expand-cv>' +
      (cvAllOpen ? "Collapse all" : "Expand all") +
      "</button></div>" +
      aboutAcc("skills", "Skills", skillsBody, "right", "cv") +
      aboutAcc("interests", "Interests", interestsBody, "right", "cv") +
      '<div class="pf-about-stack">' +
      '<h3 class="pf-about-stack__label">Tools</h3>' +
      chipRowHtml(D.toolsColumn) +
      "</div>" +
      '<div class="pf-about-stack">' +
      '<h3 class="pf-about-stack__label">Development</h3>' +
      chipRowHtml(D.developmentColumn) +
      "</div></div></div>" +
      '<section class="pf-about__story pf-rise pf-rise--5" aria-label="Story">' +
      '<h2 class="pf-about-panel__title">Story</h2>' +
      '<div class="pf-acc-group" role="region">' +
      story +
      "</div></section>" +
      footHtml() +
      "</div>";
  }

  /* —— WORK: gallery (art) —— */
  function renderGallery() {
    const mount = root.querySelector("[data-pf-gallery]");
    if (!mount) return;
    let items = D.gallery;
    if (state.galleryFilter === "featured") items = items.filter((g) => g.featured);

    mount.innerHTML =
      '<div class="pf-crumb">Home / <span>Work</span></div>' +
      '<p class="pf-gallery-kicker">Archive: Portfolio</p>' +
      '<h1 class="pf-gallery-title">Selected Work</h1>' +
      '<div class="pf-tabs" style="margin-bottom:24px">' +
      '<button type="button" data-gallery-filter="featured" class="' +
      (state.galleryFilter === "featured" ? "active" : "") +
      '">Featured</button>' +
      '<button type="button" data-gallery-filter="all" class="' +
      (state.galleryFilter === "all" ? "active" : "") +
      '">All</button></div>' +
      '<div class="pf-gallery-grid">' +
      items
        .map(
          (g) =>
            '<div class="pf-gcell" title="' +
            escapeHtml(g.title) +
            " — " +
            escapeHtml(g.category) +
            '"><img src="' +
            escapeHtml(D.galleryImage(g.id)) +
            '" alt="' +
            escapeHtml(g.title) +
            '" loading="lazy" decoding="async" /></div>'
        )
        .join("") +
      "</div>" +
      footHtml();
  }

  /* —— WORK: projects (dev) —— */
  function renderProjects() {
    const list = root.querySelector("[data-pf-project-list]");
    const detail = root.querySelector("[data-pf-project-detail]");
    if (!list || !detail) return;
    list.innerHTML = D.projects
      .map((it, i) => {
        const sel = i === state.projectIdx;
        const idx = String(i + 1).padStart(2, "0");
        return (
          '<button type="button" class="pf-row' +
          (sel ? " selected" : "") +
          '" data-project-i="' +
          i +
          '" aria-selected="' +
          sel +
          '"><span class="pf-row-idx">' +
          idx +
          '</span><div><div class="pf-row-title">' +
          escapeHtml(it.title) +
          '</div><div class="pf-row-sub">' +
          escapeHtml(it.tags.slice(0, 2).join(" · ")) +
          "</div></div></button>"
        );
      })
      .join("");
    const p = D.projects[state.projectIdx];
    const idx = String(state.projectIdx + 1).padStart(2, "0");
    const openHref = p.demo || p.href || p.source || "#";
    const openExt = /^https?:/i.test(openHref);
    const source = p.source || "";
    const body = p.longDescription || p.description;
    detail.innerHTML =
      '<div class="pf-detail">' +
      '<div class="pf-detail__tag">UNLOCKED: ' +
      idx +
      "</div>" +
      '<h2 class="pf-detail__title">' +
      escapeHtml(p.title) +
      "</h2>" +
      '<p class="pf-detail__quote">"' +
      escapeHtml(p.quote) +
      '"</p>' +
      (p.role
        ? '<p class="pf-detail__role">Role · ' + escapeHtml(p.role) + "</p>"
        : "") +
      (p.meta
        ? '<p class="pf-detail__meta">' + escapeHtml(p.meta) + "</p>"
        : "") +
      '<p class="pf-detail__desc">' +
      escapeHtml(body) +
      "</p>" +
      (p.highlights && p.highlights.length
        ? '<ul class="pf-detail__list">' +
          p.highlights
            .map((h) => "<li>" + escapeHtml(h) + "</li>")
            .join("") +
          "</ul>"
        : "") +
      (p.team && p.team.length
        ? '<div class="pf-detail__block"><h3 class="pf-detail__label">Team</h3><ul class="pf-detail__list pf-detail__list--plain">' +
          p.team.map((m) => "<li>" + escapeHtml(m) + "</li>").join("") +
          "</ul></div>"
        : "") +
      (p.stack && p.stack.length
        ? '<div class="pf-detail__block"><h3 class="pf-detail__label">Stack</h3><div class="pf-tags">' +
          p.stack
            .map((t) => '<span class="pf-tag">' + escapeHtml(t) + "</span>")
            .join("") +
          "</div></div>"
        : "") +
      (p.status
        ? '<p class="pf-detail__status">' + escapeHtml(p.status) + "</p>"
        : "") +
      '<div class="pf-tags">' +
      p.tags.map((t) => '<span class="pf-tag">' + escapeHtml(t) + "</span>").join("") +
      '</div><div class="pf-btn-row">' +
      '<a class="pf-btn-primary" href="' +
      escapeHtml(openHref) +
      '"' +
      (openExt ? ' target="_blank" rel="noopener"' : "") +
      ">" +
      (p.demo ? "Open live —▸" : "Open —▸") +
      "</a>" +
      (source && source !== openHref
        ? '<a class="pf-btn pf-btn--ghost" href="' +
          escapeHtml(source) +
          '" target="_blank" rel="noopener">Source —▸</a>'
        : "") +
      "</div></div>";
  }

  /* —— CONTACT: form left + info/socials right —— */
  function renderContact() {
    const mount = root.querySelector("[data-pf-contact]");
    if (!mount) return;
    const s = D.socials;
    const status = D.commissionStatus;

    const socialRow = [
      ["mail", s.email, D.brand.email],
      ["github", s.github, "GitHub"],
      ["linkedin", s.linkedin, "LinkedIn"],
      ["twitter", s.twitter, "Twitter / X"],
      ["instagram", s.instagram, "Instagram"],
    ]
      .map(
        ([ic, href, label]) =>
          '<a class="pf-social-link" href="' +
          escapeHtml(href) +
          '"' +
          (href.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener"') +
          ">" +
          icon(ic) +
          "<span>" +
          escapeHtml(label) +
          "</span></a>"
      )
      .join("");

    mount.innerHTML =
      '<div class="pf-crumb">Home / <span>Contact</span></div>' +
      '<div class="pf-contact__kicker">' +
      escapeHtml(D.contact.eyebrow) +
      "</div>" +
      '<h1 class="pf-about-title" style="font-size:clamp(32px,5vw,48px)">' +
      escapeHtml(D.contact.title) +
      "</h1>" +
      '<p class="pf-body" style="margin-bottom:32px;font-style:italic">' +
      "Drop me a quick message and I'll get back to you within 48 hours." +
      "</p>" +
      '<div class="pf-contact-grid">' +
      '<form class="pf-form" data-inquiry-form>' +
      '<label class="pf-form__label">What is this about?' +
      '<select class="pf-form__control" name="about" required>' +
      '<option value="">Select…</option>' +
      '<option value="commission">Commission</option>' +
      '<option value="collab">Collaboration</option>' +
      '<option value="job">Job / hire</option>' +
      '<option value="other">Other</option>' +
      "</select></label>" +
      '<div class="pf-form__row">' +
      '<label class="pf-form__label">Name<input class="pf-form__control" name="name" type="text" placeholder="Your name" required /></label>' +
      '<label class="pf-form__label">Email<input class="pf-form__control" name="email" type="email" placeholder="Your email" required /></label>' +
      "</div>" +
      '<label class="pf-form__label">Message<textarea class="pf-form__control pf-form__area" name="message" rows="6" placeholder="Tell me about your project…" required></textarea></label>' +
      '<button type="submit" class="pf-btn pf-btn--ghost pf-form__submit">' +
      icon("send") +
      " Send Inquiry —▸</button></form>" +
      '<aside class="pf-contact-side">' +
      '<div class="pf-info-card">' +
      icon("mail") +
      '<div><strong>Email</strong><a href="mailto:' +
      escapeHtml(D.brand.email) +
      '">' +
      escapeHtml(D.brand.email) +
      "</a></div></div>" +
      '<div class="pf-info-card">' +
      icon("clock") +
      "<div><strong>Response time</strong><span>" +
      escapeHtml(D.contact.responseTime) +
      "</span></div></div>" +
      '<div class="pf-info-card">' +
      icon("briefcase") +
      "<div><strong>Business inquiries</strong><span>" +
      (status.open
        ? "Commissions open — use the builder or this form."
        : "Commissions closed until " +
          escapeHtml(status.nextOpening) +
          ". Licensing and collabs still welcome.") +
      "</span></div></div>" +
      '<div class="pf-info-card">' +
      icon("heart") +
      '<div><strong>Tips and donations</strong><span>Ko-Fi · PayPal · GCash</span>' +
      '<div class="pf-tip-row">' +
      '<a class="pf-chip" href="' +
      escapeHtml(s.kofi) +
      '" target="_blank" rel="noopener">Ko-Fi</a>' +
      '<button type="button" class="pf-chip" data-copy-gcash>' +
      icon("copy") +
      " GCash</button></div></div></div>" +
      '<div class="pf-connect"><h3 class="pf-stack-cols__label">Connect</h3>' +
      socialRow +
      "</div></aside></div>" +
      '<div class="pf-sec"><h3 class="pf-sec__head pf-sec__head--plus">Frequently Asked Questions</h3>' +
      '<p class="pf-body" style="margin-bottom:16px;font-style:italic">' +
      escapeHtml(D.faqItalic) +
      "</p>" +
      '<div class="pf-faq">' +
      D.faq
        .map((it, i) => {
          const open = state.faqOpen === i;
          return (
            '<div class="pf-faq__item' +
            (open ? " open" : "") +
            '">' +
            '<button type="button" class="pf-faq__q" data-faq-i="' +
            i +
            '" aria-expanded="' +
            open +
            '">' +
            escapeHtml(it.q) +
            "<span>" +
            (open ? "−" : "+") +
            "</span></button>" +
            '<div class="pf-faq__a">' +
            escapeHtml(it.a) +
            "</div></div>"
          );
        })
        .join("") +
      "</div></div>" +
      footHtml();
  }

  function syncModeButtons() {
    const m = mode();
    root.querySelectorAll("[data-pf-mode]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.pfMode === m ? "true" : "false");
    });
    root.classList.toggle("pf-shell--artist", m === "artist");
    root.classList.toggle("pf-shell--developer", m === "developer");
  }

  function renderAll() {
    syncModeButtons();
    renderHome();
    renderAbout();
    renderProjects();
    renderGallery();
    renderContact();
  }

  function normalizeSection(id) {
    const map = { portfolio: "projects", work: "projects", commissions: "home", gallery: "projects" };
    const next = map[id] || id;
    return SECTIONS.includes(next) ? next : "home";
  }

  const VIEW_MOTION = [
    "is-enter-from-right",
    "is-enter-from-left",
    "is-leave",
    "is-leave-left",
    "is-leave-right",
  ];

  let viewTimer = null;

  function prefersReduced() {
    return !!(
      window.Mikaelleon?.prefersReducedMotion?.() ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function clearViewMotion(el) {
    el.classList.remove.apply(el.classList, VIEW_MOTION);
  }

  function syncRail(id) {
    root.querySelectorAll(".pf-rail-btn[data-pf-nav]").forEach((btn) => {
      const on = btn.dataset.pfNav === id;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-current", on ? "page" : "false");
    });
  }

  function showViewInstant(id) {
    root.querySelectorAll("[data-pf-view]").forEach((el) => {
      clearViewMotion(el);
      el.classList.toggle("active", el.dataset.pfView === id);
    });
    const incoming = root.querySelector('[data-pf-view="' + id + '"]');
    if (incoming) incoming.scrollTop = 0;
  }

  function reveal(id) {
    id = normalizeSection(id || "home");
    syncModeButtons();
    renderAll();
    clearTimeout(viewTimer);
    viewTimer = null;
    state.section = id;
    showViewInstant(id);
    syncRail(id);
    const hash = "#" + id;
    if (location.hash !== hash) history.replaceState(null, "", hash);
  }

  function setSection(id, opts) {
    id = normalizeSection(id);
    const from = state.section;
    const instant = !!(opts?.instant || prefersReduced());

    syncRail(id);
    root.querySelectorAll(".pf-ld").forEach((el) => el.classList.remove("drill"));
    const hash = "#" + id;
    if (location.hash !== hash) history.replaceState(null, "", hash);

    if (id === from && !opts?.force) {
      const current = root.querySelector('[data-pf-view="' + id + '"]');
      if (!current?.classList.contains("active")) showViewInstant(id);
      if (!opts?.silent) announce(id.charAt(0).toUpperCase() + id.slice(1));
      return;
    }

    const views = Array.from(root.querySelectorAll("[data-pf-view]"));
    const outgoing = views.find((el) => el.dataset.pfView === from);
    const incoming = views.find((el) => el.dataset.pfView === id);
    state.section = id;

    if (instant || !outgoing || !incoming || !outgoing.classList.contains("active")) {
      clearTimeout(viewTimer);
      showViewInstant(id);
      if (!opts?.silent) announce(id.charAt(0).toUpperCase() + id.slice(1));
      return;
    }

    const dir = SECTIONS.indexOf(id) >= SECTIONS.indexOf(from) ? 1 : -1;
    clearTimeout(viewTimer);
    views.forEach(clearViewMotion);

    outgoing.classList.add("is-leave", dir === 1 ? "is-leave-left" : "is-leave-right");
    incoming.classList.add(
      "active",
      dir === 1 ? "is-enter-from-right" : "is-enter-from-left"
    );
    incoming.scrollTop = 0;

    viewTimer = setTimeout(() => {
      outgoing.classList.remove("active");
      clearViewMotion(outgoing);
      clearViewMotion(incoming);
      viewTimer = null;
    }, 400);

    if (!opts?.silent) announce(id.charAt(0).toUpperCase() + id.slice(1));
  }

  function setMode(next) {
    const m = next === "developer" ? "developer" : "artist";
    document.body.dataset.profile = m;
    localStorage.setItem(PROFILE_KEY, m);
    state.faqOpen = 0;
    renderAll();
    announce(m === "developer" ? "Developer mode" : "Artist mode");
  }

  root.addEventListener("submit", (e) => {
    const form = e.target.closest("[data-inquiry-form]");
    if (!form) return;
    e.preventDefault();
    const msg =
      (D.contact && D.contact.toastForm) ||
      "Thanks for reaching out — I'll respond within 48 hours.";
    if (window.Mikaelleon?.toast) window.Mikaelleon.toast(msg);
    else announce(msg);
    form.reset();
  });

  root.addEventListener("click", (e) => {
    const modeBtn = e.target.closest("[data-pf-mode]");
    if (modeBtn) {
      setMode(modeBtn.dataset.pfMode);
      return;
    }

    const nav = e.target.closest("[data-pf-nav]");
    if (nav) {
      e.preventDefault();
      setSection(nav.dataset.pfNav);
      return;
    }

    const gf = e.target.closest("[data-gallery-filter]");
    if (gf) {
      state.galleryFilter = gf.dataset.galleryFilter;
      renderGallery();
      return;
    }

    const wf = e.target.closest("[data-home-work-filter]");
    if (wf) {
      state.homeWorkFilter = wf.dataset.homeWorkFilter || "all";
      renderHome();
      return;
    }

    const unlock = e.target.closest("[data-unlock-name]");
    if (unlock) {
      state.nameUnlocked = !state.nameUnlocked;
      if (!state.nameUnlocked) {
        state.spoilers = { address: false, phone: false, dob: false };
      }
      renderAbout();
      announce(state.nameUnlocked ? "Legal name revealed" : "Legal name hidden");
      return;
    }

    const spoilerBtn = e.target.closest("[data-spoiler]");
    if (spoilerBtn) {
      const key = spoilerBtn.dataset.spoiler;
      state.spoilers[key] = !state.spoilers[key];
      renderAbout();
      return;
    }

    const expandCv = e.target.closest("[data-expand-cv]");
    if (expandCv) {
      const allOpen = !!(state.cvOpen.skills && state.cvOpen.interests);
      state.cvOpen.skills = !allOpen;
      state.cvOpen.interests = !allOpen;
      renderAbout();
      return;
    }

    const aboutAccBtn = e.target.closest("[data-about-acc]");
    if (aboutAccBtn) {
      const id = aboutAccBtn.dataset.aboutAcc;
      const group = aboutAccBtn.dataset.aboutGroup || "story";
      if (group === "cv") {
        state.cvOpen[id] = !state.cvOpen[id];
      } else {
        state.aboutOpen = state.aboutOpen === id ? "" : id;
      }
      renderAbout();
      return;
    }

    const faq = e.target.closest("[data-faq-i]");
    if (faq) {
      const i = Number(faq.dataset.faqI);
      state.faqOpen = state.faqOpen === i ? -1 : i;
      renderContact();
      return;
    }

    const copy = e.target.closest("[data-copy-gcash]");
    if (copy) {
      navigator.clipboard?.writeText(D.contact.gcash).then(() => {
        if (window.Mikaelleon?.toast) window.Mikaelleon.toast(D.contact.toastCopy);
        else announce(D.contact.toastCopy);
      });
      return;
    }

    const proj = e.target.closest("[data-project-i]");
    if (proj) {
      state.projectIdx = Number(proj.dataset.projectI);
      renderProjects();
      announce(D.projects[state.projectIdx].title);
      if (isNarrow()) root.querySelector("[data-pf-work-dev]")?.classList.add("drill");
      return;
    }

    if (e.target.closest("[data-pf-back]")) {
      root.querySelector("[data-pf-work-dev]")?.classList.remove("drill");
    }
  });

  root.addEventListener("keydown", (e) => {
    const projList = e.target.closest("[data-pf-project-list]");
    if (projList && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const dlt = e.key === "ArrowDown" ? 1 : -1;
      state.projectIdx = Math.max(0, Math.min(D.projects.length - 1, state.projectIdx + dlt));
      renderProjects();
      projList.querySelector('[data-project-i="' + state.projectIdx + '"]')?.focus();
    }
  });

  window.addEventListener("hashchange", () => {
    const id = normalizeSection((location.hash || "#home").slice(1));
    if (id !== state.section) setSection(id, { silent: true });
  });

  window.addEventListener("resize", () => {
    if (!isNarrow()) root.querySelectorAll(".pf-ld").forEach((el) => el.classList.remove("drill"));
  });

  new MutationObserver(() => {
    syncModeButtons();
    renderAll();
  }).observe(document.body, { attributes: true, attributeFilter: ["data-profile"] });

  renderAll();
  reveal(normalizeSection((location.hash || "#home").slice(1)));

  window.AppShell = {
    setView: setSection,
    reveal,
    applyProfileCopy: renderAll,
    setMode,
  };
})();
