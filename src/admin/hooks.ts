/** Two hooks the panel needs everywhere: loading remote data, and the theme. */
import { useCallback, useEffect, useRef, useState } from 'react';

import { describeError } from './lib/api';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Runs `load` on mount and whenever `deps` change, with a reload trigger.
 *
 * A request counter, not an AbortController: the Appwrite SDK gives no signal
 * to abort with, so a superseded response is ignored rather than cancelled.
 * Without it, switching tables fast enough can land an older list on a newer
 * screen.
 */
export const useAsync = <T,>(load: () => Promise<T>, deps: unknown[]): AsyncState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const latest = useRef(0);

  // `load` is typically an inline closure, so it is a new function on every
  // render; the caller's `deps` are what actually decide when to refetch.
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    const request = ++latest.current;
    setLoading(true);
    setError(null);

    loadRef
      .current()
      .then((result) => {
        if (request !== latest.current) return;
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (request !== latest.current) return;
        setError(describeError(err));
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { data, loading, error, reload };
};

export type ThemeMode = 'system' | 'light' | 'dark';

const THEME_KEY = 'admin-theme';

const resolve = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode !== 'system') return mode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Light/dark/system, written to `data-theme` on <html> so the CSS variables in
 * admin.css can switch without a re-render of anything below.
 */
export const useThemeMode = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  });

  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.theme = resolve(mode);
    };
    apply();
    localStorage.setItem(THEME_KEY, mode);

    if (mode !== 'system') return;

    // Only while following the system does the OS switch need watching.
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [mode]);

  const cycle = useCallback(
    () => setMode((m) => (m === 'system' ? 'light' : m === 'light' ? 'dark' : 'system')),
    []
  );

  return { mode, cycle };
};
