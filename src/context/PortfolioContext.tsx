import { createContext, useContext, ReactNode } from 'react';
import {
  SiFlutter,
  SiDart,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiFirebase,
  SiSupabase,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiSpringboot,
  SiGit,
  SiDocker,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import {
  PortfolioContextType,
  PersonalInfo,
  Skill,
  Project,
  Experience,
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
 * PortfolioProvider - Contains all portfolio data
 * Edit this file to customize your portfolio content
 */
export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  // Personal Information - Edit these details
  const personalInfo: PersonalInfo = {
    name: 'Rinshid',
    title: 'Flutter Developer',
    tagline: 'Building Beautiful Cross-Platform Experiences',
    email: 'rinshidch10@gmail.com',
    location: 'India',
    bio: `Passionate Flutter Developer with expertise in building beautiful,
    performant cross-platform mobile applications. Experienced in backend
    technologies including Node.js, Supabase, and Firebase. Strong knowledge
    of various state management solutions like Provider, Riverpod, Bloc, and GetX.
    Currently working as a Flutter Developer, continuously learning and growing
    in the mobile development ecosystem.`,
    social: {
      github: 'https://github.com/rinshid',
      linkedin: 'https://linkedin.com/in/rinshid',
      twitter: 'https://twitter.com/rinshid',
      instagram: 'https://www.instagram.com/rnshiid',
    },
    resumeUrl: '/resume.pdf',
  };

  // Technology icons for the rotating carousel animation
  const techIcons: TechIcon[] = [
    { name: 'Flutter', icon: SiFlutter, color: '#02569B', category: 'Mobile' },
    { name: 'Dart', icon: SiDart, color: '#0175C2', category: 'Language' },
    { name: 'React', icon: SiReact, color: '#61DAFB', category: 'Frontend' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933', category: 'Backend' },
    { name: 'Firebase', icon: SiFirebase, color: '#FFCA28', category: 'Backend' },
    { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E', category: 'Backend' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', category: 'Database' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248', category: 'Database' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', category: 'Language' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', category: 'Language' },
    { name: 'Git', icon: SiGit, color: '#F05032', category: 'Tools' },
  ];

  // Skills - Customize your skill levels
  const skills: Skill[] = [
    // Mobile Development
    { name: 'Flutter', level: 95, category: 'Mobile' },
    { name: 'Dart', level: 92, category: 'Mobile' },

    // State Management
    { name: 'Provider', level: 90, category: 'State Management' },
    { name: 'Riverpod', level: 88, category: 'State Management' },
    { name: 'Bloc', level: 85, category: 'State Management' },
    { name: 'GetX', level: 88, category: 'State Management' },

    // Frontend
    { name: 'Flutter', level: 95, category: 'Mobile' },
    { name: 'React', level: 80, category: 'Frontend' },
    { name: 'TypeScript', level: 75, category: 'Frontend' },
    { name: 'JavaScript', level: 82, category: 'Frontend' },

    // Backend
    { name: 'Node.js', level: 78, category: 'Backend' },
    { name: 'Firebase', level: 85, category: 'Backend' },
    { name: 'Supabase', level: 82, category: 'Backend' },

    // Database
    { name: 'PostgreSQL', level: 75, category: 'Database' },
    { name: 'MySQL', level: 72, category: 'Database' },
    { name: 'MongoDB', level: 70, category: 'Database' },

    // Tools
    { name: 'Git', level: 88, category: 'Tools' },

    // AI
    { name: 'Claude', level: 90, category: 'AI' },
    { name: 'CLI', level: 85, category: 'AI' },
    { name: 'Cursor AI', level: 88, category: 'AI' },
    { name: 'Figma', level: 85, category: 'AI' },
    { name: 'MCP', level: 80, category: 'AI' },
  ];

  // Projects - Add your projects here
  const projects: Project[] = [
    {
      id: 1,
      title: 'Online Check Writer',
      description: 'A cloud-based payment app to simplify your accounts payable and account receivable in one go. Pay or get paid the way you want- Printable Check, eChecks, Check by mail, Credit, Debit, ACH, Wallet-to Wallet, Wire, etc. Easy navigation to help you quickly access features and tools to make payments on the go. Make transactions through our military-grade secure platform to prevent check frauds from ever hitting your account. This way, you spend less time on payment tasks and more time on work that really matters. You can also get in touch with our dedicated customer support team available round the clock to help you.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600',
      technologies: ['Flutter', 'Riverpod'],
      // github: 'https://github.com/rinshid/task-manager',
      featured: true,
      playStore: 'https://play.google.com/store/apps/details?id=com.onlinecheckwriter.m',
      category: 'Mobile',
    },
    {
      id: 2,
      title: 'Check Mail',
      description: 'Effortlessly manage and send checks via email from your bank accounts, credit cards, and wallets. Secure, fast, and reliable payment solutions at your fingertips.',
      longDescription: 'Send and manage digital checks instantly via email using your bank accounts, credit cards, or wallets.Secure, fast, and reliable payment solutions designed for convenience and control.',
      image: '/app_logo.svg',
      technologies: ['Flutter', 'Getx'],
      playStore: 'https://play.google.com/store/apps/details?id=com.checkmail.app',
      featured: true,
      category: 'Mobile',
    },

    {
      id: 3,
      title: 'International Payment',
      description: 'International Payment is a fast, secure, and efficient solution for U.S. businesses to send money globally in just minutes. Powered by Zil Money and OnlineCheckWriter.com, the app enables direct wallet-to-bank transfers to 9+ countries including the UK, France, Germany, India, China, Australia, and more.',
      image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600',
      technologies: ['Flutter', 'Firebase', 'Bloc', 'WebSocket'],
      // github: 'https://github.com/rinshid/chat-app',
      playStore: 'https://play.google.com/store/apps/details?id=com.internationalpayments.app',
      featured: true,
      category: 'Mobile',
    },
    {
      id: 4,
      title: 'GetPaid Link',
      description: 'GetPaid Link - Effortless Payment Links for BusinessGetPaid Link is a powerful, secure payment link app designed for businesses of all sizes. Whether you\'re a freelancer, small business, or large enterprise, GetPaid Link allows you to send instant payment links to clients, accept payments securely, and manage recurring payments with ease.With GetPaid Link, you can quickly create and send one-time or recurring payment links via email or SMS, making it simple for your clients to pay directly from their bank accounts or credit cards. No more complicated invoicing or long payment processes – just fast,',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600',
      technologies: ['Flutter', 'Getx'],
      playStore: 'https://play.google.com/store/apps/details?id=com.getpaidlink.app',
      featured: false,
      category: 'Mobile',
    },
    {
      id: 5,
      title: 'Weather Dashboard',
      description: 'Beautiful weather app with animations and location-based forecasts.',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600',
      technologies: ['Flutter', 'Provider', 'REST API', 'Lottie'],
      github: 'https://github.com/rinshid/weather-app',
      featured: false,
      category: 'Mobile',
    },
    {
      id: 6,
      title: 'Chat Flow - Web & Mobile',
      description: 'real-time web chat platform that enables instant messaging with smooth, secure, and seamless communication. It ensures fast message delivery, live updates, and an interactive user experience across devices.',
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600',
      technologies: ['Flutter', 'Provider', 'Firebase', 'WebSocket'],
      github: 'https://github.com/Rinshid10/chat-App',
      
      live: 'https://rinshdss.vercel.app/',
      featured: false,
      category: 'Web',
      
    },
    {
      id: 7,
      title: 'Shop Easy - E-commerce',
      description: 'modern e-commerce platform that offers a seamless online shopping experience with secure payments, fast checkout, and a user-friendly interface. Discover, compare, and purchase products بسهولة from anywhere, anytime.',
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600',
      technologies: ['Flutter', 'Provider', 'Firebase', 'WebSocket'],
      github: 'https://github.com/Rinshid10/chat-App',
      
      live: 'https://rinshdss.vercel.app/',
      featured: false,
      category: 'Web',
      
    },
    
  ];

  // Experience - Add your work experience
  const experience: Experience[] = [
    {
      id: 1,
      role: 'Flutter Developer',
      company: 'Tech Company',
      location: 'India',
      period: 'June 2025 - Present',
      startDate: '2025-06',
      current: true,
      description: 'Working as a Flutter Developer, building and maintaining cross-platform mobile applications.',
      responsibilities: [
        'Developing and maintaining Flutter applications for iOS and Android',
        'Implementing clean architecture and state management solutions',
        'Collaborating with backend team for API integration',
        'Writing unit and widget tests for quality assurance',
        'Participating in code reviews and team discussions',
      ],
      technologies: ['Flutter', 'Dart', 'Firebase', 'REST APIs', 'Git'],
      type: 'Full-time',
    },
    {
      id: 2,
      role: 'Flutter Developer Intern',
      company: 'Startup Inc',
      location: 'India',
      period: 'June 2024 - May 2025',
      startDate: '2024-06',
      endDate: '2025-05',
      current: false,
      description: 'Completed a 1-year internship focusing on Flutter mobile app development.',
      responsibilities: [
        'Built multiple mobile applications from scratch using Flutter',
        'Learned and implemented various state management solutions',
        'Integrated Firebase services including Auth, Firestore, and Cloud Functions',
        'Worked on UI/UX improvements and animations',
        'Collaborated with senior developers on production applications',
      ],
      technologies: ['Flutter', 'Dart', 'Firebase', 'Provider', 'GetX'],
      type: 'Internship',
    },
  ];

  const value: PortfolioContextType = {
    personalInfo,
    skills,
    projects,
    experience,
    techIcons,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
