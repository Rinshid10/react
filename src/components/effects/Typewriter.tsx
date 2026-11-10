import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import './effects.css';

/**
 * Typewriter
 *
 * Types a short string out one character at a time once it scrolls into
 * view, with a block caret. Meant for monospaced labels — dates, codes,
 * file names — where the typing reads as the thing being written rather than
 * as a gimmick. Keep it off body copy: a paragraph typed out is a wait.
 *
 * `keepCaret` leaves the caret blinking after the text has finished — used on
 * the current role to say "this line is still being written".
 *
 * Accessibility: the finished text is exposed via `aria-label`; the partial
 * string and caret are decorative and hidden from assistive tech. Honours
 * `prefers-reduced-motion` by rendering the full string immediately.
 */

interface TypewriterProps {
  text: string;
  /** Seconds before typing starts, once in view. */
  delay?: number;
  /** Seconds per character. */
  speed?: number;
  keepCaret?: boolean;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Typewriter = ({
  text,
  delay = 0,
  speed = 0.045,
  keepCaret = false,
  className,
}: TypewriterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [reducedMotion] = useState(prefersReducedMotion);
  const [count, setCount] = useState(reducedMotion ? text.length : 0);

  useEffect(() => {
    if (!isInView || reducedMotion) return;

    let raf = 0;
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const elapsed = now - start;
      const next = elapsed <= 0 ? 0 : Math.min(text.length, Math.floor(elapsed / (speed * 1000)));
      setCount(next);
      if (next < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, reducedMotion, text, delay, speed]);

  const done = count >= text.length;
  const typing = isInView && !done && !reducedMotion;
  const showCaret = !reducedMotion && (typing || (keepCaret && isInView));

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {/* Reserve the untyped width so the layout does not shift as it types. */}
      <span aria-hidden="true" className="tw-ghost">{text.slice(count)}</span>
      {showCaret && (
        <span aria-hidden="true" className={`tw-caret${typing ? ' is-typing' : ''}`} />
      )}
    </span>
  );
};

export default Typewriter;
