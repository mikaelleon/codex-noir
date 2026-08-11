# Codex Noir Design System

Design system for **Mikaelleon** — the personal developer & digital-artist portfolio of Kim, a 4th-year BSIT student and freelance illustrator/web developer. The site, "Codex Noir," is built on one concept: an ancient gothic grimoire that's been hacked with a modern developer terminal. Two identities fused into one interface — dark-fantasy worldbuilder (blackletter monogram, tarot/RPG-card aesthetics) and working software developer (React, Node, Firebase, Git). The gothic layer is atmosphere and framing; underneath, the site is a clean, fast, legible dev portfolio.

**Sections the portfolio needs:** Home (name, photo, intro, CV/work CTAs), About Me (education, programming interests, career goals), Technical Skills (HTML, CSS, JS, Node.js, Git, GitHub, Firebase, VS Code), Projects (3+ case-study cards), a downloadable CV, and Contact (email, GitHub, LinkedIn).

**Sources:** built from a written brief only — no codebase, Figma file, or logo asset was attached to this project. The brief mentions an existing custom blackletter "M" monogram logo that would be attached as an asset; it was not actually provided, so no logo has been created (see Iconography below). If one is attached later, drop it in `assets/` and it can replace the type-only lockup used throughout.

## Index

- `styles.css` — root stylesheet, imports everything below
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `motion.css`, `fonts.css`, `base.css`
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand groups in the Design System tab)
- `components/core/` — Button, Tag, IndexNumber, Divider, SectionHeader, ContactLink, StatCard, ProjectCard
- `templates/portfolio-site/` — the Codex Noir portfolio template: Home, About, Skills, Projects, Contact
- `thumbnail.html` — project tile
- `SKILL.md` — Claude Code-compatible skill wrapper

## Components

- **Button** — gold-outline CTA, `primary` (filled) or `ghost` variants
- **Tag** — mono skill/tech chip (no progress bars/ratings)
- **IndexNumber** — zero-padded mono numeral for the ordered Projects list
- **Divider** — 1px gold hairline rule
- **SectionHeader** — Cinzel small-caps section label, optional sparkle glyph
- **ContactLink** — plain-text link, gold hover underline (no icons)
- **StatCard** — tarot/ID-card-style stat block for About Me
- **ProjectCard** — the signature "unlock" project card (gold border draw + oxblood "NEW ITEM UNLOCKED" flash on scroll-into-view)
- **Accordion** — single-open FAQ accordion, hairline dividers, mono +/− indicator

### Intentional additions

No source component library was attached, so this is a from-scratch set sized to exactly what the six required sections need — no Toast, Tabs, Dialog, etc., since the one-page portfolio has no use for them.

## Content fundamentals

**Voice:** first person, quietly confident, craftsperson tone — a developer who also makes art, not a corporate resume. Short declarative sentences; avoid startup-speak ("passionate," "synergy," "leverage"). Where the gothic conceit surfaces in copy, it's a wink, not full cosplay — e.g. a Projects section framed as "shipped work" with numbered indices, an unlock caption that's playful RPG reference, not a role-played character.

**Casing:** section labels and headers are Cinzel SMALL CAPS / uppercase by design; body copy is normal sentence case — never write body paragraphs in all-caps. Tech tags render in their conventional casing (JavaScript, Node.js, Firebase) inside mono chips.

**Person:** "I" throughout (Home, About, Contact) — this is a personal portfolio, not a company site addressing "you."

**Emoji:** never. The brand's whole visual joke is blackletter-vs-terminal typography; emoji would undercut it.

**Example lines:**
- Home intro: "I build interfaces the way old scribes bound books — with structure, and a little reverence for the craft."
- Project unlock caption: "NEW ITEM UNLOCKED" (all-caps, oxblood, Cinzel — the one place all-caps body-sized text is allowed, because it's a UI/game reference, not prose)
- Contact: plain text, no "Let's connect!" enthusiasm — "kim@mikaelleon.dev", "github.com/kim", "linkedin.com/in/kim"

## Visual foundations

**Color:** near-black ink background (`--ink-black #0C0A10`) with a faint violet undertone, panels one step lighter (`--panel #161219`). Text is warm bone/ivory (`--bone`) primary, muted taupe (`--taupe`) secondary. Antique gold (`--gold #B8935B`) is the one accent, brightening to `--gold-bright #D9BE8C` on hover. Oxblood (`--oxblood #5B1A22`) is reserved exclusively for the ProjectCard unlock flash — never decorative, never combined with gold outside that moment. Max two background colors on any page (ink-black + panel).

**Type:** three deliberately mismatched roles create the site's core visual joke (gothic grimoire framing terminal code) — Cormorant SC for the name/wordmark, Cinzel small-caps for section headers/labels, EB Garamond for body copy (17–18px, 1.6 line-height), Space Mono for skill tags/tech chips/project index numbers ONLY. Mono never appears in a heading or a paragraph.

**Shape:** sharp corners everywhere, 0–2px radius max — no soft rounded cards. Borders are 1px gold hairlines (`--hairline`, 35% opacity) as section dividers and card frames; never thick.

**Backgrounds/imagery:** flat ink-black/panel surfaces, no gradients, no textures or patterns, no photography treatment defined yet (Home needs a real photo — currently a placeholder). No blur or glassmorphism.

**Motion:** fast, quiet, no bounce. `--duration-fast 150ms` with `--ease-standard cubic-bezier(.4,0,.2,1)` for everything (hover, focus, nav). The one exception is the ProjectCard "unlock" moment: a `--duration-unlock 400ms` gold border draw left-to-right, then an oxblood "NEW ITEM UNLOCKED" caption flash before settling into the title. All motion respects `prefers-reduced-motion` (unlock skips straight to the settled state).

**Hover/press states:** links and CTAs go from gold to gold-bright on hover with an underline; no color-darkening or scale/shrink press effects defined — keep interactions understated.

**Iconography:** a single four-point sparkle/star glyph (✦, from the logo concept) used at most once per section as a marker, never scattered as decoration. No icon font, no SVG icon set — contact links are plain text with a gold hover underline (no icon-soup). No emoji.

**Layout:** sharp-cornered single-column sections on a max-width container (`--container-max 1120px`); Projects render as a numbered ordered list (01, 02, 03…); About Me renders as a single centered stat/ID card, not a grid of small cards.

## Iconography

No icon system, icon font, or SVG sprite was provided or found. The only "icon" in the system is the four-point sparkle glyph described above, used sparingly as a section marker. If a richer icon need arises (e.g. tech-stack logos for Skills), source real SVGs from the actual tools (React, Node, Firebase, Git, GitHub, VS Code logos) rather than hand-drawing substitutes — flag this as a follow-up if wanted.

## Fonts

Cormorant SC, Cinzel, EB Garamond, and Space Mono are all available directly on Google Fonts under their exact names from the brief — no substitution was needed. Loaded via `@import` of the Google Fonts CSS2 API in `tokens/fonts.css` (dynamic `@font-face`, not static local files — flag if the user wants self-hosted font binaries instead for offline/production use).

## Caveats / open asks

1. **No logo file was attached.** The brief describes an existing blackletter "M" monogram but it never arrived — every wordmark in this system is currently plain Cinzel/Cormorant SC type. Please attach the actual logo asset (SVG/PNG) so it can replace the type lockup.
2. **No Home photo.** The Home section needs a real photo of Kim — currently an image placeholder.
3. **No tech-stack icon set.** Skills currently render as plain mono text tags per the brief ("no icon-soup"), but if real tool logos (React/Node/Firebase/Git/GitHub/VS Code) are wanted alongside the tags, please provide or point to them.
4. **Fonts are Google-Fonts-CDN-loaded, not self-hosted.** Fine for prototyping; flag if production needs local font binaries for offline use or stricter CSP.
