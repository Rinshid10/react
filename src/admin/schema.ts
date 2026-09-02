/**
 * The content schema, mirroring `scripts/schema.mjs`.
 *
 * The whole admin UI is generated from this: list columns, edit forms,
 * validation and length limits all come from here, so adding a field to a
 * table means adding one line below rather than writing another screen.
 *
 * Keep it in step with `scripts/schema.mjs`. If they drift, the symptom is an
 * Appwrite 400 on save naming the offending column — annoying but loud, which
 * is better than silent.
 */
import { TABLES } from '../config';

export type FieldType =
  | 'text'
  | 'multiline'
  | 'number'
  | 'boolean'
  | 'choice'
  | 'stringList'
  | 'metrics';

export interface Field {
  key: string;
  label: string;
  type?: FieldType;

  /**
   * Mirrors the Appwrite column size. Enforced in the form so a too-long value
   * is caught while typing rather than as a 400 on save.
   */
  maxLength?: number;
  required?: boolean;
  options?: readonly string[];
  help?: string;
  min?: number;
  max?: number;

  /** Pre-filled on a NEW row only; existing rows keep whatever they hold. */
  defaultValue?: string | number | boolean;
}

export interface TableDef {
  id: string;
  label: string;
  fields: readonly Field[];

  /**
   * Single-row tables are read at the fixed row id `main` and edited directly,
   * with no list in between.
   */
  singleton?: boolean;

  /** Field shown as the secondary line in the list. */
  subtitleKey?: string;
  icon?: IconKey;
}

export type IconKey =
  | 'person'
  | 'bell'
  | 'skills'
  | 'work'
  | 'apps'
  | 'insights'
  | 'quote'
  | 'timeline'
  | 'stats'
  | 'palette';

/** The field used as a row's title in lists, in order of preference. */
const TITLE_KEYS = ['title', 'name', 'role', 'label', 'client'] as const;

/** Mirrors `SkillCategory` in src/types/index.ts. */
const SKILL_CATEGORIES = [
  'Mobile',
  'State Management',
  'Frontend',
  'Backend',
  'Database',
  'Tools',
  'AI',
] as const;

export const titleOf = (data: Record<string, unknown>): string => {
  for (const key of TITLE_KEYS) {
    const value = data[key];
    if (typeof value === 'string' && value.trim() !== '') return value;
  }
  return '(untitled)';
};

const ORDER: Field = {
  key: 'order',
  label: 'Order',
  type: 'number',
  required: true,
  min: 0,
  max: 9999,
  help: 'Lower shows first. Use tens (10, 20, 30) so you can insert between.',
};

/**
 * One value, since the site dropped its marketing track.
 *
 * The field is kept rather than removed because the column is required on
 * services and experience in the live database, and this panel is the thing
 * that writes it — dropping it here would make creating a new row fail with a
 * 400. `defaultValue` means nobody has to pick the only option.
 */
const TRACK = ['Development'] as const;

const TRACK_FIELD: Field = {
  key: 'track',
  label: 'Track',
  type: 'choice',
  options: TRACK,
  required: true,
  defaultValue: 'Development',
  help: 'Kept because the database column is required. Only one value remains.',
};

/** Icon keys the React components know how to resolve. */
const SERVICE_ICONS = ['smartphone', 'code', 'zap'] as const;

export const CONTENT_TABLES: readonly TableDef[] = [
  {
    id: TABLES.personalInfo,
    label: 'Profile',
    singleton: true,
    icon: 'person',
    fields: [
      { key: 'name', label: 'Name', maxLength: 100, required: true },
      { key: 'title', label: 'Headline role', maxLength: 160, required: true },
      { key: 'roles', label: 'Role chips', type: 'stringList', maxLength: 60 },
      { key: 'tagline', label: 'Tagline', maxLength: 200, required: true },
      {
        key: 'taglineEmphasis',
        label: 'Tagline emphasis',
        maxLength: 100,
        help: 'Must be an exact substring of the tagline; it renders dimmer.',
      },
      { key: 'heroBadge', label: 'Hero badge', maxLength: 160 },
      { key: 'heroScript', label: 'Hero script accent', maxLength: 40 },
      { key: 'email', label: 'Email', maxLength: 255, required: true },
      { key: 'phone', label: 'Phone', maxLength: 32 },
      { key: 'location', label: 'Location', maxLength: 160, required: true },
      { key: 'bio', label: 'Bio', type: 'multiline', maxLength: 2000, required: true },
      { key: 'socialGithub', label: 'GitHub URL', maxLength: 255 },
      { key: 'socialLinkedin', label: 'LinkedIn URL', maxLength: 255 },
      { key: 'socialTwitter', label: 'Twitter URL', maxLength: 255 },
      { key: 'socialInstagram', label: 'Instagram URL', maxLength: 255 },
      { key: 'socialBehance', label: 'Behance URL', maxLength: 255 },
      { key: 'resumeUrl', label: 'Resume URL', maxLength: 512 },
      { key: 'availability', label: 'Availability line', maxLength: 120 },
      { key: 'isAvailable', label: 'Available for work', type: 'boolean' },
      {
        key: 'bookingUrl',
        label: 'Booking URL',
        maxLength: 512,
        help: 'Calendly / Cal.com link.',
      },
      {
        key: 'whatsapp',
        label: 'WhatsApp',
        maxLength: 20,
        help: 'Digits only, e.g. 919876543210.',
      },
      { key: 'portraitUrl', label: 'Portrait URL', maxLength: 512 },
    ],
  },
  {
    id: TABLES.services,
    label: 'Services',
    icon: 'work',
    subtitleKey: 'startingPrice',
    fields: [
      ORDER,
      { key: 'title', label: 'Title', maxLength: 100, required: true },
      {
        key: 'description',
        label: 'Description',
        type: 'multiline',
        maxLength: 400,
        required: true,
      },
      { key: 'deliverables', label: 'Deliverables', type: 'stringList', maxLength: 200 },
      { key: 'icon', label: 'Icon', type: 'choice', options: SERVICE_ICONS },
      TRACK_FIELD,
      { key: 'startingPrice', label: 'Starting price', maxLength: 60 },
      { key: 'timeline', label: 'Timeline', maxLength: 60 },
      { key: 'featured', label: 'Featured', type: 'boolean' },
    ],
  },
  {
    id: TABLES.projects,
    label: 'Projects',
    icon: 'apps',
    subtitleKey: 'category',
    fields: [
      ORDER,
      { key: 'title', label: 'Title', maxLength: 120, required: true },
      {
        key: 'description',
        label: 'Description',
        type: 'multiline',
        maxLength: 600,
        required: true,
      },
      { key: 'longDescription', label: 'Long description', type: 'multiline', maxLength: 2000 },
      { key: 'image', label: 'Image URL', maxLength: 512 },
      { key: 'technologies', label: 'Technologies', type: 'stringList', maxLength: 40 },
      { key: 'github', label: 'GitHub URL', maxLength: 512 },
      { key: 'live', label: 'Live URL', maxLength: 512 },
      { key: 'playStore', label: 'Play Store URL', maxLength: 512 },
      { key: 'appStore', label: 'App Store URL', maxLength: 512 },
      { key: 'featured', label: 'Featured', type: 'boolean' },
      {
        key: 'category',
        label: 'Category',
        type: 'choice',
        options: ['Mobile', 'Web', 'Backend', 'Full Stack'],
        required: true,
      },
    ],
  },
  {
    id: TABLES.skills,
    label: 'Skills',
    icon: 'skills',
    subtitleKey: 'category',
    fields: [
      ORDER,
      { key: 'name', label: 'Name', maxLength: 60, required: true },
      {
        key: 'category',
        label: 'Category',
        type: 'choice',
        options: SKILL_CATEGORIES,
        required: true,
        help: 'Groups the chip into a row on the site, in the order listed here.',
      },
      {
        key: 'icon',
        label: 'Icon override',
        maxLength: 40,
        help: 'Leave empty. The site matches the brand mark on the name, and ' +
          'falls back to a letter tile when no logo exists.',
      },
      {
        key: 'level',
        label: 'Level',
        type: 'number',
        min: 0,
        max: 100,
        defaultValue: 80,
        help: 'Not shown on the site any more — the column is kept so the ' +
          'schema still matches. Anything from 0 to 100 is fine.',
      },
    ],
  },
  {
    id: TABLES.testimonials,
    label: 'Testimonials',
    icon: 'quote',
    subtitleKey: 'company',
    fields: [
      ORDER,
      { key: 'name', label: 'Name', maxLength: 80, required: true },
      { key: 'role', label: 'Role', maxLength: 80, required: true },
      { key: 'company', label: 'Company', maxLength: 120, required: true },
      { key: 'quote', label: 'Quote', type: 'multiline', maxLength: 1000, required: true },
      { key: 'avatar', label: 'Avatar URL', maxLength: 512 },
      { key: 'rating', label: 'Rating', type: 'number', min: 1, max: 5 },
    ],
  },
  {
    id: TABLES.experience,
    label: 'Experience',
    icon: 'timeline',
    subtitleKey: 'company',
    fields: [
      ORDER,
      { key: 'role', label: 'Role', maxLength: 120, required: true },
      { key: 'company', label: 'Company', maxLength: 120, required: true },
      { key: 'companyUrl', label: 'Company URL', maxLength: 512 },
      { key: 'location', label: 'Location', maxLength: 80, required: true },
      {
        key: 'period',
        label: 'Period',
        maxLength: 60,
        required: true,
        help: 'e.g. "2024 - Present"',
      },
      { key: 'startDate', label: 'Start date', maxLength: 10, required: true, help: 'YYYY-MM' },
      {
        key: 'endDate',
        label: 'End date',
        maxLength: 10,
        help: 'YYYY-MM. Leave empty if current.',
      },
      { key: 'current', label: 'Current role', type: 'boolean' },
      {
        key: 'description',
        label: 'Description',
        type: 'multiline',
        maxLength: 800,
        required: true,
      },
      { key: 'responsibilities', label: 'Responsibilities', type: 'stringList', maxLength: 300 },
      { key: 'technologies', label: 'Technologies', type: 'stringList', maxLength: 40 },
      {
        key: 'type',
        label: 'Type',
        type: 'choice',
        options: ['Full-time', 'Internship', 'Freelance', 'Contract'],
        required: true,
      },
      TRACK_FIELD,
    ],
  },
  {
    id: TABLES.stats,
    label: 'Stats',
    icon: 'stats',
    subtitleKey: 'value',
    fields: [
      ORDER,
      { key: 'label', label: 'Label', maxLength: 60, required: true },
      { key: 'value', label: 'Value', maxLength: 20, required: true },
      { key: 'icon', label: 'Icon key', maxLength: 40 },
    ],
  },
  {
    id: TABLES.settings,
    label: 'Notifications',
    singleton: true,
    icon: 'bell',
    fields: [
      {
        key: 'notifyEmail',
        label: 'Notify this address',
        maxLength: 255,
        help: 'Where a new enquiry is emailed. Leave empty to fall back to ' +
          'the address set on the notifier itself.',
      },
      {
        key: 'notifyEnabled',
        label: 'Email me new enquiries',
        type: 'boolean',
        defaultValue: true,
        help: 'Off stops the emails. Enquiries are still saved and still ' +
          'show up under Enquiries.',
      },
    ],
  },
  {
    id: TABLES.theme,
    label: 'Theme',
    singleton: true,
    icon: 'palette',
    fields: [
      { key: 'primaryColor', label: 'Primary colour', maxLength: 9, help: '#rrggbb' },
      { key: 'secondaryColor', label: 'Secondary colour', maxLength: 9, help: '#rrggbb' },
      { key: 'accentColor', label: 'Accent colour', maxLength: 9, help: '#rrggbb' },
      { key: 'darkBackground', label: 'Dark background', maxLength: 9, help: '#rrggbb' },
      {
        key: 'defaultDarkMode',
        label: 'Default to dark mode',
        type: 'boolean',
        help: 'Only applies to visitors with no saved preference.',
      },
    ],
  },
];

export const ENQUIRIES_TABLE = TABLES.contactSubmissions;

export const ENQUIRY_STATUSES = ['new', 'read', 'replied', 'archived'] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
