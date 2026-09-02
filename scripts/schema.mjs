/**
 * The Appwrite schema, as data.
 *
 * Kept separate from the script that applies it so the shape stays readable and
 * reviewable on its own. Column order here is the order they appear in the
 * console, so it is worth keeping it sensible.
 *
 * Conventions:
 *   - `req: true` means required. Appwrite forbids a default on a required
 *     column, so `def` and `req` are mutually exclusive.
 *   - `array: true` maps to a native Appwrite array-of-scalar column. Array
 *     columns cannot have defaults, and a *required* array must be non-empty,
 *     so every array here is optional.
 *   - Sizes carry roughly 2x headroom over the longest current value. A string
 *     column cannot be shrunk later.
 */

/** Every list table is ordered by this column; see the note in setup-appwrite.mjs. */
const ORDER = { key: 'order', type: 'integer', req: true, min: 0, max: 9999 };

const TRACK = ['Development', 'Marketing'];

export const DATABASE_NAME = 'Portfolio';

export const TABLES = [
  {
    id: 'contact_submissions',
    name: 'Contact submissions',
    // Create-only for guests. No read, update or delete for ANY role: these are
    // private enquiries, and the project id that reaches this table is public
    // and sits in the bundled JS. You read them in the console.
    permissions: ['create("any")'],
    columns: [
      { key: 'name', type: 'string', size: 100, req: true },
      { key: 'email', type: 'email', req: true },
      { key: 'subject', type: 'string', size: 200, req: true },
      { key: 'message', type: 'string', size: 5000, req: true },
      { key: 'projectType', type: 'string', size: 120 },
      { key: 'budget', type: 'string', size: 60 },
      {
        key: 'status',
        type: 'enum',
        elements: ['new', 'read', 'replied', 'archived'],
        def: 'new',
      },
    ],
    // No index: you sort by the built-in $createdAt in the console.
    indexes: [],
  },

  {
    id: 'personal_info',
    name: 'Personal info',
    permissions: ['read("any")'],
    singleton: true,
    columns: [
      { key: 'name', type: 'string', size: 100, req: true },
      { key: 'title', type: 'string', size: 160, req: true },
      { key: 'roles', type: 'string', size: 60, array: true },
      { key: 'tagline', type: 'string', size: 200, req: true },
      { key: 'taglineEmphasis', type: 'string', size: 100 },
      { key: 'heroBadge', type: 'string', size: 160 },
      { key: 'heroScript', type: 'string', size: 40 },
      { key: 'email', type: 'email', req: true },
      { key: 'phone', type: 'string', size: 32 },
      { key: 'location', type: 'string', size: 160, req: true },
      { key: 'bio', type: 'string', size: 2000, req: true },
      { key: 'marketingBio', type: 'string', size: 2000 },
      // `social` is a nested object in TypeScript; Appwrite has no nested column
      // type, so it is stored flat and re-nested by src/lib/appwrite.ts.
      { key: 'socialGithub', type: 'string', size: 255 },
      { key: 'socialLinkedin', type: 'string', size: 255 },
      { key: 'socialTwitter', type: 'string', size: 255 },
      { key: 'socialInstagram', type: 'string', size: 255 },
      { key: 'socialBehance', type: 'string', size: 255 },
      // Deliberately plain strings, not the URL column type: resumeUrl and
      // portraitUrl hold relative paths like '/resume.pdf', which a URL
      // validator rejects, and bookingUrl/whatsapp are empty by default.
      { key: 'resumeUrl', type: 'string', size: 512 },
      { key: 'availability', type: 'string', size: 120 },
      { key: 'isAvailable', type: 'boolean', def: true },
      { key: 'bookingUrl', type: 'string', size: 512 },
      { key: 'whatsapp', type: 'string', size: 20 },
      { key: 'portraitUrl', type: 'string', size: 512 },
    ],
    indexes: [],
  },

  {
    id: 'services',
    name: 'Services',
    permissions: ['read("any")'],
    columns: [
      ORDER,
      { key: 'title', type: 'string', size: 100, req: true },
      { key: 'description', type: 'string', size: 400, req: true },
      { key: 'deliverables', type: 'string', size: 200, array: true },
      // Resolved to a react-icon in Services.tsx. Valid keys today:
      // smartphone, code, search, target, share, zap.
      { key: 'icon', type: 'string', size: 40, def: 'zap' },
      { key: 'track', type: 'enum', elements: TRACK, req: true },
      { key: 'startingPrice', type: 'string', size: 60 },
      { key: 'timeline', type: 'string', size: 60 },
      { key: 'featured', type: 'boolean', def: false },
    ],
  },

  {
    id: 'projects',
    name: 'Projects',
    permissions: ['read("any")'],
    columns: [
      ORDER,
      { key: 'title', type: 'string', size: 120, req: true },
      { key: 'description', type: 'string', size: 600, req: true },
      { key: 'longDescription', type: 'string', size: 2000 },
      { key: 'image', type: 'string', size: 512 },
      { key: 'technologies', type: 'string', size: 40, array: true },
      { key: 'github', type: 'string', size: 512 },
      { key: 'live', type: 'string', size: 512 },
      { key: 'playStore', type: 'string', size: 512 },
      { key: 'appStore', type: 'string', size: 512 },
      { key: 'featured', type: 'boolean', def: false },
      {
        key: 'category',
        type: 'enum',
        elements: ['Mobile', 'Web', 'Backend', 'Full Stack'],
        req: true,
      },
    ],
  },

  {
    id: 'case_studies',
    name: 'Case studies',
    permissions: ['read("any")'],
    columns: [
      ORDER,
      { key: 'client', type: 'string', size: 120, req: true },
      { key: 'industry', type: 'string', size: 60, req: true },
      { key: 'title', type: 'string', size: 160, req: true },
      { key: 'channels', type: 'string', size: 40, array: true },
      { key: 'problem', type: 'string', size: 1500, req: true },
      { key: 'approach', type: 'string', size: 300, array: true },
      // Metric[] is an array of objects, which Appwrite cannot store. Each entry
      // is one metric, pipe-delimited as `label|value|note` (note optional):
      //   Return on ad spend|3.4x|up from 1.2x
      // Never put a literal | inside a label or value.
      { key: 'results', type: 'string', size: 255, array: true },
      { key: 'duration', type: 'string', size: 40, req: true },
      { key: 'image', type: 'string', size: 512 },
      { key: 'featured', type: 'boolean', def: false },
    ],
  },

  {
    id: 'testimonials',
    name: 'Testimonials',
    permissions: ['read("any")'],
    columns: [
      ORDER,
      { key: 'name', type: 'string', size: 80, req: true },
      { key: 'role', type: 'string', size: 80, req: true },
      { key: 'company', type: 'string', size: 120, req: true },
      { key: 'quote', type: 'string', size: 1000, req: true },
      { key: 'avatar', type: 'string', size: 512 },
      { key: 'rating', type: 'integer', min: 1, max: 5, def: 5 },
      { key: 'track', type: 'enum', elements: TRACK },
    ],
  },

  {
    id: 'experience',
    name: 'Experience',
    permissions: ['read("any")'],
    columns: [
      ORDER,
      { key: 'role', type: 'string', size: 120, req: true },
      { key: 'company', type: 'string', size: 120, req: true },
      { key: 'companyUrl', type: 'string', size: 512 },
      { key: 'location', type: 'string', size: 80, req: true },
      { key: 'period', type: 'string', size: 60, req: true },
      // Strings, not datetime: the data holds "2024-01", which is not a valid
      // ISO datetime and a datetime column would reject it.
      { key: 'startDate', type: 'string', size: 10, req: true },
      { key: 'endDate', type: 'string', size: 10 },
      { key: 'current', type: 'boolean', def: false },
      { key: 'description', type: 'string', size: 800, req: true },
      { key: 'responsibilities', type: 'string', size: 300, array: true },
      { key: 'technologies', type: 'string', size: 40, array: true },
      {
        key: 'type',
        type: 'enum',
        elements: ['Full-time', 'Internship', 'Freelance', 'Contract'],
        req: true,
      },
      { key: 'track', type: 'enum', elements: TRACK, req: true },
    ],
  },

  {
    id: 'stats',
    name: 'Stats',
    permissions: ['read("any")'],
    columns: [
      ORDER,
      { key: 'label', type: 'string', size: 60, req: true },
      { key: 'value', type: 'string', size: 20, req: true },
      { key: 'icon', type: 'string', size: 40 },
    ],
  },

  {
    id: 'theme',
    name: 'Theme',
    permissions: ['read("any")'],
    singleton: true,
    columns: [
      // Leave these four EMPTY. ThemeContext writes them straight onto
      // --color-accent and --gradient-primary, and the site is a deliberate
      // monochrome design — any real hue here visibly breaks it. Every colour
      // branch is guarded, so empty is a clean no-op. Populate only
      // defaultDarkMode. Size 9 fits '#rrggbbaa'.
      { key: 'primaryColor', type: 'string', size: 9 },
      { key: 'secondaryColor', type: 'string', size: 9 },
      { key: 'accentColor', type: 'string', size: 9 },
      { key: 'darkBackground', type: 'string', size: 9 },
      { key: 'defaultDarkMode', type: 'boolean', def: true },
    ],
    indexes: [],
  },
];

/**
 * Every list table gets the same ordering index. Ordering is load-bearing
 * rather than cosmetic: PortfolioContext derives each item's `id` / `step` from
 * its array index, so an unordered response silently renumbers your content.
 */
export const DEFAULT_INDEXES = [
  { key: 'idx_order', type: 'key', columns: ['order'], orders: ['asc'] },
];
