// TypeScript interfaces for the portfolio
//
// The site presents two tracks — Development and Marketing — sharing one
// freelance funnel: Hero -> Services -> About -> Skills -> Work -> Case
// Studies -> Process -> Experience -> Testimonials -> Contact.

import type { ComponentType, CSSProperties } from 'react';

export type Track = 'Development' | 'Marketing';

export interface PersonalInfo {
  name: string;
  /** Primary headline role, e.g. "Flutter Developer & Digital Marketer". */
  title: string;
  /** Short role chips shown under the hero title. */
  roles: string[];
  tagline: string;
  /**
   * A substring of `tagline` rendered in a dimmer tone, so the headline reads
   * in two weights rather than one flat block.
   */
  taglineEmphasis?: string;
  /** Small pill above the hero headline. */
  heroBadge?: string;
  /** Handwritten accent set beside the hero wordmark. */
  heroScript?: string;
  email: string;
  phone?: string;
  location: string;
  bio: string;
  /** Second paragraph covering the marketing side of the bio. */
  marketingBio?: string;
  social: SocialLinks;
  resumeUrl?: string;
  /** Availability line shown in the hero badge, e.g. "Available for freelance". */
  availability?: string;
  /** True when open to new freelance work — drives the green status dot. */
  isAvailable?: boolean;
  /** Optional booking link (Calendly, Cal.com) used by the primary hero CTA. */
  bookingUrl?: string;
  whatsapp?: string;
  /**
   * Optional background-removed portrait. When set, it layers over the hero
   * wordmark the way the Figma composition does. Left empty the hero is
   * type-led — which is the intended default, not a fallback.
   */
  portraitUrl?: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter?: string;
  instagram?: string;
  behance?: string;
}

// ---------------------------------------------------------------------------
// Services — what a client can actually hire me for
// ---------------------------------------------------------------------------

export interface Service {
  id: number;
  title: string;
  /** One-line pitch shown on the card. */
  description: string;
  /** Concrete deliverables — what the client receives. */
  deliverables: string[];
  /** Icon key resolved to a react-icon in PortfolioContext. */
  icon: string;
  track: Track;
  /** Indicative price, e.g. "From ₹25,000" or "Custom quote". */
  startingPrice?: string;
  /** Typical turnaround, e.g. "4–8 weeks". */
  timeline?: string;
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export interface Skill {
  name: string;
  level: number; // 0-100
  category: SkillCategory;
  track: Track;
  icon?: string;
}

export type SkillCategory =
  // Development
  | 'Mobile'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'State Management'
  | 'Tools'
  | 'AI'
  // Marketing
  | 'SEO'
  | 'Paid Ads'
  | 'Social Media'
  | 'Content'
  | 'Analytics'
  | 'Branding';

// ---------------------------------------------------------------------------
// Work
// ---------------------------------------------------------------------------

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

/**
 * Marketing case study — problem / approach / measurable result.
 * This is the format clients scan when judging a marketer, so every entry
 * should carry at least two hard metrics.
 */
export interface CaseStudy {
  id: number;
  client: string;
  industry: string;
  /** Headline outcome, e.g. "3.4x return on ad spend in 90 days". */
  title: string;
  /** Channels used: SEO, Meta Ads, Google Ads, Content, Social. */
  channels: string[];
  /** What was going wrong before the engagement. */
  problem: string;
  /** What was done, in plain language. */
  approach: string[];
  /** Headline numbers rendered as metric tiles. */
  results: Metric[];
  duration: string;
  image?: string;
  featured?: boolean;
  testimonialId?: number;
}

export interface Metric {
  /** e.g. "Organic traffic" */
  label: string;
  /** e.g. "+186%" */
  value: string;
  /** Optional context, e.g. "vs. previous 6 months" */
  note?: string;
}

// ---------------------------------------------------------------------------
// Experience, process and social proof
// ---------------------------------------------------------------------------

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
  track: Track;
}

export type ExperienceType = 'Full-time' | 'Internship' | 'Freelance' | 'Contract';

/**
 * A reassurance shown under the services — the objections a freelance client
 * has before they enquire, answered up front.
 */
export interface Guarantee {
  /** Icon key resolved to a react-icon in the Services component. */
  icon: string;
  title: string;
  description: string;
}

/** A step in the "how we'll work together" timeline. */
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
  /** e.g. "Day 1–3" */
  duration?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar?: string;
  rating?: number; // 1-5
  track?: Track;
}

/** Headline numbers shown in the hero / about strip. */
export interface Stat {
  label: string;
  value: string;
  icon?: string;
}

export interface TechIcon {
  name: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string;
  category: string;
}

// ---------------------------------------------------------------------------
// Forms and context
// ---------------------------------------------------------------------------

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Which service the enquiry is about — lets leads self-qualify. */
  projectType: string;
  /** Indicative budget band. */
  budget: string;
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
  caseStudies: CaseStudy[];
  services: Service[];
  guarantees: Guarantee[];
  experience: Experience[];
  testimonials: Testimonial[];
  process: ProcessStep[];
  stats: Stat[];
  techIcons: TechIcon[];
  /** Budget bands offered in the contact form. */
  budgetRanges: string[];
}
