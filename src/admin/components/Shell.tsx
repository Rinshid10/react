/**
 * Signed-in shell: a sidebar on the left, the selected section on the right.
 * Singletons open straight into their form; list tables show a list.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FiActivity,
  FiBarChart2,
  FiBell,
  FiBriefcase,
  FiChevronsLeft,
  FiChevronsRight,
  FiClock,
  FiCloudOff,
  FiDroplet,
  FiGrid,
  FiLayers,
  FiLogOut,
  FiMail,
  FiMessageSquare,
  FiMoon,
  FiRefreshCw,
  FiUser,
} from 'react-icons/fi';

import { useAsync, useThemeMode } from '../hooks';
import { getSingleton, signOut } from '../lib/api';
import { popover, screen, SNAP, toast as toastVariants } from '../motion';
import { CONTENT_TABLES, type IconKey, type TableDef } from '../schema';
import { CONFIRM_DISCARD, UnsavedContext } from '../unsaved';
import { Enquiries } from './Enquiries';
import { RecordEdit } from './RecordEdit';
import { RecordList } from './RecordList';
import { BrandMark, SectionLabel, SkeletonList, StateMessage } from './ui';

const ICONS: Record<IconKey, IconType> = {
  person: FiUser,
  skills: FiLayers,
  work: FiBriefcase,
  apps: FiGrid,
  insights: FiActivity,
  quote: FiMessageSquare,
  timeline: FiClock,
  stats: FiBarChart2,
  palette: FiDroplet,
  bell: FiBell,
};

const THEME_LABEL = {
  system: 'Theme: system',
  light: 'Theme: light',
  dark: 'Theme: dark',
} as const;

export const Shell = ({ email, onSignedOut }: { email: string; onSignedOut: () => void }) => {
  // `null` means "follow the window width"; a boolean is the user's own choice.
  const [collapsedOverride, setCollapsedOverride] = useState<boolean | null>(null);
  const [narrow, setNarrow] = useState(() => window.innerWidth < 1080);
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const enquiriesIndex = CONTENT_TABLES.length;
  const collapsed = collapsedOverride ?? narrow;

  // Set by an open editor with unsaved edits. Switching section unmounts that
  // form, so ask first rather than discarding someone's typing silently.
  const unsaved = useRef(false);
  const go = (next: number) => {
    if (next === index) return;
    if (unsaved.current && !window.confirm(CONFIRM_DISCARD)) return;
    unsaved.current = false;
    setIndex(next);
  };

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 1080);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Toasts clear themselves; a save confirmation that needs dismissing is worse
  // than no confirmation.
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const leave = async () => {
    try {
      await signOut();
    } finally {
      // Sign out locally even if the request failed — leaving someone stuck in
      // a session they asked to end is worse than a stale server-side session.
      onSignedOut();
    }
  };

  const body = () => {
    if (index === enquiriesIndex) return <Enquiries onToast={setToast} />;
    const table = CONTENT_TABLES[index];
    if (table.singleton) return <SingletonEditor key={table.id} table={table} onToast={setToast} />;
    return <RecordList key={table.id} table={table} onToast={setToast} />;
  };

  return (
    <UnsavedContext.Provider value={unsaved}>
      <div className={`shell${collapsed ? ' shell--collapsed' : ''}`}>
        <nav className="sidebar" aria-label="Sections">
          <div className="sidebar__head">
            <BrandMark size={30} />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  className="sidebar__head-rest"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <span className="sidebar__title">
                    <strong>Portfolio</strong>
                    <small>Content admin</small>
                  </span>
                  <button
                    type="button"
                    className="btn btn--icon"
                    onClick={() => setCollapsedOverride(true)}
                    title="Collapse sidebar"
                    aria-label="Collapse sidebar"
                  >
                    <FiChevronsLeft />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="sidebar__nav">
            {!collapsed && <SectionLabel>Content</SectionLabel>}
            {CONTENT_TABLES.map((table, i) => (
              <NavItem
                key={table.id}
                icon={ICONS[table.icon ?? 'apps']}
                label={table.label}
                active={index === i}
                collapsed={collapsed}
                onClick={() => go(i)}
              />
            ))}

            {!collapsed && <SectionLabel>Inbox</SectionLabel>}
            <NavItem
              icon={FiMail}
              label="Enquiries"
              active={index === enquiriesIndex}
              collapsed={collapsed}
              onClick={() => go(enquiriesIndex)}
            />
          </div>

          <AccountMenu
            email={email}
            collapsed={collapsed}
            open={menuOpen}
            setOpen={setMenuOpen}
            onExpand={() => setCollapsedOverride(false)}
            onSignOut={leave}
          />
        </nav>

        <main className="content">
          {/* Keyed, so changing section remounts the pane and replays its
              entrance. Deliberately not wrapped in AnimatePresence — see the
              note on `screen` in motion.ts for why an exit phase costs more
              here than it gives. */}
          <motion.div key={index} className="content__page" {...screen}>
            {body()}
          </motion.div>
        </main>

        <AnimatePresence>
          {toast && (
            <motion.div
              className="toast"
              role="status"
              variants={toastVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UnsavedContext.Provider>
  );
};

/**
 * One sidebar row.
 *
 * The selected background is a single shared element (`layoutId`), so it slides
 * from the old section to the new one instead of blinking out and in. That
 * movement is the only thing on screen that traces the path between two
 * sections, which is worth more than it costs.
 */
const NavItem = ({
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  icon: IconType;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    className={`nav-item${active ? ' nav-item--on' : ''}`}
    aria-current={active ? 'page' : undefined}
    title={collapsed ? label : undefined}
    onClick={onClick}
  >
    {active && <motion.span className="nav-item__marker" layoutId="nav-marker" transition={SNAP} />}
    <span className="nav-item__inner">
      <Icon aria-hidden />
      {!collapsed && <span>{label}</span>}
    </span>
  </button>
);

const AccountMenu = ({
  email,
  collapsed,
  open,
  setOpen,
  onExpand,
  onSignOut,
}: {
  email: string;
  collapsed: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  onExpand: () => void;
  onSignOut: () => void;
}) => {
  const { mode, cycle } = useThemeMode();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  return (
    <div className="account" ref={ref}>
      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            role="menu"
            variants={popover}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ transformOrigin: 'bottom left' }}
          >
            <span className="menu__email">{email}</span>
            <hr />
            <button type="button" role="menuitem" onClick={cycle}>
              {/* The icon spins a half turn on each change, so cycling through
                  system → light → dark is visible even when the theme it lands
                  on happens to look identical to the one it left. */}
              <motion.span
                className="menu__icon"
                key={mode}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FiMoon aria-hidden />
              </motion.span>
              {THEME_LABEL[mode]}
            </button>
            {collapsed && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onExpand();
                  setOpen(false);
                }}
              >
                <FiChevronsRight aria-hidden /> Expand sidebar
              </button>
            )}
            <button type="button" role="menuitem" className="menu__danger" onClick={onSignOut}>
              <FiLogOut aria-hidden /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="account__button"
        aria-haspopup="menu"
        aria-expanded={open}
        title={email}
        onClick={() => setOpen(!open)}
      >
        <span className="account__avatar">{(email[0] ?? '?').toUpperCase()}</span>
        {!collapsed && <span className="account__email">{email}</span>}
      </button>
    </div>
  );
};

/**
 * Loads a single-row table before handing it to the shared editor, so Profile
 * and Theme open directly into their form instead of a one-item list.
 */
const SingletonEditor = ({
  table,
  onToast,
}: {
  table: TableDef;
  onToast: (message: string) => void;
}) => {
  const { data, loading, error, reload } = useAsync(() => getSingleton(table.id), [table.id]);

  if (loading) {
    return (
      <div className="screen">
        <div className="page-header page-header--ghost" />
        <div className="screen__body">
          <SkeletonList count={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <StateMessage
        tone="error"
        icon={<FiCloudOff />}
        title={`Could not load ${table.label.toLowerCase()}`}
        detail={error}
        action={
          <button type="button" className="btn btn--primary" onClick={reload}>
            <FiRefreshCw /> Try again
          </button>
        }
      />
    );
  }

  // A missing row is normal — the site runs on its defaults until this is saved
  // for the first time, which the editor then creates.
  return <RecordEdit table={table} initial={data} embedded onToast={onToast} />;
};
