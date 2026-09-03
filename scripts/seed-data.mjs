/**
 * One-time bootstrap content for Appwrite.
 *
 * Mirrored from the `default*` arrays in src/context/PortfolioContext.tsx as of
 * the initial Appwrite migration. It is NOT kept in sync with them, and is not
 * meant to be: once seeded, Appwrite is the source of truth and you edit content
 * in the console. The defaults in PortfolioContext remain purely as the offline
 * fallback.
 *
 * `testimonials` is deliberately absent: those defaults are invented
 * placeholders — fictional people and fabricated quotes — and seeding them
 * would turn obvious sample content in source into records that look real in a
 * production database. Add those by hand when you have genuine ones.
 *
 * `order` is authored in tens so rows can be inserted between without
 * renumbering everything.
 */

export const personalInfo = {
  name: 'Rinshid',
  title: 'Flutter Developer',
  roles: ['Flutter Developer', 'React Developer', 'Freelancer'],
  tagline: 'I build cross-platform apps that ship and keep working.',
  taglineEmphasis: 'and keep working',
  heroBadge: 'Building digital experiences that make an impact',
  heroScript: "Hey, I'm",
  email: 'rinshidch10@gmail.com',
  location: 'India · Working with clients worldwide',
  bio: "I'm a Flutter developer who builds fast, good-looking cross-platform apps for iOS and Android. I work with Flutter, React and Node.js, with Firebase and Supabase behind them, and I'm comfortable across Provider, Riverpod, Bloc and GetX.",
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


//
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
      'Fast, responsive websites and web apps in React and TypeScript, built to load quickly and stay maintainable.',
    deliverables: [
      'React + TypeScript build, mobile-first',
      'CMS or admin panel so you can edit content yourself',
      'Core Web Vitals, accessibility and responsive layouts',
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
    title: 'End-to-end Product Build',
    description:
      'The full stack: app, web and the backend behind them, taken from an empty repo to a live release.',
    deliverables: [
      'App and website build, end to end',
      'Backend, database and third-party integrations',
      'Deployment, store submission and domain setup',
      'First 90 days of post-launch fixes included',
      'Fortnightly progress calls',
    ],
    icon: 'zap',
    track: 'Development',
    startingPrice: 'Custom quote',
    timeline: '3–6 months',
    featured: true,
  },
];

export const skills = [
  { order: 10, name: 'Flutter', level: 95, category: 'Mobile' },
  { order: 20, name: 'Dart', level: 92, category: 'Mobile' },
  { order: 30, name: 'Provider', level: 90, category: 'State Management' },
  { order: 40, name: 'Riverpod', level: 88, category: 'State Management' },
  { order: 50, name: 'Bloc', level: 85, category: 'State Management' },
  { order: 60, name: 'GetX', level: 88, category: 'State Management' },
  { order: 70, name: 'React', level: 80, category: 'Frontend' },
  { order: 80, name: 'TypeScript', level: 75, category: 'Frontend' },
  { order: 90, name: 'JavaScript', level: 82, category: 'Frontend' },
  { order: 100, name: 'Node.js', level: 78, category: 'Backend' },
  { order: 110, name: 'Firebase', level: 85, category: 'Backend' },
  { order: 120, name: 'Supabase', level: 82, category: 'Backend' },
  { order: 130, name: 'Appwrite', level: 80, category: 'Backend' },
  { order: 140, name: 'PostgreSQL', level: 75, category: 'Database' },
  { order: 150, name: 'MySQL', level: 72, category: 'Database' },
  { order: 160, name: 'MongoDB', level: 70, category: 'Database' },
  { order: 170, name: 'Git', level: 88, category: 'Tools' },
  { order: 180, name: 'Figma', level: 85, category: 'Tools' },
  { order: 190, name: 'Claude / AI tooling', level: 90, category: 'AI' },
  { order: 200, name: 'Cursor AI', level: 88, category: 'AI' },
  { order: 210, name: 'Figma MCP', level: 75, category: 'AI' },
];

export const stats = [
  { order: 10, label: 'Apps shipped to stores', value: '10+', icon: 'smartphone' },
  { order: 20, label: 'Years building with Flutter', value: '2+', icon: 'trending' },
  { order: 30, label: 'Client retention', value: '90%', icon: 'heart' },
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
    role: 'Freelance Developer',
    company: 'Self-employed',
    location: 'Remote',
    period: '2024 - Present',
    startDate: '2024-01',
    current: true,
    description:
      'Working directly with founders and small teams on app and web builds, from scoping through to store release and post-launch support.',
    responsibilities: [
      'Scoping and pricing projects with clients end to end',
      'Building Flutter and React products from design to store release',
      'Integrating REST and Firebase backends, and third-party SDKs',
      'Maintaining and updating live apps after release',
    ],
    technologies: ['Flutter', 'React', 'Firebase', 'Supabase', 'Node.js'],
    type: 'Freelance',
    track: 'Development',
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
