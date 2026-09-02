/**
 * Field validation, kept beside the schema rather than in the editor
 * component: the rules come from the schema entry, and the save path needs to
 * run all of them at once without rendering anything.
 */
import type { Field } from './schema';

export type FieldValue = string | number | boolean | string[] | null | undefined;

/** Returns the message to show, or null when the value is acceptable. */
export const validateField = (field: Field, value: FieldValue): string | null => {
  const type = field.type ?? 'text';

  if (type === 'boolean') return null;

  if (type === 'stringList' || type === 'metrics') {
    const items = Array.isArray(value) ? value : [];
    if (field.required && items.length === 0) return `${field.label} is required`;
    if (field.maxLength && items.some((line) => line.length > field.maxLength!)) {
      return `One line exceeds ${field.maxLength} characters`;
    }
    return null;
  }

  const text = value === null || value === undefined ? '' : String(value).trim();
  if (field.required && text === '') return `${field.label} is required`;

  if (type === 'number' && text !== '') {
    const n = Number(text);
    if (Number.isNaN(n)) return 'Must be a number';
    if (field.min !== undefined && n < field.min) return `Minimum is ${field.min}`;
    if (field.max !== undefined && n > field.max) return `Maximum is ${field.max}`;
  }

  if (field.maxLength && text.length > field.maxLength) {
    return `Maximum ${field.maxLength} characters`;
  }

  return null;
};
