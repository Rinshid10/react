import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FiMapPin,
  FiMail,
  FiCode,
  FiSmartphone,
  FiLayers,
  FiUploadCloud,
} from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/About.css';
import TextReveal3D from './effects/TextReveal3D';
import CountUp from './effects/CountUp';

/**
 * About Component
 *
 * A bio card beside a grid of what I actually build, so a visitor can place
 * the offer without reading the prose.
 */
const About = () => {
  const { personalInfo, stats } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const specializations = [
    {
      icon: FiSmartphone,
      title: 'Mobile & Cross-Platform',
      description:
        'Flutter apps for iOS and Android from one codebase — clean architecture, real state management, shipped to the stores.',
    },
    {
      icon: FiCode,
      title: 'Web & Backend',
      description:
        'React and TypeScript front ends on Node, Firebase or Supabase, with the APIs and admin tooling behind them.',
    },
    {
      icon: FiLayers,
      title: 'State & Architecture',
      description:
        'Provider, Riverpod, Bloc or GetX — chosen to fit the app, not the fashion, so the codebase survives its second year.',
    },
    {
      icon: FiUploadCloud,
      title: 'Release & Maintenance',
      description:
        'Play Store and App Store submission, CI, crash reporting, and the unglamorous fixes that follow a first release.',
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
            <TextReveal3D>
              A Developer Who <span className="highlight">Ships</span>, Then{' '}
              <span className="highlight">Stays</span>.
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">
            One person accountable from the first call to the store listing.
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

              {/* Quick Stats — driven by the shared stats list */}
              <div className="quick-stats">
                {stats.map((stat) => (
                  <div className="stat" key={stat.label}>
                    <span className="stat-number">
                      <CountUp value={stat.value} />
                    </span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
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
                    <div className="spec-top">
                      <div className="spec-icon">
                        <Icon />
                      </div>
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
