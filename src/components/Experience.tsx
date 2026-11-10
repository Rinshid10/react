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
 * The company's mark: its logo if one is set, otherwise a monogram tile drawn
 * from the first letter. The tile is the node on the journey's rail, so every
 * entry gets one whether or not a logo exists.
 */
const CompanyMark = ({ exp }: { exp: ExperienceEntry }) =>
  exp.logo ? (
    <img className="xp-logo-img" src={exp.logo} alt="" loading="lazy" />
  ) : (
    <span className="xp-monogram" aria-hidden="true">
      {exp.company.trim()[0]?.toUpperCase()}
    </span>
  );

/**
 * Experience Component
 *
 * A vertical journey, newest first. Each stop opens with the company the way
 * a profile does: a square mark, the company name, and where it is. Then the
 * role held there, the dates, and what was actually done. The marks sit on a
 * rail that runs down the section, so the list reads as one path.
 *
 * Motion: the rail draws down from each mark to the next, the mark pops in
 * and the company name follows it, the role title rises from behind its
 * baseline, the dates type out in mono (the caret keeps blinking on the
 * current role), the tenure counts up, and the bullet points brighten as
 * they scroll past.
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

  // Each stop's sequence starts a beat after the one above it.
  const stopStart = (i: number) => (reduceMotion ? 0 : 0.15 + i * 0.3);

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
          className="xp-summary"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: stopStart(0) }}
        >
          <span>{sorted.length} {sorted.length === 1 ? 'role' : 'roles'}</span>
          <span>{spanLabel}</span>
          <span>
            <CountUp value={formatSpan(lastEnd - firstStart + 1)} duration={1.4} /> total
          </span>
        </motion.p>

        <ol className="xp" aria-label="Work history, newest first">
          {sorted.map((exp, i) => {
            const t = stopStart(i + 1);
            const last = i === sorted.length - 1;
            return (
              <motion.li
                key={exp.id}
                className={`xp-stop${exp.current ? ' is-current' : ''}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: t }}
              >
                {/* The rail from this mark down to the next one. */}
                {!last && (
                  <motion.span
                    className="xp-rail"
                    aria-hidden="true"
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: reduceMotion ? 0 : 1.1, delay: t + 0.5, ease: EASE }}
                  />
                )}

                {/* --- Company header: mark, name, place --------------------- */}
                <div className="xp-head">
                  <motion.div
                    className="xp-logo"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 320, damping: 22, delay: t }
                    }
                  >
                    <CompanyMark exp={exp} />
                    {exp.current && <span className="xp-live" aria-hidden="true" />}
                  </motion.div>

                  <motion.div
                    className="xp-org"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: t + 0.15, ease: EASE }}
                  >
                    {exp.companyUrl ? (
                      <a
                        className="xp-company"
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {exp.company} <FiArrowUpRight aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="xp-company">{exp.company}</span>
                    )}
                    <span className="xp-place">
                      <FiMapPin aria-hidden="true" /> {exp.location}
                    </span>
                  </motion.div>

                  <motion.span
                    className="xp-type"
                    initial={{ opacity: 0, y: 6 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: t + 0.3, ease: EASE }}
                  >
                    {exp.type}
                  </motion.span>
                </div>

                {/* --- The role held there ----------------------------------- */}
                <div className="xp-body">
                  <h3 className="xp-role">
                    <span className="xp-role-mask">
                      <motion.span
                        className="xp-role-text"
                        initial={{ y: '110%' }}
                        animate={isInView ? { y: 0 } : {}}
                        transition={{ duration: reduceMotion ? 0 : 0.8, delay: t + 0.3, ease: EASE }}
                      >
                        {exp.role}
                      </motion.span>
                    </span>
                  </h3>

                  <p className="xp-meta">
                    <time className="xp-period" dateTime={exp.startDate}>
                      <Typewriter
                        text={exp.period}
                        delay={reduceMotion ? 0 : t + 0.45}
                        keepCaret={exp.current}
                      />
                    </time>
                    <motion.span
                      className="xp-tenure"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.4, delay: t + 0.6 }}
                    >
                      <CountUp value={tenure(exp)} duration={1.2} />
                    </motion.span>
                  </p>

                  <motion.div
                    className="xp-detail"
                    initial={{ opacity: 0, y: 14 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, delay: t + 0.6, ease: EASE }}
                  >
                    <p className="xp-desc">{exp.description}</p>

                    {exp.responsibilities.length > 0 && (
                      <ul className="xp-points">
                        {exp.responsibilities.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies.length > 0 && (
                      <div className="xp-stack">
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
