# Maxim Furculita - Portfolio

**Backend & Full-stack Developer.** Bilingual portfolio built with Next.js, React and TypeScript, focused on performance, accessibility and privacy - one functional cookie for the language choice, cookieless analytics, and an animated canvas background that respects `prefers-reduced-motion`.

> This is a **personal portfolio**. It represents the author's own skills, projects and opinions. It is not affiliated with, endorsed by, or sponsored by any of the tools, companies, or technologies mentioned.
>
> The code is provided as-is, without warranty of any kind, to serve as a reference and a starting point for your own portfolio.

---

## Tech Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router, Turbopack) | 16.4.2 | SSG/SSR, file-based routing, metadata API |
| UI | [React](https://react.dev) | 19.3.0 | Component model |
| Language | [TypeScript](https://www.typescriptlang.org) | 5.x | Type safety end to end |
| Styling | [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first design tokens |
| Animation | [Motion](https://motion.dev) | 14.x | Declarative, GPU-friendly transitions |
| i18n | [next-intl](https://next-intl.dev) | 4.14.9 | Locale routing and messages |
| Icons | [react-icons](https://react-icons.github.io/react-icons) | 5.7.x | Lightweight icon set |
| Email | [Resend](https://resend.com) | - | Contact form delivery (API) |
| Analytics | [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics) | - | Cookieless, privacy-friendly |
| Image processing | [sharp](https://sharp.pixelplumbing.com) | - | Offline icon/canvas generation |

---

## Features

- **Full i18n** - `/en` and `/ro` routes, `x-default` → English, `hreflang` alternates in HTML and `sitemap.xml`. The locale lives in the URL, and a single functional cookie remembers the language you pick, so no consent banner is needed.
- **Two animated backgrounds** - aurora and particle systems rendered on a `<canvas>` with device-pixel-ratio clamping and an automatic static fallback under `prefers-reduced-motion`. Clicking the logo toggles between them.
- **Project showcase** - modal-based project viewer with tech icons, brand-colored chips and lazy-loaded covers (screenshots rendered with `unoptimized` images as a deliberate trade-off).
- **Contact form** - client-side validation (per-field errors), in-memory rate limiting (5 requests / 10 minutes / IP), size caps, and server-side delivery through Resend. No honeypot, no silent drops.
- **Privacy-first analytics** - Cloudflare Web Analytics is cookieless and aggregated; no visitor is ever identified.
- **Complete SEO kit** - `sitemap.xml`, `robots.txt`, web manifest, SVG + PNG + maskable icons, Open Graph image, canonical and `hreflang` metadata on every page, plus Person and WebSite structured data with the diacritic name variants as `alternateName`.
- **Accessibility** - WCAG-contrast-safe palette, focus rings, `aria-*` labels, keyboard-reachable controls, and reduced-motion support.
- **Smooth language switching** - scroll position is preserved and entrance animations are skipped for 1 second so switching never feels laggy.

---

## Project Structure

```
.
├── app/
│   ├── [locale]/                  # Locale-scoped routes
│   │   ├── layout.tsx             # Root layout: font, metadata, providers
│   │   ├── page.tsx               # Home page composition
│   │   └── privacy/page.tsx       # Privacy policy (per-language)
│   ├── api/contact/route.ts       # Contact form endpoint (Resend)
│   ├── manifest.ts                # Web app manifest
│   ├── robots.ts                  # robots.txt
│   ├── sitemap.ts                 # sitemap.xml with hreflang alternates
│   ├── icon.svg                   # Favicon
│   ├── apple-icon.png             # iOS icon
│   └── globals.css                # Tailwind CSS + design tokens
├── components/
│   ├── background/                # Canvas aurora / particles renderers
│   ├── layout/                    # Header, language toggle, mobile nav
│   ├── providers/                 # Motion, background, analytics providers
│   ├── sections/                  # Hero, Services, Projects, Skills, About, Contact, Footer
│   └── ui/                        # Cards, modal, reveal, scroll hint
├── i18n/                          # next-intl routing & locale request
├── lib/                           # Site config, motion tokens, project/skill data
├── messages/                      # en.json, ro.json translations
├── public/
│   ├── cv/                        # Downloadable CV PDFs
│   ├── icons/                     # Generated 192/512/maskable PNGs
│   ├── og-image.png               # 1200×630 Open Graph card
│   └── projects/                  # Project cover images
├── scripts/
│   └── generate-icons.mjs         # Icon generation (sharp)
├── proxy.ts                       # next-intl middleware (locale redirect for `/`)
└── next.config.ts
```

Key files:

- `proxy.ts` - redirects `/` to the visitor's stored locale (`NEXT_LOCALE` cookie), otherwise hands off to next-intl.
- `lib/motion.ts` - central animation tokens (durations, eases, stagger variants).
- `lib/site.ts` - single source of truth for domain, site name and name variants.
- `lib/structured-data.ts` - Person + WebSite JSON-LD with `alternateName` for the diacritic spellings.
- `components/providers/analytics.tsx` - Cloudflare beacon (no-ops without a token).

---

## Getting Started

### Prerequisites

- **Node.js 20.x+** (Next.js 16 requirement)
- npm (or your preferred package manager)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/maxf-coder/portfolio-website.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Set environment variables (see below)
cp .env.example .env.local
# then edit .env.local with your real values

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The locale redirects: `/` picks up your stored language, or defaults to English at `/en`.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes* | Resend API key for the contact form. *Marked required only if you want the form to work. |
| `CONTACT_TO` | Yes* | Recipient email for form submissions. |
| `CONTACT_FROM` | Yes* | Sender identity shown to the recipient. |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | No | Cloudflare Web Analytics beacon token. The component stays inert without it. |

\* The site runs without the contact variables - the form simply returns a server error instead of sending.

Note that `NEXT_PUBLIC_*` values are inlined at build time: after changing `.env.local`, restart the dev server (or rebuild for production).

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server (Turbopack). |
| `npm run build` | Production build with type checks. |
| `npm start` | Serve the production build. |
| `npm run lint` | ESLint across the codebase. |
| `node scripts/generate-icons.mjs` | Regenerate `public/icons/*.png` (192, 512, maskable) from `app/icon.svg`. |

---

## Deployment

The site is designed for [Vercel](https://vercel.com):

1. Push the repository to GitHub and import it in Vercel (framework preset: **Next.js** - auto-detected).
2. Add the same environment variables in *Project → Settings → Environment Variables*.
3. Connect your domain (`maximf.com`) and point the DNS record at Vercel.
4. Deploy. Build logs will confirm linting, type-checking and cache-components.

After the first deploy:

- Submit the contact form once and confirm the email arrives.
- Verify the Cloudflare Web Analytics beacon loads (needs the beacon token set before the build).
- Run [PageSpeed Insights](https://pagespeed.web.dev) against the production URL to validate real-world Core Web Vitals.

---

## Technical Notes

- **Locale and state** - changing the language remounts the `[locale]` tree (the route segment). To keep the experience seamless, scroll position is persisted in `sessionStorage` and restored on mount, and Motion's global `skipAnimations` is enabled for 1 second during the switch so entrances don't replay.
- **Analytics honesty** - the analytics beacon sends aggregated, anonymous metrics only; no IPs are stored by Cloudflare and analytics uses no cookies. The only cookie is the language preference. The privacy policy (in `/privacy`) reflects exactly this.
- **Animation budget** - the hero title is intentionally not opacity-animated (it slides) so the Largest Contentful Paint stays close to First Contentful Paint, while secondary content still staggers in.
- **Images** - project covers are served `unoptimized` per design choice and resized with `sharp` (600px wide) to keep the bundle light.

---

## License

© 2026 Maxim Furculita - All rights reserved.

This repository is a personal portfolio. Reuse the code as a reference; if you build on it visibly, link back to the original.