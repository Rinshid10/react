import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FiTrendingUp, FiAlertCircle, FiCheckCircle, FiClock, FiChevronDown } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import ScrollStack from './effects/ScrollStack';
import '../styles/CaseStudies.css';
import TextReveal3D from './effects/TextReveal3D';

/**
 * CaseStudies Component
 *
 * The marketing equivalent of the Projects grid. A developer is judged on
 * what they shipped; a marketer is judged on what moved. So each entry leads
 * with the numbers, then expands into problem -> approach for anyone who
 * wants to check the thinking behind them.
 */
const CaseStudies = () => {
  const { caseStudies } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!caseStudies.length) return null;

  return (
    <section id="case-studies" className="case-studies" ref={ref}>
      <div className="case-studies-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Case Studies</span>
          <h2 className="section-title">
            <TextReveal3D>
              Marketing Work, <span className="highlight">Measured</span>
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">
            Every engagement is tracked against numbers agreed up front. Here is what that
            looks like in practice.
          </p>
        </motion.div>

        {/* Each case study pins and the previous one scales back behind it, so
            every story gets the screen to itself instead of being skimmed. */}
        <ScrollStack topOffset={110} itemOffset={16}>
          {caseStudies.map((study, index) => {
            const isOpen = expandedId === study.id;
            return (
              <motion.article
                key={study.id}
                className={`case-card ${isOpen ? 'open' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 }}
              >
                {/* Summary row */}
                <div className="case-head">
                  <div className="case-head-text">
                    <div className="case-meta">
                      <span className="case-industry">{study.industry}</span>
                      <span className="case-duration">
                        <FiClock /> {study.duration}
                      </span>
                    </div>
                    <h3 className="case-title">{study.title}</h3>
                    <p className="case-client">{study.client}</p>
                    <div className="case-channels">
                      {study.channels.map((c) => (
                        <span key={c} className="tech-tag">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {study.image && (
                    <div className="case-image">
                      <img src={study.image} alt="" loading="lazy" />
                    </div>
                  )}
                </div>

                {/* Headline metrics — the part clients actually scan */}
                <div className="case-metrics">
                  {study.results.map((metric) => (
                    <motion.div
                      key={metric.label}
                      className="metric-tile"
                      whileHover={{ y: -4 }}
                    >
                      <FiTrendingUp className="metric-icon" />
                      <span className="metric-value">{metric.value}</span>
                      <span className="metric-label">{metric.label}</span>
                      {metric.note && <span className="metric-note">{metric.note}</span>}
                    </motion.div>
                  ))}
                </div>

                <button
                  className="case-toggle"
                  onClick={() => setExpandedId(isOpen ? null : study.id)}
                  aria-expanded={isOpen}
                >
                  {isOpen ? 'Hide the detail' : 'How it was done'}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                    <FiChevronDown />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="case-detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="case-detail-inner">
                        <div className="case-block">
                          <h4>
                            <FiAlertCircle /> The problem
                          </h4>
                          <p>{study.problem}</p>
                        </div>
                        <div className="case-block">
                          <h4>
                            <FiCheckCircle /> What I did
                          </h4>
                          <ul>
                            {study.approach.map((step) => (
                              <li key={step}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
};

export default CaseStudies;
