import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './effects.css';

/**
 * TiltCard
 *
 * Tips a card toward the cursor in 3D, so the surface catches the pointer
 * like a physical object. Paired with the grid's parallax drift it gives the
 * work section depth on two axes — one from scrolling, one from pointing.
 *
 * The rotation is small (a handful of degrees) on purpose: past roughly 8° a
 * card's text visibly keystones and gets harder to read, which is a poor
 * trade for a hover flourish.
 *
 * Pointer-only, for the same reason as `Magnetic` — a tap would fire mousemove
 * once and leave the card stuck at an angle.
 */

interface TiltCardProps {
  children: ReactNode;
  /** Maximum rotation in degrees, on each axis. */
  max?: number;
  className?: string;
}

const TiltCard = ({ children, max = 6, className = '' }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Normalised pointer position within the card, -0.5 … 0.5.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const springX = useSpring(px, { stiffness: 180, damping: 20, mass: 0.5 });
  const springY = useSpring(py, { stiffness: 180, damping: 20, mass: 0.5 });

  // Pointer above centre tips the top away, which is the direction that reads
  // as "leaning toward the cursor".
  const rotateX = useTransform(springY, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-max, max]);

  const finePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  if (!finePointer) return <div className={className}>{children}</div>;

  return (
    <div className={`tilt-card ${className}`} onMouseMove={handleMove} onMouseLeave={reset}>
      <motion.div ref={ref} className="tilt-card-inner" style={{ rotateX, rotateY }}>
        {children}
      </motion.div>
    </div>
  );
};

export default TiltCard;
