import { useRef } from 'react';
import { scrollToId } from '../lib/scroll';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { FiPhone, FiFileText, FiZap, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import TextReveal3D from './effects/TextReveal3D';
import '../styles/Process.css';

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
 * "what actually happens if I hire this person?"
 *
 * The steps sit on one connected line so the whole journey is visible at a
 * glance: horizontal on wide screens, vertical on narrow ones. The line draws
 * itself and the steps light up in order as the section scrolls into view,
 * which reads as "this is a sequence" without pinning the page.
 */
const Process = () => {
  const { process } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });
  const reduceMotion = useReducedMotion();

  if (!process.length) return null;

  const stepDelay = (i: number) => (reduceMotion ? 0 : 0.35 + i * 0.18);

  const startProject = () => {
    scrollToId('contact');
  };

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

        <ol
          className="journey"
          style={{ '--steps': process.length } as React.CSSProperties}
          aria-label="Project steps in order"
        >
          {/* The connecting rule: one element behind the nodes, scaled from
              its start so it appears to be drawn. */}
          <motion.span
            className="journey-line"
            aria-hidden="true"
            initial={{ scaleX: 0, scaleY: 0 }}
            animate={isInView ? { scaleX: 1, scaleY: 1 } : {}}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          {process.map((step, i) => {
            const Icon = iconMap[step.icon] ?? FiZap;
            const isLast = i === process.length - 1;
            return (
              <motion.li
                key={step.step}
                className={`journey-step${isLast ? ' is-last' : ''}`}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: stepDelay(i), ease: 'easeOut' }}
              >
                {step.duration && <span className="journey-when">{step.duration}</span>}

                <span className="journey-node" aria-hidden="true">
                  <Icon />
                </span>

                <div className="journey-body">
                  <span className="journey-index">
                    Step {String(step.step).padStart(2, '0')}
                  </span>
                  <h3 className="journey-title">{step.title}</h3>
                  <p className="journey-copy">{step.description}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <motion.div
          className="journey-cta"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: stepDelay(process.length) }}
        >
          <p>Every project starts the same way: a short call, no commitment.</p>
          <button type="button" className="btn btn-secondary" onClick={startProject}>
            Start with a discovery call <FiArrowRight aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
