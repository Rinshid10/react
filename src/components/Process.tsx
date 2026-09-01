import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiPhone, FiFileText, FiZap, FiTrendingUp } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/Process.css';
import TextReveal3D from './effects/TextReveal3D';

const iconMap: Record<string, React.ComponentType> = {
  phone: FiPhone,
  file: FiFileText,
  zap: FiZap,
  trending: FiTrendingUp,
};

/**
 * Process Component
 *
 * Answers the question every freelance prospect has before they message:
 * "what actually happens if I hire this person?" Removing that uncertainty
 * is worth more than another project card.
 */
const Process = () => {
  const { process } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (!process.length) return null;

  return (
    <section id="process" className="process" ref={ref}>
      <div className="process-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">How I Work</span>
          <h2 className="section-title">
            <TextReveal3D>
              From First Call to <span className="highlight">Live Results</span>
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">
            No mystery, no month-long silences. Here is exactly how a project runs.
          </p>
        </motion.div>

        <div className="process-steps">
          {/* Connecting line, drawn as the section scrolls into view */}
          <motion.div
            className="process-line"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {process.map((step, index) => {
            const Icon = iconMap[step.icon] ?? FiZap;
            return (
              <motion.div
                key={step.step}
                className="process-step"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                whileHover={{ y: -6 }}
              >
                <div className="process-number">{String(step.step).padStart(2, '0')}</div>
                <div className="process-icon">
                  <Icon />
                </div>
                <h3>{step.title}</h3>
                {step.duration && <span className="process-duration">{step.duration}</span>}
                <p>{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
