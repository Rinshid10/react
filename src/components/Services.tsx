import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FiSmartphone,
  FiCode,
  FiZap,
  FiCheck,
  FiArrowUpRight,
  FiShield,
  FiClock,
  FiBarChart2,
  FiHeadphones,
} from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import ParallaxCarousel from './effects/ParallaxCarousel';
import TextReveal3D from './effects/TextReveal3D';
import '../styles/Services.css';

// Icon keys used in PortfolioContext -> the actual component.
const serviceIcons: Record<string, React.ComponentType> = {
  smartphone: FiSmartphone,
  code: FiCode,
  zap: FiZap,
};

const guaranteeIcons: Record<string, React.ComponentType> = {
  shield: FiShield,
  clock: FiClock,
  chart: FiBarChart2,
  headphones: FiHeadphones,
};

/**
 * Services Component
 *
 * The offer, top to bottom: an availability pill, the pitch as the headline,
 * the packages in a parallax carousel, then a row of
 * reassurances answering the objections a client has before they enquire.
 *
 * Every card puts price and timeline in a fixed footer, so a visitor can flick
 * through comparing cost without reading the copy.
 */
const Services = () => {
  const { services, guarantees, personalInfo } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });


  // Send the visitor to the contact form with this service pre-selected.
  const enquire = (title: string) => {
    window.dispatchEvent(new CustomEvent('portfolio:enquire', { detail: title }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="services" ref={ref}>
      <div className="services-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {personalInfo.isAvailable && (
            <span className="services-availability">
              <span className="availability-dot" aria-hidden="true" />
              {personalInfo.availability}
            </span>
          )}

          {/* The pitch is the headline here — it is the sentence that decides
              whether someone keeps reading. */}
          <h2 className="section-title services-title">
            <TextReveal3D>
              Hire me to <span className="highlight">design</span>, {' '}
              <span className="highlight">build</span> and ship it — one person accountable
              end to end.
            </TextReveal3D>
          </h2>

          <p className="section-subtitle">
            From idea to a live release, I help businesses build, scale and keep
            improving — all with one reliable partner.
          </p>
        </motion.div>

        <ParallaxCarousel label="Services">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon] ?? FiZap;
            return (
              <article className="service-card" key={service.id}>
                <header className="service-card-top">
                  <span className="service-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="service-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </header>

                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>

                <ul className="service-deliverables">
                  {service.deliverables.map((d) => (
                    <li key={d}>
                      <span className="deliverable-check" aria-hidden="true">
                        <FiCheck />
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                {/* Price left, CTA right — pushed to the bottom of every card so
                    the numbers line up across the rail. */}
                <footer className="service-card-foot">
                  <div className="service-pricing">
                    {service.startingPrice && (
                      <span className="service-price">{service.startingPrice}</span>
                    )}
                    {service.timeline && (
                      <span className="service-timeline">{service.timeline}</span>
                    )}
                  </div>
                  <button className="service-cta" onClick={() => enquire(service.title)}>
                    Enquire now
                    <FiArrowUpRight />
                  </button>
                </footer>
              </article>
            );
          })}
        </ParallaxCarousel>

        {/* The objections a freelance client has before they get in touch. */}
        {guarantees.length > 0 && (
          <motion.ul
            className="services-guarantees"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {guarantees.map((g) => {
              const Icon = guaranteeIcons[g.icon] ?? FiShield;
              return (
                <li key={g.title}>
                  <span className="guarantee-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="guarantee-text">
                    <strong>{g.title}</strong>
                    <span>{g.description}</span>
                  </span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </section>
  );
};

export default Services;
