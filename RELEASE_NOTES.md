# Mogoverse Release Notes

## v2.3.0 — Logo Wall Dark Theme, Footer Fix, Testimonial Polish (2026-03-29)

### Fixed
- **Logo wall**: White cells on dark navy bg — original brand colors preserved (no more brightness/invert filter). Logos 48px. Dark bg creates section contrast rhythm.
- **Black bleed-through**: Removed `position:fixed` brand reveal that was bleeding through transparent sections. Now static at bottom.
- **Testimonials**: Replaced "BrandMusiq" with "They" (Zomato) and "Rajeev and team" (Vistara). Bigger fonts (quote 16px, name 17px, title 14px).
- **LP hero padding**: 140px→100px desktop, 100px→76px mobile (form visible in first fold)
- **Quiz lead form**: Post-quiz uses shared lead-form.js with `quiz_result` source identifier
- **Mobile UX**: 16 fixes (touch targets ≥44px, grid collapses, font sizing)
- **Popup stacking**: Timed popup won't override exit intent and vice versa
- **Exit intent**: Now uses same white style as timed popup

---

## v2.2.0 — UI Polish: Light Quiz, Bigger Logos, Footer Reveal (2026-03-28)

### Fixed
- **Lead form** back inside hero on landing pages (was in standalone section below)
- **Quiz**: frosted glass light mode (was too dark), purple next button, proper hover states
- **Logo wall**: 44px logos (was 36px), tooltip hover now works (position:relative fix)
- **Testimonials**: light gray bg (was dark navy, clashed with adjacent sections)
- **Landing page footer**: minimal (logo + copyright only, no SEO links)
- **Footer curtain-lift reveal**: Amplitude-style sticky footer, content slides over it
- **Comparison text**: left-aligned in landing pages

---

## v2.1.0 — Quiz Polish + Logo Quality + Landing Page Heroes (2026-03-28)

### Changed
- **Quiz component**: Thinner option buttons with dark-bg contrast, purple hover glow, animated wave bars while audio plays, "0.15 seconds — faster than you can blink"
- **Logo wall**: All 35 logos now real images from BrandMusiq CDN (zero hand-crafted SVGs), softer grid dividers, more padding, sharper rendering
- **Landing page heroes**: Quiz moved into hero right column (first fold) on both royalty-free and give-mogo pages
- **Lead form**: Moved below hero as standalone section on landing pages
- **"How can we help?"**: Removed from all 3 pages

### New logo downloads from BrandMusiq
Mastercard, Amazon Pay, Toyota, Tata, HDFC Bank, Infosys, Asian Paints, Zomato, Raymond, Vistara — all replaced crude SVGs with real brand PNGs

---

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
