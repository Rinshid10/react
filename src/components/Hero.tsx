import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram, FiDownload, FiArrowDown } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import TechCarousel from './TechCarousel';
import '../styles/Hero.css';

/**
 * Hero Component
 * Main landing section with animated text, social links, and tech carousel
 */
const Hero = () => {
  const { personalInfo } = usePortfolio();
  const { setActiveSection } = useTheme();

  // Scroll to about section
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('about');
    }
  };

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Typing effect for tagline
  const taglineWords = personalInfo.tagline.split(' ');

  return (
    <section id="hero" className="hero">
      {/* Animated Background */}
      <div className="hero-background">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
        <div className="grid-pattern" />
      </div>

      <div className="hero-wrapper">
        {/* Left Content */}
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Greeting Badge */}
          <motion.div className="hero-badge" variants={itemVariants}>
            <span className="badge-wave">👋</span>
            <span>Welcome to my portfolio</span>
          </motion.div>

          {/* Name */}
          <motion.h1 className="hero-title" variants={itemVariants}>
            Hi, I'm{' '}
            <span className="highlight">{personalInfo.name}</span>
          </motion.h1>

          {/* Title */}
          <motion.h2 className="hero-subtitle" variants={itemVariants}>
            {personalInfo.title}
          </motion.h2>

          {/* Animated Tagline */}
          <motion.p className="hero-tagline" variants={itemVariants}>
            {taglineWords.map((word, index) => (
              <motion.span
                key={index}
                className="tagline-word"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                {word}{' '}
              </motion.span>
            ))}
          </motion.p>

          {/* Description */}
          <motion.p className="hero-description" variants={itemVariants}>
            Specialized in Flutter development with expertise in backend technologies.
            Creating seamless mobile experiences with clean architecture and modern practices.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="hero-cta" variants={itemVariants}>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </motion.button>
            <motion.a
              href={personalInfo.resumeUrl}
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              download
            >
              <FiDownload />
              Download CV
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div className="hero-social" variants={itemVariants}>
            <span className="social-label">Find me on</span>
            <div className="social-links">
              {[
                { icon: FiGithub, link: 'https://github.com/Rinshid10', label: 'GitHub' },
                { icon: FiLinkedin, link: personalInfo.social.linkedin, label: 'LinkedIn' },
                { icon: FiInstagram, link: personalInfo.social.instagram || '#', label: 'Instagram' },
              ].map(({ icon: Icon, link, label }) => (
                <motion.a
                  key={label}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Tech Carousel */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <TechCarousel />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        className="scroll-indicator"
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.5 },
          y: { duration: 1.5, repeat: Infinity },
        }}
        aria-label="Scroll to about section"
      >
        <FiArrowDown />
        <span>Scroll Down</span>
      </motion.button>
    </section>
  );
};

export default Hero;
