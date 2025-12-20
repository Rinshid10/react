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
    email: 'rinshid@example.com',
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
    { name: 'Java', icon: FaJava, color: '#ED8B00', category: 'Language' },
    { name: 'Spring Boot', icon: SiSpringboot, color: '#6DB33F', category: 'Backend' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', category: 'Database' },
    { name: 'MySQL', icon: SiMysql, color: '#4479A1', category: 'Database' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248', category: 'Database' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', category: 'Language' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', category: 'Language' },
    { name: 'Git', icon: SiGit, color: '#F05032', category: 'Tools' },
    { name: 'Docker', icon: SiDocker, color: '#2496ED', category: 'Tools' },
  ];

  // Skills - Customize your skill levels
  const skills: Skill[] = [
    // Mobile Development
    { name: 'Flutter', level: 95, category: 'Mobile' },
    { name: 'Dart', level: 92, category: 'Mobile' },
    { name: 'React Native', level: 70, category: 'Mobile' },

    // State Management
    { name: 'Provider', level: 90, category: 'State Management' },
    { name: 'Riverpod', level: 88, category: 'State Management' },
    { name: 'Bloc', level: 85, category: 'State Management' },
    { name: 'GetX', level: 88, category: 'State Management' },

    // Frontend
    { name: 'React', level: 80, category: 'Frontend' },
    { name: 'TypeScript', level: 75, category: 'Frontend' },
    { name: 'JavaScript', level: 82, category: 'Frontend' },

    // Backend
    { name: 'Node.js', level: 78, category: 'Backend' },
    { name: 'Firebase', level: 85, category: 'Backend' },
    { name: 'Supabase', level: 82, category: 'Backend' },
    { name: 'Spring Boot', level: 65, category: 'Backend' },

    // Database
    { name: 'PostgreSQL', level: 75, category: 'Database' },
    { name: 'MySQL', level: 72, category: 'Database' },
    { name: 'MongoDB', level: 70, category: 'Database' },

    // Tools
    { name: 'Git', level: 88, category: 'Tools' },
    { name: 'Docker', level: 65, category: 'Tools' },
  ];

  // Projects - Add your projects here
  const projects: Project[] = [
    {
      id: 1,
      title: 'E-Commerce Mobile App',
      description: 'A full-featured shopping app with cart, payments, and order tracking.',
      longDescription: 'Built a complete e-commerce solution with product catalog, cart management, secure payments integration, and real-time order tracking.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
      technologies: ['Flutter', 'Firebase', 'Provider', 'Stripe'],
      github: 'https://github.com/rinshid/ecommerce-app',
      playStore: 'https://play.google.com/store/apps/details?id=com.rinshid.ecommerce',
      featured: true,
      category: 'Mobile',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Productivity app with task organization, reminders, and team collaboration.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600',
      technologies: ['Flutter', 'Riverpod', 'Supabase', 'Notifications'],
      github: 'https://github.com/rinshid/task-manager',
      featured: true,
      category: 'Mobile',
    },
    {
      id: 3,
      title: 'Real-time Chat Application',
      description: 'Messaging app with group chats, media sharing, and real-time updates.',
      image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600',
      technologies: ['Flutter', 'Firebase', 'Bloc', 'WebSocket'],
      github: 'https://github.com/rinshid/chat-app',
      featured: true,
      category: 'Mobile',
    },
    {
      id: 4,
      title: 'Fitness Tracker',
      description: 'Health and fitness app with workout plans and progress tracking.',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600',
      technologies: ['Flutter', 'GetX', 'SQLite', 'Charts'],
      github: 'https://github.com/rinshid/fitness-tracker',
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
      title: 'Portfolio Website',
      description: 'Modern portfolio website built with React and TypeScript.',
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600',
      technologies: ['React', 'TypeScript', 'Framer Motion'],
      github: 'https://github.com/rinshid/portfolio',
      live: 'https://rinshid.dev',
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
