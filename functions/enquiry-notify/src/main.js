/**
 * Emails you when someone submits the contact form.
 *
 * Runs as an Appwrite Function on the `contact_submissions` row-create event.
 * It exists because the site is static: the browser cannot hold a mail
 * credential without publishing it, so the send has to happen somewhere the
 * visitor cannot read. That is the whole reason this is a function and not ten
 * lines in `Contact.tsx`.
 *
 * Failure policy: this must NEVER report failure back in a way that looks like
 * the enquiry was lost. The row is already written by the time this runs — the
 * visitor has been told it was received, and they are right. So every problem
 * here is logged and swallowed, and the enquiry is still sitting in the admin
 * panel either way. An alert you did not get is bad; an enquiry you never
 * received is worse, and that cannot happen from here.
 *
 * Environment variables (set in the Appwrite console, never committed):
 *   RESEND_API_KEY   required. From resend.com/api-keys.
 *   MAIL_FROM        required. e.g. "Portfolio <onboarding@resend.dev>".
 *   MAIL_TO          fallback recipient, used when the settings row is empty.
 *   APPWRITE_API_KEY optional. Only needed if the function has no dynamic key;
 *                    scope `rows.read`, so it can read the settings row.
 */

import { Client, TablesDB } from 'node-appwrite';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'portfolio';
const SETTINGS_TABLE = 'settings';
const SETTINGS_ROW = 'main';

/** Appwrite's own injected vars, present in every function runtime. */
const ENDPOINT = process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_FUNCTION_PROJECT_ID;

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Where to send it.
 *
 * The settings row wins so the address can be changed in the admin panel
 * without redeploying; MAIL_TO is the fallback for a project that has not
 * created that row yet. `notifyEnabled: false` turns emails off without
 * clearing the address.
 */
const resolveRecipient = async ({ apiKey, log }) => {
  const fallback = process.env.MAIL_TO || '';

  if (!apiKey) {
    log('No API key available — using MAIL_TO and skipping the settings row.');
    return { to: fallback, enabled: Boolean(fallback) };
  }

  try {
    const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(apiKey);
    const row = await new TablesDB(client).getRow({
      databaseId: DATABASE_ID,
      tableId: SETTINGS_TABLE,
      rowId: SETTINGS_ROW,
    });

    // `notifyEnabled` defaults to true in the schema, so only an explicit false
    // counts as off — a missing field must not silently disable alerts.
    const enabled = row.notifyEnabled !== false;
    return { to: row.notifyEmail || fallback, enabled };
  } catch (e) {
    // A 404 here is the normal state before the settings row is created.
    log(`Settings row unavailable (${e.message}) — falling back to MAIL_TO.`);
    return { to: fallback, enabled: Boolean(fallback) };
  }
};

const buildEmail = (enquiry) => {
  const rows = [
    ['From', `${enquiry.name} <${enquiry.email}>`],
    ['Subject', enquiry.subject],
    ['Wants', enquiry.projectType],
    ['Budget', enquiry.budget],
  ].filter(([, value]) => value);

  const html = `
    <div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:600px">
      <h2 style="margin:0 0 4px;font-size:17px">New enquiry</h2>
      <p style="margin:0 0 20px;color:#71717a;font-size:13px">
        via the contact form on your portfolio
      </p>
      <table style="border-collapse:collapse;font-size:14px;margin-bottom:20px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:4px 16px 4px 0;color:#71717a;vertical-align:top">${label}</td>
            <td style="padding:4px 0">${escapeHtml(value)}</td>
          </tr>`
          )
          .join('')}
      </table>
      <div style="padding:16px;background:#f4f4f5;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
        enquiry.message
      )}</div>
    </div>`;

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    enquiry.message ?? '',
  ].join('\n');

  return { html, text };
};

export default async ({ req, res, log, error }) => {
  // Appwrite hands the function a short-lived key when the function declares
  // scopes; an explicit key is only needed when it does not.
  const apiKey = req.headers['x-appwrite-key'] || process.env.APPWRITE_API_KEY || '';
  const event = req.headers['x-appwrite-event'] || '';

  // Triggered manually from the console — report configuration rather than
  // pretending to send, so "does this work?" has an answer without a visitor.
  if (!event) {
    const { to, enabled } = await resolveRecipient({ apiKey, log });
    return res.json({
      ok: true,
      hint: 'No event header: this was a manual run, so nothing was sent.',
      resendKeySet: Boolean(process.env.RESEND_API_KEY),
      mailFromSet: Boolean(process.env.MAIL_FROM),
      recipient: to || '(none resolved)',
      notificationsEnabled: enabled,
    });
  }

  if (!event.includes('.create')) {
    log(`Ignoring event: ${event}`);
    return res.json({ ok: true, skipped: 'not a create event' });
  }

  const enquiry = req.bodyJson ?? {};
  if (!enquiry.email || !enquiry.message) {
    log('Payload has no email/message — not a contact submission. Ignoring.');
    return res.json({ ok: true, skipped: 'unrecognised payload' });
  }

  const { to, enabled } = await resolveRecipient({ apiKey, log });

  if (!enabled) {
    log('Notifications are switched off in the admin panel. Nothing sent.');
    return res.json({ ok: true, skipped: 'notifications disabled' });
  }
  if (!to) {
    error('No recipient: set MAIL_TO, or fill in Notify email in the admin panel.');
    return res.json({ ok: false, skipped: 'no recipient configured' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) {
    error('RESEND_API_KEY and MAIL_FROM must both be set on the function.');
    return res.json({ ok: false, skipped: 'mail not configured' });
  }

  const { html, text } = buildEmail(enquiry);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [to],
        subject: `New enquiry — ${enquiry.subject || 'no subject'}`,
        html,
        text,
        // So hitting reply in your mail client answers the visitor directly
        // rather than the no-reply sending address.
        reply_to: enquiry.email,
      }),
    });

    if (!response.ok) {
      error(`Resend rejected the send (${response.status}): ${await response.text()}`);
      return res.json({ ok: false, skipped: 'resend rejected' });
    }

    log(`Notified ${to} about an enquiry from ${enquiry.email}.`);
    return res.json({ ok: true });
  } catch (e) {
    // Swallowed on purpose — see the note at the top of this file.
    error(`Send failed: ${e.message}`);
    return res.json({ ok: false, skipped: 'send threw' });
  }
};
