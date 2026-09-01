import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiArrowUpRight } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/Footer.css';

// Mirrors the navbar so the footer never drifts out of sync with the page.
const quickLinks = [
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' },
  { id: 'case-studies', label: 'Results' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
];

const Footer = () => {
  const { personalInfo } = usePortfolio();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Last chance to convert before the page ends. */}
        <div className="footer-cta">
          <p className="footer-cta-label">Have a project in mind?</p>
          <a className="footer-cta-link" href={`mailto:${personalInfo.email}`}>
            {personalInfo.email}
            <FiArrowUpRight />
          </a>
        </div>

        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">R<span>.</span></div>
            <p>{personalInfo.title}</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                {quickLinks.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-section">
              <h4>Connect</h4>
              <div className="footer-social">
                <motion.a
                  href={personalInfo.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  whileHover={{ scale: 1.15 }}
                >
                  <FiGithub />
                </motion.a>
                <motion.a
                  href={personalInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  whileHover={{ scale: 1.15 }}
                >
                  <FiLinkedin />
                </motion.a>
                <motion.a
                  href={personalInfo.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  whileHover={{ scale: 1.15 }}
                >
                  <FiTwitter />
                </motion.a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {year} {personalInfo.name}. All rights reserved.
          </p>
          <p className="made-with">{personalInfo.location}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
