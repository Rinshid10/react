/**
 * Shared building blocks: the page header, empty/error states, the mark and a
 * couple of small flourishes. Screens compose these instead of each
 * re-inventing its own padding and border radius.
 */
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

import { fadeUp, GLIDE, listParent } from '../motion';

/**
 * The monochrome mark. A filled square with an initial in it — no asset to
 * ship, and it reads at every size the panel uses it.
 */
export const BrandMark = ({ size = 32, letter = 'A' }: { size?: number; letter?: string }) => (
  <span
    className="mark"
    style={{ width: size, height: size, fontSize: size * 0.5, borderRadius: size * 0.28 }}
  >
    {letter}
  </span>
);

/**
 * Sticky page header: title, subtitle and trailing actions, sitting on the
 * canvas with a hairline under it rather than an elevated bar.
 *
 * The title is keyed on its own text so switching section retypes it rather
 * than swapping it — a small cue that the whole pane changed, not just a list.
 */
export const PageHeader = ({
  title,
  subtitle,
  leading,
  actions,
}: {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  actions?: ReactNode;
}) => (
  <header className="page-header">
    {leading}
    <div className="page-header__text">
      <motion.h1 key={title} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={GLIDE}>
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p key={subtitle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={GLIDE}>
          {subtitle}
        </motion.p>
      )}
    </div>
    {actions && <div className="page-header__actions">{actions}</div>}
  </header>
);

/** Centred state used for empty lists, load failures and "nothing here yet". */
export const StateMessage = ({
  icon,
  title,
  detail,
  action,
  tone = 'neutral',
}: {
  icon: ReactNode;
  title: string;
  detail?: string;
  action?: ReactNode;
  tone?: 'neutral' | 'error';
}) => (
  <motion.div className="state" variants={listParent} initial="hidden" animate="show">
    <motion.div
      className={`state__icon${tone === 'error' ? ' state__icon--error' : ''}`}
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 480, damping: 26 } },
      }}
    >
      {icon}
    </motion.div>
    <motion.h2 variants={fadeUp}>{title}</motion.h2>
    {detail && <motion.p variants={fadeUp}>{detail}</motion.p>}
    {action && (
      <motion.div className="state__action" variants={fadeUp}>
        {action}
      </motion.div>
    )}
  </motion.div>
);

/**
 * Inline "this did not work" banner, kept on screen rather than flashed in a
 * toast, because the messages it carries name the field that was rejected.
 *
 * It shakes once on arrival. A second failed save with identical text would
 * otherwise be indistinguishable from the first, which is exactly the moment
 * someone needs to know the button did something.
 */
export const NoticeBanner = ({ title, message }: { title?: string; message: string }) => (
  <motion.div
    className="banner"
    role="alert"
    initial={{ x: 0 }}
    animate={{ x: [0, -5, 4, -3, 0] }}
    transition={{ duration: 0.36, ease: 'easeOut' }}
  >
    <FiAlertCircle aria-hidden />
    <div>
      {title && <strong>{title}</strong>}
      <p>{message}</p>
    </div>
  </motion.div>
);

/** Small capsule for a status or a count. */
export const Pill = ({ label, dot }: { label: string; dot?: string }) => (
  <span className="pill">
    {dot && <i className="pill__dot" style={{ background: dot }} />}
    {label}
  </span>
);

/** Uppercase micro-label used above form groups and sidebar sections. */
export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <span className="section-label">{children}</span>
);

/**
 * Placeholder rows, so a load reads as "content is coming" rather than a
 * spinner in the middle of an otherwise empty page. The shimmer is CSS, and
 * the rows fade in staggered so a fast response never flashes a full set.
 */
export const SkeletonList = ({ count = 5 }: { count?: number }) => (
  <motion.div className="skeletons" variants={listParent} initial="hidden" animate="show">
    {Array.from({ length: count }, (_, i) => (
      <motion.div
        className="skeleton"
        key={i}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: Math.max(0.35, 1 - i * 0.15), transition: GLIDE },
        }}
      >
        <span className="skeleton__box" />
        <span className="skeleton__lines">
          <i style={{ width: 180 }} />
          <i style={{ width: 110, height: 9 }} />
        </span>
      </motion.div>
    ))}
  </motion.div>
);

/** Inline spinner for busy buttons. */
export const Spinner = () => <span className="spinner" aria-hidden />;
