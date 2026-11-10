import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { FiExternalLink, FiArrowUpRight } from 'react-icons/fi';
import { SiGoogleplay, SiAppstore } from 'react-icons/si';
import { usePortfolio } from '../context/PortfolioContext';
import type { Project } from '../types';
import CardModal from './effects/CardModal';
import TiltCard from './effects/TiltCard';
import TextReveal3D from './effects/TextReveal3D';
import '../styles/Projects.css';

/**
 * Projects ("Work")
 *
 * A grid of cards, each showing the project inside a device drawn in CSS: a
 * phone for mobile apps, a browser window for web projects. The screen holds
 * a generated, monochrome layout of the kind of app it is — app bar with the
 * project's name, a hero figure, a list of rows, a tab bar — rather than a
 * stock photo or a generic icon. It reads as a product shot without
 * pretending to be a screenshot.
 *
 * The device rises into the frame when the card enters, lifts on hover, and
 * its screen content nudges upward as if scrolled. Store and live links sit
 * under the copy, always visible, so touch users can reach them. Clicking
 * anywhere else on the card opens the detail modal.
 */

const ALL = 'All';
const EASE = [0.22, 1, 0.36, 1] as const;

/** Deterministic 0–1 from the project id, so skeleton bar widths vary per card but never jitter. */
const vary = (id: number, n: number) => ((id * 37 + n * 53) % 100) / 100;
const pct = (id: number, n: number, min: number, max: number) =>
  `${Math.round(min + (max - min) * vary(id, n))}%`;

const host = (url?: string) => {
  if (!url) return 'localhost';
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/** A phone with a generated finance-app style screen. */
const PhoneMock = ({ project }: { project: Project }) => (
  <div className="mock mock-phone" aria-hidden="true">
    <span className="mock-notch" />
    <div className="mock-screen">
      <div className="mock-status">
        <span className="mock-time">9:41</span>
        <span className="mock-signal" />
      </div>
      <div className="mock-appbar">
        <span className="mock-avatar">{project.title[0]}</span>
        <span className="mock-appname">{project.title}</span>
      </div>
      <div className="mock-scroll">
        <div className="mock-hero">
          <span className="mock-line mock-line--xs" style={{ width: pct(project.id, 1, 30, 45) }} />
          <span className="mock-figure" style={{ width: pct(project.id, 2, 50, 70) }} />
          <div className="mock-pills">
            <span />
            <span />
            <span />
          </div>
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="mock-row" key={i}>
            <span className="mock-dot" />
            <span className="mock-row-text">
              <span className="mock-line" style={{ width: pct(project.id, 10 + i, 45, 80) }} />
              <span className="mock-line mock-line--xs" style={{ width: pct(project.id, 20 + i, 25, 45) }} />
            </span>
            <span className="mock-amt" style={{ width: pct(project.id, 30 + i, 14, 22) }} />
          </div>
        ))}
      </div>
      <div className="mock-tabs">
        <span className="is-on" />
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>
);

/** A browser window with a generated landing-page layout. */
const BrowserMock = ({ project }: { project: Project }) => (
  <div className="mock mock-browser" aria-hidden="true">
    <div className="mock-chrome">
      <span className="mock-wdot" />
      <span className="mock-wdot" />
      <span className="mock-wdot" />
      <span className="mock-url">{host(project.live)}</span>
    </div>
    <div className="mock-page">
      <div className="mock-nav">
        <span className="mock-logo">{project.title[0]}</span>
        <span className="mock-line mock-line--xs" />
        <span className="mock-line mock-line--xs" />
        <span className="mock-line mock-line--xs" />
        <span className="mock-cta" />
      </div>
      <div className="mock-scroll">
        <div className="mock-web-hero">
          <span className="mock-h1" style={{ width: pct(project.id, 3, 55, 75) }} />
          <span className="mock-h1" style={{ width: pct(project.id, 4, 35, 55) }} />
          <span className="mock-line mock-line--xs" style={{ width: pct(project.id, 5, 40, 60) }} />
          <span className="mock-btn" />
        </div>
        <div className="mock-cards">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  </div>
);

const DeviceMock = ({ project }: { project: Project }) =>
  project.category === 'Web' ? <BrowserMock project={project} /> : <PhoneMock project={project} />;

/** Outbound buttons. `stop` keeps a link click from also opening the modal. */
const ProjectLinks = ({ project }: { project: Project }) => {
  const stop = (e: MouseEvent) => e.stopPropagation();
  const links = [
    project.playStore && { href: project.playStore, label: 'Play Store', Icon: SiGoogleplay },
    project.appStore && { href: project.appStore, label: 'App Store', Icon: SiAppstore },
    project.live && { href: project.live, label: 'Live site', Icon: FiExternalLink },
  ].filter(Boolean) as { href: string; label: string; Icon: React.ComponentType }[];

  if (!links.length) return null;
  return (
    <div className="shot-links">
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shot-link"
          onClick={stop}
        >
          <Icon />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
};

const Projects = () => {
  const { projects } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();

  const [activeFilter, setActiveFilter] = useState<string>(ALL);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const categories = useMemo(() => [ALL, ...new Set(projects.map((p) => p.category))], [projects]);
  const visible = useMemo(
    () => (activeFilter === ALL ? projects : projects.filter((p) => p.category === activeFilter)),
    [projects, activeFilter],
  );

  const openOnKey = (project: Project) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpenProject(project);
    }
  };

  const d = (i: number) => (reduce ? 0 : 0.1 + i * 0.07);

  return (
    <section id="projects" className="projects" ref={ref}>
      <div className="projects-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">
            <TextReveal3D>
              Featured <span className="highlight">Projects</span>
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">
            A selection of my recent work showcasing my skills and expertise
          </p>
        </motion.div>

        <motion.div
          className="work-filters"
          role="tablist"
          aria-label="Filter projects by category"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {categories.map((cat) => {
            const selected = activeFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`work-filter${selected ? ' is-active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {selected && (
                  <motion.span
                    className="work-filter-bg"
                    layoutId="work-filter-bg"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="work-filter-label">{cat}</span>
              </button>
            );
          })}
        </motion.div>

        <ul className="shots">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, delay: d(i), ease: EASE, layout: { duration: 0.45, ease: EASE } }}
              >
                <TiltCard max={5}>
                  <motion.article
                    className={`shot${project.featured ? ' is-featured' : ''}`}
                    layoutId={`project-${project.id}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${project.title} — open details`}
                    onClick={() => setOpenProject(project)}
                    onKeyDown={openOnKey(project)}
                    style={{ borderRadius: 16 }}
                  >
                    {/* The stage: a lit backdrop the device rises into. */}
                    <div className="shot-stage">
                      <motion.div
                        className="shot-device"
                        initial={{ y: 56, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: reduce ? 0 : 0.9, delay: d(i) + 0.15, ease: EASE }}
                      >
                        <DeviceMock project={project} />
                      </motion.div>

                      {project.featured && (
                        <span className="shot-badge">
                          <span className="shot-badge-dot" aria-hidden="true" />
                          Featured
                        </span>
                      )}
                      <span className="shot-cat">{project.category}</span>
                    </div>

                    <div className="shot-body">
                      <div className="shot-head">
                        <h3 className="shot-title">{project.title}</h3>
                        <FiArrowUpRight className="shot-arrow" aria-hidden="true" />
                      </div>
                      <p className="shot-desc">{project.description}</p>
                      <div className="shot-tech">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="tech-chip">{tech}</span>
                        ))}
                      </div>
                      <ProjectLinks project={project} />
                    </div>
                  </motion.article>
                </TiltCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {/* The grid clamps descriptions; the modal is where the whole text and
          every link become readable. */}
      <CardModal
        layoutId={openProject ? `project-${openProject.id}` : ''}
        open={Boolean(openProject)}
        onClose={() => setOpenProject(null)}
        title={openProject?.title ?? ''}
      >
        {openProject && (
          <div className="project-modal">
            <span className="shot-cat project-modal-pill">{openProject.category}</span>
            <h3 className="project-modal-title">{openProject.title}</h3>
            <p className="project-modal-desc">
              {openProject.longDescription || openProject.description}
            </p>
            <div className="project-modal-tech">
              {openProject.technologies.map((tech) => (
                <span key={tech} className="tech-chip">{tech}</span>
              ))}
            </div>
            <ProjectLinks project={openProject} />
          </div>
        )}
      </CardModal>
    </section>
  );
};

export default Projects;
