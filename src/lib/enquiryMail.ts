import type { ContactForm } from '../types';

/**
 * Emails a contact-form enquiry straight to the owner's inbox via FormSubmit
 * (https://formsubmit.co).
 *
 * Why FormSubmit: the site is static, so it cannot hold an SMTP password or a
 * mail-API key without publishing it to every visitor. FormSubmit's AJAX
 * endpoint needs neither — the recipient address is the only configuration.
 *
 * One-time activation: the very first submission to a new address does not
 * deliver the enquiry. FormSubmit instead emails that address an "Activate
 * Form" link; after it is clicked once, every later submission arrives as a
 * normal email. The visitor-facing request still succeeds either way.
 *
 * Set VITE_ENQUIRY_EMAIL to send somewhere other than the profile email, or to
 * the random alias FormSubmit offers after activation, which keeps the real
 * address out of the page source.
 */
export const enquiryRecipient = (fallback: string) =>
  (import.meta.env.VITE_ENQUIRY_EMAIL as string | undefined)?.trim() || fallback;

export const sendEnquiryEmail = async (form: ContactForm, to: string): Promise<void> => {
  const subject = form.subject?.trim() || `${form.projectType || 'Project'} enquiry`;

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      // Field names become the row labels in the email.
      Name: form.name,
      Email: form.email,
      'Project type': form.projectType || '—',
      Budget: form.budget || '—',
      Subject: subject,
      Message: form.message,
      // FormSubmit controls (underscore-prefixed, not shown in the email).
      _subject: `New enquiry: ${subject} — ${form.name}`,
      _replyto: form.email, // "Reply" in Gmail goes to the visitor
      _template: 'table',
      _captcha: 'false', // the form has its own honeypot and timing check
    }),
  });

  // FormSubmit answers 200 with { success: "false" } for some failures, so the
  // body is checked as well as the status.
  const data = (await res.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
  const ok = res.ok && data != null && String(data.success) === 'true';
  if (!ok) {
    throw new Error(data?.message || `Mail service responded ${res.status}`);
  }
};
