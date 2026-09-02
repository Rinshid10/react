/**
 * Grants the admin panel write access, via an Appwrite team.
 *
 *   npm run appwrite:admin -- you@example.com
 *
 * Why a team and not an API key: the admin panel is a Flutter *web* app, so
 * anything it ships is public, exactly like the React bundle. A key in it would
 * hand full database control to anyone who opened the page. Instead the panel
 * signs a real user in, and these permissions grant write to that user's team.
 *
 * Why a team and not `users()`: that role means *any* authenticated account. If
 * signups are open on your project, a stranger could register and then edit your
 * site. Team membership is something only you can grant.
 *
 * The API key this needs is only for setup. It never reaches the browser, and
 * you should delete it from the Appwrite console once this has run.
 *
 * Re-runnable. It only ever adds permissions; public read on the content tables
 * is preserved, because the live site depends on it.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Client, Query, TablesDB, Teams, Users } from 'node-appwrite';
import { ADMIN_TEAM_ID, TABLES } from './schema.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ADMIN_EMAIL = process.argv.slice(2).find((a) => a.includes('@'));

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
const API_KEY = env.APPWRITE_API_KEY;

if (!ENDPOINT || !PROJECT_ID || !DATABASE_ID || !API_KEY) {
  console.error('\nNeed all four values in .env.local, including APPWRITE_API_KEY.\n');
  process.exit(1);
}

const SCOPES = 'tables.write, teams.read, teams.write, users.read';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const db = new TablesDB(client);
const teams = new Teams(client);
const users = new Users(client);

/** An Appwrite API key carries a fixed allow-list of scopes, set when created. */
const isScopeError = (error) => /missing scope/i.test(error.message ?? '');

/** Console steps that do not need any API key at all. */
const manualTeamSteps = () => {
  console.log('');
  console.log('  Do these two in the Appwrite console instead — no key needed:');
  console.log('');
  console.log('    a) Auth > Teams > Create team');
  console.log(`         Team ID:   ${ADMIN_TEAM_ID}      <- must be exactly this`);
  console.log('         Name:      Site admins');
  console.log('');
  console.log(`    b) Open that team > Members > Create membership, and add`);
  console.log(`       ${ADMIN_EMAIL ?? 'your admin account'}`);
  console.log('');
  console.log('  Or widen the key at Overview > API Keys and re-run this script:');
  console.log(`      ${SCOPES}`);
};

const main = async () => {
  console.log('\nAdmin access setup\n');

  // 1. The team ------------------------------------------------------------
  //
  // Deliberately not fatal. Creating a team needs teams.write, but updating
  // table permissions only needs tables.write — and that is the tedious part
  // worth automating. A key that cannot do step 1 can still do step 2, so a
  // scope error here degrades to instructions rather than aborting the run.
  let teamReady = false;
  let teamBlocked = false;
  try {
    const team = await teams.get({ teamId: ADMIN_TEAM_ID });
    console.log(`  = team "${team.name}" (${ADMIN_TEAM_ID}) already exists`);
    teamReady = true;
  } catch (getError) {
    try {
      await teams.create({ teamId: ADMIN_TEAM_ID, name: 'Site admins' });
      console.log(`  + created team "${ADMIN_TEAM_ID}"`);
      teamReady = true;
    } catch (error) {
      if (isScopeError(error) || isScopeError(getError)) {
        console.log('  ~ this key cannot manage teams (no teams.write scope)');
        teamBlocked = true;
      } else {
        console.log(`  ! could not create team — ${error.message}`);
        teamBlocked = true;
      }
    }
  }

  // 2. Table permissions ---------------------------------------------------
  console.log('');
  let failed = 0;
  for (const table of TABLES) {
    try {
      await db.updateTable({
        databaseId: DATABASE_ID,
        tableId: table.id,
        name: table.name,
        permissions: table.permissions,
        // Row security off: a per-row permission could otherwise override the
        // table rule, which on contact_submissions is exactly how enquiries end
        // up publicly readable.
        rowSecurity: false,
      });
      const summary = table.permissions
        .map((p) => p.replace(`"team:${ADMIN_TEAM_ID}"`, 'admins'))
        .join(' ');
      console.log(`  + ${table.id.padEnd(20)} ${summary}`);
    } catch (error) {
      console.log(`  ! ${table.id} — ${error.message}`);
      if (isScopeError(error)) {
        console.log('');
        console.log('  The key lacks tables.write, which this step cannot work');
        console.log('  around. Add it at Overview > API Keys and re-run.\n');
        process.exit(1);
      }
      // Appwrite rejects a permission naming a team that does not exist.
      if (/team/i.test(error.message ?? '') && teamBlocked) {
        console.log('');
        console.log(`  The "${ADMIN_TEAM_ID}" team has to exist before the tables can`);
        console.log('  reference it.');
        manualTeamSteps();
        process.exit(1);
      }
      failed++;
    }
  }

  // 3. Membership ----------------------------------------------------------
  console.log('');
  let membershipDone = false;

  if (!ADMIN_EMAIL) {
    console.log('  No email given, so nobody was added to the team.');
    console.log('  Re-run as: npm run appwrite:admin -- you@example.com');
  } else if (teamBlocked) {
    console.log('  Skipping membership — this key cannot manage teams.');
  } else {
    let user;
    let lookupBlocked = false;
    try {
      const found = await users.list({ queries: [Query.equal('email', ADMIN_EMAIL)] });
      user = found.users[0];
    } catch (error) {
      lookupBlocked = isScopeError(error);
      console.log(
        lookupBlocked
          ? '  ~ this key cannot search users (no users.read scope)'
          : `  ! could not search users — ${error.message}`
      );
    }

    if (!user && !lookupBlocked) {
      console.log(`  ! no account found for ${ADMIN_EMAIL}`);
      console.log('');
      console.log('  Create it first, so you choose the password and it never');
      console.log('  passes through anything else:');
      console.log('      Appwrite console > Auth > Users > Create user');
      console.log(`      email: ${ADMIN_EMAIL}`);
      console.log('  Then run this again with the same address.');
    } else if (user) {
      try {
        const members = await teams.listMemberships({ teamId: ADMIN_TEAM_ID });
        if (members.memberships.some((m) => m.userId === user.$id)) {
          console.log(`  = ${ADMIN_EMAIL} is already in the team`);
        } else {
          await teams.createMembership({
            teamId: ADMIN_TEAM_ID,
            roles: ['owner'],
            userId: user.$id,
          });
          console.log(`  + added ${ADMIN_EMAIL} to the team`);
        }
        membershipDone = true;
      } catch (error) {
        console.log(`  ! could not add member — ${error.message}`);
      }
    }
  }

  // 4. What is left --------------------------------------------------------
  console.log('');
  if (teamReady && membershipDone && !failed) {
    console.log('Done. Sign in to the panel with that email and password:');
    console.log('    cd admin');
    console.log('    flutter run -d chrome');
  } else if (teamBlocked) {
    console.log('Table permissions are set. Two steps left, both in the console:');
    manualTeamSteps();
    console.log('  Nothing else needs the API key after that — the panel signs');
    console.log('  in as you and never sees it.');
  } else {
    console.log('Some steps did not complete. This script is re-runnable —');
    console.log('fix the cause above and run it again.');
  }

  console.log('');
  console.log('Public read on the content tables is unchanged, so the live site');
  console.log('is unaffected.\n');

  if (failed) process.exit(1);
};

main().catch((error) => {
  console.error(`\nFailed: ${error.message}\n`);
  process.exit(1);
});
