import { Children, ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import './effects.css';

/**
 * ScrollStack
 *
 * Cards pin one after another and pile up: as each new card slides over the
 * one before it, the card underneath scales down and dims, so the stack reads
 * as depth rather than a list. Each card gets the reader's full attention in
 * turn — useful where every item is a story worth finishing, not something to
 * skim past.
 *
 * Native equivalent of @reactbits-starter/scroll-stack-tw, built on the
 * project's own tokens instead of Tailwind.
 *
 * Implementation notes:
 * - Pinning is `position: sticky`, offset by index so the stacked edges stay
 *   visible. No ancestor may have `overflow: hidden` or sticky silently dies.
 * - The parent's scroll progress is passed down as a MotionValue so each item
 *   can call `useTransform` at the top level of its own component — hooks
 *   cannot be called in a loop.
 * - Respects `prefers-reduced-motion`: the CSS drops the sticky behaviour and
 *   the cards render as a plain stack.
 */

interface ScrollStackProps {
  children: ReactNode;
  /** Distance from the top of the viewport the first card pins at. */
  topOffset?: number;
  /** Extra offset per card, so the edge of each one underneath stays visible. */
  itemOffset?: number;
}

interface StackItemProps {
  index: number;
  total: number;
  topOffset: number;
  itemOffset: number;
  progress: MotionValue<number>;
  children: ReactNode;
}

const StackItem = ({ index, total, topOffset, itemOffset, progress, children }: StackItemProps) => {
  // The slice of the container's scroll during which this card is being
  // covered by the next one.
  const start = index / total;
  const end = (index + 1) / total;

  const isLast = index === total - 1;
  // The final card is never covered, so it keeps its full size and weight.
  const scale = useTransform(progress, [start, end], isLast ? [1, 1] : [1, 0.93]);
  const opacity = useTransform(progress, [start, end], isLast ? [1, 1] : [1, 0.45]);

  return (
    <div
      className="scroll-stack-item"
      style={{ top: topOffset + index * itemOffset, zIndex: index + 1 }}
    >
      <motion.div className="scroll-stack-card" style={{ scale, opacity }}>
        {children}
      </motion.div>
    </div>
  );
};

const ScrollStack = ({ children, topOffset = 110, itemOffset = 16 }: ScrollStackProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <div className="scroll-stack" ref={ref}>
      {items.map((child, i) => (
        <StackItem
          key={i}
          index={i}
          total={items.length}
          topOffset={topOffset}
          itemOffset={itemOffset}
          progress={scrollYProgress}
        >
          {child}
        </StackItem>
      ))}
    </div>
  );
};

export default ScrollStack;
