import { motion } from 'framer-motion';
import { FiHeart, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { SiFlutter } from 'react-icons/si';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/Footer.css';

const Footer = () => {
  const { personalInfo } = usePortfolio();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">R<span>.</span></div>
            <p>Building beautiful mobile experiences</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                {['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
                  <li key={item}><a href={`#${item.toLowerCase()}`}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer-section">
              <h4>Connect</h4>
              <div className="footer-social">
                <motion.a href={personalInfo.social.github} target="_blank" whileHover={{ scale: 1.2 }}><FiGithub /></motion.a>
                <motion.a href={personalInfo.social.linkedin} target="_blank" whileHover={{ scale: 1.2 }}><FiLinkedin /></motion.a>
                <motion.a href={personalInfo.social.twitter} target="_blank" whileHover={{ scale: 1.2 }}><FiTwitter /></motion.a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {year} {personalInfo.name}. All rights reserved.</p>
          <p className="made-with">Made with <FiHeart className="heart" /> and <SiFlutter className="flutter" /></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
