# Enquiry notifier

Emails you when someone submits the contact form.

The site is static, so the browser cannot hold a mail credential without
publishing it to every visitor. This function is where the send happens instead:
Appwrite triggers it on the row-create event, it reads the recipient, and it
calls Resend. Nothing secret ever reaches the bundle.

```
visitor submits  →  row in contact_submissions  →  this function  →  Resend  →  your inbox
```

**The enquiry is already saved before this runs.** Every failure in here is
logged and swallowed, so a broken mail key can never cost you an enquiry — it
only costs you the alert. The row is in the admin panel either way.

## Setup

### 1. Get a Resend key

Sign up at [resend.com](https://resend.com) (free tier: 100 emails/day) and
create an API key. To send from your own domain you have to verify it; until
then use `onboarding@resend.dev` as the sender, which works immediately.

### 2. Create the function

Appwrite console → **Functions** → **Create function**

| Setting | Value |
| --- | --- |
| Name | `enquiry-notify` |
| Runtime | Node.js 18 or newer |
| Entrypoint | `src/main.js` |
| Build command | `npm install` |

Under **Settings → Scopes**, grant `rows.read`. That gives the function a
short-lived key at runtime so it can read your notification settings; without it
the function still works, but only from the `MAIL_TO` variable below.

### 3. Set the variables

Function → **Settings → Environment variables**. These live server-side and are
never bundled:

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | From step 1. |
| `MAIL_FROM` | yes | e.g. `Portfolio <onboarding@resend.dev>`. Must be a verified sender. |
| `MAIL_TO` | recommended | Fallback recipient, used before the settings row exists or if it is empty. |
| `APPWRITE_DATABASE_ID` | yes | Same id as `VITE_APPWRITE_DATABASE_ID` in `.env.local`. |
| `APPWRITE_API_KEY` | only if you skipped the scope in step 2 | Needs `rows.read`. |

### 4. Add the trigger

Function → **Settings → Events** → **Add event**, and pick the create event for
the `contact_submissions` table. Search the picker for `contact_submissions` and
choose the one ending in `.create` — the exact string depends on your Appwrite
version, so take whatever the picker offers rather than typing it by hand.

### 5. Deploy

From this directory, with the [Appwrite CLI](https://appwrite.io/docs/tooling/command-line/installation):

```bash
appwrite login
appwrite push functions
```

Or zip the folder's contents (`src/` and `package.json` at the top level, not
the folder itself) and upload it under **Deployments**.

### 6. Check it

Execute the function manually from the console. With no event attached it sends
nothing and instead reports what it can see:

```json
{
  "ok": true,
  "hint": "No event header: this was a manual run, so nothing was sent.",
  "resendKeySet": true,
  "mailFromSet": true,
  "recipient": "you@example.com",
  "notificationsEnabled": true
}
```

If `recipient` is `(none resolved)`, set `MAIL_TO` or fill in **Notify this
address** in the admin panel. Then submit the real form once and watch the
function's **Executions** tab.

## Changing where enquiries go

Admin panel → **Notifications**:

- **Notify this address** — overrides `MAIL_TO`, so you can redirect enquiries
  without touching the function.
- **Email me new enquiries** — off stops the emails. Enquiries are still saved
  and still appear under Enquiries.

The `settings` table is the one content table with **no public read**: it holds
an inbox address, and the project id that reaches Appwrite is public.
