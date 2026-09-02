import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiPhone, FiFileText, FiZap, FiTrendingUp } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import ScrollStack, { ScrollStackItem } from './effects/ScrollStack';
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

        {/* The steps are a sequence meant to be read in order, so they pin and
            pile up rather than sitting side by side — each one holds the screen
            until the next slides over it. */}
        <ScrollStack topOffset={130} itemOffset={18}>
          {process.map((step) => {
            const Icon = iconMap[step.icon] ?? FiZap;
            return (
              <ScrollStackItem key={step.step}>
                <div className="process-step">
                  <div className="process-number">{String(step.step).padStart(2, '0')}</div>
                  <div className="process-icon">
                    <Icon />
                  </div>
                  <h3>{step.title}</h3>
                  {step.duration && <span className="process-duration">{step.duration}</span>}
                  <p>{step.description}</p>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
};

export default Process;
