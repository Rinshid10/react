import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './effects.css';

/**
 * Magnetic
 *
 * Pulls a control gently toward the cursor as it approaches, then springs
 * back on leave. It makes a button feel like it is reaching for the pointer,
 * which is a cheap way to mark the one or two things on a screen that are
 * actually clickable.
 *
 * Deliberately restrained: the travel is a fraction of the pointer's offset
 * and is capped, because a button that runs away from the cursor is harder to
 * click, not more delightful.
 *
 * Pointer-only. On touch there is no cursor to attract to, and mousemove
 * would fire once on tap and leave the control displaced — so the handlers
 * are only attached when the device actually has a fine pointer.
 */

interface MagneticProps {
  children: ReactNode;
  /** Fraction of the cursor's offset the element travels. */
  strength?: number;
  /** Maximum travel in pixels, in each axis. */
  max?: number;
  className?: string;
}

const Magnetic = ({ children, strength = 0.3, max = 12, className = '' }: MagneticProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring so the return is eased rather than snapping back.
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const finePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(Math.max(-max, Math.min(max, dx * strength)));
    y.set(Math.max(-max, Math.min(max, dy * strength)));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (!finePointer) return <span className={`magnetic ${className}`}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={`magnetic ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.span>
  );
};

export default Magnetic;
