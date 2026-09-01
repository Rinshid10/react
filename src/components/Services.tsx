import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FiSmartphone,
  FiCode,
  FiSearch,
  FiTarget,
  FiShare2,
  FiZap,
  FiCheck,
  FiArrowUpRight,
} from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import { Track } from '../types';
import ScrollMask from './effects/ScrollMask';
import '../styles/Services.css';
import TextReveal3D from './effects/TextReveal3D';

// Icon keys used in PortfolioContext -> the actual component.
const iconMap: Record<string, React.ComponentType> = {
  smartphone: FiSmartphone,
  code: FiCode,
  search: FiSearch,
  target: FiTarget,
  share: FiShare2,
  zap: FiZap,
};

type Filter = 'All' | Track;

/**
 * Services Component
 *
 * An editorial index rather than a grid of boxed cards: each service is a row
 * — number, title, what you get, what it costs — separated by hairlines. Six
 * bordered cards competed with each other for attention and read nothing like
 * the rest of the site; a numbered list scans top to bottom, and the price
 * column lets someone rule themselves in or out without reading a word of the
 * copy.
 *
 * Each row ends in a CTA that pre-fills the contact form with that service.
 */
const Services = () => {
  const { services } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [filter, setFilter] = useState<Filter>('All');

  const filters: Filter[] = ['All', 'Development', 'Marketing'];
  const visible = filter === 'All' ? services : services.filter((s) => s.track === filter);

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
          <span className="section-tag">Services</span>
          <h2 className="section-title">
            <TextReveal3D>
              What I Can <span className="highlight">Build &amp; Grow</span> For You
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">
            Hire me for the build, the growth, or both — one person accountable end to end.
          </p>
        </motion.div>

        {/* Track filter — text tabs with an underline, matching the navbar
            rather than the filled pills this section used to have. */}
        <motion.div
          className="services-filters"
          role="tablist"
          aria-label="Filter services by track"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`service-filter ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className="service-filter-count">
                {f === 'All' ? services.length : services.filter((s) => s.track === f).length}
              </span>
              {filter === f && (
                <motion.span className="service-filter-underline" layoutId="serviceFilter" />
              )}
            </button>
          ))}
        </motion.div>

        <ScrollMask fade={7}>
          <ul className="services-list">
            {visible.map((service, index) => {
              const Icon = iconMap[service.icon] ?? FiZap;
              return (
                <motion.li
                  key={service.id}
                  className="service-row"
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                >
                  <span className="service-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="service-main">
                    <div className="service-eyebrow">
                      <span className="service-icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <span className={`service-track track-${service.track.toLowerCase()}`}>
                        {service.track}
                      </span>
                    </div>

                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>

                    <ul className="service-deliverables">
                      {service.deliverables.map((d) => (
                        <li key={d}>
                          <FiCheck className="deliverable-check" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-aside">
                    {service.startingPrice && (
                      <span className="service-price">{service.startingPrice}</span>
                    )}
                    {service.timeline && (
                      <span className="service-timeline">{service.timeline}</span>
                    )}
                    <button className="service-cta" onClick={() => enquire(service.title)}>
                      Enquire
                      <FiArrowUpRight />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </ScrollMask>
      </div>
    </section>
  );
};

export default Services;
