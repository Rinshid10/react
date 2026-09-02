/**
 * Ready-made colour combinations for the site's `theme` row.
 *
 * How these actually land on the site, because it constrains every value here
 * (see `ThemeContext` in the portfolio):
 *
 *   primaryColor   -> --color-accent (and --color-accent-light, --shadow-glow)
 *   secondaryColor -> --color-accent-light, second gradient stop
 *   accentColor    -> third gradient stop only
 *   darkBackground -> --color-bg-primary
 *
 * Two consequences worth knowing before adding a palette:
 *
 * 1. They apply in DARK MODE ONLY. ThemeContext writes these as inline custom
 *    properties on <html>, but `.light-mode` on <body> re-declares the same
 *    variables — and for anything inside <body> the nearer declaration wins. So
 *    light mode keeps the black-on-white design regardless of what is chosen
 *    here. That is why the background field is called `darkBackground`.
 *
 * 2. The site writes BLACK text on accent-filled surfaces in dark mode
 *    (`--color-on-accent: #000000`), and that value is not settable from this
 *    table. So every `primaryColor` below is deliberately light — each one
 *    clears 7:1 against black, which leaves room to spare on buttons and chips.
 *    A dark accent would render its own label invisible, which is the single
 *    easiest way to break the live site from this screen.
 *
 * Keep hexes in `#rrggbb`, lowercase, 7 characters — the column is capped at 9
 * and the site's `hexToRgb` expects that shape.
 */

export interface ThemePreset {
  id: string;
  name: string;

  /** One line on the mood, shown under the name. */
  note: string;

  /** Empty strings mean "write nothing", which is a clean no-op on the site. */
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkBackground: string;
}

/** The columns a preset owns. Everything else on the theme row is left alone. */
export const PRESET_KEYS = [
  'primaryColor',
  'secondaryColor',
  'accentColor',
  'darkBackground',
] as const;

export type PresetKey = (typeof PRESET_KEYS)[number];

/**
 * The default, and the one the site was designed in: pure monochrome.
 *
 * It stores empty values rather than white/black hexes on purpose. Empty means
 * the columns are omitted entirely on save, so `ThemeContext` never overrides a
 * single variable and the site runs on the palette in `global.css`. Writing
 * "#ffffff" instead would look identical but silently take ownership of those
 * variables, so a later change to global.css would stop taking effect.
 */
export const MONOCHROME: ThemePreset = {
  id: 'monochrome',
  name: 'Monochrome',
  note: 'The original. Pure black and white, no hue anywhere.',
  primaryColor: '',
  secondaryColor: '',
  accentColor: '',
  darkBackground: '',
};

export const THEME_PRESETS: readonly ThemePreset[] = [
  MONOCHROME,
  {
    id: 'arctic',
    name: 'Arctic',
    note: 'Cool near-white. Monochrome with the chill left in.',
    primaryColor: '#e6edf5',
    secondaryColor: '#b9c7d9',
    accentColor: '#8fa3bc',
    darkBackground: '#0a0c10',
  },
  {
    id: 'amber',
    name: 'Amber',
    note: 'Warm and high-contrast. Reads as confident rather than loud.',
    primaryColor: '#ffc857',
    secondaryColor: '#f0a202',
    accentColor: '#c97b0a',
    darkBackground: '#0f0d0a',
  },
  {
    id: 'mint',
    name: 'Mint',
    note: 'Fresh green. Good fit for a product or SaaS pitch.',
    primaryColor: '#7be0ad',
    secondaryColor: '#4fcf95',
    accentColor: '#2fa87a',
    darkBackground: '#08120e',
  },
  {
    id: 'coral',
    name: 'Coral',
    note: 'Warm red. The most energetic option here.',
    primaryColor: '#ff8a7a',
    secondaryColor: '#ff6b57',
    accentColor: '#e24e3b',
    darkBackground: '#130b0a',
  },
  {
    id: 'violet',
    name: 'Violet',
    note: 'Soft purple. Creative without tipping into neon.',
    primaryColor: '#c4a6ff',
    secondaryColor: '#a87bff',
    accentColor: '#8a5cf0',
    darkBackground: '#0d0a14',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    note: 'Bright and technical. Suits a developer-first portfolio.',
    primaryColor: '#6fe3f5',
    secondaryColor: '#35cbe3',
    accentColor: '#17a8bf',
    darkBackground: '#061214',
  },
  {
    id: 'rose',
    name: 'Rose',
    note: 'Pink with warmth behind it. Distinct without being sweet.',
    primaryColor: '#ffa3c7',
    secondaryColor: '#ff7bae',
    accentColor: '#e85c93',
    darkBackground: '#140a0f',
  },
  {
    id: 'lime',
    name: 'Lime',
    note: 'Sharp yellow-green. The loudest of the set — use deliberately.',
    primaryColor: '#c7ee5a',
    secondaryColor: '#a9dc2f',
    accentColor: '#86b31c',
    darkBackground: '#0c1006',
  },
  {
    id: 'sand',
    name: 'Sand',
    note: 'Muted and editorial. Closest to monochrome with a hue.',
    primaryColor: '#e8d5b0',
    secondaryColor: '#d4b98a',
    accentColor: '#b89a66',
    darkBackground: '#12100c',
  },
  {
    id: 'sky',
    name: 'Sky',
    note: 'Familiar, trustworthy blue. The safest colour choice here.',
    primaryColor: '#8fc7ff',
    secondaryColor: '#5ba8f5',
    accentColor: '#3b86d9',
    darkBackground: '#080c12',
  },
  {
    id: 'peach',
    name: 'Peach',
    note: 'Soft orange. Warm without the shout of Coral.',
    primaryColor: '#ffcba4',
    secondaryColor: '#ffb077',
    accentColor: '#e88f4f',
    darkBackground: '#130e09',
  },
  {
    id: 'slate',
    name: 'Slate',
    note: 'Blue-grey. Reads as monochrome until you look twice.',
    primaryColor: '#cbd5e1',
    secondaryColor: '#94a3b8',
    accentColor: '#64748b',
    darkBackground: '#0b0f14',
  },
];

type ThemeValues = Partial<Record<PresetKey, unknown>>;

const norm = (value: unknown): string =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

/**
 * Which preset the stored row currently matches, or null for a hand-edited
 * combination the picker should show as "Custom".
 *
 * A row with all four columns empty is Monochrome — that is the state of every
 * project that has never touched this screen, so it must resolve to the default
 * rather than to "Custom".
 */
export const matchPreset = (values: ThemeValues): ThemePreset | null =>
  THEME_PRESETS.find((preset) =>
    PRESET_KEYS.every((key) => norm(values[key]) === preset[key])
  ) ?? null;

/** The four columns of a preset, ready to merge into the form's state. */
export const presetValues = (preset: ThemePreset): Record<PresetKey, string> => ({
  primaryColor: preset.primaryColor,
  secondaryColor: preset.secondaryColor,
  accentColor: preset.accentColor,
  darkBackground: preset.darkBackground,
});
