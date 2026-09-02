/**
 * Creates the Appwrite schema for this site.
 *
 *   node scripts/setup-appwrite.mjs          apply the schema
 *   node scripts/setup-appwrite.mjs --check  report what exists, change nothing
 *
 * Safe to re-run: every step treats "already exists" as success, so this is a
 * converge-to-target script rather than a one-shot. It never deletes or
 * modifies an existing column, because that would risk your content — if you
 * need to change a column's type or size, delete it in the console and re-run.
 *
 * Reads configuration from .env.local. The API key is read from APPWRITE_API_KEY
 * with NO `VITE_` prefix, deliberately: Vite inlines every VITE_ variable into
 * the public browser bundle, and a server API key there would hand anyone full
 * read/write access to your database. This script is the only thing that ever
 * needs the key, and it runs on your machine.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Client, TablesDB } from 'node-appwrite';
import { DATABASE_NAME, DEFAULT_INDEXES, TABLES } from './schema.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK_ONLY = process.argv.includes('--check');

// --- config -----------------------------------------------------------------

/**
 * Minimal .env parser. Node does not read .env.local on its own, and pulling in
 * dotenv for four lines is not worth a dependency.
 */
const loadEnv = () => {
  const env = {};
  for (const file of ['.env.local', '.env']) {
    let text;
    try {
      text = readFileSync(resolve(ROOT, file), 'utf8');
    } catch {
      continue;
    }
    for (const line of text.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (!match) continue;
      const [, key, rawValue = ''] = match;
      // First file wins, so .env.local overrides .env.
      if (key in env) continue;
      env[key] = rawValue.trim().replace(/^(['"])(.*)\1$/, '$2');
    }
  }
  return { ...env, ...process.env };
};

const env = loadEnv();
const ENDPOINT = env.APPWRITE_ENDPOINT || env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = env.APPWRITE_PROJECT_ID || env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = env.APPWRITE_DATABASE_ID || env.VITE_APPWRITE_DATABASE_ID;
const API_KEY = env.APPWRITE_API_KEY;

const missing = Object.entries({
  VITE_APPWRITE_ENDPOINT: ENDPOINT,
  VITE_APPWRITE_PROJECT_ID: PROJECT_ID,
  VITE_APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_API_KEY: API_KEY,
})
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length) {
  console.error(`\nMissing in .env.local: ${missing.join(', ')}\n`);
  console.error('  VITE_APPWRITE_ENDPOINT    Project -> Settings -> Overview (e.g.');
  console.error('                            https://fra.cloud.appwrite.io/v1)');
  console.error('  VITE_APPWRITE_PROJECT_ID  Project -> Settings -> Overview');
  console.error('  VITE_APPWRITE_DATABASE_ID Databases -> your database -> its ID,');
  console.error('                            which is NOT the display name');
  console.error('  APPWRITE_API_KEY          Overview -> API Keys -> Create,');
  console.error('                            scopes: tables.read, tables.write');
  console.error('\nNo VITE_ prefix on the API key — that would publish it in the bundle.\n');
  process.exit(1);
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const db = new TablesDB(client);

// --- helpers ----------------------------------------------------------------

const ALREADY_EXISTS = 409;

const log = {
  made: (what) => console.log(`  + ${what}`),
  kept: (what) => console.log(`  = ${what} (exists)`),
  fail: (what, error) => console.log(`  ! ${what} — ${error.message}`),
};

/** Runs a create call, treating a 409 as success so the script can be re-run. */
const ensure = async (label, create) => {
  if (CHECK_ONLY) return 'check';
  try {
    await create();
    log.made(label);
    return 'created';
  } catch (error) {
    if (error.code === ALREADY_EXISTS) {
      log.kept(label);
      return 'existed';
    }
    log.fail(label, error);
    return 'failed';
  }
};

const createColumn = (tableId, col) => {
  const base = { databaseId: DATABASE_ID, tableId, key: col.key, required: Boolean(col.req) };
  // Appwrite rejects a default on a required column, and on any array column.
  const xdefault = col.req || col.array ? undefined : col.def;
  const array = col.array ? { array: true } : {};

  switch (col.type) {
    case 'string':
      return db.createStringColumn({ ...base, size: col.size, xdefault, ...array });
    case 'email':
      return db.createEmailColumn({ ...base, xdefault, ...array });
    case 'integer':
      return db.createIntegerColumn({ ...base, min: col.min, max: col.max, xdefault, ...array });
    case 'boolean':
      return db.createBooleanColumn({ ...base, xdefault, ...array });
    case 'enum':
      return db.createEnumColumn({ ...base, elements: col.elements, xdefault, ...array });
    default:
      throw new Error(`Unknown column type "${col.type}" on ${tableId}.${col.key}`);
  }
};

/**
 * Appwrite creates columns asynchronously — a column is 'processing' before it
 * becomes 'available', and building an index over a column that is still
 * processing fails. This waits for the whole table to settle first.
 */
const waitForColumns = async (tableId, keys) => {
  for (let attempt = 0; attempt < 30; attempt++) {
    const { columns } = await db.getTable({ databaseId: DATABASE_ID, tableId });
    const watched = columns.filter((c) => keys.includes(c.key));
    if (watched.length === keys.length && watched.every((c) => c.status === 'available')) return true;
    const stuck = watched.find((c) => c.status === 'failed');
    if (stuck) throw new Error(`column "${stuck.key}" failed to build`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
};

// --- run --------------------------------------------------------------------

const main = async () => {
  console.log(`\n${CHECK_ONLY ? 'Checking' : 'Applying'} schema`);
  console.log(`  endpoint  ${ENDPOINT}`);
  console.log(`  project   ${PROJECT_ID}`);
  console.log(`  database  ${DATABASE_ID}\n`);

  try {
    const existing = await db.get({ databaseId: DATABASE_ID });
    console.log(`Database "${existing.name}" found.\n`);
  } catch (error) {
    console.error(`Cannot reach database "${DATABASE_ID}": ${error.message}`);
    console.error('\nCheck that VITE_APPWRITE_DATABASE_ID is the database ID, not its');
    console.error(`display name (e.g. "${DATABASE_NAME}" is a name, not an ID), and that`);
    console.error('the API key has the tables.read and tables.write scopes.\n');
    process.exit(1);
  }

  if (CHECK_ONLY) {
    for (const table of TABLES) {
      try {
        const t = await db.getTable({ databaseId: DATABASE_ID, tableId: table.id });
        const have = t.columns.length;
        const want = table.columns.length;
        const ok = have === want ? 'ok' : `${have}/${want} columns`;
        console.log(`  ${have === want ? '=' : '!'} ${table.id} — ${ok}`);
      } catch {
        console.log(`  - ${table.id} — missing`);
      }
    }
    console.log('\nRun without --check to create anything missing.\n');
    return;
  }

  let failures = 0;

  for (const table of TABLES) {
    console.log(`${table.id}`);

    const result = await ensure(`table ${table.id}`, () =>
      db.createTable({
        databaseId: DATABASE_ID,
        tableId: table.id,
        name: table.name,
        permissions: table.permissions,
        // Row-level security off. With it on, a per-row permission could
        // override the table rule — which on contact_submissions is exactly how
        // enquiries end up publicly readable.
        rowSecurity: false,
      })
    );
    if (result === 'failed') failures++;

    // Sequential, not Promise.all: Appwrite serialises schema changes per table
    // anyway, and firing them together mostly produces rate-limit noise.
    for (const col of table.columns) {
      const r = await ensure(`  ${col.key} (${col.type}${col.array ? '[]' : ''})`, () =>
        createColumn(table.id, col)
      );
      if (r === 'failed') failures++;
    }

    const indexes = table.indexes ?? DEFAULT_INDEXES;
    if (indexes.length) {
      const keys = [...new Set(indexes.flatMap((i) => i.columns))];
      process.stdout.write('  waiting for columns to build… ');
      const ready = await waitForColumns(table.id, keys);
      console.log(ready ? 'ready' : 'timed out');
      if (ready) {
        for (const index of indexes) {
          const r = await ensure(`  index ${index.key}`, () =>
            db.createIndex({
              databaseId: DATABASE_ID,
              tableId: table.id,
              key: index.key,
              type: index.type,
              columns: index.columns,
              orders: index.orders,
            })
          );
          if (r === 'failed') failures++;
        }
      } else {
        console.log(`  ! index skipped — re-run this script to add it`);
        failures++;
      }
    }

    console.log('');
  }

  if (failures) {
    console.log(`Finished with ${failures} problem(s). The script is re-runnable —`);
    console.log('fix the cause and run it again; anything already correct is left alone.\n');
    process.exit(1);
  }

  console.log('Schema applied.\n');
  console.log('Next:');
  console.log('  1. Add one row to personal_info and one to theme, each with the');
  console.log('     Row ID typed by hand as exactly "main" (turn off auto-generate).');
  console.log('     Leave theme\'s four colour columns EMPTY to keep the design monochrome.');
  console.log('  2. Add rows to the list tables, setting `order` in tens (10, 20, 30…).');
  console.log('     Seed each table fully or leave it empty — a table holding one test');
  console.log('     row replaces that whole section, rather than falling back.');
  console.log('  3. Verify contact_submissions is NOT publicly readable:');
  console.log('     node scripts/verify-appwrite.mjs\n');
};

main().catch((error) => {
  console.error(`\nFailed: ${error.message}\n`);
  process.exit(1);
});
