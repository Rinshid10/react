/**
 * Sign-in.
 *
 * There is deliberately no "create account" here. Accounts are made in the
 * Appwrite console and granted access by team membership; a signup form on a
 * public admin panel would be a way in, not a convenience.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

import { AuthMessage, checkAdmin, describeError, signIn, signOut } from '../lib/api';
import { banner, fieldItem, listParent, press } from '../motion';
import { BrandMark, NoticeBanner, Spinner } from './ui';

interface Props {
  onSignedIn: () => void;

  /** Carried over from a rejected session, e.g. access was revoked. */
  notice?: string | null;
}

export const Login = ({ onSignedIn, notice }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(notice ?? null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);

      const check = await checkAdmin();
      if (!check.isAdmin) {
        // Signed in but not authorised. Ending the session here avoids leaving
        // someone half-authorised, erroring on every screen they open.
        await signOut();
        throw new AuthMessage(check.reason ?? 'Not authorised.');
      }
      onSignedIn();
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <BrandPanel />

      <main className="login__form-side">
        <motion.form
          className="login__form"
          onSubmit={submit}
          variants={listParent}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fieldItem}>
            <BrandMark size={40} />
          </motion.div>
          <motion.h1 variants={fieldItem}>Sign in</motion.h1>
          <motion.p className="login__lede" variants={fieldItem}>
            Use your Appwrite account to manage the site content.
          </motion.p>

          <motion.label className="field__label" htmlFor="admin-email" variants={fieldItem}>
            Email
          </motion.label>
          <motion.input
            id="admin-email"
            className="input"
            type="email"
            required
            autoFocus
            autoComplete="username"
            placeholder="you@example.com"
            value={email}
            variants={fieldItem}
            onChange={(e) => setEmail(e.target.value)}
          />

          <motion.label className="field__label" htmlFor="admin-password" variants={fieldItem}>
            Password
          </motion.label>
          <motion.div className="input-group" variants={fieldItem}>
            <input
              id="admin-password"
              className="input"
              type={show ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="btn btn--icon"
              onClick={() => setShow(!show)}
              title={show ? 'Hide password' : 'Show password'}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </motion.div>

          <AnimatePresence initial={false}>
            {error && (
              <motion.div
                className="banner-slot"
                {...banner}
              >
                <NoticeBanner title="Could not sign in" message={error} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={busy}
            variants={fieldItem}
            whileTap={press}
            whileHover={{ y: -1 }}
          >
            {busy ? <Spinner /> : null}
            {busy ? 'Signing in…' : 'Sign in'}
          </motion.button>

          <motion.p className="login__foot" variants={fieldItem}>
            <FiLock aria-hidden /> Accounts are created in the Appwrite console, not here.
          </motion.p>
        </motion.form>
      </main>
    </div>
  );
};

/**
 * The decorative half, dropped rather than squeezed on a narrow screen.
 *
 * The grid drifts by one cell on a long loop. It is slow enough to read as
 * texture rather than movement, which is the point — a login screen that
 * fidgets is worse than a still one.
 */
const BrandPanel = () => (
  <aside className="login__brand" aria-hidden>
    <motion.div
      className="login__grid"
      animate={{ backgroundPosition: ['0px 0px', '44px 44px'] }}
      transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
    />
    <motion.div
      className="login__brand-head"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="login__chip" />
      <strong>Portfolio admin</strong>
    </motion.div>

    <motion.div
      className="login__pitch"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      initial="hidden"
      animate="show"
    >
      {/* Each line is clipped by its own row, so the words rise into view from
          behind the line above rather than simply fading. */}
      <h2>
        {['Everything the site', 'shows, in one place.'].map((line) => (
          <span className="login__line" key={line}>
            <motion.span
              variants={{
                hidden: { y: '100%' },
                show: { y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
      >
        Profile, projects, services, testimonials and enquiries — edited here, live on the next
        page load.
      </motion.p>
    </motion.div>

    <motion.small
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      Appwrite · React
    </motion.small>
  </aside>
);
