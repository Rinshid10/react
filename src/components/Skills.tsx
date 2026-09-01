import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Track } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/Skills.css';
import TextReveal3D from './effects/TextReveal3D';

/**
 * Skills Component
 *
 * Two levels of filtering: first the track (Development / Marketing), then
 * the category within it. Mixing SEO and Riverpod in one flat list would make
 * both look unfocused.
 */
const Skills = () => {
  const { skills } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeTrack, setActiveTrack] = useState<Track>('Development');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const tracks: Track[] = ['Development', 'Marketing'];

  // Skills for the selected track only.
  const trackSkills = useMemo(
    () => skills.filter((s) => s.track === activeTrack),
    [skills, activeTrack]
  );

  // Categories present in the selected track.
  const categories = useMemo(
    () => ['All', ...new Set(trackSkills.map((s) => s.category))],
    [trackSkills]
  );

  const filteredSkills =
    activeCategory === 'All'
      ? trackSkills
      : trackSkills.filter((s) => s.category === activeCategory);

  const switchTrack = (track: Track) => {
    setActiveTrack(track);
    setActiveCategory('All'); // the old category may not exist in the new track
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getSkillColor = (level: number): string => {
    if (level >= 90) return 'var(--color-success)';
    if (level >= 75) return 'var(--color-accent)';
    if (level >= 60) return 'var(--color-warning)';
    return 'var(--color-info)';
  };

  return (
    <section id="skills" className="skills" ref={ref}>
      <motion.div
        className="skills-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section Header */}
        <motion.div className="section-header" variants={itemVariants}>
          <span className="section-tag">Skills</span>
          <h2 className="section-title">
            <TextReveal3D>
              Two Toolkits, <span className="highlight">One Person</span>
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">
            The stack I build with, and the channels I grow with.
          </p>
        </motion.div>

        {/* Track switch */}
        <motion.div className="skills-tracks" variants={itemVariants}>
          {tracks.map((track) => (
            <button
              key={track}
              className={`track-btn ${activeTrack === track ? 'active' : ''}`}
              onClick={() => switchTrack(track)}
            >
              {track}
              {activeTrack === track && (
                <motion.span className="track-underline" layoutId="trackUnderline" />
              )}
            </button>
          ))}
        </motion.div>

        {/* Category Filter */}
        <motion.div className="skills-categories" variants={itemVariants}>
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div className="skills-grid" layout>
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={`${skill.track}-${skill.name}`}
              className="skill-item"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">{skill.level}%</span>
              </div>

              <div className="skill-progress-container">
                <motion.div
                  className="skill-progress"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.04, ease: 'easeOut' }}
                  style={{ backgroundColor: getSkillColor(skill.level) }}
                />
              </div>

              <span className="skill-category-tag">{skill.category}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Marquee across every skill, both tracks */}
        <motion.div className="tech-marquee" variants={itemVariants}>
          <div className="marquee-content">
            {[...skills, ...skills].map((skill, index) => (
              <span key={`${skill.name}-${index}`} className="marquee-item">
                {skill.name}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Skills;
