/**
 * Portfolio admin — a small React panel for the Appwrite content behind the
 * portfolio site.
 *
 * Security model, in one place:
 *   - No API key exists in this app. A web build is public, so a key here would
 *     grant anyone full control of the database.
 *   - Writes are authorised by the signed-in user's membership of the `admins`
 *     team. Being merely signed in grants nothing.
 *   - Accounts are created in the Appwrite console, never here.
 */
import { motion, MotionConfig } from 'framer-motion';

import { isAppwriteConfigured } from '../config';
import { Login } from './components/Login';
import { Shell } from './components/Shell';
import { BrandMark, StateMessage } from './components/ui';
import { useThemeMode } from './hooks';
import { screen } from './motion';
import { useSession } from './session';

export const App = () => {
  // Applies the stored light/dark choice to <html> before anything renders.
  useThemeMode();

  const session = useSession();

  const view = () => {
    // Without the env vars there is no project to sign in to, and the SDK
    // throws on an empty endpoint — so this is caught before any request.
    if (!isAppwriteConfigured) {
      return (
        <StateMessage
          key="unconfigured"
          tone="error"
          icon={<BrandMark size={26} />}
          title="Appwrite is not configured"
          detail={
            'Set VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID and ' +
            'VITE_APPWRITE_DATABASE_ID in .env.local, then restart the dev server.'
          }
        />
      );
    }

    if (session.status === 'checking') return <Splash key="splash" />;

    if (session.status === 'out' || !session.email) {
      // `refresh` re-runs the same check the app starts with rather than
      // trusting the login screen's own result — one code path lets people in.
      return <Login key="login" notice={session.notice} onSignedIn={session.refresh} />;
    }

    return <Shell key="shell" email={session.email} onSignedOut={session.clear} />;
  };

  return (
    // `reducedMotion="user"` is the whole accessibility story for motion here:
    // Framer drops transforms and layout animation for anyone who asked their
    // OS for less movement, and keeps opacity so nothing becomes invisible.
    // Because it is global, no variant below needs to branch on it.
    <MotionConfig reducedMotion="user">
      <motion.div key={session.status} className="app-root" {...screen}>
        {view()}
      </motion.div>
    </MotionConfig>
  );
};

/** Shown while the stored session is checked. */
const Splash = () => (
  <div className="splash">
    <motion.div
      animate={{ scale: [1, 1.08, 1], opacity: [1, 0.75, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <BrandMark size={44} />
    </motion.div>
    <span className="splash__bar" />
  </div>
);
