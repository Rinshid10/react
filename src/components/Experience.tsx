import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import TextReveal3D from './effects/TextReveal3D';
import Typewriter from './effects/Typewriter';
import CountUp from './effects/CountUp';
import type { Experience as ExperienceEntry } from '../types';
import '../styles/Experience.css';

// --- Date helpers -----------------------------------------------------------
// `startDate` / `endDate` are "YYYY-MM". Everything here is derived from them
// so the summary line and tenures never drift from the period text.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parseYM = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m: m || 1 };
};

const monthIndex = (ym: string) => {
  const { y, m } = parseYM(ym);
  return y * 12 + (m - 1);
};

const nowIndex = () => {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
};

/** "1 yr 4 mos", "11 mos", "2 yrs". Counts the start month inclusively. */
const formatSpan = (months: number) => {
  const total = Math.max(1, months);
  const yrs = Math.floor(total / 12);
  const mos = total % 12;
  const parts: string[] = [];
  if (yrs) parts.push(`${yrs} ${yrs === 1 ? 'yr' : 'yrs'}`);
  if (mos) parts.push(`${mos} ${mos === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ');
};

const formatYM = (ym: string) => {
  const { y, m } = parseYM(ym);
  return `${MONTHS[m - 1]} ${y}`;
};

const endIndex = (exp: ExperienceEntry) =>
  exp.current || !exp.endDate ? nowIndex() : monthIndex(exp.endDate);

const tenure = (exp: ExperienceEntry) => formatSpan(endIndex(exp) - monthIndex(exp.startDate) + 1);

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Experience Component
 *
 * A ledger rather than a card timeline: each role is a wide row split by a
 * hairline, with the dates and tenure down the left and the role, company and
 * what was actually done on the right.
 *
 * The motion tells one story — the ledger being typeset in front of you. Each
 * row's rule draws across, the role title rises from behind it, the dates
 * type out in mono with a caret that keeps blinking on the current role
 * (that line is still being written), the tenure counts up, and the bullet
 * points brighten and extend their dashes as they scroll past, like a finger
 * following the text.
 */
const Experience = () => {
  const { experience } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reduceMotion = useReducedMotion();

  if (!experience.length) return null;

  // Newest first, regardless of how the admin ordered them.
  const sorted = [...experience].sort((a, b) => monthIndex(b.startDate) - monthIndex(a.startDate));

  const firstStart = Math.min(...sorted.map((e) => monthIndex(e.startDate)));
  const lastEnd = Math.max(...sorted.map(endIndex));
  const anyCurrent = sorted.some((e) => e.current);
  const spanLabel = `${formatYM(sorted[sorted.length - 1].startDate)} – ${
    anyCurrent ? 'Present' : formatYM(sorted.find((e) => endIndex(e) === lastEnd)!.endDate!)
  }`;

  // Each row's sequence starts a beat after the one above it.
  const rowStart = (i: number) => (reduceMotion ? 0 : 0.15 + i * 0.25);

  return (
    <section id="experience" className="experience" ref={ref}>
      <div className="experience-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Experience</span>
          <h2 className="section-title">
            <TextReveal3D>
              My <span className="highlight">Journey</span>
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">Professional experience and career path</p>
        </motion.div>

        {/* Derived from the entries, so it stays true when the admin edits. */}
        <motion.p
          className="ledger-summary"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: rowStart(0) }}
        >
          <span>{sorted.length} {sorted.length === 1 ? 'role' : 'roles'}</span>
          <span>{spanLabel}</span>
          <span>
            <CountUp value={formatSpan(lastEnd - firstStart + 1)} duration={1.4} /> total
          </span>
        </motion.p>

        <ol className="ledger" aria-label="Work history, newest first">
          {sorted.map((exp, i) => {
            const t = rowStart(i + 1);
            return (
              <motion.li
                key={exp.id}
                className={`ledger-row${exp.current ? ' is-current' : ''}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: t }}
              >
                {/* The row's rule, drawn left to right. */}
                <motion.span
                  className="ledger-rule"
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: reduceMotion ? 0 : 0.9, delay: t, ease: EASE }}
                />

                <div className="ledger-when">
                  <motion.span
                    className="ledger-type"
                    initial={{ opacity: 0, y: 8 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: t + 0.2, ease: EASE }}
                  >
                    {exp.type}
                  </motion.span>

                  <time className="ledger-period" dateTime={exp.startDate}>
                    <Typewriter
                      text={exp.period}
                      delay={reduceMotion ? 0 : t + 0.35}
                      keepCaret={exp.current}
                    />
                  </time>

                  <motion.span
                    className="ledger-tenure"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: t + 0.5 }}
                  >
                    <CountUp value={tenure(exp)} duration={1.2} />
                  </motion.span>

                  <motion.span
                    className="ledger-place"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: t + 0.6 }}
                  >
                    <FiMapPin aria-hidden="true" /> {exp.location}
                  </motion.span>
                </div>

                <div className="ledger-what">
                  {/* The title rises from behind the rule above it. */}
                  <h3 className="ledger-role">
                    <span className="ledger-role-mask">
                      <motion.span
                        className="ledger-role-text"
                        initial={{ y: '110%' }}
                        animate={isInView ? { y: 0 } : {}}
                        transition={{ duration: reduceMotion ? 0 : 0.8, delay: t + 0.3, ease: EASE }}
                      >
                        {exp.role}
                      </motion.span>
                    </span>
                  </h3>

                  <motion.div
                    className="ledger-body"
                    initial={{ opacity: 0, y: 14 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, delay: t + 0.55, ease: EASE }}
                  >
                    {exp.companyUrl ? (
                      <a
                        className="ledger-company"
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {exp.company} <FiArrowUpRight aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="ledger-company">{exp.company}</span>
                    )}

                    <p className="ledger-summary-copy">{exp.description}</p>

                    {exp.responsibilities.length > 0 && (
                      <ul className="ledger-points">
                        {exp.responsibilities.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies.length > 0 && (
                      <div className="ledger-stack">
                        {exp.technologies.map((tech) => (
                          <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
