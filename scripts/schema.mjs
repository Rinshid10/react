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

// One value, since the site dropped its marketing track. The column is kept
// rather than deleted because it is `req: true` on services and experience in
// every database already created from this schema, and the setup script never
// alters an existing column — so a write that omitted it would be rejected.
const TRACK = ['Development'];

/** Mirrors `SkillCategory` in src/types/index.ts and CATEGORY_ORDER in Skills.tsx. */
const SKILL_CATEGORIES = [
  'Mobile',
  'State Management',
  'Frontend',
  'Backend',
  'Database',
  'Tools',
  'AI',
];

export const DATABASE_NAME = 'Portfolio';

/**
 * Everything the admin panel writes is authorised through this team, never
 * through an API key. The panel is a web app, so any key it shipped would be
 * public — the same reason the React site cannot hold one.
 *
 * A team rather than a single user id, so adding a second admin later is a
 * console click instead of a permissions migration. And deliberately not
 * `users()`, which means *any* authenticated account: with signups open that
 * would let a stranger register and then edit the site.
 */
export const ADMIN_TEAM_ID = 'admins';
const ADMIN = [
  `read("team:${ADMIN_TEAM_ID}")`,
  `create("team:${ADMIN_TEAM_ID}")`,
  `update("team:${ADMIN_TEAM_ID}")`,
  `delete("team:${ADMIN_TEAM_ID}")`,
];

export const TABLES = [
  {
    id: 'contact_submissions',
    name: 'Contact submissions',
    // Guests may CREATE and nothing else. Read stays restricted to the admin
    // team: these are private enquiries, and the project id that reaches this
    // table is public and sits in the bundled JS, so read("any") here would
    // publish every lead to anyone who looks.
    permissions: ['create("any")', ...ADMIN],
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
    permissions: ['read("any")', ...ADMIN],
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
    permissions: ['read("any")', ...ADMIN],
    columns: [
      ORDER,
      { key: 'title', type: 'string', size: 100, req: true },
      { key: 'description', type: 'string', size: 400, req: true },
      { key: 'deliverables', type: 'string', size: 200, array: true },
      // Resolved to a react-icon in Services.tsx. Valid keys today:
      // smartphone, code, zap.
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
    permissions: ['read("any")', ...ADMIN],
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
    id: 'skills',
    name: 'Skills',
    permissions: ['read("any")', ...ADMIN],
    columns: [
      ORDER,
      { key: 'name', type: 'string', size: 60, req: true },
      // Kept because the shape is shared with the admin panel, though the
      // site stopped rendering it — a self-assessed percentage is not
      // something a visitor can check. Safe to ignore when authoring.
      { key: 'level', type: 'integer', min: 0, max: 100, def: 80 },
      { key: 'category', type: 'enum', elements: SKILL_CATEGORIES, req: true },
      // Optional override for the brand mark. Left empty, Skills.tsx matches
      // on `name`, and falls back to a letter tile when there is no match.
      { key: 'icon', type: 'string', size: 40 },
    ],
  },

  {
    id: 'testimonials',
    name: 'Testimonials',
    permissions: ['read("any")', ...ADMIN],
    columns: [
      ORDER,
      { key: 'name', type: 'string', size: 80, req: true },
      { key: 'role', type: 'string', size: 80, req: true },
      { key: 'company', type: 'string', size: 120, req: true },
      { key: 'quote', type: 'string', size: 1000, req: true },
      { key: 'avatar', type: 'string', size: 512 },
      { key: 'rating', type: 'integer', min: 1, max: 5, def: 5 },
    ],
  },

  {
    id: 'experience',
    name: 'Experience',
    permissions: ['read("any")', ...ADMIN],
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
    permissions: ['read("any")', ...ADMIN],
    columns: [
      ORDER,
      { key: 'label', type: 'string', size: 60, req: true },
      { key: 'value', type: 'string', size: 20, req: true },
      { key: 'icon', type: 'string', size: 40 },
    ],
  },

  {
    id: 'settings',
    name: 'Settings',
    // NO public read, unlike every other content table. This row holds the
    // address enquiry notifications are sent to, and the project id that
    // reaches Appwrite is public — read("any") here would publish an inbox
    // to every scraper. The notifier reads it with a server-side key, and
    // the site itself never needs it.
    permissions: [...ADMIN],
    singleton: true,
    // No index: a single-row table has nothing to order, and the default
    // `idx_order` would wait forever on an `order` column that does not exist.
    indexes: [],
    columns: [
      { key: 'notifyEmail', type: 'email' },
      { key: 'notifyEnabled', type: 'boolean', def: true },
    ],
  },

  {
    id: 'theme',
    name: 'Theme',
    permissions: ['read("any")', ...ADMIN],
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
