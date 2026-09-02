/**
 * Appwrite connection settings.
 *
 * All three values come from Vite env vars and are PUBLIC by design — the
 * browser must send the project id on every request, so they are visible in
 * devtools no matter how they are stored. Nothing is leaked by inlining them.
 *
 * The rule that does matter: anything passed to `client.setKey()` must NEVER
 * carry a `VITE_` prefix. An Appwrite API key grants server-side privileges and
 * Vite inlines every VITE_ variable into the public bundle.
 *
 * Unset vars are not an error. `isAppwriteConfigured` goes false, the app keeps
 * its built-in content, no request is made and the SDK chunk is never even
 * downloaded — so a fresh clone of this repo still builds and renders.
 */
export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT ?? '';
export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID ?? '';
export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID ?? '';

export const isAppwriteConfigured = Boolean(
  APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID && APPWRITE_DATABASE_ID
);

/**
 * Table ids, deliberately constants rather than env vars: a table id is part of
 * the schema contract, exactly like a column name. It varies by project, not by
 * environment, and ten more variables is ten more things to set wrong.
 */
export const TABLES = {
  personalInfo: 'personal_info',
  services: 'services',
  projects: 'projects',
  skills: 'skills',
  testimonials: 'testimonials',
  experience: 'experience',
  stats: 'stats',
  theme: 'theme',
  settings: 'settings',
  contactSubmissions: 'contact_submissions',
} as const;

/** Row id of the single-row `personal_info` and `theme` tables. */
export const SINGLETON_ROW_ID = 'main';
