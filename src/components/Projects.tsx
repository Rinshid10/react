import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiPlay, FiSmartphone, FiGlobe, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SiGoogleplay, SiAppstore } from 'react-icons/si';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/Projects.css';

/**
 * Projects Component
 * Interactive project gallery with horizontal scrolling
 */
const Projects = () => {
  const { projects } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [showAllProjects, setShowAllProjects] = useState<boolean>(false);

  // Limit projects initially, show all when button is clicked
  const displayedProjects = showAllProjects ? projects : projects.slice(0, 4);

  // Handle view all projects
  const handleViewAllProjects = () => {
    setShowAllProjects(true);
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth',
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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

        {/* Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          variants={itemVariants}
        >
          <motion.div
            animate={{
              x: [-5, 5, -5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FiChevronLeft />
          </motion.div>
          <span>Scroll to explore</span>
          <motion.div
            animate={{
              x: [-5, 5, -5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FiChevronRight />
          </motion.div>
        </motion.div>

        {/* Projects Horizontal Scroll Container with Arrow Buttons */}
        <div className="projects-scroll-wrapper">
          {/* Left Arrow Button */}
          <motion.button
            className="scroll-arrow scroll-arrow-left"
            onClick={scrollLeft}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll left"
          >
            <FiChevronLeft />
          </motion.button>

          <motion.div 
            className="projects-scroll-container" 
            ref={scrollContainerRef}
            layout
          >
            <motion.div className="projects-horizontal-grid">
              <AnimatePresence mode="popLayout">
                {displayedProjects.map((project, index) => (
                  <motion.article
                  key={project.id}
                  className={`project-card ${project.featured ? 'featured' : ''}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                {/* Project Image / Icon */}
                <div className="project-image-container">
                  {project.category === 'Mobile' ? (
                    <motion.div
                      className="project-image project-icon-wrapper"
                      animate={{
                        scale: hoveredProject === project.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <FiSmartphone className="mobile-icon" />
                    </motion.div>
                  ) : project.category === 'Web' ? (
                    <motion.div
                      className="project-image project-icon-wrapper"
                      animate={{
                        scale: hoveredProject === project.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <FiGlobe className="mobile-icon" />
                    </motion.div>
                  ) : (
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="project-image"
                      animate={{
                        scale: hoveredProject === project.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  )}

                  {/* Overlay with Links */}
                  <motion.div
                    className="project-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="project-links">
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          title="View Code"
                        >
                          <FiGithub />
                        </motion.a>
                      )}
                      {project.live && (
                        <motion.a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          title="Live Demo"
                        >
                          <FiExternalLink />
                        </motion.a>
                      )}
                      {project.playStore && (
                        <motion.a
                          href={project.playStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          title="Play Store"
                        >
                          <SiGoogleplay />
                        </motion.a>
                      )}
                      {project.appStore && (
                        <motion.a
                          href={project.appStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          title="App Store"
                        >
                          <SiAppstore />
                        </motion.a>
                      )}
                    </div>
                  </motion.div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <span className="featured-badge">Featured</span>
                  )}
                </div>

                {/* Project Content */}
                <div className="project-content">
                  <span className="project-category">{project.category}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  {/* Technologies */}
                  <div className="project-technologies">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
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

          {/* Right Arrow Button */}
          <motion.button
            className="scroll-arrow scroll-arrow-right"
            onClick={scrollRight}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll right"
          >
            <FiChevronRight />
          </motion.button>
        </div>

        {/* View All Projects Button */}
        {!showAllProjects && projects.length > 4 && (
          <motion.div className="projects-cta" variants={itemVariants}>
            <motion.button
              onClick={handleViewAllProjects}
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Projects
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Projects;
