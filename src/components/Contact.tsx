import { useRef, useState, FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin, FiTwitter, FiCheck } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import { ContactForm } from '../types';
import '../styles/Contact.css';

const Contact = () => {
  const { personalInfo } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState<ContactForm>({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
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
          <h2 className="section-title">Let's Work <span className="highlight">Together</span></h2>
          <p className="section-subtitle">Have a project in mind? Let's discuss!</p>
        </motion.div>

        <div className="contact-content">
          <motion.div className="contact-info" initial={{ x: -50 }} animate={isInView ? { x: 0 } : {}}>
            <h3>Get in Touch</h3>
            <p>I'm always open to discussing new projects and opportunities.</p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon"><FiMail /></div>
                <div>
                  <span className="label">Email</span>
                  <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><FiMapPin /></div>
                <div>
                  <span className="label">Location</span>
                  <span>{personalInfo.location}</span>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <span>Follow me</span>
              <div className="social-links">
                <motion.a href={personalInfo.social.github} target="_blank" whileHover={{ scale: 1.2 }}><FiGithub /></motion.a>
                <motion.a href={personalInfo.social.linkedin} target="_blank" whileHover={{ scale: 1.2 }}><FiLinkedin /></motion.a>
                <motion.a href={personalInfo.social.twitter} target="_blank" whileHover={{ scale: 1.2 }}><FiTwitter /></motion.a>
              </div>
            </div>
          </motion.div>

          <motion.form className="contact-form" onSubmit={handleSubmit} initial={{ x: 50 }} animate={isInView ? { x: 0 } : {}}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="your@email.com" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required placeholder="Project discussion" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={5} placeholder="Tell me about your project..." />
            </div>
            <motion.button type="submit" className={`btn btn-primary submit-btn ${submitted ? 'submitted' : ''}`} disabled={isSubmitting || submitted} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {isSubmitting ? <span className="spinner" /> : submitted ? <><FiCheck /> Sent!</> : <><FiSend /> Send Message</>}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
