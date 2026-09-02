/**
 * Renders one editable field from its schema definition.
 *
 * Everything the forms can do lives here, so a new field in schema.ts needs no
 * new UI code.
 *
 * Labels sit above the input rather than inside it: with help text on most
 * fields, labels floating inside made the form hard to skim.
 */
import { useId } from 'react';

import type { Field } from '../schema';
import type { FieldValue } from '../validate';

interface Props {
  field: Field;
  value: FieldValue;
  error?: string;
  onChange: (value: FieldValue) => void;
}

/** List-valued columns round-trip as one item per line. */
const toLines = (value: FieldValue): string =>
  Array.isArray(value) ? value.join('\n') : '';

const fromLines = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export const FieldEditor = ({ field, value, error, onChange }: Props) => {
  const id = useId();
  const type = field.type ?? 'text';
  const describedBy = `${id}-help`;

  // The switch is its own labelled row already, so it skips the header.
  if (type === 'boolean') {
    return (
      <div className="field field--switch">
        <label className="switch" htmlFor={id}>
          <span className="switch__text">
            <span className="field__label">{field.label}</span>
            {field.help && <span className="field__help">{field.help}</span>}
          </span>
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="switch__track" aria-hidden />
        </label>
      </div>
    );
  }

  const text = value === null || value === undefined ? '' : String(value);
  const invalid = Boolean(error);

  const control = () => {
    switch (type) {
      case 'choice':
        return (
          <select
            id={id}
            className="input"
            value={field.options?.includes(text) ? text : ''}
            aria-invalid={invalid}
            aria-describedby={field.help ? describedBy : undefined}
            onChange={(e) => onChange(e.target.value || null)}
          >
            <option value="">{field.required ? 'Choose…' : 'Not set'}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'stringList':
      case 'metrics':
        return (
          <textarea
            id={id}
            className="input input--area"
            rows={5}
            defaultValue={toLines(value)}
            placeholder={type === 'metrics' ? 'label | value | note' : 'One per line'}
            aria-invalid={invalid}
            aria-describedby={field.help ? describedBy : undefined}
            onChange={(e) => onChange(fromLines(e.target.value))}
          />
        );

      case 'multiline':
        return (
          <textarea
            id={id}
            className="input input--area"
            rows={5}
            value={text}
            maxLength={field.maxLength}
            aria-invalid={invalid}
            aria-describedby={field.help ? describedBy : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case 'number':
        return (
          <input
            id={id}
            className="input"
            type="number"
            value={text}
            min={field.min}
            max={field.max}
            aria-invalid={invalid}
            aria-describedby={field.help ? describedBy : undefined}
            // Empty means "omit the column", not zero — the site treats a
            // present-but-empty value differently from an absent one.
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          />
        );

      default:
        return (
          <input
            id={id}
            className="input"
            type="text"
            value={text}
            maxLength={field.maxLength}
            aria-invalid={invalid}
            aria-describedby={field.help ? describedBy : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  // Counters only earn their space where a limit is close enough to hit.
  const showCount = Boolean(field.maxLength) && (type === 'text' || type === 'multiline');

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {field.label}
        {field.required ? (
          <span className="field__required" aria-label="required">
            {' '}
            *
          </span>
        ) : (
          <span className="field__optional">optional</span>
        )}
      </label>
      {field.help && (
        <span className="field__help" id={describedBy}>
          {field.help}
        </span>
      )}
      {control()}
      <div className="field__foot">
        {error ? <span className="field__error">{error}</span> : <span />}
        {showCount && (
          <span className="field__count">
            {text.length}/{field.maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
