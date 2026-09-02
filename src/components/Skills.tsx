import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  SiAppwrite,
  SiClaude,
  SiDart,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTypescript,
} from 'react-icons/si';
import { usePortfolio } from '../context/PortfolioContext';
import type { Skill, SkillCategory } from '../types';
import '../styles/Skills.css';
import TextReveal3D from './effects/TextReveal3D';

/**
 * Skills Component
 *
 * The stack as labelled groups of chips rather than a filtered grid of progress
 * bars. Two reasons the bars went:
 *
 *   - A self-assessed "88%" is unverifiable, and a visitor reads it as noise at
 *     best and overclaiming at worst. The category a tool sits in is a fact; the
 *     percentage was an opinion.
 *   - With one track left, the filter had so few categories that filtering cost
 *     a click to hide information the visitor could already see at a glance.
 *
 * `level` is still carried in the data — it costs nothing and the schema is
 * shared with the admin — it is simply no longer rendered.
 */

/**
 * Brand marks, keyed by the skill's `name` in PortfolioContext.
 *
 * Anything absent falls back to a letter tile, which is deliberate: Provider,
 * Riverpod, Bloc and GetX are Flutter packages with no Simple Icons entry, and
 * inventing a generic glyph for them would read as "unknown tool" rather than
 * "no logo exists".
 */
const ICONS: Record<string, ComponentType> = {
  Flutter: SiFlutter,
  Dart: SiDart,
  React: SiReact,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  'Node.js': SiNodedotjs,
  Firebase: SiFirebase,
  Supabase: SiSupabase,
  Appwrite: SiAppwrite,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  Git: SiGit,
  Figma: SiFigma,
  'Claude / AI tooling': SiClaude,
  'Figma MCP': SiFigma,
};

/**
 * The order groups are shown in — roughly the order work moves through them,
 * app first. A category not listed here still renders; it just sorts last, so
 * adding one to the data never silently hides it.
 */
const CATEGORY_ORDER: SkillCategory[] = [
  'Mobile',
  'State Management',
  'Frontend',
  'Backend',
  'Database',
  'Tools',
  'AI',
];

/**
 * One category's chips as a continuous belt.
 *
 * The belt is the same list laid out twice and translated by exactly half its
 * width, which is what makes the loop seamless — at the moment the first copy
 * scrolls out, the second is sitting precisely where it started. The `- gap/2`
 * matters: a flex `gap` puts a gap *between* the two copies as well as inside
 * them, so a plain -50% lands half a gap short and the belt visibly stutters
 * once per cycle.
 *
 * The repeat count fills the row before that doubling happens, and has to scale
 * inversely with how many chips the category has: "Mobile" holds two, and two
 * chips laid out once are ~820px against a 1200px container, so a third of the
 * belt would be empty air with the seam parked permanently on screen. Aiming
 * for ~14 chips per copy clears the container's width with room to spare at
 * every viewport, since the container is capped at 1200px.
 */
const chipRepeats = (count: number) => Math.max(4, Math.ceil(14 / count));

/**
 * How fast a belt travels, in CSS pixels per second.
 *
 * The duration is measured rather than estimated from the chip count, because
 * chips are not a uniform width — "Git" is a third of "Claude / AI tooling".
 * Deriving it from the count made rows differ by 1.6x, which reads as rows
 * drifting apart rather than as one moving surface.
 */
const PIXELS_PER_SECOND = 45;

const StackRow = ({
  items,
  reversed,
  paused,
}: {
  items: Skill[];
  reversed: boolean;
  paused: boolean;
}) => {
  const repeats = chipRepeats(items.length);
  const belt = Array.from({ length: repeats * 2 }, () => items).flat();

  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // `scrollWidth`, not `getBoundingClientRect()`: the track is mid-transform
    // once the animation starts, and the rect would measure the transformed box.
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const distance = track.scrollWidth / 2 + gap / 2;
      setDuration(distance / PIXELS_PER_SECOND);
    };

    measure();

    // Re-measure when the row is re-laid out — a viewport change, or a webfont
    // landing after first paint and changing every chip's width.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [belt.length]);

  return (
    <div className="stack-row">
      {/* The belt repeats every name up to eight times, so it is hidden from
          assistive tech and the real list is exposed once, unduplicated. */}
      <ul className="sr-only">
        {items.map((skill) => (
          <li key={skill.name}>{skill.name}</li>
        ))}
      </ul>

      <div
        className={`stack-marquee${paused ? ' stack-marquee--still' : ''}`}
        aria-hidden="true"
      >
        <div
          ref={trackRef}
          className="stack-marquee-track"
          style={{
            animationDuration: duration ? `${duration}s` : undefined,
            animationPlayState: duration ? undefined : 'paused',
            animationDirection: reversed ? 'reverse' : 'normal',
          }}
        >
          {belt.map((skill, i) => {
            const Icon = ICONS[skill.name];
            return (
              <span className="stack-chip" key={`${skill.name}-${i}`}>
                <span className="stack-chip-icon">
                  {Icon ? <Icon /> : <span className="stack-chip-letter">{skill.name[0]}</span>}
                </span>
                <span className="stack-chip-name">{skill.name}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Skills = () => {
  const { skills } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Everything below animates on entry and on hover, so honour the OS setting
  // rather than moving 24 chips at someone who asked for stillness.
  const reduce = useReducedMotion();

  const groups = useMemo(() => {
    const byCategory = new Map<string, Skill[]>();
    for (const skill of skills) {
      const list = byCategory.get(skill.category);
      if (list) list.push(skill);
      else byCategory.set(skill.category, [skill]);
    }

    const rank = (category: string) => {
      const i = CATEGORY_ORDER.indexOf(category as SkillCategory);
      return i === -1 ? CATEGORY_ORDER.length : i;
    };

    return [...byCategory.entries()]
      .map(([category, items]) => ({ category, items }))
      .sort((a, b) => rank(a.category) - rank(b.category));
  }, [skills]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="skills" className="skills" ref={ref}>
      <motion.div
        className="skills-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="section-header" variants={itemVariants}>
          <span className="section-tag">Skills</span>
          <h2 className="section-title">
            <TextReveal3D>
              The <span className="highlight">Toolkit</span>
            </TextReveal3D>
          </h2>
          <p className="section-subtitle">
            The stack I build with, end to end.
          </p>
        </motion.div>

        <div className="stack-groups">
          {groups.map((group, groupIndex) => (
            <motion.div className="stack-group" key={group.category} variants={itemVariants}>
              {/* The label slides in from the left, so the eye is led along the
                  row it belongs to rather than dropping onto it. */}
              <motion.h3
                className="stack-label"
                initial={reduce ? false : { opacity: 0, x: -8 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: groupIndex * 0.09 }}
              >
                {group.category}
              </motion.h3>

              <StackRow
                items={group.items}
                // Alternating direction stops the rows reading as one sliding
                // block, and gives the eye a fixed point between them.
                reversed={groupIndex % 2 === 1}
                paused={reduce ?? false}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;
