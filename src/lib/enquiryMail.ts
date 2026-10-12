import type { ContactForm } from '../types';

/**
 * Emails a contact-form enquiry to the owner's inbox via Web3Forms
 * (https://web3forms.com).
 *
 * The site is static, so it cannot hold an SMTP password or a private API key.
 * A Web3Forms access key is different: it is public by design (it only says
 * "deliver to the inbox this key was created for"), so it is safe in the
 * bundle. Unlike FormSubmit it is not tied to one website address, so the same
 * key works on localhost, a Vercel URL and a custom domain with no
 * re-activation.
 *
 * Get a key: web3forms.com → enter rinshidch10@gmail.com → "Create Access
 * Key" → the key arrives by email. Put it in WEB3FORMS_ACCESS_KEY below, or set
 * VITE_WEB3FORMS_KEY in the host's environment variables.
 */
const WEB3FORMS_ACCESS_KEY = 'd5ff2588-e8de-46c4-93af-fb382d6fe20f';

const accessKey = () =>
  (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim() || WEB3FORMS_ACCESS_KEY;

export const isEnquiryMailConfigured = () => Boolean(accessKey());

export const sendEnquiryEmail = async (form: ContactForm): Promise<void> => {
  const key = accessKey();
  if (!key) throw new Error('Enquiry email is not configured (no Web3Forms access key).');

  const subject = form.subject?.trim() || 'Enquiry';

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: key,
      subject: `New enquiry: ${subject} — ${form.name}`,
      from_name: 'Portfolio contact form',
      // Gmail's "Reply" goes to the visitor.
      replyto: form.email,
      // Each field below becomes a labelled row in the email.
      Name: form.name,
      Email: form.email,
      Subject: subject,
      Message: form.message,
    }),
  });

  const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || `Mail service responded ${res.status}`);
  }
};
