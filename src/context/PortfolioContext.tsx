import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchPortfolioContent } from '../lib/appwrite';
import {
  SiFlutter,
  SiDart,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiFirebase,
  SiSupabase,
  SiAppwrite,
  SiMongodb,
  SiPostgresql,
  SiFigma,
  SiGit,
} from 'react-icons/si';
import {
  PortfolioContextType,
  PersonalInfo,
  Skill,
  Project,
  Service,
  Guarantee,
  Experience,
  Testimonial,
  ProcessStep,
  Stat,
  TechIcon,
} from '../types';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

/**
 * Custom hook to access portfolio data
 */
export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: ReactNode;
}

/**
 * PortfolioProvider - all portfolio content lives here.
 *
 * The site sells freelance development work: Flutter / React / backend
 * builds, quoted and delivered by one person.
 *
 * Anything marked `TODO(real-data)` is realistic placeholder content written
 * so the layout can be reviewed. Replace it with genuine clients, numbers and
 * quotes before the site goes live - inventing results is the fastest way to
 * lose a prospect who checks.
 */
export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  // ==========================================================================
  // Personal information
  // ==========================================================================
  const defaultPersonalInfo: PersonalInfo = {
    name: 'Rinshid',
    title: 'Flutter Developer',
    roles: ['Flutter Developer', 'React Developer', 'Freelancer'],
    tagline: 'I build cross-platform apps that ship and keep working.',
    // Must be a substring of `tagline`; it is rendered in a dimmer tone.
    taglineEmphasis: 'and keep working',
    heroBadge: 'Building digital experiences that make an impact',
    heroScript: "Hey, I'm",
    email: 'rinshidch10@gmail.com',
    location: 'India · Working with clients worldwide',
    bio: `I'm a Flutter developer who builds fast, good-looking cross-platform
    apps for iOS and Android. I work with Flutter, React and Node.js, with
    Firebase and Supabase behind them, and I'm comfortable across Provider,
    Riverpod, Bloc and GetX.`,
    social: {
      github: 'https://github.com/Rinshid10',
      linkedin: 'https://linkedin.com/in/rinshid',
      twitter: 'https://twitter.com/rinshid',
      instagram: 'https://www.instagram.com/rnshiid',
    },
    resumeUrl: '/resume.pdf',
    availability: 'Available for freelance projects',
    isAvailable: true,
    // TODO(real-data): add your Calendly / Cal.com link to enable the "Book a call" CTA.
    bookingUrl: '',
    // TODO(real-data): international format, digits only, e.g. '919876543210'.
    whatsapp: '',
    // Layered over the hero wordmark. Set to '' for a type-only hero.
    // Square head-and-shoulders cut-out; the hero sizes its box to suit that
    // crop, so swapping in a full-length figure would need the box re-tuned.
    portraitUrl: '/rinshid-portrait.png',
  };

  // ==========================================================================
  // Services - what a client can hire me for
  // ==========================================================================
  // TODO(real-data): confirm the prices and timelines below match what you
  // actually quote. Showing a starting price filters out bad-fit leads early.
  const defaultServices: Service[] = [
    {
      id: 1,
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
      startingPrice: 'From ₹60,000',
      timeline: '4–10 weeks',
      featured: true,
    },
    {
      id: 2,
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
      startingPrice: 'From ₹30,000',
      timeline: '2–5 weeks',
      featured: true,
    },
    {
      id: 3,
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
      startingPrice: 'Custom quote',
      timeline: '3–6 months',
      featured: true,
    },
  ];

  // ==========================================================================
  // Guarantees - the objections a client has before enquiring
  // ==========================================================================
  // Shown under the services. These are promises about how you work, so they
  // cost nothing to make and everything to break — keep them true.
  const defaultGuarantees: Guarantee[] = [
    {
      icon: 'shield',
      title: 'One person accountable',
      description: 'Clear communication and ownership across the whole project.',
    },
    {
      icon: 'clock',
      title: 'On-time delivery',
      description: 'Realistic timelines agreed up front, with milestone tracking.',
    },
    {
      icon: 'chart',
      title: 'Data-driven approach',
      description: 'Decisions backed by numbers you can check, not guesswork.',
    },
    {
      icon: 'headphones',
      title: 'Post-launch support',
      description: 'I stick around after release to support and keep improving.',
    },
  ];

  // ==========================================================================
  // Headline stats
  // ==========================================================================
  // TODO(real-data): replace with numbers you can defend if a client asks.
  const defaultStats: Stat[] = [
    { label: 'Apps shipped to stores', value: '10+', icon: 'smartphone' },
    { label: 'Years building with Flutter', value: '2+', icon: 'trending' },
    { label: 'Client retention', value: '90%', icon: 'heart' },
  ];

  // ==========================================================================
  // Technology / tool icons for the hero carousel
  // ==========================================================================
  const techIcons: TechIcon[] = [
    { name: 'Flutter', icon: SiFlutter, color: '#02569B', category: 'Mobile' },
    { name: 'Dart', icon: SiDart, color: '#0175C2', category: 'Language' },
    { name: 'React', icon: SiReact, color: '#61DAFB', category: 'Frontend' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933', category: 'Backend' },
    { name: 'Firebase', icon: SiFirebase, color: '#FFCA28', category: 'Backend' },
    { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E', category: 'Backend' },
    { name: 'Appwrite', icon: SiAppwrite, color: '#FD366E', category: 'Backend' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', category: 'Database' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248', category: 'Database' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', category: 'Language' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', category: 'Language' },
    { name: 'Git', icon: SiGit, color: '#F05032', category: 'Tools' },
    { name: 'Figma', icon: SiFigma, color: '#F24E1E', category: 'Tools' },
  ];

  // ==========================================================================
  // Skills
  // ==========================================================================
  const defaultSkills: Skill[] = [
    { name: 'Flutter', level: 95, category: 'Mobile' },
    { name: 'Dart', level: 92, category: 'Mobile' },
    { name: 'Provider', level: 90, category: 'State Management' },
    { name: 'Riverpod', level: 88, category: 'State Management' },
    { name: 'Bloc', level: 85, category: 'State Management' },
    { name: 'GetX', level: 88, category: 'State Management' },
    { name: 'React', level: 80, category: 'Frontend' },
    { name: 'TypeScript', level: 75, category: 'Frontend' },
    { name: 'JavaScript', level: 82, category: 'Frontend' },
    { name: 'Node.js', level: 78, category: 'Backend' },
    { name: 'Firebase', level: 85, category: 'Backend' },
    { name: 'Supabase', level: 82, category: 'Backend' },
    { name: 'Appwrite', level: 80, category: 'Backend' },
    { name: 'PostgreSQL', level: 75, category: 'Database' },
    { name: 'MySQL', level: 72, category: 'Database' },
    { name: 'MongoDB', level: 70, category: 'Database' },
    { name: 'Git', level: 88, category: 'Tools' },
    { name: 'Figma', level: 85, category: 'Tools' },
    { name: 'Claude / AI tooling', level: 90, category: 'AI' },
    { name: 'Cursor AI', level: 88, category: 'AI' },
    { name: 'Figma MCP', level: 75, category: 'AI' },

  ];

  // ==========================================================================
  // Development projects
  // ==========================================================================
  const defaultProjects: Project[] = [
    {
      id: 1,
      title: 'Online Check Writer',
      description:
        'A cloud-based payments app that brings accounts payable and receivable into one place — printable checks, eChecks, check by mail, card, ACH, wallet-to-wallet and wire, on a security-hardened platform with round-the-clock support.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600',
      technologies: ['Flutter', 'Riverpod'],
      featured: true,
      playStore: 'https://play.google.com/store/apps/details?id=com.onlinecheckwriter.m',
      category: 'Mobile',
    },
    {
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
      title: 'Weather Dashboard',
      description: 'Location-aware forecasts wrapped in a clean, animated interface.',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600',
      technologies: ['Flutter', 'Provider', 'REST API', 'Lottie'],
      github: 'https://github.com/rinshid/weather-app',
      featured: false,
      category: 'Mobile',
    },
    {
      id: 6,
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
      id: 7,
      title: 'Shop Easy — E-commerce',
      description:
        "A modern storefront with secure payments, a fast checkout and product discovery that stays out of the shopper's way.",
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
      technologies: ['Flutter', 'Firebase', 'Provider', 'Stripe'],
      github: 'https://github.com/Rinshid10/chat-App',
      live: 'https://rinshdss.vercel.app/',
      featured: false,
      category: 'Web',
    },
  ];

  // ==========================================================================
  // How I work
  // ==========================================================================
  const defaultProcess: ProcessStep[] = [
    {
      step: 1,
      title: 'Discovery call',
      description:
        'A 30-minute call about your goals, audience and budget. If I am not the right fit, I will say so and point you somewhere better.',
      icon: 'phone',
      duration: 'Day 1',
    },
    {
      step: 2,
      title: 'Proposal & scope',
      description:
        'You get a written scope: deliverables, timeline, price and how success is measured. No surprise line items later.',
      icon: 'file',
      duration: 'Day 2–4',
    },
    {
      step: 3,
      title: 'Build',
      description:
        'Work runs in weekly sprints. You see progress every week — a running build you can open — never a month of silence.',
      icon: 'zap',
      duration: 'Week 1 onward',
    },
    {
      step: 4,
      title: 'Release & support',
      description:
        'I handle the store submission, then stay on for the fixes that always follow a first release. You keep full access to every account and repo.',
      icon: 'trending',
      duration: 'Ongoing',
    },
  ];

  // ==========================================================================
  // Testimonials
  // ==========================================================================
  // TODO(real-data): PLACEHOLDER QUOTES - attributed to fictional people.
  // Never publish these as real. Ask past clients for two sentences each and
  // replace them, or remove the section until you have one genuine quote.
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sample Name',
      role: 'Product Manager',
      company: 'Fintech Startup',
      quote:
        'The app shipped on schedule and the code was clean enough that our own team picked it up without a handover crisis.',
      rating: 5,
    },
  ];

  // ==========================================================================
  // Experience
  // ==========================================================================
  const defaultExperience: Experience[] = [
    {
      id: 1,
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
    },
    {
      id: 2,
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
    },
    {
      id: 3,
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
    },
  ];

  // Budget bands offered in the contact form so leads self-qualify.
  const budgetRanges = [
    'Under ₹25,000',
    '₹25,000 – ₹75,000',
    '₹75,000 – ₹2,00,000',
    '₹2,00,000+',
    'Monthly retainer',
    'Not sure yet',
  ];

  // ==========================================================================
  // Live content from the admin backend overrides the defaults above. If the
  // API is unreachable, the hardcoded defaults are used as a graceful fallback.
  // ==========================================================================
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [guarantees, setGuarantees] = useState<Guarantee[]>(defaultGuarantees);
  const [experience, setExperience] = useState<Experience[]>(defaultExperience);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [process, setProcess] = useState<ProcessStep[]>(defaultProcess);
  const [stats, setStats] = useState<Stat[]>(defaultStats);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchPortfolioContent();
        if (!data || cancelled) return;

        if (data.personalInfo) {
          setPersonalInfo({ ...defaultPersonalInfo, ...data.personalInfo });
        }
        if (Array.isArray(data.skills) && data.skills.length) {
          setSkills(
            data.skills.map((s: Partial<Skill>) => ({
              name: s.name ?? '',
              level: Number(s.level ?? 0),
              category: (s.category ?? 'Tools') as Skill['category'],
              icon: s.icon,
            }))
          );
        }
        if (Array.isArray(data.services) && data.services.length) {
          setServices(
            data.services.map((s: Record<string, unknown>, i: number) => ({
              id: i + 1,
              title: (s.title as string) ?? '',
              description: (s.description as string) ?? '',
              deliverables: (s.deliverables as string[]) ?? [],
              icon: (s.icon as string) ?? 'zap',
              startingPrice: (s.startingPrice as string) || undefined,
              timeline: (s.timeline as string) || undefined,
              featured: Boolean(s.featured),
            }))
          );
        }
        if (Array.isArray(data.guarantees) && data.guarantees.length) {
          setGuarantees(
            data.guarantees.map((g: Record<string, unknown>) => ({
              icon: (g.icon as string) ?? 'shield',
              title: (g.title as string) ?? '',
              description: (g.description as string) ?? '',
            }))
          );
        }
        if (Array.isArray(data.projects) && data.projects.length) {
          setProjects(
            data.projects.map((p: Record<string, unknown>, i: number) => ({
              id: i + 1,
              title: (p.title as string) ?? '',
              description: (p.description as string) ?? '',
              longDescription: p.longDescription as string | undefined,
              image: (p.image as string) ?? '',
              technologies: (p.technologies as string[]) ?? [],
              github: (p.github as string) || undefined,
              live: (p.live as string) || undefined,
              playStore: (p.playStore as string) || undefined,
              appStore: (p.appStore as string) || undefined,
              featured: Boolean(p.featured),
              category: (p.category as Project['category']) ?? 'Mobile',
            }))
          );
        }
        if (Array.isArray(data.experience) && data.experience.length) {
          setExperience(
            data.experience.map((e: Record<string, unknown>, i: number) => ({
              id: i + 1,
              role: (e.role as string) ?? '',
              company: (e.company as string) ?? '',
              companyUrl: (e.companyUrl as string) || undefined,
              location: (e.location as string) ?? '',
              period: (e.period as string) ?? '',
              startDate: (e.startDate as string) ?? '',
              endDate: (e.endDate as string) || undefined,
              current: Boolean(e.current),
              description: (e.description as string) ?? '',
              responsibilities: (e.responsibilities as string[]) ?? [],
              technologies: (e.technologies as string[]) ?? [],
              type: (e.type as Experience['type']) ?? 'Full-time',
            }))
          );
        }
        if (Array.isArray(data.testimonials) && data.testimonials.length) {
          setTestimonials(
            data.testimonials.map((t: Record<string, unknown>, i: number) => ({
              id: i + 1,
              name: (t.name as string) ?? '',
              role: (t.role as string) ?? '',
              company: (t.company as string) ?? '',
              quote: (t.quote as string) ?? '',
              avatar: (t.avatar as string) || undefined,
              rating: Number(t.rating ?? 5),
            }))
          );
        }
        if (Array.isArray(data.process) && data.process.length) {
          setProcess(
            data.process.map((p: Record<string, unknown>, i: number) => ({
              step: i + 1,
              title: (p.title as string) ?? '',
              description: (p.description as string) ?? '',
              icon: (p.icon as string) ?? 'zap',
              duration: (p.duration as string) || undefined,
            }))
          );
        }
        if (Array.isArray(data.stats) && data.stats.length) {
          setStats(
            data.stats.map((s: Record<string, unknown>) => ({
              label: (s.label as string) ?? '',
              value: (s.value as string) ?? '',
              icon: (s.icon as string) || undefined,
            }))
          );
        }
      } catch {
        // Appwrite offline or unconfigured - keep defaults.
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: PortfolioContextType = {
    personalInfo,
    skills,
    projects,
    services,
    guarantees,
    experience,
    testimonials,
    process,
    stats,
    techIcons,
    budgetRanges,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};
