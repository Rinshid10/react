import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillCategory } from '../types';
import '../styles/Skills.css';

/**
 * Skills Component
 * Displays skills with animated progress bars and category filtering
 */
const Skills = () => {
  const { skills } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Get unique categories
  const categories: string[] = ['All', ...new Set(skills.map((s) => s.category))];

  // Filter skills by category
  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Get color based on skill level
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
            My <span className="highlight">Technical</span> Expertise
          </h2>
          <p className="section-subtitle">
            Technologies and tools I work with to build amazing applications
          </p>
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
              key={skill.name}
              className="skill-item"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">{skill.level}%</span>
              </div>

              {/* Animated Progress Bar */}
              <div className="skill-progress-container">
                <motion.div
                  className="skill-progress"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.05, ease: 'easeOut' }}
                  style={{ backgroundColor: getSkillColor(skill.level) }}
                />
              </div>

              <span className="skill-category-tag">{skill.category}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Icons Marquee */}
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
