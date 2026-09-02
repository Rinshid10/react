/**
 * Palette chooser for the site's `theme` row.
 *
 * Replaces four free-text hex fields with a set of ready-made combinations.
 * Typing raw hexes is still possible — the four fields are still the schema —
 * but they are folded behind "Custom colours", because a hand-picked accent is
 * the one edit on this screen that can quietly make the live site unreadable.
 *
 * Each card previews the palette the way the site composes it: the background
 * is the page, the filled pill is an accent-filled button with its black label,
 * and the bar is the gradient the three colours produce.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiCheck, FiChevronDown, FiSliders } from 'react-icons/fi';

import { disclosure, listItem, listParent, press, SNAP } from '../motion';
import type { Field } from '../schema';
import {
  MONOCHROME,
  matchPreset,
  presetValues,
  THEME_PRESETS,
  type PresetKey,
  type ThemePreset,
} from '../themePresets';
import type { FieldValue } from '../validate';
import { FieldEditor } from './FieldEditor';
import { SectionLabel } from './ui';

interface Props {
  /** Current value of each colour column. */
  values: Partial<Record<PresetKey, FieldValue>>;

  /** The four colour fields from the schema, for the custom editor. */
  fields: readonly Field[];
  errors: Record<string, string>;

  /** Applies a whole palette in one edit. */
  onApply: (patch: Record<PresetKey, string>) => void;
  onChangeField: (key: string, value: FieldValue) => void;
}

export const ThemePicker = ({ values, fields, errors, onApply, onChangeField }: Props) => {
  const selected = matchPreset(values);
  const isCustom = selected === null;
  const [showCustom, setShowCustom] = useState(isCustom);

  return (
    <section className="panel">
      <div className="panel__head">
        <SectionLabel>Colour palette</SectionLabel>
        <span className="panel__hint">
          Applies to the site&apos;s dark mode. Light mode stays black on white.
        </span>
      </div>

      <motion.div
        className="palette"
        variants={listParent}
        initial="hidden"
        animate="show"
        role="radiogroup"
        aria-label="Colour palette"
      >
        {THEME_PRESETS.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            selected={selected?.id === preset.id}
            onSelect={() => onApply(presetValues(preset))}
          />
        ))}
      </motion.div>

      <div className="palette__foot">
        <span className="palette__state">
          {isCustom ? (
            <>
              <strong>Custom colours</strong> — not one of the sets above.
            </>
          ) : (
            <>
              <strong>{selected.name}</strong> — {selected.note}
            </>
          )}
        </span>
        {isCustom && (
          <button
            type="button"
            className="btn btn--small"
            onClick={() => onApply(presetValues(MONOCHROME))}
          >
            Reset to Monochrome
          </button>
        )}
      </div>

      <button
        type="button"
        className="disclosure-toggle"
        aria-expanded={showCustom}
        onClick={() => setShowCustom(!showCustom)}
      >
        <FiSliders aria-hidden />
        Custom colours
        <motion.span
          className="disclosure-toggle__chevron"
          animate={{ rotate: showCustom ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {showCustom && (
          <motion.div className="disclosure" {...disclosure}>
            <p className="palette__warning">
              Set these only if you know what you are doing. The accent colour is filled behind
              black text on the live site, so a dark value here makes its own label unreadable.
              Leave a field empty to fall back to the site&apos;s own value.
            </p>
            <div className="panel__fields">
              {fields.map((field) => (
                <FieldEditor
                  key={field.key}
                  field={field}
                  value={values[field.key as PresetKey]}
                  error={errors[field.key] || undefined}
                  onChange={(value) => onChangeField(field.key, value)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const PresetCard = ({
  preset,
  selected,
  onSelect,
}: {
  preset: ThemePreset;
  selected: boolean;
  onSelect: () => void;
}) => {
  // Monochrome stores nothing, so the card falls back to the site's own
  // built-in values to show what it will actually look like.
  const bg = preset.darkBackground || '#000000';
  const accent = preset.primaryColor || '#ffffff';
  const second = preset.secondaryColor || '#d6d6d6';
  const third = preset.accentColor || second;

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`preset${selected ? ' preset--on' : ''}`}
      variants={listItem}
      whileHover={{ y: -2 }}
      whileTap={press}
      onClick={onSelect}
      title={preset.note}
    >
      <span className="preset__preview" style={{ background: bg }}>
        <span className="preset__chip" style={{ background: accent }}>
          Aa
        </span>
        <span
          className="preset__bar"
          style={{ background: `linear-gradient(90deg, ${accent}, ${second}, ${third})` }}
        />
      </span>

      <span className="preset__label">
        <span className="preset__name">{preset.name}</span>
        {selected && (
          <motion.span
            className="preset__check"
            layoutId="preset-check"
            transition={SNAP}
            aria-hidden
          >
            <FiCheck />
          </motion.span>
        )}
      </span>
    </motion.button>
  );
};
