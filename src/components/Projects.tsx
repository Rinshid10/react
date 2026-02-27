import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';
import { FiGithub, FiExternalLink, FiSmartphone, FiGlobe, FiArrowUpRight } from 'react-icons/fi';
import { SiGoogleplay, SiAppstore } from 'react-icons/si';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/Projects.css';

const Projects = () => {
  const { projects } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(projects.map((p) => p.category))];
    return cats;
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  return (
    <section id="projects" className="projects" ref={ref}>
      <motion.div
        className="projects-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section Header */}
        <motion.div className="section-header" variants={itemVariants}>
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">
            Featured <span className="highlight">Projects</span>
          </h2>
          <p className="section-subtitle">
            A selection of my recent work showcasing my skills and expertise
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div className="project-filters" variants={itemVariants}>
          {categories.map((cat) => (
            <button
              key={cat}
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
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div className="projects-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={`${project.id}-${project.title}`}
                className={`project-card ${project.featured ? 'featured' : ''}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onTouchStart={() => setHoveredProject(project.id)}
              >
                {/* Card Glow Effect */}
                <motion.div
                  className="card-glow"
                  animate={{
                    opacity: hoveredProject === project.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Project Visual */}
                <div className="project-visual">
                  {project.category === 'Mobile' ? (
                    <div className="project-icon-bg">
                      <FiSmartphone className="project-type-icon" />
                    </div>
                  ) : project.category === 'Web' ? (
                    <div className="project-icon-bg">
                      <FiGlobe className="project-type-icon" />
                    </div>
                  ) : (
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="project-img"
                      animate={{
                        scale: hoveredProject === project.id ? 1.08 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  {/* Overlay */}
                  <motion.div
                    className="project-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="project-links">
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                          whileHover={{ scale: 1.15, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
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
                          whileHover={{ scale: 1.15, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
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
                          whileHover={{ scale: 1.15, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
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
                          whileHover={{ scale: 1.15, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
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
                    <span className="featured-badge">
                      <span className="featured-dot" />
                      Featured
                    </span>
                  )}

                  {/* Category Pill */}
                  <span className="category-pill">{project.category}</span>
                </div>

                {/* Project Info */}
                <div className="project-info">
                  <div className="project-info-header">
                    <h3 className="project-title">{project.title}</h3>
                    <motion.div
                      className="project-arrow"
                      animate={{
                        x: hoveredProject === project.id ? 4 : 0,
                        y: hoveredProject === project.id ? -4 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiArrowUpRight />
                    </motion.div>
                  </div>
                  <p className="project-description">{project.description}</p>

                  {/* Tech Stack */}
                  <div className="project-tech-stack">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Projects;
