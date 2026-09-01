# Rinshid — Freelance Developer & Digital Marketer Portfolio

A single-page freelance portfolio built with **React 19**, **TypeScript** and **Vite**, animated with **Framer Motion**.

The site sells two tracks under one offer — **Development** (Flutter, React, backend) and **Marketing** (SEO, paid ads, social, branding) — and is structured as a client funnel rather than a CV. Content and theme colors can be driven live from a Node.js admin backend; if that API is unreachable, the site falls back to its built-in data, so it always renders.

## Page flow

The section order is a deliberate freelance funnel — who I am → what you can buy → why me → proof → what working together looks like → hire:

| # | Section | Purpose |
| --- | --- | --- |
| 1 | **Hero** | One full screen: bright `Portfolio` wordmark with Rinshid's cut-out portrait cutting through it, name, description and `View My Work`, plus socials, an update pill and a scroll rail |
| 2 | **Services** | Editorial index of six packages — number, title, deliverables, price and timeline per row, filterable by track |
| 3 | **About** | The two tracks side by side — builder and marketer |
| 4 | **Skills** | Track switch (Development / Marketing), then category filter within it |
| 5 | **Projects** | Development work — apps and sites shipped |
| 6 | **Case Studies** | Marketing work in problem → approach → metrics format |
| 7 | **Process** | The four steps from first call to live results |
| 8 | **Experience** | Career timeline, tagged by track |
| 9 | **Testimonials** | Social proof, placed right before the ask |
| 10 | **Contact** | Enquiry form with project type + budget so leads self-qualify |

## Features

- **Dual-track content model** — every skill, service, testimonial and experience entry carries a `track` of `Development` or `Marketing`
- **Service cards that convert** — deliverables, price and timeline on each; `Enquire about this` scrolls to the contact form with that service pre-selected
- **Case studies with metric tiles** — headline numbers up front, expandable problem/approach detail underneath
- **Qualifying contact form** — service and budget dropdowns fed from the same data as the Services section
- **Dark / light mode** persisted in `localStorage` (dark by default)
- **Scroll spy** navbar with a persistent `Hire Me` CTA
- **Remote content + theming** from an admin API, with graceful fallback
- Animated custom cursor, tech carousel, scroll-reveal animations throughout
- SEO and Open Graph meta, responsive mobile-first layout

## Tech Stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript 5.9 |
| Build | Vite 7 (`@vitejs/plugin-react`) |
| Animation | Framer Motion 12 |
| Icons | react-icons (Simple Icons, Feather) |
| Styling | Plain CSS per component + CSS custom properties |
| State | React Context (`ThemeContext`, `PortfolioContext`) |
| Lint | ESLint 9 + typescript-eslint |

## Getting Started

Requires Node.js 20.19+ (or 22.12+) for Vite 7.

```bash
npm install
npm run dev      # http://localhost:5173
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the project |

## ⚠️ Placeholder content — read before publishing

Sections marked `TODO(real-data)` in `src/context/PortfolioContext.tsx` contain **realistic sample content written to demonstrate the layout**. Replace or delete them before the site goes live:

| What | Where | Status |
| --- | --- | --- |
| Marketing case studies (clients, metrics) | `defaultCaseStudies` | **Entirely invented** — every number is a sample |
| Testimonials (names, quotes) | `defaultTestimonials` | **Entirely invented** — attributed to fictional people |
| Headline stats | `defaultStats` | Estimates — use numbers you can defend |
| Service prices & timelines | `defaultServices` | Confirm they match what you actually quote |
| Marketing skill levels | `defaultSkills` | Tune honestly; a client may test them |
| Booking link, WhatsApp number | `defaultPersonalInfo` | Empty — the related CTAs stay hidden until filled |

Three honest case studies convert better than six you have to hedge about. If you don't have real numbers yet, delete `<CaseStudies />` and `<Testimonials />` from `src/App.tsx` until you do.

The contact form also **does not send anything yet** — see Notes below.

## Configuration

Create a `.env` in the project root to point the site at a deployed admin backend:

```bash
VITE_API_BASE_URL=https://your-api.com/api
```

Default when unset: `http://localhost:4000/api` (see `src/config.ts`).

### API endpoints consumed

| Endpoint | Used by | Purpose |
| --- | --- | --- |
| `GET /portfolio` | `PortfolioContext` | `personalInfo`, `skills`, `services`, `projects`, `caseStudies`, `experience`, `testimonials`, `process`, `stats` |
| `GET /portfolio/theme` | `ThemeContext` | `primaryColor`, `secondaryColor`, `accentColor`, `darkBackground`, `defaultDarkMode` |

Both requests fail silently. A missing or offline backend simply leaves the hardcoded defaults and the CSS palette in place. Each array in the `/portfolio` payload is optional and overrides its default independently. `defaultDarkMode` is only honored when the visitor has no saved preference yet.

## Project Structure

```
src/
├── App.tsx                    # Providers, section order, scroll tracking
├── main.tsx                   # React entry point
├── config.ts                  # API base URL
├── components/
│   ├── Navbar.tsx             # Nav with active-section highlight + Hire Me CTA
│   ├── Hero.tsx               # Art screen + pitch below the fold
│   ├── Services.tsx           # Service packages, filterable by track
│   ├── About.tsx              # Bio + specializations across both tracks
│   ├── Skills.tsx             # Track switch + category filter
│   ├── Projects.tsx           # Development work grid
│   ├── CaseStudies.tsx        # Marketing results, expandable detail
│   ├── Process.tsx            # 4-step working process
│   ├── Experience.tsx         # Work timeline
│   ├── Testimonials.tsx       # Client quotes
│   ├── Contact.tsx            # Qualifying enquiry form
│   ├── effects/               # 9 scroll, pointer and reveal effects
│   ├── Footer.tsx
│   ├── AnimatedCursor.tsx
│   └── TechCarousel.tsx
├── context/
│   ├── ThemeContext.tsx       # Dark mode, active section, remote theme vars
│   └── PortfolioContext.tsx   # ALL content lives here
├── styles/                    # global.css + one stylesheet per component
└── types/index.ts             # Shared interfaces and union types
```

## Customizing Content

Everything editable lives in the `default*` objects at the top of `src/context/PortfolioContext.tsx`:

| Object | Controls |
| --- | --- |
| `defaultPersonalInfo` | Name, dual title, tagline + `taglineEmphasis` (the dimmed phrase), `heroBadge`, bio (dev + marketing), contacts, socials, availability, booking link, WhatsApp, `portraitUrl` |
| `defaultServices` | The Services section and the contact form's service dropdown |
| `defaultStats` | Hero stats card (each needs an `icon` key) and the About quick-stats |
| `defaultSkills` | Skills grid — each entry needs a `track` and a `category` |
| `defaultProjects` | Development work |
| `defaultCaseStudies` | Marketing results |
| `defaultProcess` | The "How I Work" steps |
| `defaultTestimonials` | Client quotes |
| `defaultExperience` | Career timeline |
| `budgetRanges` | Budget options in the contact form |
| `techIcons` | Hero carousel icons |

All shapes are typed in `src/types/index.ts`. Icon fields on services and process steps are string keys (`smartphone`, `code`, `search`, `target`, `share`, `zap`, `phone`, `file`, `trending`) mapped to Feather icons inside each component. Place `resume.pdf` and project images in `public/`.

### The hero

One full screen. A single centred column shares one left edge — oversized `Portfolio` wordmark, then name, description and CTA beneath it — with a background-removed subject behind the word (`z-index` 1 vs 2) and taller than it, so the head clears the letters and the body runs out below. That intersection is the composition.

Around it: script logo and outlined `Let's Connect` in the navbar, a faint ring and dot grid behind, socials bottom-left, an update pill bottom-right, and a vertical scroll rail down the right edge.

**The figure sits right-of-centre, not centred.** The column below the wordmark is left-aligned, so a centred figure stands directly behind the name, description and button. Offset right it still crosses the back half of the word while leaving the copy on clear ground — verified at ~48px of clearance, measured against the *rendered glyph* extents (a `<p>` box includes trailing whitespace that never renders as ink, so a box-level check reports false overlaps).

On phones there is no room to dodge sideways, so the figure becomes a **watermark**: full height, centred, `opacity: .3` on the `<img>`, with the copy legible on top.

`.hero` declares `container-type: inline-size`, so everything sizes in `cqw` against the hero rather than the viewport — self-contained, and testable at any width.

Three things to know if you edit it:

- **Framer Motion silently overwrites CSS `transform` and `opacity`** on any element it animates. Centre by layout or a computed `left`, never `translateX(-50%)`; and put opacity on an inner element (the `<img>`, the `<span>`), not the animated wrapper. Both bugs happened here more than once.
- The giant word is decorative (`aria-hidden`); the real `<h1>` is visually hidden so SEO and screen readers still get "Rinshid — Flutter Developer & Digital Marketer". Change the word via the `WORDMARK` constant in `Hero.tsx`.
- The figure is positioned `absolute` with computed offsets so its height can never feed back into the column and push the hero past one viewport.

**The cut-out** is driven by `personalInfo.portraitUrl` — currently `/rinshid-portrait.png`, a 500×500 head-and-shoulders crop with an alpha channel. Leave the field empty and the composition goes type-only, which still reads as finished.

Two things the box depends on:

- **It is square because the photo is.** `object-fit: contain` inside a tall box would letterbox a headshot and shrink the face to a fraction of the width. Swapping in a full-length figure means re-tuning `width` / `height` / `margin-top` on `.art-cutout`.
- **The lower third is masked out.** A background-removed photo ends in a hard horizontal line where the crop stopped, which reads as a sticker pasted on the page; the gradient mask dissolves the torso into the ground instead. It fades to *transparency*, not to a colour, so it works in both themes.

`filter: grayscale(1)` keeps the photo inside the monochrome palette regardless of what is dropped in. The handwritten accent sits above the **start** of the word rather than the end, because the head occupies the top-right corner.

Copy fields in `defaultPersonalInfo`: `heroScript` (the handwritten accent beside the word), `heroBadge` and `taglineEmphasis` (currently unused by the hero — kept for the earlier pitch layout).

Assets: `public/rinshid-portrait.png` is the hero cut-out. Typefaces are Inter, plus Caveat for the logo and the handwritten accent.

`TechCarousel.tsx` is no longer rendered anywhere. The file is kept in case you want it in another section; delete it if not.

### Scroll and card effects

Nine effects live in `src/components/effects/`:

| Effect | Where | What it does |
| --- | --- | --- |
| `ScrollStack` | Case Studies | Each case pins and the previous one scales back and dims behind it, so every result gets the screen to itself |
| `ParallaxCard` | Work grid | Cards drift at slightly different rates, staggered by column so rows still read as rows |
| `CardModal` | Work grid | A card expands into a full detail view via a shared `layoutId`, showing the untruncated description and every store / repo / live link |
| `ScrollMask` | Experience timeline | Fades the block's top and bottom edges with `mask-image`, so a long list stops ending in a hard cut |
| `TextReveal3D` | All nine section titles | Reveals a heading word by word, each hinging up from flat through a shared perspective |
| `CountUp` | About stats, case-study metrics, skill levels | Counts every number in a string up from zero when it scrolls into view |
| `Magnetic` | Hero and navbar CTAs | Pulls the control gently toward the cursor, then springs back |
| `TiltCard` | Work grid | Tips a card toward the pointer in 3D, on top of the grid's parallax |
| `ScrollProgress` | Fixed, page-wide | Hairline at the top of the viewport that fills as the page scrolls |

These were requested as `@reactbits-starter/*` shadcn components (`scroll-mask-tw`, `scroll-stack-tw`, `parallax-cards-tw`, `modal-cards-tw`, `3d-text-reveal-tw`). That registry is **ReactBits Pro** — it needs a paid licence key in `.env.local` plus a Tailwind/shadcn setup this project does not have, and the components are Tailwind (`-tw`) builds. They are therefore written natively against Framer Motion (already a dependency) and this project's CSS custom properties. **No new dependencies were added.**

Notes for editing them:

- `ScrollStack` pins with `position: sticky`. It dies silently if any ancestor sets `overflow: hidden` — keep that off the wrapping section.
- The parent's scroll progress is passed down as a MotionValue so each item can call `useTransform` at the top level of its own component; hooks cannot be called in a loop.
- `ScrollMask` uses `mask-image`, so it fades to transparency rather than to a colour — it works over any background and in both themes without a matching overlay.
- `CardModal` locks body scroll (compensating for the scrollbar so the page doesn't shift), closes on Escape and on backdrop click, moves focus into the panel and returns it to the trigger, and carries `role="dialog"` + `aria-modal`.
- Project cards are now controls: `role="button"`, `tabIndex`, Enter/Space handlers and a visible focus ring.
- `TextReveal3D` splits by **word, not character** — a per-character stagger reads as a slot machine and hands a screen reader a pile of single letters. It recurses through children and only touches text nodes, so `<span className="highlight">` wrappers survive intact and animate along with the rest. The full sentence is exposed via `aria-label` and the animated pieces are `aria-hidden`, so assistive tech reads the heading, not fragments. `perspective` sits on the container, never per word — set per word, each gets its own vanishing point and the line splays.
- `CountUp` counts **every** numeric run in a string, so ranges like `2K → 47K` and `4 → 37` both animate and the surrounding characters (`₹`, `%`, `x`, `+`, arrows) are preserved. Its digit pattern deliberately swallows thousands separators — split naively on `\d+`, `₹25,000` becomes `25` and `000`, and the second renders as `0`, silently turning it into `₹25,0`. At rest it returns the authored token verbatim rather than reformatting, so the final value can never drift with locale grouping.
- `Magnetic` and `TiltCard` attach their handlers only under `(hover: hover) and (pointer: fine)`. On touch, `mousemove` fires once on tap and would leave the element stuck displaced or at an angle.
- `TiltCard` puts `perspective` on the wrapper and rotation on the child — an element cannot be the source of its own perspective, so both on one node renders flat.
- `ScrollProgress` animates `scaleX`, not `width`, so it is composited rather than laying out on every frame.
- All nine collapse to a plain static layout under `prefers-reduced-motion`.

### Theming

Strictly monochrome — pure black ground, pure white ink, greys between. No hues anywhere. Tokens live in `src/styles/global.css`:

| Token | Dark (default) | Light | Role |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#000000` | `#ffffff` | Page ground |
| `--color-bg-secondary` | `#0a0a0a` | `#f4f4f4` | Alternating section band |
| `--color-bg-tertiary` | `#161616` | `#ebebeb` | Cards, inputs, chips |
| `--color-text-primary` | `#ffffff` | `#000000` | Primary ink |
| `--color-text-secondary` | `#a3a3a3` | `#5c5c5c` | Body copy |
| `--color-text-muted` | `#6e6e6e` | `#8a8a8a` | Captions, labels |
| `--color-accent` | `#ffffff` | `#000000` | Fills and emphasis |
| `--color-on-accent` | `#000000` | `#ffffff` | Text that sits **on** an accent fill |
| `--color-warm` | `#8f8f8f` | `#8f8f8f` | De-emphasised word in headings |
| `--color-success` | `#b8b8b8` | `#5a5a5a` | Availability, checks, Marketing track |
| `--line` / `--line-strong` | white at 14% / 32% | black at 14% / 32% | Hairline rules |

Design rules that follow from it:

- **Value, not hue, separates the two tracks.** With no colour available, Development reads as white and Marketing as a step down the same grey scale (`--color-success`). Track chips share the same tinted background; only the label's value differs.
- **Photographs are desaturated.** The hero cut-out carries `filter: grayscale(1)` — a colour photo would otherwise be the only hue on the page.
- **No gradients or coloured glows.** `--gradient-primary` is kept as a variable (the admin API can override it) but resolves to near-flat white.
- **Softly rounded.** `--radius-lg` is `10px` (buttons, icon tiles) and `--radius-xl` is `16px` (cards, panels).
- **Light mode is the exact inverse**, not a different palette.

Anything filled with `--color-accent` must take `color: var(--color-on-accent)`, never a literal `white` or `black` — one of the two modes will make it invisible. Light and dark are applied via a `dark-mode` / `light-mode` class on `<body>`.

Note: `ThemeContext` applies `primaryColor` / `secondaryColor` from the admin API as CSS variables at runtime. If that backend is connected and serving colours, it will reintroduce hue. Leave those fields greyscale (or unset) to keep the theme monochrome.
## Build & Deploy

```bash
npm run build
```

Outputs a static bundle to `dist/`, deployable to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages). Set `VITE_API_BASE_URL` in the host's environment if you use the admin backend — Vite inlines it at build time.

## Notes

- **The contact form does not send anything.** `handleSubmit` in `Contact.tsx` simulates a 1.5s delay then shows success — enquiries are silently lost. `@emailjs/browser` is installed and ready to wire up, or POST to the admin backend.
- `npm run lint` currently reports 5 pre-existing errors (unused imports in `Experience.tsx` / `TechCarousel.tsx`, a `set-state-in-effect` warning in `AnimatedCursor.tsx`, and two `react-refresh/only-export-components` errors from the context files). None block the build.
- The admin backend is a separate Node.js service and is not part of this repository.
