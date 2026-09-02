/**
 * One-time bootstrap content for Appwrite.
 *
 * Mirrored from the `default*` arrays in src/context/PortfolioContext.tsx as of
 * the initial Appwrite migration. It is NOT kept in sync with them, and is not
 * meant to be: once seeded, Appwrite is the source of truth and you edit content
 * in the console. The defaults in PortfolioContext remain purely as the offline
 * fallback.
 *
 * `case_studies` and `testimonials` are deliberately absent. Their defaults are
 * invented placeholders — fictional clients, fabricated metrics and quotes — and
 * seeding them would turn obvious sample content in source into records that
 * look real in a production database. Add those by hand when you have genuine
 * ones.
 *
 * `order` is authored in tens so rows can be inserted between without
 * renumbering everything.
 */

export const personalInfo = {
  name: 'Rinshid',
  title: 'Flutter Developer & Digital Marketer',
  roles: ['Flutter Developer', 'Digital Marketer', 'Freelancer'],
  tagline: 'I build apps — and the growth engine that fills them.',
  taglineEmphasis: 'growth engine',
  heroBadge: 'Building digital experiences that make an impact',
  heroScript: 'Freelance',
  email: 'rinshidch10@gmail.com',
  location: 'India · Working with clients worldwide',
  bio: "I'm a Flutter developer who builds fast, good-looking cross-platform apps — and a digital marketer who makes sure people actually find them. On the build side I work with Flutter, React and Node.js, with Firebase and Supabase behind them, and I'm comfortable across Provider, Riverpod, Bloc and GetX.",
  marketingBio:
    'On the growth side I run SEO, Meta and Google Ads, content and social for founders who need traffic that converts, not vanity metrics. Most clients hire me for both: one person who ships the product and owns the funnel means no handoff, no finger-pointing, and a launch that lands.',
  socialGithub: 'https://github.com/Rinshid10',
  socialLinkedin: 'https://linkedin.com/in/rinshid',
  socialTwitter: 'https://twitter.com/rinshid',
  socialInstagram: 'https://www.instagram.com/rnshiid',
  resumeUrl: '/resume.pdf',
  availability: 'Available for freelance projects',
  isAvailable: true,
  portraitUrl: '/rinshid-portrait.png',
  // bookingUrl and whatsapp are intentionally omitted: they are empty in the
  // defaults, and writing '' would look deliberate in the console.
};

/** Only defaultDarkMode. The colour columns stay empty to keep the design monochrome. */
export const theme = {
  defaultDarkMode: true,
};

export const services = [
  {
    order: 10,
    title: 'Mobile App Development',
    description:
      'Cross-platform iOS and Android apps in Flutter — from an empty repo to a live store listing.',
    deliverables: [
      'Flutter app for iOS & Android from one codebase',
      'Clean architecture with your choice of state management',
      'Firebase / Supabase backend and API integration',
      'Play Store & App Store submission',
      '30 days of post-launch support',
    ],
    icon: 'smartphone',
    track: 'Development',
    startingPrice: 'From ₹60,000',
    timeline: '4–10 weeks',
    featured: true,
  },
  {
    order: 20,
    title: 'Web Development',
    description:
      'Fast, responsive marketing sites and web apps in React and TypeScript, built to rank and convert.',
    deliverables: [
      'React + TypeScript build, mobile-first',
      'CMS or admin panel so you can edit content yourself',
      'Core Web Vitals and on-page SEO baked in',
      'Analytics and conversion tracking wired up',
      'Deployment and domain setup',
    ],
    icon: 'code',
    track: 'Development',
    startingPrice: 'From ₹30,000',
    timeline: '2–5 weeks',
    featured: true,
  },
  {
    order: 30,
    title: 'SEO & Content',
    description:
      'Technical and on-page SEO plus a content plan that earns rankings you keep, not ones you rent.',
    deliverables: [
      'Full technical SEO audit with a prioritised fix list',
      'Keyword and competitor research',
      '3-month content calendar mapped to search intent',
      'On-page optimisation and internal linking',
      'Monthly rankings and traffic report',
    ],
    icon: 'search',
    track: 'Marketing',
    startingPrice: 'From ₹20,000/mo',
    timeline: 'Ongoing · 3-month minimum',
    featured: true,
  },
  {
    order: 40,
    title: 'Paid Ads — Meta & Google',
    description:
      'Campaigns built around a tracked funnel, so every rupee of spend is attached to a number you can check.',
    deliverables: [
      'Account and campaign structure setup',
      'Audience research and creative direction',
      'Pixel, conversion and GA4 tracking',
      'Weekly optimisation and A/B testing',
      'Transparent spend and ROAS reporting',
    ],
    icon: 'target',
    track: 'Marketing',
    startingPrice: 'From ₹25,000/mo + ad spend',
    timeline: 'Ongoing · 3-month minimum',
    featured: true,
  },
  {
    order: 50,
    title: 'Social Media & Branding',
    description:
      'A consistent brand and a content engine that keeps your channels alive without you posting at midnight.',
    deliverables: [
      'Brand identity direction and visual guidelines',
      'Monthly content calendar and post design',
      'Reels / short-form video scripting',
      'Community management and engagement',
      'Growth and engagement reporting',
    ],
    icon: 'share',
    track: 'Marketing',
    startingPrice: 'From ₹18,000/mo',
    timeline: 'Ongoing · monthly retainer',
    featured: false,
  },
  {
    order: 60,
    title: 'Build + Grow Package',
    description:
      'The full stack: I ship the product and run the launch. One person accountable for both sides.',
    deliverables: [
      'App or website build, end to end',
      'Launch campaign across paid and organic',
      'Analytics, funnels and conversion tracking',
      'First 90 days of growth work included',
      'Fortnightly strategy calls',
    ],
    icon: 'zap',
    track: 'Development',
    startingPrice: 'Custom quote',
    timeline: '3–6 months',
    featured: true,
  },
];

export const stats = [
  { order: 10, label: 'Apps shipped to stores', value: '10+', icon: 'smartphone' },
  { order: 20, label: 'Campaigns managed', value: '15+', icon: 'target' },
  { order: 30, label: 'Ad spend managed', value: '₹12L+', icon: 'trending' },
  { order: 40, label: 'Client retention', value: '90%', icon: 'heart' },
];

export const projects = [
  {
    order: 10,
    title: 'Online Check Writer',
    description:
      'A cloud-based payments app that brings accounts payable and receivable into one place — printable checks, eChecks, check by mail, card, ACH, wallet-to-wallet and wire, on a security-hardened platform with round-the-clock support.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600',
    technologies: ['Flutter', 'Riverpod'],
    playStore: 'https://play.google.com/store/apps/details?id=com.onlinecheckwriter.m',
    featured: true,
    category: 'Mobile',
  },
  {
    order: 20,
    title: 'Check Mail',
    description:
      'Send and manage checks by email straight from bank accounts, cards and wallets — secure, fast and built for people who move money daily.',
    longDescription:
      'Send and manage digital checks instantly via email using your bank accounts, credit cards, or wallets. Secure, fast and reliable payment flows designed for convenience and control.',
    image: '/app_logo.svg',
    technologies: ['Flutter', 'GetX'],
    playStore: 'https://play.google.com/store/apps/details?id=com.checkmail.app',
    featured: true,
    category: 'Mobile',
  },
  {
    order: 30,
    title: 'International Payment',
    description:
      'Fast, secure global transfers for U.S. businesses. Powered by Zil Money and OnlineCheckWriter.com, it moves money wallet-to-bank across 9+ countries — UK, France, Germany, India, China, Australia and more — in minutes.',
    image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600',
    technologies: ['Flutter', 'Firebase', 'Bloc', 'WebSocket'],
    playStore: 'https://play.google.com/store/apps/details?id=com.internationalpayments.app',
    featured: true,
    category: 'Mobile',
  },
  {
    order: 40,
    title: 'GetPaid Link',
    description:
      'Payment links for businesses of any size. Create one-time or recurring links, send them by email or SMS, and let clients pay from their bank account or card — no invoicing software, no long payment cycles.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600',
    technologies: ['Flutter', 'GetX'],
    playStore: 'https://play.google.com/store/apps/details?id=com.getpaidlink.app',
    featured: false,
    category: 'Mobile',
  },
  {
    order: 50,
    title: 'Weather Dashboard',
    description: 'Location-aware forecasts wrapped in a clean, animated interface.',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600',
    technologies: ['Flutter', 'Provider', 'REST API', 'Lottie'],
    github: 'https://github.com/rinshid/weather-app',
    featured: false,
    category: 'Mobile',
  },
  {
    order: 60,
    title: 'Chat Flow — Web & Mobile',
    description:
      'A real-time chat platform with instant delivery, live presence and a consistent experience across web and mobile.',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600',
    technologies: ['Flutter', 'Provider', 'Firebase', 'WebSocket'],
    github: 'https://github.com/Rinshid10/chat-App',
    live: 'https://rinshdss.vercel.app/',
    featured: false,
    category: 'Web',
  },
  {
    order: 70,
    title: 'Shop Easy — E-commerce',
    description:
      "A modern storefront with secure payments, a fast checkout and product discovery that stays out of the shopper's way.",
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
    technologies: ['Flutter', 'Firebase', 'Provider', 'Stripe'],
    // NOTE: these two links are copied from "Chat Flow" above and are almost
    // certainly wrong for this project. Fix them in the Appwrite console.
    github: 'https://github.com/Rinshid10/chat-App',
    live: 'https://rinshdss.vercel.app/',
    featured: false,
    category: 'Web',
  },
];

export const experience = [
  {
    order: 10,
    role: 'Freelance Developer & Digital Marketer',
    company: 'Self-employed',
    location: 'Remote',
    period: '2024 - Present',
    startDate: '2024-01',
    current: true,
    description:
      'Working directly with founders and small teams on app and web builds, and on the SEO, paid and social work that follows a launch.',
    responsibilities: [
      'Scoping and pricing projects with clients end to end',
      'Building Flutter and React products from design to store release',
      'Running SEO audits, content plans and paid campaigns',
      'Setting up analytics and conversion tracking so results are measurable',
      'Reporting on performance and adjusting strategy monthly',
    ],
    technologies: ['Flutter', 'React', 'Meta Ads', 'Google Ads', 'GA4', 'SEO'],
    type: 'Freelance',
    track: 'Marketing',
  },
  {
    order: 20,
    role: 'Flutter Developer',
    company: 'Tech Company',
    location: 'India',
    period: 'June 2025 - Present',
    startDate: '2025-06',
    current: true,
    description:
      'Building and maintaining cross-platform mobile applications used in production by paying customers.',
    responsibilities: [
      'Developing and maintaining Flutter applications for iOS and Android',
      'Implementing clean architecture and state management solutions',
      'Collaborating with the backend team on API integration',
      'Writing unit and widget tests for quality assurance',
      'Participating in code reviews and team discussions',
    ],
    technologies: ['Flutter', 'Dart', 'Firebase', 'REST APIs', 'Git'],
    type: 'Full-time',
    track: 'Development',
  },
  {
    order: 30,
    role: 'Flutter Developer Intern',
    company: 'Startup Inc',
    location: 'India',
    period: 'June 2024 - May 2025',
    startDate: '2024-06',
    endDate: '2025-05',
    current: false,
    description: 'A year-long internship focused on Flutter mobile app development.',
    responsibilities: [
      'Built multiple mobile applications from scratch using Flutter',
      'Learned and implemented various state management solutions',
      'Integrated Firebase Auth, Firestore and Cloud Functions',
      'Worked on UI/UX improvements and animations',
      'Collaborated with senior developers on production applications',
    ],
    technologies: ['Flutter', 'Dart', 'Firebase', 'Provider', 'GetX'],
    type: 'Internship',
    track: 'Development',
  },
];
