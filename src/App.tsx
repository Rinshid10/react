import { useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PortfolioProvider } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Process from './components/Process';
import Experience from './components/Experience';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedCursor from './components/AnimatedCursor';
import ScrollProgress from './components/effects/ScrollProgress';
import './styles/global.css';
// Last, so the phone-breakpoint fixes win ties against component stylesheets.
import './styles/mobile.css';

// Section order, top to bottom. Also drives the scroll-spy below, so it must
// stay in sync with what is rendered.
//
// The order follows a freelance funnel rather than a CV:
//   who I am -> what you can buy -> why me -> proof -> what working together
//   looks like -> background -> social proof -> hire.
const SECTION_IDS = [
  'hero',
  'services',
  'about',
  'skills',
  'projects',
  'process',
  'experience',
  'testimonials',
  'contact',
];

const AppContent = () => {
  const { setActiveSection } = useTheme();

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const sectionId of SECTION_IDS) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  return (
    <>
      <AnimatedCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Skills />
        <Projects />
        <Process />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

// Root component with providers
const App = () => {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </ThemeProvider>
  );
};

export default App;
