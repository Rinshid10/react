/**
 * The panel's motion vocabulary.
 *
 * Kept in one file so every screen moves the same way — an admin tool is used
 * for hours, and inconsistent timing reads as jank rather than polish. Three
 * rules behind these values:
 *
 *   - Motion explains a change of state, it never decorates. Rows stagger in
 *     because they arrived from a request; a deleted row leaves so you can see
 *     which one went.
 *   - Anything the user is waiting on is fast (≤ 0.2s). Anything that merely
 *     accompanies them is slower.
 *   - Nothing that moves blocks typing.
 *
 * `prefers-reduced-motion` is honoured globally by the `<MotionConfig
 * reducedMotion="user">` in App.tsx — Framer then drops transforms and keeps
 * opacity, so none of these variants need to branch on it themselves. The
 * CSS-driven transitions have their own media query in admin.css.
 */
import type { Transition, Variants } from 'framer-motion';

/** Fast out, gentle settle. The panel's one easing curve. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Layout moves — the nav marker, rows closing a gap. */
export const SNAP: Transition = { type: 'spring', stiffness: 560, damping: 42, mass: 0.8 };

/** Entrances and exits. */
export const GLIDE: Transition = { duration: 0.3, ease: EASE };

/** Anything acknowledging a click. Short enough to feel like a response. */
export const TAP: Transition = { duration: 0.16, ease: EASE };

/** The default entrance: a short rise out of nothing. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: GLIDE },
  exit: { opacity: 0, y: -6, transition: TAP },
};

/**
 * A screen arriving. Spread as props on a keyed element — see `disclosure` for
 * why these are explicit objects rather than named variants.
 *
 * Entrance only, no exit. `AnimatePresence mode="wait"` holds the incoming
 * screen back until the outgoing one has finished leaving, which shows a blank
 * pane in between; cross-fading instead stacks two page headers. An entrance on
 * a keyed element avoids both, and a section change is legible without an exit.
 */
export const screen = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.26, ease: EASE },
} as const;

/**
 * Parent of a staggered list.
 *
 * `staggerChildren` is deliberately small: at 12 rows a 0.06s step is a
 * second of waiting before the last row is readable, which is a cost paid on
 * every single navigation.
 */
export const listParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.028, delayChildren: 0.02 } },
};

/** One row of a staggered list. Exits sideways so a delete is legible. */
export const listItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: GLIDE },
  exit: { opacity: 0, x: -16, scale: 0.98, transition: { duration: 0.2, ease: EASE } },
};

/** Form fields, which stagger faster still — there are a lot of them. */
export const fieldParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018, delayChildren: 0.04 } },
};

export const fieldItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: EASE } },
};

/** Popovers and menus, growing from the edge they are anchored to. */
export const popover: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16, ease: EASE } },
  exit: { opacity: 0, y: 4, scale: 0.98, transition: { duration: 0.12, ease: EASE } },
};

/**
 * `pointerEvents: 'none'` on exit is load-bearing, not decoration.
 *
 * AnimatePresence keeps the overlay mounted for the length of its exit, and a
 * full-screen fixed element that is merely transparent still absorbs clicks.
 * Without this, a click landing in that window — right after dismissing the
 * dialog, which is exactly when one tends to land — hits the backdrop instead.
 */
export const backdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, pointerEvents: 'auto', transition: { duration: 0.18 } },
  exit: { opacity: 0, pointerEvents: 'none', transition: { duration: 0.14 } },
};

export const dialog: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: EASE } },
  exit: { opacity: 0, scale: 0.98, y: 4, transition: { duration: 0.14, ease: EASE } },
};

export const toast: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 460, damping: 34 } },
  exit: { opacity: 0, y: 10, scale: 0.98, transition: TAP },
};

/**
 * Disclosure — the enquiry body opening, and inline banners appearing.
 *
 * Spread as props (`{...disclosure}`) rather than used as named variants.
 * Framer propagates a variant label to any motion child that defines the same
 * label, which would hand these elements their parent's timing instead of their
 * own; explicit initial/animate/exit objects opt out of that entirely.
 *
 * `height: auto` is measured by Framer on each run, so this survives content of
 * any length with no hardcoded max-height. The wrapper must clip. It also does
 * not need a `layout` ancestor to move the elements below it: a height
 * animation in normal flow reflows its siblings on every frame already.
 */
export const disclosure = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: { height: { duration: 0.26, ease: EASE }, opacity: { duration: 0.2, delay: 0.06 } },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { height: { duration: 0.2, ease: EASE }, opacity: { duration: 0.12 } },
  },
} as const;

/** Inline banners, which push the form down and so animate their height too. */
export const banner = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: { height: { duration: 0.24, ease: EASE }, opacity: { duration: 0.2, delay: 0.04 } },
  },
  exit: { height: 0, opacity: 0, transition: { duration: 0.18, ease: EASE } },
} as const;

/** Press feedback shared by every button that does something irreversible. */
export const press = { scale: 0.97 };
