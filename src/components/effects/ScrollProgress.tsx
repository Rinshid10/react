import { motion, useScroll, useSpring } from 'framer-motion';
import './effects.css';

/**
 * ScrollProgress
 *
 * A hairline across the top of the viewport that fills as the page scrolls.
 * This site is one long page with ten sections, so the browser's own
 * scrollbar is the only signal of how much is left — and it is easy to miss
 * against a black ground. This makes the page's length legible.
 *
 * `scaleX` on a full-width bar rather than an animated `width`: transforms are
 * composited, so the bar tracks the scroll without laying out on every frame.
 *
 * Decorative and duplicated by the scrollbar, so it is hidden from assistive
 * tech rather than announced as a progress bar.
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  // Smooths the jitter of a trackpad or a scroll wheel's discrete steps.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  });

  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
};

export default ScrollProgress;
