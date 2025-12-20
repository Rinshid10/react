// TypeScript interfaces for the portfolio

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone?: string;
  location: string;
  bio: string;
  social: SocialLinks;
  resumeUrl?: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter?: string;
  instagram?: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: SkillCategory;
  icon?: string;
}

export type SkillCategory =
  | 'Mobile'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'State Management'
  | 'Tools';

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  technologies: string[];
  github?: string;
  live?: string;
  playStore?: string;
  appStore?: string;
  featured: boolean;
  category: ProjectCategory;
}

export type ProjectCategory = 'Mobile' | 'Web' | 'Backend' | 'Full Stack';

export interface Experience {
  id: number;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  type: ExperienceType;
}

export type ExperienceType = 'Full-time' | 'Internship' | 'Freelance' | 'Contract';

export interface TechIcon {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  category: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export interface PortfolioContextType {
  personalInfo: PersonalInfo;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  techIcons: TechIcon[];
}
