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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // "Enquire about this" on a service card pre-selects that service here.
  useEffect(() => {
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

  // TODO(real-data): wire this to EmailJS (@emailjs/browser is already a
  // dependency) or POST to the admin backend. Right now it only simulates a
  // send, so enquiries are silently lost.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData(emptyForm);
    setTimeout(() => setSubmitted(false), 3000);
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
              Open to freelance projects, retainers and build-plus-growth engagements.
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
