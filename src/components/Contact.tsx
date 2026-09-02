import { useEffect, useRef, useState, FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FiMail,
  FiMapPin,
  FiSend,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiCheck,
  FiClock,
  FiMessageCircle,
} from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import { isAppwriteConfigured } from '../config';
import { submitEnquiry } from '../lib/appwrite';
import { ContactForm } from '../types';
import '../styles/Contact.css';
import TextReveal3D from './effects/TextReveal3D';

const emptyForm: ContactForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
  projectType: '',
  budget: '',
};

/**
 * A union rather than two booleans, because `isSubmitting && submitted` was
 * representable and meaningless. These four are the only real states.
 */
type SubmitStatus = 'idle' | 'sending' | 'sent' | 'error';

/** Bots fill every field they find; a human never sees this one. */
const HONEYPOT_FIELD = 'company_website';

/**
 * Anything submitted faster than this was not typed by a person. Cheap, and it
 * catches the naive scripted posts that a public create endpoint attracts.
 */
const MIN_FILL_MS = 2000;

/**
 * Builds a mailto: draft carrying the whole enquiry.
 *
 * This is the safety net that makes the form trustworthy: if Appwrite is down,
 * misconfigured, or simply not set up yet, the enquiry still reaches an inbox.
 * It needs no dependency, no key and no network of its own.
 */
const buildMailto = (email: string, form: ContactForm) => {
  const body = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    form.projectType && `Project type: ${form.projectType}`,
    form.budget && `Budget: ${form.budget}`,
    '',
    form.message,
  ]
    .filter(Boolean)
    .join('\n');
  const subject = form.subject || 'Project enquiry';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Contact Component
 *
 * A freelance enquiry form, not a generic "say hi" box. Project type and
 * budget are asked up front so the first reply can be useful instead of
 * being three emails of qualifying questions.
 */
const Contact = () => {
  const { personalInfo, services, budgetRanges } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState<ContactForm>(emptyForm);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  // Stamped on mount rather than during render — `Date.now()` is impure, and
  // reading it in the render body makes the component non-idempotent.
  const mountedAt = useRef(0);

  const isSubmitting = status === 'sending';
  const submitted = status === 'sent';

  // "Enquire about this" on a service card pre-selects that service here.
  useEffect(() => {
    mountedAt.current = Date.now();
    const handler = (event: Event) => {
      const service = (event as CustomEvent<string>).detail;
      setFormData((prev) => ({
        ...prev,
        projectType: service,
        subject: prev.subject || `${service} enquiry`,
      }));
    };
    window.addEventListener('portfolio:enquire', handler);
    return () => window.removeEventListener('portfolio:enquire', handler);
  }, []);

  const update = (field: keyof ContactForm, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const mailtoHref = buildMailto(personalInfo.email, formData);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Silently accept-and-drop: a bot that gets an error just retries, whereas
    // one that is told it succeeded goes away.
    const trapped = Boolean(honeypotRef.current?.value);
    const tooFast = Date.now() - mountedAt.current < MIN_FILL_MS;
    if (trapped || tooFast) {
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // With no Appwrite project configured, hand the enquiry to the visitor's
    // mail client rather than pretending to send it. A fresh clone of this repo
    // then has a contact form that genuinely works, with no setup at all.
    if (!isAppwriteConfigured) {
      window.location.href = mailtoHref;
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('sending');
    setErrorMessage(null);
    try {
      await submitEnquiry(formData);
      setStatus('sent');
      // Clearing only on success. Wiping someone's typed message because the
      // network failed would lose the very thing they came here to send.
      setFormData(emptyForm);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error && error.message
          ? `Couldn't send that — ${error.message}`
          : "Couldn't send that."
      );
    }
  };

  return (
    <section id="contact" className="contact" ref={ref}>
      <motion.div
        className="contact-container"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
      >
        <motion.div className="section-header">
          <span className="section-tag">Contact</span>
          <h2 className="section-title">
            <TextReveal3D>
              Let's Build <span className="highlight">Something That Works</span>
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">
            Tell me what you need and roughly what you can spend — I'll reply with whether
            I'm the right fit and what it would take.
          </p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ x: -50 }}
            animate={isInView ? { x: 0 } : {}}
          >
            <h3>Get in Touch</h3>
            <p>
              Open to freelance projects, retainers and long-term build engagements.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <FiMail />
                </div>
                <div>
                  <span className="label">Email</span>
                  <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <FiMapPin />
                </div>
                <div>
                  <span className="label">Location</span>
                  <span>{personalInfo.location}</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <FiClock />
                </div>
                <div>
                  <span className="label">Response time</span>
                  <span>Usually within 24 hours</span>
                </div>
              </div>
            </div>

            {/* WhatsApp is the fastest route for most freelance leads */}
            {personalInfo.whatsapp && (
              <a
                className="btn btn-secondary whatsapp-btn"
                href={`https://wa.me/${personalInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiMessageCircle /> Message on WhatsApp
              </a>
            )}

            <div className="contact-social">
              <span>Follow me</span>
              <div className="social-links">
                <motion.a
                  href={personalInfo.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  whileHover={{ scale: 1.2 }}
                >
                  <FiGithub />
                </motion.a>
                <motion.a
                  href={personalInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  whileHover={{ scale: 1.2 }}
                >
                  <FiLinkedin />
                </motion.a>
                <motion.a
                  href={personalInfo.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  whileHover={{ scale: 1.2 }}
                >
                  <FiTwitter />
                </motion.a>
              </div>
            </div>
          </motion.div>

          <motion.form
            ref={formRef}
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ x: 50 }}
            animate={isInView ? { x: 0 } : {}}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Qualifying fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="projectType">What do you need?</label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => update('projectType', e.target.value)}
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Something else">Something else</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="budget">Budget</label>
                <select
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => update('budget', e.target.value)}
                  required
                >
                  <option value="">Select a range</option>
                  {budgetRanges.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => update('subject', e.target.value)}
                required
                placeholder="Project discussion"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => update('message', e.target.value)}
                required
                rows={5}
                placeholder="What are you building, who is it for, and when do you need it?"
              />
            </div>

            {/* Off-screen rather than `display:none` — some bots skip hidden
                inputs but fill positioned ones. Never focusable or announced. */}
            <div className="honeypot" aria-hidden="true">
              <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
              <input
                id={HONEYPOT_FIELD}
                name={HONEYPOT_FIELD}
                type="text"
                ref={honeypotRef}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Does not auto-dismiss. A success message can vanish because the
                visitor's job is done; an error asks them to do something, so it
                stays until they do. The mailto link means the enquiry is never
                actually lost. */}
            {status === 'error' && (
              <p className="form-error" role="alert">
                {errorMessage} Your message is still here — try again, or email me
                directly at <a href={mailtoHref}>{personalInfo.email}</a>.
              </p>
            )}

            <motion.button
              type="submit"
              className={`btn btn-primary submit-btn ${submitted ? 'submitted' : ''}`}
              disabled={isSubmitting || submitted}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="spinner" />
              ) : submitted ? (
                <>
                  <FiCheck /> Sent!
                </>
              ) : status === 'error' ? (
                <>
                  <FiSend /> Try again
                </>
              ) : (
                <>
                  <FiSend /> Send Enquiry
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
