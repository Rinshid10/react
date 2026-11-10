import { useEffect, useRef, useState, FormEvent } from 'react';
import type { ComponentType } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  FiMail,
  FiMapPin,
  FiSend,
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiClock,
  FiUser,
  FiTag,
  FiMessageSquare,
  FiMessageCircle,
} from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import { isAppwriteConfigured } from '../config';
import { submitEnquiry } from '../lib/appwrite';
import { isEnquiryMailConfigured, sendEnquiryEmail } from '../lib/enquiryMail';
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

const EASE = [0.22, 1, 0.36, 1] as const;

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
 * The paper plane and its looping trail. The trail draws itself when the
 * section comes into view, then the plane keeps drifting on a slow loop so
 * the corner never goes fully still.
 */
const PaperPlane = ({ play, reduce }: { play: boolean; reduce: boolean }) => (
  <motion.div
    className="contact-plane"
    aria-hidden="true"
    initial={{ opacity: 0, x: -24, y: 16 }}
    animate={play ? { opacity: 1, x: 0, y: 0 } : {}}
    transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
  >
    <svg viewBox="0 0 200 170" fill="none">
      {/* The loop of the trail, dashed, drawn on entry. */}
      <motion.path
        d="M120 92 C 70 160, -10 150, 14 110 C 38 72, 110 70, 132 60"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 7"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={play ? { pathLength: 1, opacity: 0.85 } : {}}
        transition={{ duration: reduce ? 0 : 1.4, delay: 0.5, ease: 'easeInOut' }}
      />
      <motion.g
        animate={reduce ? {} : { y: [0, -7, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '150px 55px' }}
      >
        {/* Upper wing */}
        <path d="M198 2 L68 62 L112 78 Z" fill="currentColor" opacity="0.95" />
        {/* Lower wing, a shade darker so the fold reads */}
        <path d="M198 2 L112 78 L118 112 Z" fill="currentColor" opacity="0.55" />
        {/* The fold line */}
        <path d="M198 2 L112 78" stroke="var(--color-bg-secondary)" strokeWidth="1.5" />
        {/* Tail flap */}
        <path d="M112 78 L96 100 L118 112 Z" fill="currentColor" opacity="0.35" />
      </motion.g>
    </svg>
  </motion.div>
);

/** One of the three info cards: round icon, small label, the value. */
const InfoCard = ({
  Icon,
  label,
  children,
  delay,
  play,
}: {
  Icon: ComponentType;
  label: string;
  children: React.ReactNode;
  delay: number;
  play: boolean;
}) => (
  <motion.div
    className="contact-item"
    initial={{ opacity: 0, y: 18 }}
    animate={play ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.55, delay, ease: EASE }}
    whileHover={{ y: -3 }}
  >
    <span className="contact-icon">
      <Icon />
    </span>
    <span className="contact-item-text">
      <span className="label">{label}</span>
      {children}
    </span>
  </motion.div>
);

/**
 * Contact Component
 *
 * A freelance enquiry form, not a generic "say hi" box. Two columns under a
 * centred header: on the left, how to reach me (email, hours, location, the
 * socials) with a paper plane looping overhead; on the right, the message
 * card with icon-led fields and one wide send button. A hairline divides
 * the two, and the whole band sits on soft curved shapes and dot grids so
 * the dark surface has depth without colour.
 */
const Contact = () => {
  const { personalInfo } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reduce = useReducedMotion() ?? false;
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

    // Nothing configured to deliver to: hand the enquiry to the visitor's own
    // mail app, prefilled, rather than showing an error.
    if (!isEnquiryMailConfigured() && !isAppwriteConfigured) {
      window.location.href = mailtoHref;
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    setStatus('sending');
    setErrorMessage(null);

    // Two independent deliveries, run side by side:
    //   1. email straight to the inbox (Web3Forms) — the one that matters
    //   2. a row in Appwrite, when it is configured — a searchable backup
    // The enquiry counts as sent if either lands, so a paused Appwrite project
    // or a mail-service hiccup alone never loses a lead.
    const deliveries: Promise<void>[] = [];
    if (isEnquiryMailConfigured()) deliveries.push(sendEnquiryEmail(formData));
    if (isAppwriteConfigured) deliveries.push(submitEnquiry(formData));

    const results = await Promise.allSettled(deliveries);
    const delivered = results.some((r) => r.status === 'fulfilled');

    if (delivered) {
      setStatus('sent');
      // Clearing only on success. Wiping someone's typed message because the
      // network failed would lose the very thing they came here to send.
      setFormData(emptyForm);
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    // The services' own error text ("This form needs Activation…", Appwrite
    // permission errors) is meant for the site owner, not a visitor, so it goes
    // to the console and the visitor gets a plain message with a way through.
    results.forEach((r) => {
      if (r.status === 'rejected') console.warn('[enquiry] delivery failed:', r.reason);
    });
    setStatus('error');
    setErrorMessage("Sorry, the message couldn't be sent right now.");
  };

  const at = (i: number) => (reduce ? 0 : 0.2 + i * 0.1);

  const socials = [
    { href: personalInfo.social.github, label: 'GitHub', Icon: FiGithub },
    { href: personalInfo.social.linkedin, label: 'LinkedIn', Icon: FiLinkedin },
    { href: personalInfo.social.instagram, label: 'Instagram', Icon: FiInstagram },
  ].filter((s) => s.href);

  const buttonLabel =
    status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : status === 'error' ? 'Try again' : 'Send Enquiry';

  return (
    <section id="contact" className="contact" ref={ref}>
      {/* Backdrop: two big curved shapes and two dot grids, all decorative. */}
      <div className="contact-backdrop" aria-hidden="true">
        <span className="contact-arc contact-arc--tl" />
        <span className="contact-arc contact-arc--br" />
        <span className="contact-dots contact-dots--tl" />
        <span className="contact-dots contact-dots--br" />
      </div>

      <div className="contact-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Contact</span>
          <h2 className="section-title">
            <TextReveal3D>
              Let's Build <span className="highlight">Something That Works</span>
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">
            Tell me what you need and I'll get back to you as soon as possible — I'll reply
            with whether I'm the right fit and what it would take.
          </p>
          <motion.span
            className="contact-rule"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          />
        </motion.div>

        <div className="contact-content">
          {/* --- Get in touch ---------------------------------------------- */}
          <div className="contact-info">
            <PaperPlane play={isInView} reduce={reduce} />

            <motion.h3
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: at(0), ease: EASE }}
            >
              Get in Touch
            </motion.h3>
            <motion.p
              className="contact-intro"
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: at(1), ease: EASE }}
            >
              Open to freelance projects, retainers and long-term collaborations.
            </motion.p>

            <div className="contact-details">
              <InfoCard Icon={FiMail} label="Email" delay={at(2)} play={isInView}>
                <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
              </InfoCard>
              {personalInfo.hours && (
                <InfoCard Icon={FiClock} label="Hours" delay={at(3)} play={isInView}>
                  <span>{personalInfo.hours}</span>
                </InfoCard>
              )}
              <InfoCard Icon={FiMapPin} label="Location" delay={at(4)} play={isInView}>
                <span>{personalInfo.location}</span>
              </InfoCard>
            </div>

            {/* WhatsApp is the fastest route for most freelance leads */}
            {personalInfo.whatsapp && (
              <motion.a
                className="btn btn-secondary whatsapp-btn"
                href={`https://wa.me/${personalInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: at(5), ease: EASE }}
              >
                <FiMessageCircle /> Message on WhatsApp
              </motion.a>
            )}

            <motion.div
              className="contact-social"
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: at(5), ease: EASE }}
            >
              <span className="contact-social-label">
                Follow me <span className="contact-social-line" aria-hidden="true" />
              </span>
              <div className="social-links">
                {socials.map(({ href, label, Icon }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: at(6) + i * 0.08 }}
                    whileHover={reduce ? undefined : { y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* --- Send a message -------------------------------------------- */}
          <motion.form
            ref={formRef}
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: at(1), ease: EASE }}
          >
            <div className="contact-form-head">
              <motion.span
                className="contact-form-icon"
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: at(2) }}
              >
                <FiMail />
              </motion.span>
              <div>
                <h3>Send a Message</h3>
                <p>Have a question or a project in mind? Let's talk.</p>
              </div>
            </div>

            <div className="form-row">
              <label className="field" htmlFor="name">
                <FiUser className="field-icon" aria-hidden="true" />
                <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  required
                  placeholder="Your name"
                  aria-label="Your name"
                />
              </label>
              <label className="field" htmlFor="email">
                <FiMail className="field-icon" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                  placeholder="Your email"
                  aria-label="Your email"
                />
              </label>
            </div>

            <label className="field" htmlFor="subject">
              <FiTag className="field-icon" aria-hidden="true" />
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => update('subject', e.target.value)}
                required
                placeholder="Subject"
                aria-label="Subject"
              />
            </label>

            <label className="field field--area" htmlFor="message">
              <FiMessageSquare className="field-icon" aria-hidden="true" />
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => update('message', e.target.value)}
                required
                rows={4}
                placeholder="Your message..."
                aria-label="Your message"
              />
            </label>

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
            <AnimatePresence>
              {status === 'error' && (
                <motion.p
                  className="form-error"
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {errorMessage} Your message is still here — try again, or email me
                  directly at <a href={mailtoHref}>{personalInfo.email}</a>.
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className={`btn btn-primary submit-btn is-${status}`}
              disabled={isSubmitting || submitted}
              whileHover={reduce || isSubmitting || submitted ? undefined : { scale: 1.01 }}
              whileTap={reduce ? undefined : { scale: 0.985 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  className="submit-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {status === 'sending' ? (
                    <motion.span
                      className="submit-plane"
                      animate={reduce ? {} : { x: [0, 8, 0], y: [0, -5, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <FiSend />
                    </motion.span>
                  ) : (
                    <FiSend className="submit-plane" />
                  )}
                  {buttonLabel}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
