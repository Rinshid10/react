import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiCalendar, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import ScrollMask from './effects/ScrollMask';
import '../styles/Experience.css';
import TextReveal3D from './effects/TextReveal3D';

const Experience = () => {
  const { experience } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="experience" ref={ref}>
      <motion.div
        className="experience-container"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
      >
        <motion.div className="section-header">
          <span className="section-tag">Experience</span>
          <h2 className="section-title">
            <TextReveal3D>
              My <span className="highlight">Journey</span>
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">Professional experience and career path</p>
        </motion.div>

        {/* The timeline is long; fading its edges stops it ending in a hard
            cut and keeps the eye on whatever is centred. */}
        <ScrollMask fade={10}>
        <div className="timeline">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              className={`timeline-item ${exp.current ? 'current' : ''}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.2 }}
            >
              <div className="timeline-marker">
                <div className="marker-dot" />
              </div>

              <motion.div
                className="timeline-content"
                whileHover={{ y: -5 }}
              >
                <div className="experience-header">
                  <span className={`exp-type ${exp.type.toLowerCase()}`}>{exp.type}</span>
                  {exp.current && <span className="current-badge">Current</span>}
                </div>

                <h3 className="exp-role">{exp.role}</h3>
                <h4 className="exp-company">{exp.company}</h4>

                <div className="exp-meta">
                  <span><FiCalendar /> {exp.period}</span>
                  <span><FiMapPin /> {exp.location}</span>
                </div>

                <p className="exp-description">{exp.description}</p>

                <ul className="exp-responsibilities">
                  {exp.responsibilities.slice(0, 3).map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>

                <div className="exp-technologies">
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        </ScrollMask>
      </motion.div>
    </section>
  );
};

export default Experience;
