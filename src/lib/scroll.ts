import type Lenis from 'lenis';

/**
 * One place the page scrolls from.
 *
 * With Lenis driving the scroll, a native `scrollIntoView({ behavior:
 * 'smooth' })` fights it: the browser animates the scroll position while
 * Lenis is also easing towards its own target, and the result stutters or
 * stops short. Every "jump to section" on the site goes through here so it
 * uses Lenis when it is running and falls back to the native call when it
 * is not (reduced motion, or before Lenis has mounted).
 */

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const getLenis = () => lenis;

/** Space left above a section so the fixed navbar does not cover its top. */
const NAV_OFFSET = -72;

export const scrollToId = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  if (lenis) {
    lenis.scrollTo(element, { offset: NAV_OFFSET, duration: 1.4 });
  } else {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
