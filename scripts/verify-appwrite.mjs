/**
 * Checks the schema the way a visitor's browser sees it.
 *
 *   node scripts/verify-appwrite.mjs           read checks only
 *   node scripts/verify-appwrite.mjs --write   also send a real test enquiry
 *
 * Deliberately runs with NO API key, as an anonymous guest — that is the whole
 * point. A key would pass every check regardless of how the permissions are
 * configured, and prove nothing.
 *
 * The check that matters most is that `contact_submissions` is NOT readable.
 * Your project id is public and sits in the bundled JS, so if that table grants
 * read to `any`, every visitor can list every lead's name, email and message.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Client, TablesDB, ID, Query } from 'node-appwrite';
import { TABLES } from './schema.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRITE_TEST = process.argv.includes('--write');

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
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (m && !(m[1] in env)) env[m[1]] = (m[2] ?? '').trim().replace(/^(['"])(.*)\1$/, '$2');
    }
  }
  return { ...env, ...process.env };
};

const env = loadEnv();
const ENDPOINT = env.APPWRITE_ENDPOINT || env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = env.APPWRITE_PROJECT_ID || env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = env.APPWRITE_DATABASE_ID || env.VITE_APPWRITE_DATABASE_ID;

if (!ENDPOINT || !PROJECT_ID || !DATABASE_ID) {
  console.error('\nSet VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID and');
  console.error('VITE_APPWRITE_DATABASE_ID in .env.local first.\n');
  process.exit(1);
}

// No .setKey(): this client is an anonymous visitor.
const guest = new TablesDB(new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID));

let passed = 0;
let failed = 0;
const pass = (m) => { console.log(`  PASS  ${m}`); passed++; };
const fail = (m) => { console.log(`  FAIL  ${m}`); failed++; };

const main = async () => {
  console.log(`\nVerifying as an anonymous visitor (no API key)\n`);

  const readable = TABLES.filter((t) => t.id !== 'contact_submissions');

  console.log('Content tables should be publicly readable and ordered:');
  for (const table of readable) {
    try {
      const isList = !table.singleton;
      const res = await guest.listRows({
        databaseId: DATABASE_ID,
        tableId: table.id,
        queries: isList ? [Query.limit(100), Query.orderAsc('order')] : [Query.limit(1)],
      });
      const n = res.rows.length;
      if (n === 0) {
        // Not a failure: the code falls back to built-in defaults for an empty
        // table. Worth surfacing, because it is indistinguishable from success
        // when you only look at the rendered page.
        console.log(`  ----  ${table.id} — readable but EMPTY (site uses defaults here)`);
      } else {
        pass(`${table.id} — ${n} row${n === 1 ? '' : 's'}`);
      }
      if (table.singleton && n > 0 && !res.rows.some((r) => r.$id === 'main')) {
        fail(`${table.id} — no row with ID "main"; the site reads that exact id`);
      }
    } catch (error) {
      fail(`${table.id} — ${error.message}`);
    }
  }

  console.log('\nEnquiries must NOT be readable by visitors:');
  try {
    const res = await guest.listRows({
      databaseId: DATABASE_ID,
      tableId: 'contact_submissions',
      queries: [Query.limit(1)],
    });
    fail(
      `contact_submissions IS PUBLICLY READABLE — ${res.total} enquir${res.total === 1 ? 'y' : 'ies'} ` +
        `exposed. Remove read permission on that table now.`
    );
  } catch (error) {
    if (error.code === 401 || error.code === 404) {
      pass(`contact_submissions is not readable (${error.code})`);
    } else {
      fail(`contact_submissions returned an unexpected ${error.code}: ${error.message}`);
    }
  }

  if (WRITE_TEST) {
    console.log('\nEnquiry write path:');
    try {
      const row = await guest.createRow({
        databaseId: DATABASE_ID,
        tableId: 'contact_submissions',
        rowId: ID.unique(),
        data: {
          name: 'Setup verification',
          email: 'verify@example.com',
          subject: 'Automated check — safe to delete',
          message: 'Written by scripts/verify-appwrite.mjs to confirm the write path.',
          projectType: 'Verification',
          budget: 'N/A',
        },
      });
      pass(`a guest can submit an enquiry (row ${row.$id})`);
      console.log(`        Delete that row in the console when you are done.`);
    } catch (error) {
      fail(`a guest cannot submit an enquiry — ${error.message}`);
      console.log('        The table needs create permission for role "any".');
    }
  } else {
    console.log('\nSkipping the write test. Re-run with --write to send a real test');
    console.log('enquiry (it creates one row you will want to delete afterwards).');
  }

  console.log(`\n${passed} passed, ${failed} failed.\n`);
  process.exit(failed ? 1 : 0);
};

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  console.error('\nIf this is a CORS or 401 error, register a Web platform:');
  console.error('Project -> Settings -> Platforms -> Add Web App, hostname "localhost".\n');
  process.exit(1);
});
