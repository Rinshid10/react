/**
 * Who is signed in, and whether they are allowed in.
 *
 * A hook rather than logic inside `App`, because the whole thing is one
 * subscription to an external system: Appwrite holds the session in a cookie,
 * and the panel has to ask it on mount, after a sign-in, and after a sign-out.
 */
import { useCallback, useEffect, useState } from 'react';

import { isAppwriteConfigured } from '../config';
import { checkAdmin, currentUser, describeError, signOut } from './lib/api';

export type SessionStatus = 'checking' | 'out' | 'in';

export interface Session {
  status: SessionStatus;
  email: string | null;

  /** Why the last attempt was rejected, shown on the sign-in screen. */
  notice: string | null;

  /** Re-checks the stored session. Called after a successful sign-in. */
  refresh: () => void;

  /** Drops local state after signing out, without waiting for a round trip. */
  clear: () => void;
}

export const useSession = (): Session => {
  const [status, setStatus] = useState<SessionStatus>(
    isAppwriteConfigured ? 'checking' : 'out'
  );
  const [email, setEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!isAppwriteConfigured) return;

    let live = true;

    /**
     * Appwrite keeps the session in a cookie, so a reload should not force a
     * second sign-in. Team membership is re-checked on every start, because
     * access can be revoked while a session is still valid.
     */
    const check = async () => {
      try {
        const user = await currentUser();
        if (!live) return;

        if (!user) {
          setEmail(null);
          setStatus('out');
          return;
        }

        const admin = await checkAdmin();
        if (!live) return;

        if (!admin.isAdmin) {
          await signOut();
          if (!live) return;
          setEmail(null);
          setNotice(admin.reason ?? null);
          setStatus('out');
          return;
        }

        setEmail(user.email);
        setStatus('in');
      } catch (error) {
        // Never leave the panel on a spinner: an unreachable Appwrite should
        // land on the sign-in screen with the reason, not a hang.
        if (!live) return;
        setEmail(null);
        setNotice(describeError(error));
        setStatus('out');
      }
    };

    check();
    return () => {
      live = false;
    };
  }, [nonce]);

  const refresh = useCallback(() => {
    setNotice(null);
    setStatus('checking');
    setNonce((n) => n + 1);
  }, []);

  const clear = useCallback(() => {
    setEmail(null);
    setNotice(null);
    setStatus('out');
  }, []);

  return { status, email, notice, refresh, clear };
};
