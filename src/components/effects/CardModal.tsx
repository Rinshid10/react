import { ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import './effects.css';

/**
 * CardModal
 *
 * Expands a card into a full detail view using a shared-element transition:
 * the card and the modal share a `layoutId`, so Framer Motion tweens the one
 * into the other rather than cross-fading. The reader keeps their place —
 * it is obvious which card opened.
 *
 * Native equivalent of @reactbits-starter/modal-cards-tw.
 *
 * Accessibility, which a decorative modal usually skips and shouldn't:
 * - `role="dialog"` + `aria-modal`, labelled by the title
 * - Escape closes it, and the backdrop is clickable to dismiss
 * - Body scroll is locked while open, and restored on close
 * - Focus moves to the panel on open and returns to the trigger on close
 */

interface CardModalProps {
  /** Must match the `layoutId` on the card that opens this modal. */
  layoutId: string;
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const CardModal = ({ layoutId, open, onClose, title, children }: CardModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // Remember what to hand focus back to, then move it into the panel.
    returnFocusRef.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Lock scroll, compensating for the scrollbar so the page doesn't shift.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      returnFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="card-modal-root">
          <motion.div
            className="card-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            layoutId={layoutId}
            className="card-modal-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
          >
            <button className="card-modal-close" onClick={onClose} aria-label="Close">
              <FiX />
            </button>
            <div className="card-modal-body">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CardModal;
