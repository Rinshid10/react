import { motion } from 'framer-motion';
import { FiArrowUpRight, FiArrowDown, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Hero.css';
import Magnetic from './effects/Magnetic';

/**
 * Hero Component
 *
 * One full screen, laid out as a single centred column that shares a left
 * edge: the greeting, the name set oversized, then the description and CTA
 * beneath it. A background-removed subject sits behind the name — head above
 * the letters, tail below — with a faint ring and dot grid behind that.
 *
 * The name is the wordmark rather than a generic word. That only works
 * because `.art-wordmark` fades where the figure begins (see Hero.css), so
 * the letters crossing the face stay readable instead of being covered.
 *
 * The corners carry the small stuff: socials bottom-left, an update pill
 * bottom-right, and a vertical scroll rail down the right edge.
 */


const Hero = () => {
  const { personalInfo } = usePortfolio();
  const { setActiveSection } = useTheme();
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const socials = [
    { icon: FiLinkedin, link: personalInfo.social.linkedin, label: 'LinkedIn' },
    { icon: FiGithub, link: personalInfo.social.github, label: 'GitHub' },
    { icon: FiInstagram, link: personalInfo.social.instagram || '#', label: 'Instagram' },
  ];

  return (
    <section id="hero" className="hero">
      {/* The visible wordmark is decorative, so the real heading is here. */}
      <h1 className="sr-only">
        {personalInfo.name} — {personalInfo.title}
      </h1>

      {/* Background decoration, all purely visual. */}
      <div className="hero-deco" aria-hidden="true">
        <span className="deco-glow" />
        <span className="deco-dots" />
      </div>

      <div className="hero-stage">
        {/* Behind the word: head above the letters, tail below. */}
        {personalInfo.portraitUrl && (
          <motion.div
            className="art-cutout"
            aria-hidden="true"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={personalInfo.portraitUrl} alt="" />
          </motion.div>
        )}

        {/* Word, name, description and CTA all share one left edge. */}
        <motion.div
          className="art-column"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12, delayChildren: 0.25 }}
        >
          <motion.div
            className="art-word"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {personalInfo.heroScript && (
              <span className="art-script">{personalInfo.heroScript}</span>
            )}
            <span className="art-wordmark" aria-hidden="true">
              {personalInfo.name}
            </span>
          </motion.div>

          <motion.p
            className="art-desc"
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
          >
            Flutter developer.
            <br />
            {personalInfo.tagline}
          </motion.p>

          <Magnetic>
          <motion.button
            className="art-cta"
            onClick={() => scrollTo('projects')}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View My Work
            <FiArrowUpRight />
          </motion.button>
          </Magnetic>
        </motion.div>
      </div>

      {/* Bottom-left socials */}
      <motion.div
        className="hero-socials"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.9 }}
      >
        {socials.map(({ icon: Icon, link, label }) => (
          <a
            key={label}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon />
          </a>
        ))}
      </motion.div>

      {/* Bottom-right update pill */}
      <motion.span
        className="hero-update"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1 }}
      >
        <span className="update-dot" aria-hidden="true" />
        Update : {year}
      </motion.span>

      {/* Right-edge scroll rail */}
      <motion.div
        className="scroll-rail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.1 }}
      >
        <span className="rail-dots" aria-hidden="true">
          <i className="active" />
          <i />
          <i />
          <i />
        </span>
        <span className="rail-line" aria-hidden="true" />
        <button className="rail-text" onClick={() => scrollTo('services')}>
          Scroll to explore
        </button>
        <motion.span
          className="rail-arrow"
          aria-hidden="true"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <FiArrowDown />
        </motion.span>
      </motion.div>
    </section>
  );
};

export default Hero;
