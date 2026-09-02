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
 * A horizontal rail of cards that recede toward the edges: each card dims
 * with its distance from the centre of the rail, so the row reads with depth
 * rather than sliding as one flat strip. It is driven by scroll
 * position, which is what makes it track a drag or a flick rather than
 * running on a timer.
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
  /** How far cards fade toward the rail edges, 0-1. */
  depth?: number;
  label?: string;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ParallaxCarousel = ({
  children,
  depth = 0.45,
  label = 'Carousel',
}: ParallaxCarouselProps) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [active, setActive] = useState(0);
  const items = Children.toArray(children);

  // Recedes each card by its distance from the rail's centre.
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
      const centre = card.offsetLeft - rail.scrollLeft + card.offsetWidth / 2;
      // 0 at the centre of the rail, 1 at either edge.
      const t = Math.min(1, Math.abs(centre - mid) / mid);

      // Depth is expressed as opacity alone, deliberately.
      //
      // Translating the card's contents moves the text relative to its own
      // border, which reads as broken padding rather than parallax. Scaling
      // the card instead fixes that but creates a different fault: cards
      // scaled by different amounts no longer share a top edge, so a row of
      // bordered cards looks ragged. Opacity is the only channel that conveys
      // distance without disturbing the geometry of a card grid.
      card.style.opacity = String(1 - t * depth);
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
