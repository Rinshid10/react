import {
  Children,
  ReactNode,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useRef,
} from 'react';
import { motion, useScroll, useTransform, useMotionValue, MotionValue } from 'framer-motion';
import './effects.css';

/**
 * ScrollStack / ScrollStackItem
 *
 * Cards pin one after another and pile up: as each new card slides over the
 * one before it, the card underneath scales down and dims, so the stack reads
 * as depth rather than a list. Each card gets the reader's full attention in
 * turn — useful where every item is a story worth finishing, or a sequence
 * meant to be read in order, rather than something to skim.
 *
 *   <ScrollStack>
 *     <ScrollStackItem>…</ScrollStackItem>
 *     <ScrollStackItem>…</ScrollStackItem>
 *   </ScrollStack>
 *
 * Native equivalent of @reactbits-starter/scroll-stack-tw, built on the
 * project's own tokens instead of Tailwind.
 *
 * Implementation notes:
 * - Pinning is `position: sticky`, offset by index so the stacked edges stay
 *   visible. No ancestor may set `overflow: hidden` or sticky silently dies.
 * - The parent's scroll progress travels down through context, and the index
 *   is injected by cloning, so each item can call `useTransform` at the top
 *   level of its own component — hooks cannot be called in a loop.
 * - Respects `prefers-reduced-motion`: the CSS drops the pinning and the
 *   cards render as an ordinary column.
 */

interface StackContextValue {
  progress: MotionValue<number>;
  topOffset: number;
  itemOffset: number;
}

const StackContext = createContext<StackContextValue | null>(null);

interface ScrollStackItemProps {
  children: ReactNode;
  className?: string;
  /** Injected by ScrollStack; do not pass by hand. */
  index?: number;
  /** Injected by ScrollStack; do not pass by hand. */
  total?: number;
}

export const ScrollStackItem = ({
  children,
  className = '',
  index = 0,
  total = 1,
}: ScrollStackItemProps) => {
  const ctx = useContext(StackContext);

  // Hooks must run unconditionally, so an item rendered outside a ScrollStack
  // falls back to a static motion value and simply does not animate.
  const fallback = useMotionValue(0);
  const progress = ctx?.progress ?? fallback;
  const topOffset = ctx?.topOffset ?? 0;
  const itemOffset = ctx?.itemOffset ?? 0;

  // The slice of the container's scroll during which this card is covered by
  // the next one.
  const start = index / total;
  const end = (index + 1) / total;

  // The final card is never covered, so it keeps its full size and weight.
  const isLast = index === total - 1;
  const scale = useTransform(progress, [start, end], isLast ? [1, 1] : [1, 0.93]);
  const opacity = useTransform(progress, [start, end], isLast ? [1, 1] : [1, 0.45]);

  return (
    <div
      className="scroll-stack-item"
      style={{ top: topOffset + index * itemOffset, zIndex: index + 1 }}
    >
      <motion.div className={`scroll-stack-card ${className}`} style={{ scale, opacity }}>
        {children}
      </motion.div>
    </div>
  );
};

interface ScrollStackProps {
  children: ReactNode;
  /** Distance from the top of the viewport the first card pins at. */
  topOffset?: number;
  /** Extra offset per card, so the edge of each one underneath stays visible. */
  itemOffset?: number;
}

const ScrollStack = ({ children, topOffset = 110, itemOffset = 16 }: ScrollStackProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <StackContext.Provider value={{ progress: scrollYProgress, topOffset, itemOffset }}>
      <div className="scroll-stack" ref={ref}>
        {items.map((child, i) =>
          isValidElement(child)
            ? cloneElement(child as React.ReactElement<ScrollStackItemProps>, {
                key: i,
                index: i,
                total: items.length,
              })
            : child
        )}
      </div>
    </StackContext.Provider>
  );
};

export default ScrollStack;
