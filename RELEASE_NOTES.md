# Mogoverse Release Notes

## v2.0.0 — Component Architecture + Lead Form Integration (2026-03-28)

### Added
- **Component System** (`/components/`): Shared HTML fragments loaded via JS fetch()
  - `quiz.html` — Interactive 3-round sound quiz (Netflix, Airtel, IRCTC)
  - `logo-wall.html` — 35-brand F1 press conference logo grid with hover testimonial tooltips
  - `testimonials.html` — Horizontal scroll with C-suite headshots (6 photos)
  - `footer.html` — Shared site footer
  - `assets/js/components.js` — Loader: `mogoLoadComponent()` + `mogoComponentPath()`
  - Change once → updates all pages automatically
- **Lead Form on Homepage**: Integrated `lead-form.js` (name + phone + persona flow) into `index.html`
  - "How can we help?" use-case chips in hero
  - Popups (15s timed, exit intent, sticky bar) now via lead-form.js
- **Headshot Photos** (`assets/headshots/`): Raja Rajamannar, Gaurav Verma, Phee Teik Yeoh, Pallavi Singh, Kartik Jain, Dhiren Amin
- **Logo Hover Tooltips**: Amplitude-style — hovering Mastercard/Zomato/HDFC/Vistara/MG/Rupeek shows C-suite testimonial with photo

### Changed
- **Section Ordering** (all 3 pages): Quiz → Logo Wall → Testimonials → BrandMusiq Strip → page content
- **index.html** reduced from 1834 → 1140 lines (component extraction)
- **Microsoft Clarity**: Removed manual script (now loaded via GTM). Kept `clarity()` event calls.
- **Enhanced Conversions**: `mogoTrackEnhancedConversion()` sends user data with every Google Ads conversion
- **UTM Passthrough**: Page URL + referrer added to all dataLayer events
- **Clarity Tagging**: UTM source, medium, campaign, gclid, page type tagged per session

### Pages Updated
- `index.html` — Full component rewrite + lead form integration
- `landing-pages/royalty-free-music-isnt-free-costing-your-brand.html` — Components wired
- `landing-pages/your-brand-has-a-logo-give-mogo.html` — Components wired

### Unchanged
- 6 other landing pages in `/landing-pages/`
- `.github/workflows/deploy-pages.yml`
- All SEO infrastructure (robots.txt, sitemap.xml, JSON-LD schemas)

---

## v1.0.0 — Homepage + SEO Architecture (2026-03-28)

### Added
- **Homepage** (`index.html`): 16-section flagship page for mogoverse.ai
- **SEO Infrastructure**: robots.txt, sitemap.xml, global.css, JSON-LD schemas, OG + Twitter cards
- **Folder Architecture**: `/tools/`, `/sonic-branding/`, `/alternatives/`
- **GTM Tracking**: GTM-TFX2NPMP with dataLayer events
- **35-brand Logo Wall**: F1 press conference style, sorted by valuation
- **Sound Quiz**: Interactive 3-round brand recognition
- **ROI Calculator**: First-ever sonic branding ROI tool
- **FAQ**: 10 AEO-optimized questions with FAQPage schema
