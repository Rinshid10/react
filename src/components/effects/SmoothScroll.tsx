import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';
import { setLenis } from '../../lib/scroll';
import './effects.css';

/**
 * SmoothScroll
 *
 * Inertial scrolling for the whole page, via Lenis. A wheel tick or a
 * trackpad flick eases the page instead of stepping it, which is what makes
 * the scroll-linked motion elsewhere (the progress bar, the parallax, the
 * reading highlights) feel continuous rather than notchy.
 *
 * It scrolls the real window, so everything that listens to native scroll
 * (the scroll-spy, `useInView`, CSS scroll timelines) keeps working. Touch
 * stays native: phones already scroll with momentum, and taking that over
 * costs battery for no gain.
 *
 * Off entirely under the reduced-motion preference. And while a modal has
 * locked the body (`overflow: hidden`), Lenis is paused so a wheel over the
 * backdrop does not keep moving the page behind it.
 */
const SmoothScroll = () => {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    setLenis(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Follow the body's scroll lock: CardModal sets `overflow: hidden` while
    // open and restores it on close.
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduce]);

  return null;
};

export default SmoothScroll;
