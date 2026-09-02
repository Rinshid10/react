/**
 * Seeds the Appwrite tables with the content in seed-data.mjs.
 *
 *   node scripts/seed-appwrite.mjs           seed empty tables only
 *   node scripts/seed-appwrite.mjs --force   also seed tables that already
 *                                            have rows (adds duplicates)
 *
 * Refuses to touch a table that already has rows unless --force, because the
 * common way to run this twice is by accident, and the result is a duplicated
 * services list on a live site.
 *
 * Only ever adds. It never deletes or overwrites, so anything you have edited
 * in the console is safe.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Client, TablesDB, ID, Query } from 'node-appwrite';
import { experience, personalInfo, projects, services, skills, stats, theme } from './seed-data.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FORCE = process.argv.includes('--force');

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
  console.error('\nNeed VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID,');
  console.error('VITE_APPWRITE_DATABASE_ID and APPWRITE_API_KEY in .env.local.\n');
  process.exit(1);
}

const db = new TablesDB(
  new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY)
);

let added = 0;
let skipped = 0;
let failed = 0;

/** Singletons are read by the app at the fixed row id "main". */
const seedSingleton = async (tableId, data) => {
  try {
    await db.getRow({ databaseId: DATABASE_ID, tableId, rowId: 'main' });
    console.log(`  = ${tableId}/main already exists — left alone`);
    skipped++;
    return;
  } catch {
    // Missing, which is what we want.
  }
  try {
    await db.createRow({ databaseId: DATABASE_ID, tableId, rowId: 'main', data });
    console.log(`  + ${tableId}/main`);
    added++;
  } catch (error) {
    console.log(`  ! ${tableId}/main — ${error.message}`);
    failed++;
  }
};

const seedList = async (tableId, rows, label = (r) => r.title ?? r.label ?? r.role ?? r.name) => {
  const existing = await db.listRows({
    databaseId: DATABASE_ID,
    tableId,
    queries: [Query.limit(1)],
  });
  if (existing.total > 0 && !FORCE) {
    console.log(`  = ${tableId} already has ${existing.total} row(s) — skipped`);
    console.log(`      re-run with --force to add these on top (creates duplicates)`);
    skipped += rows.length;
    return;
  }
  for (const row of rows) {
    try {
      await db.createRow({
        databaseId: DATABASE_ID,
        tableId,
        rowId: ID.unique(),
        data: row,
      });
      console.log(`  + ${tableId}: ${label(row)}`);
      added++;
    } catch (error) {
      console.log(`  ! ${tableId}: ${label(row)} — ${error.message}`);
      failed++;
    }
  }
};

const main = async () => {
  console.log(`\nSeeding ${DATABASE_ID}${FORCE ? ' (--force)' : ''}\n`);

  await seedSingleton('personal_info', personalInfo);
  await seedSingleton('theme', theme);
  await seedList('services', services);
  await seedList('projects', projects);
  await seedList('skills', skills);
  await seedList('stats', stats);
  await seedList('experience', experience);

  console.log(`\n${added} added, ${skipped} skipped, ${failed} failed.`);

  if (failed) {
    console.log('\nSome rows failed. Nothing was deleted; fix the cause and re-run.');
    process.exit(1);
  }

  console.log('\ntestimonials were deliberately NOT seeded — their defaults are');
  console.log('invented placeholders. The site will keep showing those built-in');
  console.log('samples until you add real rows in the console.\n');
  console.log('Check it worked:  npm run appwrite:verify\n');
};

main().catch((error) => {
  console.error(`\nFailed: ${error.message}\n`);
  process.exit(1);
});
