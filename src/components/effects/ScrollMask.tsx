import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './effects.css';

/**
 * ScrollMask
 *
 * Fades the top and bottom edges of a block into the page background, with
 * the fade driven by scroll position: the leading edge is soft as the block
 * enters the viewport and firms up once it is fully in view. Long lists stop
 * ending in a hard cut, and the eye is pulled to whatever is centred.
 *
 * Native equivalent of @reactbits-starter/scroll-mask-tw.
 *
 * Uses `mask-image`, so it fades to transparency rather than to a colour —
 * it keeps working over any background, and in both light and dark mode,
 * without a matching-coloured overlay.
 */

interface ScrollMaskProps {
  children: ReactNode;
  /** How much of the block each edge fades over, as a percentage. */
  fade?: number;
}

const ScrollMask = ({ children, fade = 12 }: ScrollMaskProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Strongest fade while the block is entering or leaving, easing off while
  // it sits in the middle of the viewport.
  const topFade = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0, fade, fade, fade]);
  const bottomFade = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [fade, fade, fade, 0]);

  const maskImage = useTransform(
    [topFade, bottomFade],
    ([t, b]: number[]) =>
      `linear-gradient(to bottom, transparent 0%, #000 ${t}%, #000 ${100 - b}%, transparent 100%)`
  );

  return (
    <motion.div
      className="scroll-mask"
      ref={ref}
      style={{ maskImage, WebkitMaskImage: maskImage }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollMask;
