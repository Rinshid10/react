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
  socialLinkedin: 'https://www.linkedin.com/in/rinshid-ch-996175316',
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

// Mirrors `defaultProjects` in src/context/PortfolioContext.tsx. Keep the two
// in sync: the live site reads this table, the defaults are the offline fallback.
export const projects = [
  {
    order: 10,
    title: 'Online Check Writer',
    description:
      'B2B payments app for a platform serving 1M+ business users and 22,000+ banks. Multi-rail payment flows — printable checks, eChecks, check mailing, ACH/RTP, wire and wallet-to-wallet transfers.',
    longDescription:
      'Online Check Writer is the flagship Zil Money payments app. I build and ship features across its multi-rail payment flows — printable checks, eChecks, check mailing, ACH/RTP, wire transfers and wallet-to-wallet transfers — plus wallet management, payment links, statement downloads, transaction history and accounts payable/receivable workflows. The platform serves over 1M business users and connects to 22,000+ banks.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600',
    technologies: ['Flutter', 'Riverpod', 'Clean Architecture', 'REST APIs', 'WebSocket'],
    playStore: 'https://play.google.com/store/apps/details?id=com.onlinecheckwriter.m',
    appStore: 'https://apps.apple.com/us/app/online-check-writer/id1521980907',
    featured: true,
    category: 'Mobile',
  },
  {
    order: 20,
    title: 'Zil Remit',
    description:
      'Cross-border remittance for U.S. businesses — recipient management, real-time transfer tracking and wallet-to-bank payouts to 9+ countries, on phone and tablet.',
    longDescription:
      'Zil Remit moves money wallet-to-bank across 9+ countries — UK, France, Germany, India, China, Australia and more — in minutes. I built the recipient management, transaction history and real-time transfer tracking features, with go_router navigation that adapts across phone and iPad layouts.',
    image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600',
    technologies: ['Flutter', 'BLoC', 'go_router', 'REST APIs', 'Responsive UI'],
    playStore: 'https://play.google.com/store/apps/details?id=com.internationalpayments.app',
    appStore: 'https://apps.apple.com/us/app/id6748254326',
    featured: true,
    category: 'Mobile',
  },
  {
    order: 30,
    title: 'Virtual Card',
    description:
      'Instant virtual cards for business spend — card creation, spend controls, freeze/unfreeze and transaction tracking, funded straight from the Zil wallet.',
    longDescription:
      'Virtual Cards lets businesses issue a card in seconds, set spending limits and vendor locks, freeze or cancel it at any time and track every transaction. I developed the card creation, spend-control, transaction tracking and secure online payment features for business expense management.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
    technologies: ['Flutter', 'BLoC', 'REST APIs', 'Secure Storage'],
    playStore: 'https://play.google.com/store/apps/details?id=com.virtualcard.app',
    appStore: 'https://apps.apple.com/us/app/virtual-cards/id6748954269',
    featured: true,
    category: 'Mobile',
  },
  {
    order: 40,
    title: 'Check Mail',
    description:
      'Send and manage checks by mail straight from bank accounts, cards and wallets — automated delivery workflows, payment tracking and transaction management.',
    longDescription:
      'Check Mail prints, envelopes and mails a check in one tap, with USPS/FedEx delivery and tracking. I built the check-mailing features with automated delivery workflows, payment tracking and transaction management, backed by secure payment flows from bank accounts, credit cards and wallets.',
    image: '/app_logo.svg',
    technologies: ['Flutter', 'GetX', 'REST APIs', 'Push Notifications'],
    playStore: 'https://play.google.com/store/apps/details?id=com.checkmail.app',
    appStore: 'https://apps.apple.com/us/app/check-mail/id6748264295',
    featured: true,
    category: 'Mobile',
  },
  {
    order: 50,
    title: 'GetPaid Link',
    description:
      'Payment links for businesses of any size. Create one-time or recurring links, send them by email or SMS, and let clients pay from a bank account or card — no invoicing software needed.',
    longDescription:
      'GetPaid Link generates secure payment links a client can pay from their bank account or card without installing anything. I built the payment-link generation, online payment acceptance and transaction tracking features used for customer collections.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600',
    technologies: ['Flutter', 'GetX', 'REST APIs', 'Firebase'],
    playStore: 'https://play.google.com/store/apps/details?id=com.getpaidlink.app',
    appStore: 'https://apps.apple.com/us/app/id6755234489',
    featured: false,
    category: 'Mobile',
  },
  {
    order: 60,
    title: 'Amazon-style E-commerce App',
    description:
      'A Flutter storefront with product search and filters, cart, checkout and order tracking.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600',
    technologies: ['Flutter', 'Provider', 'REST APIs'],
    // TODO(real-data): confirm this is the right repo for the Amazon-style app.
    github: 'https://github.com/Rinshid10/E-commerce-Product-Listing-App',
    featured: false,
    category: 'Mobile',
  },
  {
    order: 70,
    title: 'Thrift Store Shoe App',
    description:
      'Wishlist, cart, order history and offline-first local storage with Hive, laid out responsively for mobile and tablet.',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600',
    technologies: ['Flutter', 'Provider', 'Hive', 'Responsive Design'],
    // TODO(real-data): add the GitHub repo link for this app.
    featured: false,
    category: 'Mobile',
  },
  {
    order: 80,
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
    order: 90,
    title: 'Shop Easy — Meesho Dropshipping',
    description:
      "A modern storefront with secure payments, a fast checkout and product discovery that stays out of the shopper's way.",
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
    technologies: ['React', 'TypeScript', 'Firebase', 'Stripe'],
    github: 'https://github.com/Rinshid10/shopeasy',
    live: 'https://makeeasyshop.netlify.app/',
    featured: false,
    category: 'Web',
  },
  {
    order: 100,
    title: 'Pulse Clinic',
    description:
      'A clinic management app. Patients book appointments and browse doctors on the public site, while staff run the clinic from separate admin, HR, roster and payroll, billing and pharmacy consoles.',
    longDescription:
      'Pulse is a clinic management app. Patients book appointments and browse doctors on the public site. Staff run the clinic from separate consoles for admin, HR, roster and payroll, billing, and pharmacy. The website is React (Vite), and shared data lives in a Node, Express, and MongoDB API.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
    technologies: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/Rinshid10/Pulse_clinic',
    live: 'https://pulseclinicpr.netlify.app/',
    featured: false,
    category: 'Full Stack',
  },
];

export const experience = [
  {
    order: 10,
    role: 'Flutter Developer',
    company: 'Zil Money',
    companyUrl: 'https://zilmoney.com',
    location: 'Manjeri, Kerala, India',
    period: 'July 2025 - Present',
    startDate: '2025-07',
    current: true,
    description:
      'Building and shipping features across 5 cross-platform fintech apps for Android and iOS, including Online Check Writer, a B2B payments platform with 1M+ business users connected to 22,000+ banks.',
    responsibilities: [
      'Build and ship features across Online Check Writer, Zil Remit, Virtual Card, Check Mail and GetPaid Link',
      'Integrate banking APIs, ACH processing, payment gateways, real-time WebSocket communication, push notifications and secure storage',
      'Built multi-rail payment flows: printable checks, eChecks, check mailing, ACH/RTP, wire and wallet-to-wallet transfers',
      'Structure code with Clean Architecture and Riverpod, BLoC and Provider so features stay modular and testable',
      'Write unit and widget tests with flutter_test to reduce post-release bugs',
    ],
    technologies: ['Flutter', 'Dart', 'Riverpod', 'BLoC', 'REST APIs', 'WebSocket', 'Firebase'],
    type: 'Full-time',
    track: 'Development',
  },
  {
    order: 30,
    role: 'Flutter Developer Intern',
    company: 'Bridgeon',
    location: 'Calicut, Kerala, India',
    period: 'June 2024 - June 2025',
    startDate: '2024-06',
    endDate: '2025-06',
    current: false,
    description:
      'A year-long Flutter internship building cross-platform apps in an Agile team under senior developer guidance.',
    responsibilities: [
      'Built responsive UI screens and integrated REST APIs in cross-platform Flutter apps',
      'Fixed bugs and improved app stability under senior developer guidance',
      'Worked in an Agile team using Git, daily stand-ups, code reviews and sprint planning',
      'Built portfolio apps: an Amazon-style e-commerce app and a thrift store shoe app with Hive offline storage',
    ],
    technologies: ['Flutter', 'Dart', 'Provider', 'Hive', 'REST APIs', 'Git'],
    type: 'Internship',
    track: 'Development',
  },
];
