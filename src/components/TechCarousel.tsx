import { useRef, useEffect } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import '../styles/TechCarousel.css';

/**
 * TechCarousel Component
 * Displays a 3D rotating carousel of technology icons
 * Creates an engaging visual effect on the hero section
 */
const TechCarousel = () => {
  const { techIcons } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);

  // Calculate positions for 3D carousel effect
  const radius = 180; // Distance from center
  const iconCount = techIcons.length;

  // Continuous rotation animation using requestAnimationFrame
  useAnimationFrame((time) => {
    angleRef.current = (time / 50) % 360; // Slow rotation
    if (containerRef.current) {
      const icons = containerRef.current.querySelectorAll('.tech-icon-wrapper');
      icons.forEach((icon, index) => {
        const angle = (360 / iconCount) * index + angleRef.current;
        const radian = (angle * Math.PI) / 180;

        // Calculate 3D position
        const x = Math.sin(radian) * radius;
        const z = Math.cos(radian) * radius;
        const scale = (z + radius) / (2 * radius) * 0.5 + 0.5; // Scale based on depth
        const opacity = (z + radius) / (2 * radius) * 0.7 + 0.3; // Opacity based on depth

        (icon as HTMLElement).style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        (icon as HTMLElement).style.opacity = `${opacity}`;
        (icon as HTMLElement).style.zIndex = `${Math.round(z + radius)}`;
      });
    }
  });

  return (
    <div className="tech-carousel-container">
      {/* Decorative glow effect */}
      <div className="carousel-glow" />

      {/* 3D Carousel */}
      <div className="tech-carousel" ref={containerRef}>
        {techIcons.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={tech.name}
              className="tech-icon-wrapper"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div
                className="tech-icon-card"
                style={{ '--icon-color': tech.color } as React.CSSProperties}
              >
                <Icon className="tech-icon" style={{ color: tech.color }} />
                <span className="tech-icon-name">{tech.name}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Center decoration */}
      <div className="carousel-center">
        <motion.div
          className="center-ring"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="center-ring ring-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
};

export default TechCarousel;
