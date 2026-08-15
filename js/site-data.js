/* Mikaelleon — site content catalog
 *
 * Ownership (avoid duplicating the same prose across views):
 *   brand/socials/bios     → shared constants
 *   profiles.*.heroIntro   → Home only
 *   profiles.*.shortBio + objective + highlights → About (+ Work mode switch)
 *   bios.full / journey    → About only
 *   projects / gallery     → Work (Home shows preview slice only)
 *   faq / contact / status → Contact only (+ commissions page for builder)
 *   archiveSplit           → reserved / unused by shell (was redundant with rail)
 */
window.SiteData = (function () {
  const brand = {
    name: "Mikaelleon",
    legalName: "Kimberly Claire A. Aliwate",
    tagline: "Digital Artist & Web Developer",
    location: "Lipa City, Batangas",
    email: "hello@mikaelleon.art",
    cv: "cv/mikaelleon-cv.pdf",
    avatar: "images/opt/profile1.webp",
    avatarArtist: "images/opt/profile2.webp",
    avatarDev: "images/pfp.png",
    workProfile: "images/pfp.png",
  };

  const socials = {
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    deviantart: "https://deviantart.com",
    github: "https://github.com/mikaelleon",
    linkedin: "https://linkedin.com",
    kofi: "https://ko-fi.com",
    email: "mailto:hello@mikaelleon.art",
  };

  const github = {
    username: "mikaelleon",
    profileUrl: "https://github.com/mikaelleon",
    chartLevels: ["#0C0A10", "#5a4528", "#8a6b35", "#b8935b", "#e8c77a"],
    eyebrow: "Activity",
    title: "Coding Activity",
    sub: "My contributions over the last year.",
  };

  const bios = {
    value:
      "I'm a freelance digital artist and web developer based in Lipa City, Batangas — I build character art, illustrations, and front-end web experiences.",
    careerObjective:
      "A highly motivated and adaptable Information Technology student aiming to gain practical work experience and apply a strong desire to learn in a customer-oriented environment. Eager to contribute to team success and develop excellent service skills.",
    short:
      "I'm a freelance digital artist and web developer based in Lipa City, Batangas. Character art and front-end work sit side by side in my practice.",
    full:
      "I'm a freelance digital artist and web developer based in Lipa City, Batangas. I work across character art, illustrations, and front-end web experiences as an Information Technology student at the University of Batangas, Lipa Campus.",
    journey:
      "My path runs through Quezon City schools into Lipa City Senior High (HUMSS), then into BS Information Technology at the University of Batangas, Lipa Campus — where art practice and web development sit side by side.",
    programmingInterest:
      "I care about interfaces strangers can navigate without a walkthrough — typed React surfaces, clear visual systems, and tooling that stays out of the way.",
  };

  const profiles = {
    artist: {
      toggle: "Artist",
      tagline: "Digital Artist",
      heroIntro:
        "I draw characters and illustrations for commissions from Lipa City, Batangas, while studying IT.",
      shortBio:
        "Commission work is the spine of my art practice — character designs, chibi stickers, and illustrations shaped for people who already know the vibe they want.",
      objective:
        "I want every commission to leave the client with a clear, usable piece — not a vague mood board they have to decode alone.",
      highlights: [
        "Character Design & Illustration",
        "Chibi & Sticker Art",
        "Fan Art & Community Commissions",
        "UI/UX Design",
      ],
      featuredEyebrow: "Materials",
      featuredSub: "Highlighted pieces from the art archive.",
      ctas: [
        { label: "View Portfolio —▸", action: "projects" },
        { label: "Commission Me —▸", href: "commissions.html" },
        { label: "Download CV —▸", href: brand.cv, download: true },
      ],
    },
    developer: {
      toggle: "Developer",
      tagline: "Web Developer · BSIT Student",
      heroIntro:
        "I'm a BSIT student at University of Batangas, Lipa Campus, building front-end experiences in React and TypeScript.",
      shortBio:
        "Outside class I ship the surfaces behind this site — commission flows, portfolio filters, and typed React pages meant to stay readable.",
      objective:
        "I'm looking for practical work where I can learn fast, contribute to a team, and get better at building things people actually use.",
      highlights: [
        "Front-End Product UI",
        "Commission Storefronts",
        "Design-to-Code Handoff",
        "UI/UX Design",
      ],
      featuredEyebrow: "Repositories",
      featuredSub: "Selected repositories with live previews from GitHub.",
      ctas: [
        { label: "View Projects —▸", action: "projects" },
        { label: "About Me —▸", action: "about" },
        { label: "Download CV —▸", href: brand.cv, download: true },
      ],
    },
  };

  const education = [
    {
      years: "2023–Present",
      school: "University of Batangas, Lipa Campus",
      detail: "Bachelor of Science in Information Technology · Lipa City, Batangas",
    },
    {
      years: "2021–2023",
      school: "Lipa City Senior High School",
      detail: "Humanities and Social Sciences · Lipa City, Batangas",
    },
    {
      years: "2020–2021",
      school: "Tandang Sora National High School",
      detail: "Secondary Education · Quezon City, Metro Manila",
    },
    {
      years: "2011–2020",
      school: "Saint Anthony Academy of Quezon City",
      detail: "Primary & Secondary Education · Tandang Sora, Quezon City, Metro Manila",
    },
  ];

  const workExperience = [
    {
      title: "Freelance Web Developer",
      meta: "July 2024 – February 2025 · C7 Digital Solutions / Remote",
      bullets: [
        "Developed and maintained responsive websites for small businesses using HTML, CSS, and JavaScript.",
        "Gathered client requirements and translated them into functional web solutions.",
      ],
    },
    {
      title: "Freelance Digital Artist",
      meta: "August 2020 – April 2022 · Remote",
      bullets: [
        "Created a variety of digital artworks and visual content for diverse clients, consistently adhering to project specifications and content guidelines.",
        "Communicated effectively with clients to understand their needs and deliver work that met their expectations.",
      ],
    },
  ];

  const personalData = {
    address: "Brgy. Tibig, Lipa City, Batangas",
    phones: ["0994 174 4520", "0906 402 3920"],
    email: "aliwatekimberly@gmail.com",
    age: "21",
    dateOfBirth: "September 20, 2003",
    citizenship: "Filipino",
    gender: "Female",
    civilStatus: "Single",
  };

  const softSkills = [
    "Attention to Detail and Accuracy",
    "Adaptable and Resilient",
    "Critical Thinking and Analytical Skills",
    "Computer literacy and familiarity with Microsoft Office",
    "Fast Learner (Tools & Software)",
  ];

  const languages = "Fluent in English and Filipino";

  const interests = [
    "Learning new tools and software relevant to web development, digital art, and online platforms.",
    "Developing and designing responsive web solutions.",
    "Understanding user experience and client requirements in projects.",
  ];

  const specializations = [
    "Character Design & Illustration",
    "Concept Art for Games",
    "Fan Art & Community Commissions",
    "UI/UX Design",
    "Front-End Web Development",
  ];

  const technicalSkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Git",
    "GitHub",
    "Firebase",
    "Visual Studio Code",
    "Tailwind CSS",
    "Vite",
  ];

  const toolsColumn = [
    "Adobe Photoshop",
    "Clip Studio Paint",
    "Unity 2D/3D",
    "Canva",
    "CapCut",
    "Alight Motion",
  ];

  const developmentColumn = [
    "C#",
    "C++",
    "C",
    "Python",
    "Java",
    "JavaScript",
    "HTML/CSS",
    "React",
    "Next.js",
  ];

  const tools = toolsColumn;
  const toolsArt = toolsColumn;
  const toolsDev = developmentColumn;

  const faq = [
    {
      id: "how-to-order",
      q: "How do I place a commission?",
      a: "Head to the Commissions page, choose your options (illustration type, style, and size), add any extras, then add to cart and complete the order form. You'll receive a confirmation email with your order number and next steps.",
    },
    {
      id: "turnaround",
      q: "How long does a commission take?",
      a: "Turnaround depends on complexity and queue position. Typical completion is a few weeks; you can check the Queue page for current wait times and track your order with your order number.",
    },
    {
      id: "revisions",
      q: "Can I request changes to my commission?",
      a: "Yes. You get up to 2 free revisions during the sketch phase. Once the sketch is approved, we move to coloring and final delivery. Additional revisions after approval may be available for a fee.",
    },
    {
      id: "payment",
      q: "What payment methods do you accept?",
      a: "Payment options are listed on the Commissions page and vary by commission type. A deposit is typically required before work begins, with the remainder due on completion.",
    },
    {
      id: "commercial",
      q: "Can I use my commission commercially?",
      a: "Personal use is included. Commercial use (e.g. merchandise, branding, games) requires a commercial license, which can be added at checkout or discussed before ordering.",
    },
    {
      id: "will-draw",
      q: "What will you draw?",
      a: "I'm happy to draw original characters (OCs), fan art of existing characters (anime, games, etc.), character design and concept art, portraits and headshots, full-body or half-body illustrations, chibis, and stylized/cartoon work. I also do character design packages, reference sheets, and revamps. If you're unsure whether your idea fits, just ask!",
    },
    {
      id: "wont-draw",
      q: "What won't you draw?",
      a: "I don't draw hate symbols or discriminatory content, real people (e.g. portraits of real individuals) unless agreed otherwise, or artwork for NFTs/AI training. Furries, animal-faced humanoids, elderly subjects, and excessive gore are also out of scope — see Terms for the full list. When in doubt, send an inquiry.",
    },
  ];

  const faqItalic = "Answers to common questions about commissions and orders.";

  const archiveSplit = [
    {
      id: "chapters",
      tab: "Chapters",
      kicker: "THE",
      title: "Stranger",
      body: "These two chibi stickers are the commission style I ship most: thick outlines, heart-eyed aliens, paired colorways. You bring the characters; I hand them back as something you can slap on a phone case tomorrow.",
      cta: "Commission this style —▸",
      href: "commissions.html",
      image: "images/opt/profile2.webp",
    },
    {
      id: "code",
      tab: "Code",
      kicker: "THE",
      title: "Runtime",
      body: "The same restraint shows up in the code: typed React pages, a commission builder with a clear cart, and archive filters that don't make you guess.",
      cta: "View projects —▸",
      action: "projects",
      image: "images/opt/profile1.webp",
    },
    {
      id: "materials",
      tab: "Materials",
      kicker: "THE",
      title: "Archive",
      body: "Finished plates, studies, and character sheets live in one portfolio — filterable and meant to be revisited, not scrolled past once.",
      cta: "Browse portfolio —▸",
      action: "projects",
      image: "images/opt/profile2.webp",
    },
    {
      id: "contact",
      tab: "Contact",
      kicker: "THE",
      title: "Letter",
      body: "Commissions, collabs, and quiet questions land in the same inbox. Write when you already know the vibe — or when you don't, and need a second hand.",
      cta: "Send a message —▸",
      action: "contact",
      image: "images/opt/profile1.webp",
    },
  ];

  const gallery = [
    {
      id: "latevia",
      title: "Latevia",
      description: "Watermarked sample illustration.",
      category: "Illustrations",
      medium: "Digital",
      date: "2025-11-01",
      featured: true,
      oc: false,
      image: "images/artworks/Latevia-WM1.png",
    },
    {
      id: "mizuki-noir",
      title: "Mizuki Noir",
      description: "Blended commission piece.",
      category: "Commissions",
      medium: "Digital",
      date: "2026-01-15",
      featured: true,
      oc: false,
      image: "images/artworks/MIZUKI-NOIR_BLENDEDCOMM4.png",
    },
    {
      id: "refsheet",
      title: "Reference Sheet",
      description: "Character reference sheet.",
      category: "Character Designs",
      medium: "Digital",
      date: "2025-12-01",
      featured: true,
      oc: true,
      image: "images/artworks/REFSHEET.png",
    },
    {
      id: "rosella",
      title: "Rosella",
      description: "Character illustration.",
      category: "Illustrations",
      medium: "Digital",
      date: "2025-11-20",
      featured: true,
      oc: true,
      image: "images/artworks/Rosella_W1.png",
    },
    {
      id: "chibi-ych",
      title: "Chibi YCH — Leviathan & Hime",
      description: "Chibi YCH sample.",
      category: "Chibi",
      medium: "Digital",
      date: "2025-08-28",
      featured: true,
      oc: false,
      image: "images/artworks/CHIBI-YCH_Leviathan&Hime.png",
    },
    {
      id: "yoshida-rin",
      title: "Yoshida Rin",
      description: "Character illustration.",
      category: "Character Designs",
      medium: "Digital",
      date: "2025-07-15",
      featured: true,
      oc: false,
      image: "images/artworks/FC-DC_yoshida-rin2-g.png",
    },
    {
      id: "pepper",
      title: "Pepper",
      description: "Character piece.",
      category: "Character Designs",
      medium: "Digital",
      date: "2025-10-18",
      featured: false,
      oc: true,
      image: "images/artworks/PEPPER.png",
    },
    {
      id: "dane",
      title: "Dane",
      description: "Portrait commission.",
      category: "Commissions",
      medium: "Digital",
      date: "2025-10-05",
      featured: false,
      oc: false,
      image: "images/artworks/dane.png",
    },
    {
      id: "yr-lc",
      title: "YR-LC",
      description: "Full illustration.",
      category: "Illustrations",
      medium: "Digital",
      date: "2025-09-22",
      featured: false,
      oc: false,
      image: "images/artworks/YR-LC_F.png",
    },
    {
      id: "couple-glorp",
      title: "Couple Glorp",
      description: "Couple illustration.",
      category: "Illustrations",
      medium: "Digital",
      date: "2025-09-10",
      featured: false,
      oc: false,
      image: "images/artworks/020526-couple-glorp-5.png",
    },
    {
      id: "himeme-banner",
      title: "Himeme Banner",
      description: "Freebie Discord banner.",
      category: "Banners",
      medium: "Digital",
      date: "2025-08-12",
      featured: false,
      oc: false,
      image: "images/artworks/DCB-BANNER (FREEBIE) - Himeme.png",
    },
    {
      id: "perrine",
      title: "Perrine",
      description: "Silly character sketch.",
      category: "Character Designs",
      medium: "Digital",
      date: "2025-07-30",
      featured: false,
      oc: true,
      image: "images/artworks/FC-DC_sillysillyperrine.png",
    },
    {
      id: "wm-eyebanner",
      title: "Eye Banner",
      description: "Watermarked eye banner.",
      category: "Banners",
      medium: "Digital",
      date: "2025-06-28",
      featured: false,
      oc: false,
      image: "images/artworks/WM-EYEBANNER.png",
    },
    {
      id: "unpriced",
      title: "Unpriced Sample",
      description: "Portfolio sample piece.",
      category: "Illustrations",
      medium: "Digital",
      date: "2025-06-10",
      featured: false,
      oc: false,
      image: "images/artworks/UNPRICED.png",
    },
    {
      id: "sample1",
      title: "Sample 01",
      description: "Portfolio sample.",
      category: "Illustrations",
      medium: "Digital",
      date: "2025-05-20",
      featured: false,
      oc: false,
      image: "images/artworks/mikaelleon-sample1.png",
    },
    {
      id: "sample5",
      title: "Sample 05",
      description: "Portfolio sample.",
      category: "Illustrations",
      medium: "Digital",
      date: "2025-05-08",
      featured: false,
      oc: false,
      image: "images/artworks/mikaelleon-sample5_yu5h1i.png",
    },
    {
      id: "sample7",
      title: "Sample 07",
      description: "Portfolio sample.",
      category: "Illustrations",
      medium: "Digital",
      date: "2025-04-22",
      featured: false,
      oc: false,
      image: "images/artworks/mikaelleon-sample7.png",
    },
  ];

  const galleryImage = (idOrItem) => {
    if (idOrItem && typeof idOrItem === "object" && idOrItem.image) {
      return idOrItem.image;
    }
    const hit = gallery.find((g) => g.id === String(idOrItem));
    return hit && hit.image ? hit.image : "";
  };

  const projects = [
    {
      id: "bago-quadstack",
      title: "BAGO.PH",
      quote: "Barangay App for Garbage Operations in Philippines.",
      description:
        "Lipa City CENRO pilot for waste schedules, reports, and oversight across residents, collectors, officers, and superadmins — built to cut missed collections and give barangay leaders clearer data.",
      longDescription:
        "BAGO.PH helps four role groups work in one place: residents check schedules and submit waste reports; collectors verify field activity; Lipa City CENRO Officers monitor operations and compliance; superadmins approve LGU onboarding and review audit trails. Core auth, schedules, reports, announcements, eco-points, QR scan, analytics, and exports are live while remaining prototype screens migrate to full API data.",
      tags: ["Node.js", "Express", "MySQL", "JavaScript", "XML/XSLT", "JWT"],
      kind: "fullstack",
      featured: true,
      meta: "Live · Render · Lipa City CENRO",
      role: "COO / UI/UX Designer",
      team: [
        {
          name: "Carlos Kent D. Del Rio",
          role: "CEO / Lead Developer",
          contribution: "Backend architecture, API design, deployment.",
          commits: "—",
        },
        {
          name: "Kimberly Claire A. Aliwate",
          role: "COO / UI/UX Designer",
          contribution: "Product UX, interface systems, role flows.",
          commits: "—",
        },
        {
          name: "Kenneth Elijah N. Castillo",
          role: "CTO / Frontend Developer",
          contribution: "Frontend pages, role navigation, client wiring.",
          commits: "—",
        },
        {
          name: "Miguel Yuan M. Mercado",
          role: "CPO / Database Administrator",
          contribution: "Schema, migrations, barangay/schedule data.",
          commits: "—",
        },
      ],
      highlights: [
        "Role-based auth for residents, collectors, CENRO officers, and superadmins",
        "Live schedules, waste reports, announcements, eco-points, and QR validation",
        "72 Lipa City barangays with RA 9003 waste categories",
        "Superadmin governance: LGU queue, invite codes, audit exports",
        "XML/XSLT tools for schedule and barangay datasets",
      ],
      stack: ["HTML/CSS/JS", "Node.js + Express 5", "MySQL (Aiven)", "JWT · Leaflet", "XML 1.0 + XSLT 1.0"],
      status: "Mixed live + prototype · M5 end-to-end data in progress · live on Render",
      media: [
        {
          label: "BAGO.PH",
          kind: "preview",
          src: "images/works/1.svg",
          fit: "contain",
        },
        { label: "Photo / PDF preview", kind: "preview" },
      ],
      demo: "https://bago-ph-frontend.onrender.com/",
      source: "https://github.com/mikaelleon/bago.ph-quadstack",
    },
    {
      id: "bakesync",
      title: "BakeSync ERP",
      quote: "Bakery ops in one Next.js surface.",
      description:
        "Next.js 14 ERP for bakery operations — inventory, recipes, POS, production planning, and financial analytics with role-based access for managers, bakers, and cashiers.",
      longDescription:
        "BakeSync is a comprehensive bakery ERP built with Next.js 14 App Router. It covers real-time inventory for raw materials and finished goods, recipe cost analysis, a responsive POS cart (cash, card, GCash), production batch scheduling, and financial analytics. Role-based access separates managers, bakers, and cashiers across desktop, tablet, and mobile.",
      tags: ["Next.js 14", "TypeScript", "Tailwind CSS", "shadcn/ui", "pnpm", "Playwright"],
      kind: "fullstack",
      featured: true,
      meta: "Live · Vercel",
      role: "Developer",
      team: [
        {
          name: "Kimberly Claire A. Aliwate",
          role: "Developer",
          contribution: "ERP UI, inventory/POS flows, TypeScript app shell.",
          commits: "—",
        },
      ],
      highlights: [
        "Inventory with live stock levels and low-stock alerts",
        "Recipe management with ingredient costs and yield tracking",
        "POS with responsive cart and multiple payment methods",
        "Production planning for batches and consumption logs",
        "Role-based access: Manager, Baker, Cashier",
      ],
      stack: [
        "Next.js 14 (App Router)",
        "TypeScript",
        "Tailwind CSS",
        "Radix UI + shadcn/ui",
        "pnpm · Lucide React",
      ],
      status: "Live on Vercel · Playwright test suite with Page Object Model",
      media: [
        {
          label: "BakeSync ERP",
          kind: "preview",
          src: "images/works/2.svg",
          fit: "contain",
        },
        { label: "Photo / PDF preview", kind: "preview" },
      ],
      href: "https://bake-sync.vercel.app",
      demo: "https://bake-sync.vercel.app",
      source: "https://github.com/mikaelleon/BakeSync",
    },
    {
      id: "pawdar",
      title: "Pawdar",
      quote: "Stray and Owned Dog Registry and Incident Reporting System.",
      description:
        "Community-driven civic platform for Batangas Province that connects dog owners, reporters, veterinarians, LGU officials, and rescue organizations — built on PHP and MySQL with no separate frontend framework.",
      longDescription:
        "Pawdar addresses the lack of central tracking for dog ownership, health records, and incident history by integrating community reporting, registry, and case management in one place. Six roles share one database with permissions scoped to each job: Community Reporter, Dog Owner, Veterinarian, LGU Official, Rescue Organization, and Admin. The system runs on PHP with MySQL using a server-rendered structure standard hosting supports — vanilla JavaScript handles the report drawer, map filters, and live notification counts without a build tool or bundler. External services fill specific gaps: Leaflet for maps, Resend for email, and a QR code API for dog tags.",
      tags: ["PHP", "MySQL", "JavaScript", "Leaflet", "Resend", "QR API"],
      kind: "fullstack",
      featured: true,
      meta: "Live · InfinityFree · Batangas pilot",
      role: "UI/UX & Product Design",
      team: [
        {
          name: "Aliwate, Kimberly Claire",
          role: "UI/UX & Product Design",
          contribution: "Product UX, design system, role flows, civic IA.",
          commits: "—",
        },
        {
          name: "Castillo, Brent Justine",
          role: "Developer",
          contribution: "Platform features and implementation support.",
          commits: "—",
        },
        {
          name: "Lat, Nib Hoxan",
          role: "Developer",
          contribution: "Platform features and implementation support.",
          commits: "—",
        },
      ],
      highlights: [
        "Six roles on one shared database with job-scoped permissions",
        "Dog registry, vaccination records, and QR registry tags",
        "Incident feed, map pins, and LGU case management",
        "Server-rendered PHP/MySQL — no frontend framework or bundler",
        "Vanilla JS for report drawer, map filters, and live notification counts",
        "Leaflet maps · Resend email · QR code API for dog tags",
      ],
      stack: [
        "PHP + MySQL (server-rendered)",
        "Vanilla JavaScript (no bundler)",
        "Leaflet (maps)",
        "Resend (email)",
        "QR code API (dog tags)",
      ],
      status:
        "Core modules live · M7 production hardening & QA in progress · hosted on InfinityFree",
      media: [
        {
          label: "Pawdar",
          kind: "preview",
          src: "images/works/3.svg",
          fit: "contain",
        },
        { label: "Photo / PDF preview", kind: "preview" },
      ],
      href: "https://kcaliwate.freedev.app/web/index.html",
      demo: "https://kcaliwate.freedev.app/web/index.html",
      source: "https://github.com/mikaelleon/Pawdar",
    },
  ];

  const repos = [
    {
      name: "bago.ph-quadstack",
      description:
        "BAGO.PH — Barangay App for Garbage Operations; Lipa City CENRO waste ops platform.",
      language: "JavaScript",
      topics: ["nodejs", "express", "mysql", "lgu", "ra9003"],
      url: "https://github.com/mikaelleon/bago.ph-quadstack",
    },
    {
      name: "BakeSync",
      description:
        "Next.js 14 bakery ERP — inventory, recipes, POS, production, and financials.",
      language: "TypeScript",
      topics: ["nextjs", "typescript", "erp", "pos"],
      url: "https://github.com/mikaelleon/BakeSync",
    },
    {
      name: "Pawdar",
      description:
        "Stray and owned dog registry and incident reporting for Batangas — PHP/MySQL, Leaflet, Resend.",
      language: "PHP",
      topics: ["php", "mysql", "leaflet", "resend", "batangas"],
      url: "https://github.com/mikaelleon/Pawdar",
    },
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Game Developer",
      rating: 5,
      text: "Absolutely stunning character designs! The attention to detail and the way they brought my vision to life was beyond what I expected. Will commission again!",
    },
    {
      name: "Mika Chen",
      role: "Indie Author",
      rating: 5,
      text: "The book cover illustration was perfect. Great communication throughout the process and delivered ahead of schedule. Highly recommended!",
    },
    {
      name: "Jordan Lee",
      role: "Content Creator",
      rating: 5,
      text: "Beautiful OC design that perfectly captured the personality I described. The color palette choices were chef's kiss. Thank you!",
    },
    {
      name: "Sam Torres",
      role: "Tabletop Designer",
      rating: 4,
      text: "Professional, creative, and incredibly talented. The concept art for our game exceeded all expectations. A pleasure to work with!",
    },
  ];

  const contact = {
    eyebrow: "Correspondence",
    title: "Get in Touch",
    letterTitle: "Send a letter",
    responseTime: "Usually within 24–48 hours on business days.",
    gcash: "09941744520",
    gcashQr: "images/donations/gcash-qr.png",
    toastForm: "Thanks for reaching out — I'll respond within 48 hours.",
    toastCopy: "Number copied!",
  };

  const commissionStatus = {
    open: false,
    remainingSlots: 0,
    nextOpening: "March 2026",
    waitlistUrl: "https://discord.gg/example",
  };

  return {
    brand,
    socials,
    github,
    bios,
    profiles,
    education,
    workExperience,
    personalData,
    softSkills,
    languages,
    interests,
    specializations,
    technicalSkills,
    tools,
    toolsArt,
    toolsDev,
    toolsColumn,
    developmentColumn,
    faq,
    faqItalic,
    archiveSplit,
    gallery,
    galleryImage,
    projects,
    repos,
    testimonials,
    contact,
    commissionStatus,
  };
})();
