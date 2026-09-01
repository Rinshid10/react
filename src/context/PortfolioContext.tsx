import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API_BASE_URL } from '../config';
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
  SiGoogleads,
  SiMeta,
  SiGoogleanalytics,
  SiGooglesearchconsole,
  SiCanva,
  SiFigma,
  SiSemrush,
  SiMailchimp,
  SiGit,
} from 'react-icons/si';
import {
  PortfolioContextType,
  PersonalInfo,
  Skill,
  Project,
  CaseStudy,
  Service,
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
 * The site sells two tracks under one freelance offer:
 *   Development  - Flutter / React / backend build work
 *   Marketing    - SEO, paid ads, social and branding
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
    title: 'Flutter Developer & Digital Marketer',
    roles: ['Flutter Developer', 'Digital Marketer', 'Freelancer'],
    tagline: 'I build apps — and the growth engine that fills them.',
    // Must be a substring of `tagline`; it is rendered in a dimmer tone.
    taglineEmphasis: 'growth engine',
    heroBadge: 'Building digital experiences that make an impact',
    heroScript: 'Freelance',
    email: 'rinshidch10@gmail.com',
    location: 'India · Working with clients worldwide',
    bio: `I'm a Flutter developer who builds fast, good-looking cross-platform
    apps — and a digital marketer who makes sure people actually find them.
    On the build side I work with Flutter, React and Node.js, with Firebase
    and Supabase behind them, and I'm comfortable across Provider, Riverpod,
    Bloc and GetX.`,
    marketingBio: `On the growth side I run SEO, Meta and Google Ads, content
    and social for founders who need traffic that converts, not vanity metrics.
    Most clients hire me for both: one person who ships the product and owns
    the funnel means no handoff, no finger-pointing, and a launch that lands.`,
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
      track: 'Development',
      startingPrice: 'From ₹60,000',
      timeline: '4–10 weeks',
      featured: true,
    },
    {
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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

  // ==========================================================================
  // Headline stats
  // ==========================================================================
  // TODO(real-data): replace with numbers you can defend if a client asks.
  const defaultStats: Stat[] = [
    { label: 'Apps shipped to stores', value: '10+', icon: 'smartphone' },
    { label: 'Campaigns managed', value: '15+', icon: 'target' },
    { label: 'Ad spend managed', value: '₹12L+', icon: 'trending' },
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
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', category: 'Database' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248', category: 'Database' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', category: 'Language' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', category: 'Language' },
    { name: 'Git', icon: SiGit, color: '#F05032', category: 'Tools' },
    // Marketing side of the toolkit
    { name: 'Google Ads', icon: SiGoogleads, color: '#4285F4', category: 'Paid Ads' },
    { name: 'Meta Ads', icon: SiMeta, color: '#0081FB', category: 'Paid Ads' },
    { name: 'GA4', icon: SiGoogleanalytics, color: '#E37400', category: 'Analytics' },
    { name: 'Search Console', icon: SiGooglesearchconsole, color: '#458CF5', category: 'SEO' },
    { name: 'Semrush', icon: SiSemrush, color: '#FF642D', category: 'SEO' },
    { name: 'Mailchimp', icon: SiMailchimp, color: '#FFE01B', category: 'Content' },
    { name: 'Figma', icon: SiFigma, color: '#F24E1E', category: 'Branding' },
    { name: 'Canva', icon: SiCanva, color: '#00C4CC', category: 'Branding' },
  ];

  // ==========================================================================
  // Skills - split across the two tracks
  // ==========================================================================
  const defaultSkills: Skill[] = [
    // --- Development ---
    { name: 'Flutter', level: 95, category: 'Mobile', track: 'Development' },
    { name: 'Dart', level: 92, category: 'Mobile', track: 'Development' },
    { name: 'Provider', level: 90, category: 'State Management', track: 'Development' },
    { name: 'Riverpod', level: 88, category: 'State Management', track: 'Development' },
    { name: 'Bloc', level: 85, category: 'State Management', track: 'Development' },
    { name: 'GetX', level: 88, category: 'State Management', track: 'Development' },
    { name: 'React', level: 80, category: 'Frontend', track: 'Development' },
    { name: 'TypeScript', level: 75, category: 'Frontend', track: 'Development' },
    { name: 'JavaScript', level: 82, category: 'Frontend', track: 'Development' },
    { name: 'Node.js', level: 78, category: 'Backend', track: 'Development' },
    { name: 'Firebase', level: 85, category: 'Backend', track: 'Development' },
    { name: 'Supabase', level: 82, category: 'Backend', track: 'Development' },
    { name: 'PostgreSQL', level: 75, category: 'Database', track: 'Development' },
    { name: 'MySQL', level: 72, category: 'Database', track: 'Development' },
    { name: 'MongoDB', level: 70, category: 'Database', track: 'Development' },
    { name: 'Git', level: 88, category: 'Tools', track: 'Development' },
    { name: 'Figma', level: 85, category: 'Tools', track: 'Development' },
    { name: 'Claude / AI tooling', level: 90, category: 'AI', track: 'Development' },
    { name: 'Cursor AI', level: 88, category: 'AI', track: 'Development' },

    // --- Marketing ---
    // TODO(real-data): tune these levels honestly - a client may test them.
    { name: 'Technical SEO', level: 85, category: 'SEO', track: 'Marketing' },
    { name: 'Keyword Research', level: 88, category: 'SEO', track: 'Marketing' },
    { name: 'On-Page SEO', level: 87, category: 'SEO', track: 'Marketing' },
    { name: 'Link Building', level: 72, category: 'SEO', track: 'Marketing' },
    { name: 'Meta Ads', level: 88, category: 'Paid Ads', track: 'Marketing' },
    { name: 'Google Ads', level: 82, category: 'Paid Ads', track: 'Marketing' },
    { name: 'Conversion Tracking', level: 85, category: 'Paid Ads', track: 'Marketing' },
    { name: 'Instagram Growth', level: 86, category: 'Social Media', track: 'Marketing' },
    { name: 'Content Strategy', level: 84, category: 'Content', track: 'Marketing' },
    { name: 'Copywriting', level: 80, category: 'Content', track: 'Marketing' },
    { name: 'Email Marketing', level: 75, category: 'Content', track: 'Marketing' },
    { name: 'Google Analytics 4', level: 83, category: 'Analytics', track: 'Marketing' },
    { name: 'Search Console', level: 85, category: 'Analytics', track: 'Marketing' },
    { name: 'Brand Identity', level: 78, category: 'Branding', track: 'Marketing' },
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
  // Marketing case studies - problem / approach / results
  // ==========================================================================
  // TODO(real-data): THIS ENTIRE ARRAY IS PLACEHOLDER. Every number below is
  // invented to show the layout. Swap in real clients and real metrics - or
  // delete the entries you can't back up. Three honest case studies convert
  // better than six you have to hedge about.
  const defaultCaseStudies: CaseStudy[] = [
    {
      id: 1,
      client: 'Sample Client — D2C Skincare Brand',
      industry: 'E-commerce',
      title: '3.4x return on ad spend in 90 days',
      channels: ['Meta Ads', 'Google Ads', 'Landing Pages'],
      problem:
        'The brand was spending steadily on Meta but could not tell which campaigns produced sales. Tracking was half-installed, every ad pointed at the homepage, and cost per purchase had been climbing for four months.',
      approach: [
        'Rebuilt pixel and GA4 tracking so every purchase was attributed correctly',
        'Restructured the account into cold, warm and retargeting campaigns',
        'Built three dedicated landing pages, one per bestselling product',
        'Ran a creative test cycle of six new ads every two weeks',
        'Cut spend on ad sets that missed the target cost per purchase within 7 days',
      ],
      results: [
        { label: 'Return on ad spend', value: '3.4x', note: 'up from 1.2x' },
        { label: 'Cost per purchase', value: '-58%', note: 'over 90 days' },
        { label: 'Monthly revenue', value: '+212%', note: 'at similar spend' },
      ],
      duration: '3 months',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
      featured: true,
      testimonialId: 1,
    },
    {
      id: 2,
      client: 'Sample Client — B2B SaaS',
      industry: 'Software',
      title: 'Organic traffic up 186% with a technical SEO rebuild',
      channels: ['Technical SEO', 'Content', 'On-Page'],
      problem:
        'A well-written blog was invisible in search. Pages took over six seconds to load, half the site was not indexed, and the content targeted terms with no commercial intent.',
      approach: [
        'Full technical audit: fixed crawl errors, redirects and a broken sitemap',
        'Cut largest-contentful-paint from 6.2s to 1.9s with image and script work',
        'Rebuilt the keyword map around problem-aware search intent',
        'Rewrote 14 existing posts and added internal linking clusters',
        'Published two new pieces a month against a 3-month calendar',
      ],
      results: [
        { label: 'Organic traffic', value: '+186%', note: 'in 6 months' },
        { label: 'Keywords in top 10', value: '4 → 37' },
        { label: 'Demo requests', value: '+64%', note: 'from organic' },
      ],
      duration: '6 months',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
      featured: true,
      testimonialId: 2,
    },
    {
      id: 3,
      client: 'Sample Client — Local Restaurant Group',
      industry: 'Food & Beverage',
      title: 'From 2K to 47K followers and a fully booked weekend service',
      channels: ['Instagram', 'Short-form Video', 'Local SEO'],
      problem:
        'Three outlets posting inconsistently with no shared identity. Google Business profiles were unclaimed, so the group was invisible to the "near me" searches that drive walk-ins.',
      approach: [
        'Set one visual identity and content pillars across all three outlets',
        'Shifted to a reels-first calendar: five short videos a week',
        'Claimed and optimised every Google Business profile',
        'Ran a monthly collaboration programme with local food creators',
        'Added a booking link and tracked reservations back to each channel',
      ],
      results: [
        { label: 'Instagram followers', value: '2K → 47K', note: 'in 8 months' },
        { label: 'Weekend bookings', value: '+120%' },
        { label: '"Near me" impressions', value: '+340%' },
      ],
      duration: '8 months',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
      featured: true,
      testimonialId: 3,
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
      title: 'Build or launch',
      description:
        'Work runs in weekly sprints. You see progress every week — a build, a dashboard, a report — never a month of silence.',
      icon: 'zap',
      duration: 'Week 1 onward',
    },
    {
      step: 4,
      title: 'Measure & iterate',
      description:
        'Everything is tracked against the numbers we agreed. We keep what performs, cut what does not, and you keep full access to every account.',
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
      role: 'Founder',
      company: 'D2C Skincare Brand',
      quote:
        'We had been burning budget on ads nobody could explain. Within a quarter we knew exactly which campaigns made money, and the rest were switched off.',
      rating: 5,
      track: 'Marketing',
    },
    {
      id: 2,
      name: 'Sample Name',
      role: 'Head of Growth',
      company: 'B2B SaaS',
      quote:
        'The SEO work was unglamorous and completely effective. Site speed, indexing, intent — the traffic followed and so did the demo requests.',
      rating: 5,
      track: 'Marketing',
    },
    {
      id: 3,
      name: 'Sample Name',
      role: 'Owner',
      company: 'Restaurant Group',
      quote:
        'Our weekends are full now. Same food, same prices — people just finally know we exist.',
      rating: 5,
      track: 'Marketing',
    },
    {
      id: 4,
      name: 'Sample Name',
      role: 'Product Manager',
      company: 'Fintech Startup',
      quote:
        'The app shipped on schedule and the code was clean enough that our own team picked it up without a handover crisis.',
      rating: 5,
      track: 'Development',
    },
  ];

  // ==========================================================================
  // Experience
  // ==========================================================================
  const defaultExperience: Experience[] = [
    {
      id: 1,
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
      track: 'Development',
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
      track: 'Development',
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
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(defaultCaseStudies);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [experience, setExperience] = useState<Experience[]>(defaultExperience);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [process, setProcess] = useState<ProcessStep[]>(defaultProcess);
  const [stats, setStats] = useState<Stat[]>(defaultStats);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/portfolio`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;

        if (data.personalInfo) {
          setPersonalInfo({ ...defaultPersonalInfo, ...data.personalInfo });
        }
        if (Array.isArray(data.skills) && data.skills.length) {
          setSkills(
            data.skills.map((s: Partial<Skill>) => ({
              name: s.name ?? '',
              level: Number(s.level ?? 0),
              category: (s.category ?? 'Tools') as Skill['category'],
              track: (s.track ?? 'Development') as Skill['track'],
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
              track: (s.track as Service['track']) ?? 'Development',
              startingPrice: (s.startingPrice as string) || undefined,
              timeline: (s.timeline as string) || undefined,
              featured: Boolean(s.featured),
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
        if (Array.isArray(data.caseStudies) && data.caseStudies.length) {
          setCaseStudies(
            data.caseStudies.map((c: Record<string, unknown>, i: number) => ({
              id: i + 1,
              client: (c.client as string) ?? '',
              industry: (c.industry as string) ?? '',
              title: (c.title as string) ?? '',
              channels: (c.channels as string[]) ?? [],
              problem: (c.problem as string) ?? '',
              approach: (c.approach as string[]) ?? [],
              results: (c.results as CaseStudy['results']) ?? [],
              duration: (c.duration as string) ?? '',
              image: (c.image as string) || undefined,
              featured: Boolean(c.featured),
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
              track: (e.track as Experience['track']) ?? 'Development',
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
              track: (t.track as Testimonial['track']) || undefined,
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
        // Backend offline - keep defaults.
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
    caseStudies,
    services,
    experience,
    testimonials,
    process,
    stats,
    techIcons,
    budgetRanges,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};
