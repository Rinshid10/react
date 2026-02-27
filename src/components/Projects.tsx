import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';
import { FiGithub, FiExternalLink, FiSmartphone, FiGlobe, FiArrowUpRight } from 'react-icons/fi';
import { SiGoogleplay, SiAppstore } from 'react-icons/si';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/Projects.css';

const Projects = () => {
  const { projects } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = useMemo(() => {
    return ['All', ...new Set(projects.map((p) => p.category))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  // ---- Entrance Animation Variants ----

  const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const tagVariants: Variants = {
    hidden: { opacity: 0, scale: 0.6, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 15 },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const lineVariants: Variants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const filtersVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const filterItemVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  };

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 60, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.3 } },
  };

  return (
    <section id="projects" className="projects" ref={ref}>
      <motion.div
        className="projects-container"
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* ---- Section Header with staggered children ---- */}
        <motion.div className="section-header" variants={sectionVariants}>
          <motion.span className="section-tag" variants={tagVariants}>
            Portfolio
          </motion.span>

          <motion.h2 className="section-title" variants={titleVariants}>
            Featured <span className="highlight">Projects</span>
          </motion.h2>

          <motion.p className="section-subtitle" variants={subtitleVariants}>
            A selection of my recent work showcasing my skills and expertise
          </motion.p>

          {/* Animated decorative line */}
          <motion.div className="section-line" variants={lineVariants} />
        </motion.div>

        {/* ---- Filter Tabs with per-tab stagger ---- */}
        <motion.div className="project-filters" variants={filtersVariants}>
          {categories.map((cat) => (
            <motion.div key={cat} variants={filterItemVariants}>
              <button
                className={`filter-tab ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
                {activeFilter === cat && (
                  <motion.div
                    className="filter-tab-indicator"
                    layoutId="activeFilter"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* ---- Projects Grid ---- */}
        <motion.div className="projects-grid" variants={gridVariants} layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const isHovered = hoveredProject === project.id;

              return (
                <motion.article
                  key={`${project.id}-${project.title}`}
                  className={`project-card ${project.featured ? 'featured' : ''}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  transition={{ delay: index * 0.08 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Card Glow */}
                  <motion.div
                    className="card-glow"
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Project Visual */}
                  <div className="project-visual">
                    {project.category === 'Mobile' ? (
                      <motion.div
                        className="project-icon-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                      >
                        <motion.div
                          animate={isHovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          <FiSmartphone className="project-type-icon" />
                        </motion.div>
                      </motion.div>
                    ) : project.category === 'Web' ? (
                      <motion.div
                        className="project-icon-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                      >
                        <motion.div
                          animate={isHovered ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          <FiGlobe className="project-type-icon" />
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="project-img"
                        animate={{ scale: isHovered ? 1.08 : 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}

                    {/* Overlay */}
                    <motion.div
                      className="project-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
                    >
                      <div className="project-links">
                        {project.github && (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                            whileHover={{ scale: 1.15, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            title="View Code"
                          >
                            <FiGithub />
                            <span>Code</span>
                          </motion.a>
                        )}
                        {project.live && (
                          <motion.a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            whileHover={{ scale: 1.15, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            title="Live Demo"
                          >
                            <FiExternalLink />
                            <span>Live</span>
                          </motion.a>
                        )}
                        {project.playStore && (
                          <motion.a
                            href={project.playStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                            whileHover={{ scale: 1.15, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            title="Play Store"
                          >
                            <SiGoogleplay />
                            <span>Play</span>
                          </motion.a>
                        )}
                        {project.appStore && (
                          <motion.a
                            href={project.appStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            whileHover={{ scale: 1.15, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            title="App Store"
                          >
                            <SiAppstore />
                            <span>Store</span>
                          </motion.a>
                        )}
                      </div>
                    </motion.div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <motion.span
                        className="featured-badge"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                      >
                        <span className="featured-dot" />
                        Featured
                      </motion.span>
                    )}

                    {/* Category Pill */}
                    <motion.span
                      className="category-pill"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                    >
                      {project.category}
                    </motion.span>
                  </div>

                  {/* Project Info */}
                  <div className="project-info">
                    <div className="project-info-header">
                      <h3 className="project-title">{project.title}</h3>
                      <motion.div
                        className="project-arrow"
                        animate={{
                          x: isHovered ? 4 : 0,
                          y: isHovered ? -4 : 0,
                          opacity: isHovered ? 1 : 0.4,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiArrowUpRight />
                      </motion.div>
                    </div>
                    <p className="project-description">{project.description}</p>

                    {/* Tech Stack */}
                    <div className="project-tech-stack">
                      {project.technologies.map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          className="tech-chip"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.5 + index * 0.08 + techIndex * 0.04,
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Projects;
