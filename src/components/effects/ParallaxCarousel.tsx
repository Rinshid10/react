import {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import './effects.css';

/**
 * ParallaxCarousel
 *
 * A horizontal rail of cards where each card's contents drift against its own
 * frame as the rail scrolls, so the row reads with depth rather than sliding
 * as one flat strip. The drift is driven by each card's distance from the
 * centre of the viewport, which is what makes it track a drag or a flick
 * rather than running on a timer.
 *
 * Native equivalent of @reactbits-starter/parallax-carousel-tw, built on the
 * project's own tokens instead of Tailwind.
 *
 * Built on native overflow scrolling with CSS scroll snapping rather than a
 * transform-driven track. That comes with touch swiping, trackpad gestures,
 * keyboard scrolling, and correct scrollbar semantics for free — all things a
 * hand-rolled drag implementation has to reimplement and usually gets wrong.
 * The arrows scroll by exactly one card.
 *
 * Accessibility: the rail is a labelled, focusable region so keyboard users
 * can reach it and use the arrow keys; the arrow buttons disable at each end
 * rather than silently doing nothing.
 */

interface ParallaxCarouselProps {
  children: ReactNode;
  /** How far the card contents drift, in pixels, across a full pass. */
  depth?: number;
  label?: string;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ParallaxCarousel = ({
  children,
  depth = 28,
  label = 'Carousel',
}: ParallaxCarouselProps) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [active, setActive] = useState(0);
  const items = Children.toArray(children);

  // Offsets each card's inner layer by its distance from the rail's centre.
  // Written straight to the DOM rather than through state: this runs on every
  // scroll frame, and re-rendering the whole rail that often would stutter.
  const update = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    // A snapped rail does not rest at exactly 0: the rail's own horizontal
    // padding offsets the first snap point (it settles a few pixels in), and
    // fractional device pixels shift the far end too. A tolerance well under
    // one card width keeps both ends detectable without ever misfiring.
    const EDGE = 16;
    setAtStart(rail.scrollLeft <= EDGE);
    setAtEnd(rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - EDGE);

    // Whichever card's leading edge sits nearest the rail's left edge is the
    // one the reader is on.
    const cards = Array.from(rail.children) as HTMLElement[];
    let nearest = 0;
    let best = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - rail.scrollLeft);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setActive(nearest);

    if (prefersReducedMotion()) return;

    const mid = rail.clientWidth / 2;
    for (const card of Array.from(rail.children) as HTMLElement[]) {
      const inner = card.querySelector<HTMLElement>('.pcarousel-inner');
      if (!inner) continue;
      const centre = card.offsetLeft - rail.scrollLeft + card.offsetWidth / 2;
      // -1 … 1 across the rail, clamped so off-screen cards do not run away.
      const t = Math.max(-1, Math.min(1, (centre - mid) / mid));
      inner.style.transform = `translate3d(${(-t * depth).toFixed(2)}px,0,0)`;
    }
  }, [depth]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    update();
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      rail.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update, items.length]);

  const page = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const first = rail.firstElementChild as HTMLElement | null;
    // One card plus the gap, so a click always lands on a snap point.
    const step = first
      ? first.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || '0')
      : rail.clientWidth * 0.8;
    rail.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <div className="pcarousel">
      <div
        className="pcarousel-rail"
        ref={railRef}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {items.map((child, i) => (
          <div className="pcarousel-card" key={i}>
            <div className="pcarousel-inner">{child}</div>
          </div>
        ))}
      </div>

      {/* Arrows sit outside the rail, centred against it. */}
      <button
        className="pcarousel-btn pcarousel-prev"
        onClick={() => page(-1)}
        disabled={atStart}
        aria-label="Previous"
      >
        <FiArrowLeft />
      </button>
      <button
        className="pcarousel-btn pcarousel-next"
        onClick={() => page(1)}
        disabled={atEnd}
        aria-label="Next"
      >
        <FiArrowRight />
      </button>

      <div className="pcarousel-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`pcarousel-dot ${i === active ? 'active' : ''}`}
            aria-label={`Go to item ${i + 1}`}
            aria-current={i === active}
            onClick={() => {
              const rail = railRef.current;
              const card = rail?.children[i] as HTMLElement | undefined;
              if (rail && card) rail.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParallaxCarousel;
