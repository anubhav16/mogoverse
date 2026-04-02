# Mogoverse Release Notes

## v2.6.7 — Fix: Hamburger nudge disappears after CTA click without form submit (2026-04-03)

### Bug Fix
- **Nudge permanently hidden on CTA tap**: `mogoHamburgerCTA()` was explicitly setting `nudge.style.display = 'none'` when the button was tapped. If the user dismissed the popup without submitting, the nudge was gone for the rest of the session — only `anyFormSubmitted` should suppress it
- **Fix**: Removed `nudge.style.display = 'none'` from `mogoHamburgerCTA()`. Menu closes (`.mobile-open` removed), nudge reappears naturally on next menu open since `anyFormSubmitted` is still false

### Files changed
- 1 modified (`assets/js/lead-form.js` +1/-2)

---

## v2.6.6 — Fix: Hamburger nudge CTA not rendering (2026-04-03)

### Bug Fix
- **Nudge suppressed permanently**: The `localStorage.getItem('mogo_form_submitted')` check blocked the nudge for any user who had ever submitted a form (including testing). Removed cross-session check — nudge now only suppresses when `popupState.anyFormSubmitted` is true in the **current session**
- **Nudge width in flex container**: Added `width:100%; box-sizing:border-box` to `.nav-lead-nudge` so the dark card fills the full menu width when displayed as a flex child

### Files changed
- 2 modified (`assets/js/lead-form.js` +1/-2, `assets/css/global.css` +2/-0)

---

## v2.6.5 — Fix: Mobile Nav 3 Bugs (hamburger bars, menu auto-close, scroll offset) (2026-04-03)

### Bug Fixes
- **Bug 1 — Hamburger bars invisible**: Changed `.hamburger` mobile rule from `display:block` to `display:flex; flex-direction:column; align-items:center; justify-content:center` — this properly centres the 3 `<span>` bars inside the touch target
- **Bug 2 — Menu stays open after link tap**: Added delegated `click` listener on `#navLinks` inside `mogoToggleNav` — tapping any `<a href>` inside the open menu now removes `.mobile-open`, resets hamburger state, and hides the nudge
- **Bug 3 — Section heading hidden under fixed nav**: Added `html { scroll-padding-top: 72px }` inside `@media (max-width: 768px)` — anchors now scroll to a position that clears the ~60px fixed nav bar

### Files changed
- 2 modified (`assets/css/global.css` +3/-1, `assets/js/lead-form.js` +9/-0)

---

## v2.6.4 — Fix: Homepage Mobile Nav CTA Overflow (2026-04-03)

### Bug Fix
- **Root cause**: `.nav-cta` was a flex sibling of `.hamburger` in the homepage nav. On mobile, `.logo-group { flex:1 }` consumed remaining space, pushing `.nav-cta` to render as a large dark block at its natural `inline-flex` size
- **Fix**: Hide `.nav-cta` on mobile (`display: none` inside `@media (max-width: 768px)`)
- **CTA preserved in mobile menu**: Added `<li class="nav-cta-mobile">` as last item in `<ul class="nav-links">` — shown only when menu is open, hidden on desktop via `.nav-cta-mobile { display: none }` default rule
- **Landing pages unaffected**: Use inline `<style>` tags, not `global.css`

### Files changed
- 2 modified (`assets/css/global.css` +14/-1, `index.html` +2/-1)

---

## v2.6.3 — Performance: Defer Popup + Sticky Bar Init (2026-04-03)

### Performance
- **Sticky bar deferred 2s**: `mogoInitStickyBar` now runs via `setTimeout(..., 2000)` instead of at DOMContentLoaded — DOM node creation and `IntersectionObserver` attachment no longer block LCP
- **Popup init deferred 5s**: `mogoInitPopups` now runs via `setTimeout(..., 5000)` — `mouseout` listener and `popupState` wiring happen after first paint. Timed popup still fires at ~20s total (5s init + 15s internal timer); exit intent active from 5s onward
- **Ad pages unaffected**: existing `/ad/` guard still skips both inits entirely

### Files changed
- 1 modified (`assets/js/lead-form.js`, +3/-2 lines)

---

## v2.6.2 — Performance: Top 10 Images Converted to WebP (2026-04-03)

### Performance
- **10 priority images converted PNG → WebP**: tata-salt, saffola, rcb, bkt-tyres, toyota-bmq, nestle (logos) + pallavi-singh, raja-rajamannar, gaurav-verma, dhiren-amin (headshots)
- **Total savings: 222KB / 81% reduction** (273KB PNG → 51KB WebP) — directly addresses Lighthouse image-delivery-insight finding (676KB total savings available; these 10 are the highest-impact subset)
- **No `<picture>` fallback needed**: WebP supported in all target browsers (Safari 14+ / 2020+)
- **CLS unaffected**: All `width`/`height` attributes preserved on logo `<img>` tags and testimonial headshot rendering
- **Original PNGs retained on disk** for remaining logo-wall images not yet converted

### Files changed
- 2 modified (`components/logo-wall.html`, `components/testimonials.html`)
- 10 new files (`assets/logos/*.webp` × 6, `assets/headshots/*.webp` × 4)

---

## v2.6.1 — Performance: Render-Blocking Fix Rolled Out to All Pages (2026-04-03)

### Performance
- **All 9 remaining pages fixed**: `@import` Google Fonts replaced with `<link rel="preconnect">` + `<link rel="stylesheet">` across all landing pages and homepage
- **global.css @import removed**: `index.html` now loads Inter directly via `<link>` before `global.css` — eliminates the double render-block (blocking CSS → blocking @import inside it)
- **lead-form.css async on 3 more pages**: `royalty-free-music-isnt-free`, `ad/brand-sound-identity`, `ad/royalty-free-music` — now preload/onload pattern with `<noscript>` fallback
- **Font weights trimmed site-wide**: All pages now load Inter `wght@400;600;700;800;900` only (dropped 300 + 500, confirmed unused)
- **GTM preconnect added site-wide**: `preconnect` + `dns-prefetch` for `www.googletagmanager.com` on all pages

### Files changed
- 9 modified (`landing-pages/*.html`, `landing-pages/ad/*.html`) + `index.html` + `assets/css/global.css`

---

## v2.6.0 — Landing Page Performance: Render-Blocking Fix (2026-04-02)

### Performance
- **Google Fonts @import removed**: Moved from render-blocking `@import` inside `<style>` to `<link rel="stylesheet">` with `preconnect` hints — saves ~958ms on FCP (mobile)
- **Font weights trimmed**: Dropped Inter 300 and 500 (confirmed unused by Lighthouse) — loads 400/600/700/800/900 only
- **lead-form.css async-loaded**: Replaced blocking `<link rel="stylesheet">` with `<link rel="preload" as="style" onload>` pattern — saves ~230ms. Safe: form is JS-injected after DOMContentLoaded, no FOUC risk
- **GTM preconnect added**: `<link rel="preconnect">` + `<link rel="dns-prefetch">` for `www.googletagmanager.com`

### Target
- Baseline: Performance 67, LCP 9.4s, FCP 3.1s (mobile)
- Goal: Performance 90+ (multi-step plan — this is Step 1 of 5)

### Files changed
- 1 modified (`landing-pages/your-brand-has-a-logo-give-mogo.html`, +10/-2 lines)

---

## v2.5.1 — Fix Asset Paths on Landing Pages (2026-03-29)

### Bug Fix
- **Asset 404s on landing pages**: Logo images, HQ logos, and MOGO audio files returned 404 on `/landing-pages/` routes because the base-path (`bp`) only detected `/mockups/` subdirectory
- **Fix**: `bp` detection now includes `/landing-pages/`, prepending `../` to all relative asset paths

### Files changed
- 1 modified (`landing-pages/sonic-branding-platform.html`)

---

## v2.5.0 — Mobile Conversion UX + Ad Campaign Prep (2026-03-29)

### Mobile UX (all pages)
- **Nav CTA right-aligned**: `.logo-group { flex: 1 }` pushes "Get Early Access" + hamburger to far right
- **Hero cognitive load reduced**: Eyebrow hidden, subtitle trimmed to 1 line, purple value prop bridge added
- **Quiz-first on mobile**: Homepage quiz renders before text+form via CSS `order: -1` (foot-in-the-door)
- **Card spacing**: `.problem-grid` gap 24→16px, card padding 32→24px on mobile

### Sticky Bottom Bar
- **Hero-aware show/hide**: Uses `IntersectionObserver` — appears when hero scrolls out, hides when hero returns (was: fixed 30% scroll threshold)
- **Slimmed down**: Single-line, 8px padding, subtitle hidden, better copy

### Logo Wall
- **Mobile testimonials**: Tap a logo → bottom sheet slides up (was: hidden on mobile)
- **Scroll hint blink**: Logos with testimonials pulse once when wall enters viewport

### Ad Campaign Landing Pages
- **2 ad LPs created**: `landing-pages/ad/royalty-free-music.html` and `brand-sound-identity.html`
- **Ad pages optimized**: No nav links, no popups, no sticky bar, ~8KB each
- **noindex**: Added to all 4 ad-targeted pages
- **Existing LPs trimmed**: Earpoints section hidden, videos trimmed to top 3, "True Cost" section removed

### Content
- **BrandMusiq reduced**: Removed from sticky bar, form notes, logo wall label, stats bar, case studies desc — kept in nav, footer, testimonial quotes
- **$0/mo removed**: Replaced with "ready in minutes" across all pages and meta tags
- **Value prop added**: Mobile-only purple line between subtitle and form on all pages

### Files changed
- 16 modified, 2 new (`landing-pages/ad/`)

---

## v2.4.1 — Lighthouse A11Y & SEO Polish (2026-03-29)

### Accessibility
- **Quiz play button**: Added `aria-label="Play brand sound quiz"` (was failing button-name audit)
- **Quiz label contrast**: `#999` → `#767676` on play label (inline + CSS rule)
- **Lead form CTA note**: `.mogo-cta-note` contrast `#999` → `#767676` in lead-form.css

### SEO
- **Meta descriptions**: Added to `your-brand-has-a-logo-give-mogo` and `royalty-free-music-isnt-free-costing-your-brand` LPs (were missing, SEO 92 → 100)

### Results
- A11Y: 71 → **92-96** across all pages
- SEO: 85 → **100** across all pages

---

## v2.4.0 — Lighthouse Performance, Accessibility & SEO Fixes (2026-03-29)

### Performance
- **Image optimization**: Resized 41 PNG/JPG images (logos max 200px, headshots max 128px). Total image weight: 5.2MB -> 964KB (81% reduction)
- **Render-blocking scripts removed**: `tracking.js` and `components.js` now use `defer` on homepage + all 8 landing pages
- **Non-critical CSS deferred**: `lead-form.css` loads with `media="print"` + `onload` swap
- **Preload hints removed**: Removed 3 `<link rel="preload">` for below-fold components
- **CLS fix**: Added explicit `width`/`height` attributes to all logo-wall (35), testimonial headshot, and landing page client logo images

### Accessibility
- **`<main>` landmark**: Added to homepage and all 8 landing pages
- **Form labels**: Added `sr-only` labels to all dynamically-generated lead form inputs (name, phone, country code, persona select). Added `for` attributes to ROI calculator labels.
- **Color contrast (WCAG AA)**: Bumped muted text colors from `#999`/`#888`/`#bbb` to `#767676` on light backgrounds across CSS tokens, homepage inline styles, and all LP inline styles
- **Video card keyboard access**: Added `role="button"`, `tabindex="0"`, `aria-label`, and `onkeydown` handlers to all 6 case study video cards
- **Iframe titles**: Added `title` to GTM noscript iframe and YouTube video modal iframe on all pages

### SEO
- **robots.txt**: Fixed space-in-path (`/business files/` -> `/business%20files/`) — was causing ~1023 crawl errors
- **Canonical tags**: Added `<link rel="canonical">` to all 8 landing pages
- **Crawlable nav CTA**: Removed `javascript:void(0)` href override in lead-form.js

---

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
