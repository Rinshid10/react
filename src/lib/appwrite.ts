/**
 * Appwrite data layer.
 *
 * This module exists to do *shape* work that only Appwrite requires, and to
 * keep it out of the React contexts. Appwrite has no nested-object column type,
 * so `PersonalInfo.social` is stored as five flat columns, which have to be
 * reassembled before the rest of the app sees them.
 *
 * `fetchPortfolioContent()` returns the exact JSON shape the old
 * `GET /portfolio` endpoint returned, so `PortfolioContext` keeps its existing
 * ~135 lines of defaulting and coercion untouched. That code is currently the
 * only thing keeping the site rendering, and it is worth not rewriting.
 *
 * A useful consequence: keys are OMITTED for tables that failed or came back
 * empty, so the context's existing `Array.isArray(x) && x.length` guard gives
 * per-section fallback for free. A broken `testimonials` table yields live
 * services and default testimonials.
 */
import type { ContactForm } from '../types';
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  SINGLETON_ROW_ID,
  TABLES,
  isAppwriteConfigured,
} from '../config';

/** A row as it comes back from Appwrite: our columns plus `$id`, `$createdAt`… */
type Row = Record<string, unknown>;

/** The wire shape `PortfolioContext` already knows how to consume. */
export interface PortfolioPayload {
  personalInfo?: Record<string, unknown>;
  services?: Row[];
  projects?: Row[];
  testimonials?: Row[];
  experience?: Row[];
  stats?: Row[];

  skills?: Row[];

  // Declared but never populated: `guarantees` and `process` are four rows
  // each of editorial copy with no churn, so they stay as defaults in
  // PortfolioContext. The keys are kept so the context's handling of them
  // still typechecks — adding a table later is then a mapper and nothing else.
  guarantees?: Row[];
  process?: Row[];
}

export interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  darkBackground?: string;
  defaultDarkMode?: boolean;
}

// ---------------------------------------------------------------------------
// SDK singleton
// ---------------------------------------------------------------------------

/**
 * The SDK is loaded with a dynamic import so it lands in its own chunk rather
 * than the main bundle — it is ~45KB gzipped on a landing page whose whole
 * value is how fast it paints. When Appwrite is unconfigured this promise is
 * never created, so the chunk is never fetched at all.
 *
 * ES modules evaluate once per bundle, so this module-level promise is already
 * a singleton; it needs no React context and no `useMemo`. Building it lazily
 * (rather than at import time) also guarantees `setEndpoint('')` is never
 * called, which throws on an invalid URL.
 */
let sdkPromise: Promise<{
  tablesDB: import('appwrite').TablesDB;
  ID: typeof import('appwrite').ID;
  Query: typeof import('appwrite').Query;
}> | null = null;

const getSdk = () =>
  (sdkPromise ??= (async () => {
    const { Client, TablesDB, ID, Query } = await import('appwrite');
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID);
    return { tablesDB: new TablesDB(client), ID, Query };
  })());

/**
 * A misconfigured project fails silently by design — the site just renders its
 * built-in content and looks perfect. That makes a wrong database id or a
 * missing Web-platform registration effectively invisible, which is the most
 * likely way this integration breaks. This warning is the only signal, so it
 * stays dev-only and never reaches the UI.
 */
const warn = (label: string, reason: unknown) => {
  if (import.meta.env.DEV) {
    console.warn(`[appwrite] "${label}" failed — falling back to defaults.`, reason);
  }
};

// ---------------------------------------------------------------------------
// Row -> wire shape
// ---------------------------------------------------------------------------

/** Re-nests the flattened `social*` columns back into a `SocialLinks` object. */
const assemblePersonalInfo = (row: Row): Record<string, unknown> => {
  const { socialGithub, socialLinkedin, socialTwitter, socialInstagram, socialBehance, ...rest } =
    row;
  return {
    ...rest,
    social: {
      github: (socialGithub as string) ?? '',
      linkedin: (socialLinkedin as string) ?? '',
      twitter: (socialTwitter as string) || undefined,
      instagram: (socialInstagram as string) || undefined,
      behance: (socialBehance as string) || undefined,
    },
  };
};

/**
 * Builds the payload from raw rows. Pure and exported so it can be tested with
 * fixture arrays — no network, no React, no DOM.
 *
 * Tables that failed or returned nothing are left out entirely rather than set
 * to `[]`, because an empty array would satisfy a truthiness check somewhere
 * downstream and blank the section instead of falling back.
 */
export const assemblePortfolio = (rows: {
  personalInfo?: Row | null;
  services?: Row[];
  projects?: Row[];
  skills?: Row[];
  testimonials?: Row[];
  experience?: Row[];
  stats?: Row[];
}): PortfolioPayload => {
  const payload: PortfolioPayload = {};

  if (rows.personalInfo) payload.personalInfo = assemblePersonalInfo(rows.personalInfo);
  if (rows.services?.length) payload.services = rows.services;
  if (rows.projects?.length) payload.projects = rows.projects;
  if (rows.skills?.length) payload.skills = rows.skills;
  if (rows.testimonials?.length) payload.testimonials = rows.testimonials;
  if (rows.experience?.length) payload.experience = rows.experience;
  if (rows.stats?.length) payload.stats = rows.stats;

  return payload;
};

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

/** Tables that are plain ordered lists, and the payload key each fills. */
const LIST_TABLES = [
  ['services', TABLES.services],
  ['projects', TABLES.projects],
  ['skills', TABLES.skills],
  ['testimonials', TABLES.testimonials],
  ['experience', TABLES.experience],
  ['stats', TABLES.stats],
] as const;

const loadContent = async (): Promise<PortfolioPayload | null> => {
  try {
    const { tablesDB, Query } = await getSdk();

    // One parallel wave. These all hit the same origin over HTTP/2, so they
    // multiplex onto a single connection — the cost is roughly one round trip,
    // not one per table.
    //
    // `allSettled`, not `all`: one failing table must not discard the six that
    // succeeded.
    const [personalInfoResult, ...listResults] = await Promise.allSettled([
      tablesDB.getRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLES.personalInfo,
        rowId: SINGLETON_ROW_ID,
      }),
      ...LIST_TABLES.map(([, tableId]) =>
        tablesDB.listRows({
          databaseId: APPWRITE_DATABASE_ID,
          tableId,
          // `limit(100)` is not optional: Appwrite's default page size is 25
          // and it truncates silently.
          //
          // `orderAsc('order')` is load-bearing rather than cosmetic — the
          // context derives each item's `id` from its array index, so an
          // unordered response silently renumbers the content.
          queries: [Query.limit(100), Query.orderAsc('order')],
        })
      ),
    ]);

    const rows: Parameters<typeof assemblePortfolio>[0] = {};

    if (personalInfoResult.status === 'fulfilled') {
      rows.personalInfo = personalInfoResult.value as Row;
    } else {
      warn(TABLES.personalInfo, personalInfoResult.reason);
    }

    listResults.forEach((result, i) => {
      const [key, tableId] = LIST_TABLES[i];
      if (result.status === 'fulfilled') {
        rows[key] = result.value.rows as Row[];
      } else {
        warn(tableId, result.reason);
      }
    });

    return assemblePortfolio(rows);
  } catch (error) {
    warn('portfolio content', error);
    return null;
  }
};

/**
 * Memoised on the in-flight promise, so React 19 StrictMode's double-invoked
 * effect awaits the same request instead of firing a second one.
 */
let contentPromise: Promise<PortfolioPayload | null> | null = null;

export const fetchPortfolioContent = (): Promise<PortfolioPayload | null> => {
  if (!isAppwriteConfigured) return Promise.resolve(null);
  return (contentPromise ??= loadContent());
};

let themePromise: Promise<ThemeSettings | null> | null = null;

export const fetchThemeSettings = (): Promise<ThemeSettings | null> => {
  if (!isAppwriteConfigured) return Promise.resolve(null);
  return (themePromise ??= (async () => {
    try {
      const { tablesDB } = await getSdk();
      const row = await tablesDB.getRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLES.theme,
        rowId: SINGLETON_ROW_ID,
      });
      return row as unknown as ThemeSettings;
    } catch (error) {
      warn(TABLES.theme, error);
      return null;
    }
  })());
};

// ---------------------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------------------

/**
 * Writes one enquiry.
 *
 * Deliberately NOT memoised (every submit is a real send) and deliberately NOT
 * wrapped in try/catch — the caller has to know when this fails, because the
 * alternative is telling someone their enquiry was sent when it was not.
 *
 * No `permissions` argument is passed. Row-level permissions would override the
 * table's create-only rule; granting read here would expose every lead's name,
 * email and message to anyone holding the (public) project id.
 */
export const submitEnquiry = async (form: ContactForm): Promise<void> => {
  const { tablesDB, ID } = await getSdk();
  await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.contactSubmissions,
    rowId: ID.unique(),
    data: {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      projectType: form.projectType || undefined,
      budget: form.budget || undefined,
    },
  });
};
