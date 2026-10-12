import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiArrowUpRight, FiArrowUp } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/Footer.css';

// Every id here must match a <section id> rendered in App.tsx.
const quickLinks = [
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' },
  { id: 'process', label: 'Process' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const Footer = () => {
  const { personalInfo } = usePortfolio();
  const year = new Date().getFullYear();

  // Same three profiles as the hero, plus email. Empty links are dropped so
  // the footer never shows an icon that goes nowhere.
  const socials = [
    { icon: FiGithub, href: personalInfo.social.github, label: 'GitHub' },
    { icon: FiLinkedin, href: personalInfo.social.linkedin, label: 'LinkedIn' },
    { icon: FiInstagram, href: personalInfo.social.instagram, label: 'Instagram' },
    { icon: FiMail, href: personalInfo.email ? `mailto:${personalInfo.email}` : '', label: 'Email' },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href));

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
            <a href="#hero" className="footer-logo" aria-label="Back to top">
              {personalInfo.name}
            </a>
            <p className="footer-tagline">
              {personalInfo.title} building fintech and business apps for Android and iOS.
            </p>
            {personalInfo.availability && (
              <span className="footer-status">
                <span className={`footer-status-dot ${personalInfo.isAvailable ? 'on' : ''}`} />
                {personalInfo.availability}
              </span>
            )}
          </div>

          <nav className="footer-section" aria-label="Footer">
            <h4>Quick Links</h4>
            <ul className="footer-nav">
              {quickLinks.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-section">
            <h4>Connect</h4>
            <div className="footer-social">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
            <p className="footer-location">{personalInfo.location}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {year} {personalInfo.name}. All rights reserved.
          </p>
          <a href="#hero" className="footer-top">
            Back to top <FiArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
