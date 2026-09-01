import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * CountUp
 *
 * Animates every number inside a string from zero to its final value when the
 * element scrolls into view. Figures are the proof on this site — "+186%",
 * "3.4x", "₹12L+" — and a number that ticks up gets read; one that is simply
 * there gets skimmed.
 *
 * It counts *every* numeric run in the string rather than assuming the value
 * is a bare number, so ranges like "2K → 47K" and "4 → 37" both animate, and
 * all the surrounding characters — currency, arrows, %, x, + — are preserved
 * exactly as written. Decimal places are taken from the source token, so
 * "3.4x" counts in tenths and never renders as "3.40x".
 *
 * Honours `prefers-reduced-motion` by rendering the final value immediately.
 */

interface CountUpProps {
  /** The finished value, e.g. "+186%", "2K → 47K", "₹12L+". */
  value: string;
  /** Seconds the count takes. */
  duration?: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Ease-out cubic: fast at first, settling at the end, so the final digits are
// readable rather than blurring past.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const CountUp = ({ value, duration = 1.6 }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [progress, setProgress] = useState(0);

  // Split into alternating text / number tokens, keeping the separators.
  const tokens = useMemo(() => value.split(/(\d+(?:\.\d+)?)/), [value]);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion()) {
      setProgress(1);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      setProgress(easeOut(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, duration]);

  const rendered = tokens
    .map((token) => {
      if (!/^\d+(?:\.\d+)?$/.test(token)) return token;
      const decimals = token.includes('.') ? token.split('.')[1].length : 0;
      return (Number(token) * progress).toFixed(decimals);
    })
    .join('');

  // The finished string is exposed to assistive tech; the ticking digits are
  // decorative and would otherwise be announced on every frame.
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{rendered}</span>
    </span>
  );
};

export default CountUp;
