/**
 * All Appwrite access for the admin panel.
 *
 * One client for the whole panel. Every write is authorised by the signed-in
 * user's membership of the `admins` team — there is no API key anywhere in this
 * build, and there must never be one, because a web bundle is public.
 *
 * Separate from `src/lib/appwrite.ts` on purpose: that module is the public
 * site's read path, memoised per page load and deliberately silent on failure.
 * The admin needs the opposite of both — fresh reads after every write, and
 * errors loud enough to act on.
 */
import { Account, Client, ID, Query, TablesDB, Teams, AppwriteException } from 'appwrite';
import type { Models } from 'appwrite';

import {
  APPWRITE_DATABASE_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  SINGLETON_ROW_ID,
} from '../../config';
import { ENQUIRIES_TABLE } from '../schema';

/** The team whose members may edit content. Mirrors `ADMIN_TEAM_ID` in `scripts/schema.mjs`. */
export const ADMIN_TEAM_ID = 'admins';

/** A row plus whatever columns its table defines. */
export type Row = Models.Row & Record<string, unknown>;

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);
const teams = new Teams(client);
const tables = new TablesDB(client);

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/**
 * The signed-in user, or null. Appwrite throws when there is no session, which
 * is not an error worth surfacing.
 */
export const currentUser = async (): Promise<Models.User<Models.Preferences> | null> => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

export const signIn = (email: string, password: string) =>
  account.createEmailPasswordSession({ email, password });

export const signOut = () => account.deleteSession({ sessionId: 'current' });

export interface AdminCheck {
  isAdmin: boolean;
  reason?: string;
}

/**
 * Whether the signed-in account is in the admin team.
 *
 * Checked explicitly so a signed-in non-admin gets one clear message instead of
 * a permission error on every screen they open.
 *
 * Returns a reason on failure rather than a bare false, because "the team does
 * not exist yet" and "you are not in it" need different fixes.
 */
export const checkAdmin = async (): Promise<AdminCheck> => {
  try {
    const list = await teams.list();
    if (list.teams.some((team) => team.$id === ADMIN_TEAM_ID)) return { isAdmin: true };

    // `teams.list()` returns only the teams this account belongs to, so an
    // empty result and a wrong-id result need different fixes. Naming what was
    // actually found turns a dead end into a diagnosis.
    if (list.teams.length === 0) {
      return {
        isAdmin: false,
        reason:
          'Signed in, but this account belongs to no teams at all.\n\n' +
          'In the Appwrite console:\n' +
          `  1. Auth > Teams > Create team, with Team ID exactly "${ADMIN_TEAM_ID}"\n` +
          '  2. Open it > Members > Create membership, and add this account\n\n' +
          'Creating the team is not enough on its own — you have to be a member ' +
          'of it. If you only did step 1, do step 2.',
      };
    }

    const found = list.teams.map((team) => `"${team.$id}"`).join(', ');
    return {
      isAdmin: false,
      reason:
        `Signed in, but not a member of the "${ADMIN_TEAM_ID}" team.\n\n` +
        `This account is in: ${found}\n\n` +
        `The Team ID has to be exactly "${ADMIN_TEAM_ID}" — the display name ` +
        'does not matter, and an auto-generated id will not work, because that ' +
        'is the id the table permissions reference.\n\n' +
        'Either recreate the team with that id, or add this account to it.',
    };
  } catch (error) {
    return { isAdmin: false, reason: describeError(error) };
  }
};

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export const listRows = async (tableId: string, ordered = true): Promise<Row[]> => {
  const res = await tables.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId,
    // limit(100) is not optional — Appwrite's default page size is 25 and it
    // truncates silently.
    queries: ordered ? [Query.limit(100), Query.orderAsc('order')] : [Query.limit(100)],
  });
  return res.rows as Row[];
};

export const getSingleton = async (tableId: string): Promise<Row | null> => {
  try {
    return (await tables.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId,
      rowId: SINGLETON_ROW_ID,
    })) as Row;
  } catch (error) {
    // 404 simply means the row has not been created yet; the site falls back to
    // its built-in defaults until it is.
    if (error instanceof AppwriteException && error.code === 404) return null;
    throw error;
  }
};

export const saveSingleton = async (tableId: string, data: Record<string, unknown>) => {
  try {
    await tables.updateRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId,
      rowId: SINGLETON_ROW_ID,
      data,
    });
  } catch (error) {
    if (!(error instanceof AppwriteException) || error.code !== 404) throw error;
    await tables.createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId,
      rowId: SINGLETON_ROW_ID,
      data,
    });
  }
};

export const createRow = (tableId: string, data: Record<string, unknown>) =>
  tables.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId,
    rowId: ID.unique(),
    data,
  });

export const updateRow = (tableId: string, rowId: string, data: Record<string, unknown>) =>
  tables.updateRow({ databaseId: APPWRITE_DATABASE_ID, tableId, rowId, data });

export const deleteRow = (tableId: string, rowId: string) =>
  tables.deleteRow({ databaseId: APPWRITE_DATABASE_ID, tableId, rowId });

// ---------------------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------------------

/**
 * Newest first. There is no `order` column here — enquiries are sorted by when
 * they arrived.
 */
export const listEnquiries = async (): Promise<Row[]> => {
  const res = await tables.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: ENQUIRIES_TABLE,
    queries: [Query.limit(100), Query.orderDesc('$createdAt')],
  });
  return res.rows as Row[];
};

export const setEnquiryStatus = (rowId: string, status: string) =>
  updateRow(ENQUIRIES_TABLE, rowId, { status });

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/**
 * An error whose text is written for the reader rather than derived from an
 * exception. Kept distinct so error handling never has to guess whether a
 * message is presentable.
 */
export class AuthMessage extends Error {}

/**
 * Turns an Appwrite failure into something worth reading.
 *
 * `AppwriteException.message` is often serviceable, but the `type` field is
 * what actually says how to fix the common cases, so those get written out.
 */
export const describeError = (error: unknown): string => {
  if (error instanceof AuthMessage) return error.message;

  if (error instanceof AppwriteException) {
    const message = error.message || 'Unknown Appwrite error';

    switch (error.type) {
      case 'user_invalid_credentials':
        return (
          'Wrong email or password.\n\n' +
          'If you have not created the admin account yet, do that first in the ' +
          'Appwrite console under Auth > Users — you choose the password there.'
        );
      case 'user_blocked':
        return 'That account is blocked in the Appwrite console.';
      case 'general_unauthorized_scope':
      case 'user_unauthorized':
        return (
          'Signed in, but not allowed to do that. The account is probably not ' +
          `in the "${ADMIN_TEAM_ID}" team.\n\n` +
          'Run: npm run appwrite:admin -- your@email.com'
        );
      case 'collection_not_found':
      case 'table_not_found':
        return (
          'That table does not exist in this database. Check ' +
          'VITE_APPWRITE_DATABASE_ID matches the project you are editing.'
        );
    }

    // A failed CORS preflight arrives as a network error with no status, and is
    // the most likely first-run problem: the panel's origin has to be
    // registered in the Appwrite console.
    if (!error.code) {
      return (
        `${message}\n\nIf this is the first run, add this site under ` +
        'Project > Settings > Platforms > Add Web App in the Appwrite console.'
      );
    }

    return `${message} (${error.code})`;
  }

  return error instanceof Error ? error.message : String(error);
};
