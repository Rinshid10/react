import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { scrollToId } from '../lib/scroll';
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
 * The corners carry the small stuff: socials bottom-left and a vertical
 * scroll rail down the right edge.
 */


const Hero = () => {
  const { personalInfo } = usePortfolio();
  const { setActiveSection } = useTheme();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Scroll-linked exit: as the hero scrolls away the composition sinks,
  // shrinks a touch and fades, while the glow behind it drifts the other
  // way. Tied to scroll position, so it reverses when you scroll back up.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const stageY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 140]);
  const stageScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.94]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const decoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      scrollToId(id);
      setActiveSection(id);
    }
  };

  const socials = [
    { icon: FiLinkedin, link: personalInfo.social.linkedin, label: 'LinkedIn' },
    { icon: FiGithub, link: personalInfo.social.github, label: 'GitHub' },
    { icon: FiInstagram, link: personalInfo.social.instagram || '#', label: 'Instagram' },
  ];

  return (
    <section id="hero" className="hero" ref={ref}>
      {/* The visible wordmark is decorative, so the real heading is here. */}
      <h1 className="sr-only">
        {personalInfo.name} — {personalInfo.title}
      </h1>

      {/* Background decoration, all purely visual. */}
      <motion.div className="hero-deco" aria-hidden="true" style={{ y: decoY }}>
        <span className="deco-glow" />
        <span className="deco-dots" />
      </motion.div>

      <motion.div className="hero-stage" style={{ y: stageY, scale: stageScale, opacity: stageOpacity }}>
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
            Software Engineer.
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
      </motion.div>

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
