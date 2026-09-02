/**
 * One generic form, driven entirely by the table's field list in schema.ts.
 *
 * It handles both single-row tables (Profile, Theme) and rows of a list table,
 * which is why there are no per-table edit screens.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiCheck, FiInfo } from 'react-icons/fi';

import { createRow, describeError, saveSingleton, updateRow } from '../lib/api';
import { banner, fadeUp, fieldItem, fieldParent, press } from '../motion';
import type { TableDef } from '../schema';
import { PRESET_KEYS } from '../themePresets';
import { useUnsaved } from '../unsaved';
import { validateField, type FieldValue } from '../validate';
import { FieldEditor } from './FieldEditor';
import { ThemePicker } from './ThemePicker';
import { NoticeBanner, PageHeader, SectionLabel, Spinner } from './ui';

interface Props {
  table: TableDef;

  /** Null for a new row. Ignored for singletons, which always use `main`. */
  rowId?: string | null;
  initial?: Record<string, unknown> | null;

  /** Singletons render inside the shell, so they get no back button. */
  embedded?: boolean;
  onDone?: (changed: boolean) => void;
  onToast?: (message: string) => void;
}

export const RecordEdit = ({
  table,
  rowId = null,
  initial,
  embedded = false,
  onDone,
  onToast,
}: Props) => {
  // A new row starts from the schema's defaults; an existing one is left
  // exactly as stored, so opening and saving a record never silently rewrites a
  // column someone had deliberately left empty.
  const [data, setData] = useState<Record<string, FieldValue>>(() => {
    const seed: Record<string, FieldValue> = {};
    if (!initial) {
      for (const field of table.fields) {
        if (field.defaultValue !== undefined) seed[field.key] = field.defaultValue;
      }
    }
    return { ...seed, ...(initial ?? {}) } as Record<string, FieldValue>;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNew = rowId === null && !table.singleton;

  // Published so the sidebar can ask before navigating away, and cleared on
  // unmount so a closed editor never blocks the next click.
  const unsaved = useUnsaved();
  useEffect(() => {
    unsaved.current = dirty;
    return () => {
      unsaved.current = false;
    };
  }, [dirty, unsaved]);

  // Covers the browser's own exits — reload, close, back — which no in-app
  // guard can intercept.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  // The tick on the save button holds for a beat, then reverts. A singleton
  // stays on screen after saving, so without it there is no evidence at all
  // that the click did anything.
  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 1800);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const set = (key: string, value: FieldValue) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    // Clear a field's error as soon as it is touched; re-validated on save.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev));
  };

  /** Several columns at once — a theme preset writes all four together. */
  const setMany = (patch: Record<string, FieldValue>) => {
    setData((prev) => ({ ...prev, ...patch }));
    setDirty(true);
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  };

  /**
   * Drops empty values rather than sending them.
   *
   * Sending `''` for an optional column is not the same as omitting it: the
   * site treats empty strings as present, so a blanked field would render as an
   * empty element rather than falling back to its default.
   */
  const payload = () => {
    const out: Record<string, unknown> = {};
    for (const field of table.fields) {
      const value = data[field.key];
      if (value === null || value === undefined) continue;
      if (typeof value === 'string' && value.trim() === '') continue;
      if (Array.isArray(value) && value.length === 0) continue;
      out[field.key] = typeof value === 'string' ? value.trim() : value;
    }
    return out;
  };

  const save = async () => {
    const found: Record<string, string> = {};
    for (const field of table.fields) {
      const message = validateField(field, data[field.key]);
      if (message) found[field.key] = message;
    }
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setError('Some fields need attention — see the messages below.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (table.singleton) {
        await saveSingleton(table.id, payload());
      } else if (isNew) {
        await createRow(table.id, payload());
      } else {
        await updateRow(table.id, rowId!, payload());
      }
      setDirty(false);
      setSaved(true);
      onToast?.('Saved. The live site picks this up on next load.');
      // Singletons stay open — you usually keep editing. List rows pop back.
      if (!table.singleton) onDone?.(true);
    } catch (err) {
      // Kept on screen rather than shown in a toast: a failed save means
      // unsaved work, and the message says which column Appwrite rejected.
      setError(describeError(err));
    } finally {
      setSaving(false);
    }
  };

  const title = table.singleton
    ? table.label
    : isNew
      ? `New ${table.label.toLowerCase()}`
      : `Edit ${table.label.toLowerCase()}`;

  const subtitle = table.singleton
    ? 'A single record — edits here replace what the site shows.'
    : isNew
      ? 'Fields marked * are required.'
      : `Editing an existing entry in ${table.label.toLowerCase()}.`;

  const isTheme = table.id === 'theme';

  // On the theme table the four colour columns are owned by the palette picker,
  // so they are lifted out of the plain field list and rendered by it.
  const { paletteFields, plainFields } = useMemo(() => {
    if (!isTheme) return { paletteFields: [], plainFields: table.fields };
    const keys = PRESET_KEYS as readonly string[];
    return {
      paletteFields: table.fields.filter((f) => keys.includes(f.key)),
      plainFields: table.fields.filter((f) => !keys.includes(f.key)),
    };
  }, [isTheme, table.fields]);

  return (
    <div className="screen">
      <PageHeader
        title={title}
        subtitle={subtitle}
        leading={
          embedded ? undefined : (
            <motion.button
              type="button"
              className="btn btn--icon"
              onClick={() => onDone?.(false)}
              aria-label="Back"
              title="Back"
              whileHover={{ x: -2 }}
              whileTap={press}
            >
              <FiArrowLeft />
            </motion.button>
          )
        }
        actions={
          <>
            <AnimatePresence>
              {dirty && !saving && (
                <motion.span
                  className="pill pill--warn"
                  initial={{ opacity: 0, scale: 0.9, x: 6 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 6 }}
                  transition={{ duration: 0.16 }}
                >
                  <motion.i
                    className="pill__dot"
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                  Unsaved changes
                </motion.span>
              )}
            </AnimatePresence>
            <SaveButton saving={saving} saved={saved} onClick={save} />
          </>
        }
      />

      <div className="screen__body">
        <form
          className="measure measure--form"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          {isTheme && (
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <MonochromeWarning />
            </motion.div>
          )}

          {/* Height-animated so the form below slides down to make room rather
              than jumping — the error appears right where the eye already is. */}
          <AnimatePresence initial={false}>
            {error && (
              <motion.div
                className="banner-slot"
                {...banner}
              >
                <NoticeBanner title="Not saved" message={error} />
              </motion.div>
            )}
          </AnimatePresence>

          {isTheme && (
            <ThemePicker
              values={data}
              fields={paletteFields}
              errors={errors}
              onApply={setMany}
              onChangeField={set}
            />
          )}

          <motion.section
            className="panel"
            variants={fieldParent}
            initial="hidden"
            animate="show"
          >
            <SectionLabel>{isTheme ? 'Other settings' : `${table.label} fields`}</SectionLabel>
            <div className="panel__fields">
              {plainFields.map((field) => (
                <motion.div key={field.key} variants={fieldItem}>
                  <FieldEditor
                    field={field}
                    value={data[field.key]}
                    error={errors[field.key] || undefined}
                    onChange={(value) => set(field.key, value)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.div className="form-actions" variants={fadeUp} initial="hidden" animate="show">
            <motion.button
              type="submit"
              className="btn btn--primary"
              disabled={saving}
              whileTap={press}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </motion.button>
            {!embedded && (
              <button
                type="button"
                className="btn"
                onClick={() => onDone?.(false)}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  );
};

/**
 * Save, with its three states in one button: idle, in flight, and done.
 *
 * The label is swapped inside a fixed-width shell so the button never resizes
 * mid-save and shifts the toolbar around it.
 */
const SaveButton = ({
  saving,
  saved,
  onClick,
}: {
  saving: boolean;
  saved: boolean;
  onClick: () => void;
}) => {
  const state = saving ? 'saving' : saved ? 'saved' : 'idle';

  return (
    <motion.button
      type="button"
      className={`btn btn--primary btn--save${saved ? ' btn--save-done' : ''}`}
      onClick={onClick}
      disabled={saving}
      whileTap={press}
      whileHover={{ y: -1 }}
      animate={saved ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 0.32 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          className="btn__label"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.14 }}
        >
          {state === 'saving' && (
            <>
              <Spinner /> Saving…
            </>
          )}
          {state === 'saved' && (
            <>
              <FiCheck /> Saved
            </>
          )}
          {state === 'idle' && (
            <>
              <FiCheck /> Save
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

/**
 * What a palette actually changes, stated once at the top of the screen.
 *
 * The old copy here told you to leave the colours empty, which was honest when
 * this was four raw hex fields. Now that the choices are curated it would be
 * wrong — so it explains the scope of the change instead of warning against it.
 */
const MonochromeWarning = () => (
  <aside className="callout">
    <motion.span
      className="callout__rule"
      aria-hidden
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ transformOrigin: 'top' }}
    />
    <div>
      <strong>
        <FiInfo aria-hidden /> How a palette is applied
      </strong>
      <p>
        The site was designed black and white, and <em>Monochrome</em> keeps it that way. Any
        other set tints the accent — buttons, highlights, the availability dot — and the page
        background.
      </p>
      <p>
        It only affects the site&apos;s <strong>dark mode</strong>; light mode stays black on
        white either way. Changes go live on the next page load, and Monochrome puts everything
        back.
      </p>
    </div>
  </aside>
);
