import { Children, ReactNode, cloneElement, isValidElement, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './effects.css';

/**
 * TextReveal3D
 *
 * Reveals a heading word by word, each one hinging up from flat into place
 * through a shared perspective, so the line assembles in depth rather than
 * simply fading in.
 *
 * Native equivalent of @reactbits-starter/3d-text-reveal-tw, built on the
 * project's own tokens instead of Tailwind.
 *
 * Why it splits by word and not by character: a per-character stagger on a
 * heading reads as a slot machine and, more importantly, it hands a screen
 * reader a pile of single letters. Words keep the text intact.
 *
 * Markup is preserved. The splitter recurses through children and only ever
 * touches text nodes, so a heading like
 *
 *   What I Can <span className="highlight">Build &amp; Grow</span> For You
 *
 * keeps its highlight span — the words inside it animate along with the rest.
 *
 * Accessibility: the whole heading is exposed as one string via `aria-label`
 * and the animated pieces are hidden from the accessibility tree, so assistive
 * tech reads the sentence rather than a sequence of fragments.
 */

interface TextReveal3DProps {
  children: ReactNode;
  /** Seconds between each word. */
  stagger?: number;
  /** Play once, or every time the heading scrolls back into view. */
  once?: boolean;
}

const wordVariants = {
  hidden: { opacity: 0, rotateX: -75, y: '0.3em' },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** Flattens a React tree down to its text, for the aria-label. */
const toText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(toText).join('');
  if (isValidElement(node)) {
    return toText((node.props as { children?: ReactNode }).children);
  }
  return '';
};

const TextReveal3D = ({ children, stagger = 0.045, once = true }: TextReveal3DProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px' });

  // Runs during render and resets each time, so keys stay stable across
  // renders for the same content.
  let wordIndex = 0;

  const split = (node: ReactNode): ReactNode => {
    if (typeof node === 'string') {
      // Keep the separators so spacing survives the split.
      return node.split(/(\s+)/).map((token, i) => {
        if (token === '' || /^\s+$/.test(token)) return token;
        return (
          <motion.span
            key={`w-${wordIndex++}-${i}`}
            className="reveal-word"
            variants={wordVariants}
          >
            {token}
          </motion.span>
        );
      });
    }

    if (Array.isArray(node)) return Children.map(node, split);

    // Preserve the element (and its className) and split what is inside it.
    if (isValidElement(node)) {
      const el = node as React.ReactElement<{ children?: ReactNode }>;
      return cloneElement(el, undefined, split(el.props.children));
    }

    return node;
  };

  return (
    <motion.span
      ref={ref}
      className="text-reveal-3d"
      aria-label={toText(children)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ staggerChildren: stagger }}
    >
      <span aria-hidden="true">{split(children)}</span>
    </motion.span>
  );
};

export default TextReveal3D;
