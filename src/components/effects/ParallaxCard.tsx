import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './effects.css';

/**
 * ParallaxCard
 *
 * Drifts a card vertically at a slightly different rate from the page as it
 * scrolls through the viewport. Staggering the depth across a grid — by
 * column, not at random — keeps the rows reading as rows while giving the
 * grid a sense of layers.
 *
 * Native equivalent of @reactbits-starter/parallax-cards-tw.
 *
 * The travel is deliberately small (tens of pixels). Anything larger breaks
 * the alignment of a grid and makes cards look detached from their captions.
 * Disabled entirely under `prefers-reduced-motion`.
 */

interface ParallaxCardProps {
  children: ReactNode;
  /**
   * How far the card drifts, in pixels, across its whole pass through the
   * viewport. Positive lags behind the scroll, negative runs ahead.
   */
  offset?: number;
  className?: string;
}

const ParallaxCard = ({ children, offset = 40, className = '' }: ParallaxCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div className={`parallax-card ${className}`} ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};

export default ParallaxCard;
