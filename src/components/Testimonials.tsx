import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/Testimonials.css';
import TextReveal3D from './effects/TextReveal3D';

/**
 * Testimonials Component
 *
 * Social proof placed immediately before the contact form — the last thing a
 * visitor reads before deciding whether to message.
 *
 * NOTE: the default quotes in PortfolioContext are clearly-labelled samples.
 * Publishing invented testimonials as real is both dishonest and easy to
 * catch, so either replace them with genuine client quotes or delete this
 * section from App.tsx until you have at least one.
 */
const Testimonials = () => {
  const { testimonials } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (!testimonials.length) return null;

  // First letter of the client name, used as an avatar fallback.
  const initial = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

  return (
    <section id="testimonials" className="testimonials" ref={ref}>
      <div className="testimonials-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">
            <TextReveal3D>
              What Clients <span className="highlight">Say</span>
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">
            Feedback from the founders and teams I have worked with.
          </p>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.id}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <span className="testimonial-mark" aria-hidden="true">
                &ldquo;
              </span>

              {t.rating ? (
                <div className="testimonial-rating" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} />
                  ))}
                </div>
              ) : null}

              <blockquote className="testimonial-quote">{t.quote}</blockquote>

              <figcaption className="testimonial-author">
                {t.avatar ? (
                  <img src={t.avatar} alt="" className="testimonial-avatar" loading="lazy" />
                ) : (
                  <span className="testimonial-avatar fallback">{initial(t.name)}</span>
                )}
                <span className="testimonial-identity">
                  <strong>{t.name}</strong>
                  <span>
                    {t.role} · {t.company}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
