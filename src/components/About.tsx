import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiMapPin, FiMail, FiCode, FiSmartphone, FiServer, FiDatabase } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/About.css';

/**
 * About Component
 * Personal introduction section with bio, info cards, and specializations
 */
const About = () => {
  const { personalInfo } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Specialization areas
  const specializations = [
    {
      icon: FiSmartphone,
      title: 'Mobile Development',
      description: 'Building cross-platform apps with Flutter for iOS and Android with pixel-perfect UI.',
    },
    {
      icon: FiServer,
      title: 'Backend Integration',
      description: 'Connecting apps to Firebase, Supabase, and Node.js backends with RESTful APIs.',
    },
    {
      icon: FiDatabase,
      title: 'State Management',
      description: 'Implementing scalable state solutions using Provider, Riverpod, Bloc, and GetX.',
    },
    {
      icon: FiCode,
      title: 'Clean Architecture',
      description: 'Writing maintainable, testable code following SOLID principles and best practices.',
    },
  ];

  return (
    <section id="about" className="about" ref={ref}>
      <motion.div
        className="about-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section Header */}
        <motion.div className="section-header" variants={itemVariants}>
          <span className="section-tag">About Me</span>
          <h2 className="section-title">
            Passionate <span className="highlight">Flutter Developer</span>
          </h2>
          <p className="section-subtitle">
            Creating beautiful mobile experiences with clean code
          </p>
        </motion.div>

        <div className="about-content">
          {/* Bio Section */}
          <motion.div className="about-bio-section" variants={itemVariants}>
            <div className="bio-card">
              <p className="about-bio">{personalInfo.bio}</p>

              <div className="about-info">
                <div className="info-item">
                  <FiMapPin className="info-icon" />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="info-item">
                  <FiMail className="info-icon" />
                  <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="quick-stats">
                <div className="stat">
                  <span className="stat-number">1+</span>
                  <span className="stat-label">Year Experience</span>
                </div>
                <div className="stat">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Technologies</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Specializations Grid */}
          <motion.div className="specializations" variants={itemVariants}>
            <h3 className="specializations-title">What I Do</h3>
            <div className="specializations-grid">
              {specializations.map((spec, index) => {
                const Icon = spec.icon;
                return (
                  <motion.div
                    key={spec.title}
                    className="spec-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  >
                    <div className="spec-icon">
                      <Icon />
                    </div>
                    <h4>{spec.title}</h4>
                    <p>{spec.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
