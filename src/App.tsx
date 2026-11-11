import { lazy, Suspense, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PortfolioProvider } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';
import AnimatedCursor from './components/AnimatedCursor';

// Below-the-fold sections are split out of the first bundle. The hero paints
// without their code; the chunks are then fetched during the first idle
// moment (see `prefetchSections`), so by the time anyone scrolls they are
// already here. The fallbacks reserve roughly a screen each so the page
// length — and the scroll-spy that reads it — does not jump as they land.
const loaders = {
  Projects: () => import('./components/Projects'),
  Process: () => import('./components/Process'),
  Experience: () => import('./components/Experience'),
  Contact: () => import('./components/Contact'),
};
const Projects = lazy(loaders.Projects);
const Process = lazy(loaders.Process);
const Experience = lazy(loaders.Experience);
const Contact = lazy(loaders.Contact);

const prefetchSections = () => {
  const run = () => Object.values(loaders).forEach((load) => void load());
  // Safari still has no requestIdleCallback; a short timer stands in for it.
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 2000 });
  else window.setTimeout(run, 300);
};

const Placeholder = ({ id }: { id: string }) => (
  <section id={id} aria-busy="true" style={{ minHeight: '80vh' }} />
);
import ScrollProgress from './components/effects/ScrollProgress';
import SmoothScroll from './components/effects/SmoothScroll';
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

  useEffect(prefetchSections, []);

  return (
    <>
      <SmoothScroll />
      <AnimatedCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Skills />
        <Suspense fallback={<Placeholder id="projects" />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<Placeholder id="process" />}>
          <Process />
        </Suspense>
        <Suspense fallback={<Placeholder id="experience" />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<Placeholder id="contact" />}>
          <Contact />
        </Suspense>
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
