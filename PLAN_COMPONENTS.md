# Mogoverse — Component Architecture + Feature Rollout Plan

**Overall Progress:** `0%`
**Affected Pages:** `index.html`, `landing-pages/royalty-free-music-isnt-free-costing-your-brand.html`, `landing-pages/your-brand-has-a-logo-give-mogo.html`

---

## TLDR

Extract shared UI sections into `/components/` as standalone HTML fragments loaded via JS. Add Microsoft Clarity, Google Ads Enhanced Conversions, performance optimizations, and new testimonial UX. Apply to 3 pages with single source of truth per component.

---

## Critical Decisions

1. **JS fetch() includes** — Components load at runtime via `mogoLoadComponent(id, path)`. Zero build step. Works on GitHub Pages.
2. **Logo hover** — Only brands with testimonials show tooltip popup. Others: no hover action.
3. **Headshots** — Initials as placeholder. User provides photos later.
4. **Google Ads** — Wire dataLayer events for Enhanced Conversions. User creating conversion labels in G Ads console.
5. **Microsoft Clarity** — Project ID: `w2uv9zdrgv`

---

## Component Inventory

| Component | File | Used In |
|---|---|---|
| Logo Wall (35 brands) | `/components/logo-wall.html` | index, royalty-free, give-mogo |
| Sound Quiz (3 rounds) | `/components/quiz.html` | index, royalty-free, give-mogo |
| Testimonials (7 quotes, hover tooltip) | `/components/testimonials.html` | index, royalty-free, give-mogo |
| Lead Form (multi-step) | Already exists: `assets/js/lead-form.js` + `assets/css/lead-form.css` | All pages |
| Tracking (GTM + Clarity + Ads) | `/components/tracking.html` | All pages |
| Footer | `/components/footer.html` | index, royalty-free, give-mogo |

---

## Tasks

### Phase 0: Component Loader + Tracking

- [ ] **Step 1: Create component loader system**
  - Create `assets/js/components.js` — tiny loader function (~20 lines)
  - `mogoLoadComponent(containerId, componentPath)` — fetches HTML, injects into container, executes inline scripts
  - Preload hints in `<head>` for performance
  - **AC**: Component loads and renders in <200ms on localhost

- [ ] **Step 2: Add Microsoft Clarity + update tracking.js**
  - Add Clarity snippet (w2uv9zdrgv) to tracking.js (single source)
  - Add `clarity('set', ...)` calls for key events (quiz, calculator, form)
  - Add Enhanced Conversion data to GTM dataLayer pushes
  - Ensure UTM params captured and forwarded to all form submissions
  - **AC**: Clarity loads on all pages, events visible in Clarity dashboard

### Phase 1: Extract Components

- [ ] **Step 3: Extract logo wall → `/components/logo-wall.html`**
  - Move 35-logo grid from index.html to component file
  - Include CSS inline in component (or reference global.css)
  - Testimonial data embedded as `data-*` attributes on logo cells that have quotes
  - Logo hover tooltip JS included
  - **AC**: Logo wall renders identically on all 3 pages via component loader

- [ ] **Step 4: Extract quiz → `/components/quiz.html`**
  - Move quiz HTML + JS + audio refs to component file
  - Quiz initializes after component loads
  - **AC**: Quiz works on all 3 pages (audio plays, scoring works, GTM fires)

- [ ] **Step 5: Extract testimonials → `/components/testimonials.html`**
  - New design: single visible card, horizontal scroll left/right
  - 7 testimonials from BrandMusiq BrandSpeak section
  - Initials as avatar placeholder (swappable to photos later)
  - Auto-scroll pauses when user interacts
  - **AC**: One card visible, scroll indicators work, auto-scroll works

- [ ] **Step 6: Extract footer → `/components/footer.html`**
  - Move footer from index.html to component
  - **AC**: Footer renders on all 3 pages

### Phase 2: Testimonial UX + Logo Hover

- [ ] **Step 7: Logo hover testimonial tooltip**
  - When hovering a logo that has a testimonial, show Amplitude-style tooltip
  - Tooltip: quote + name + title + initials/photo
  - Non-intrusive: positioned adjacent to logo, semi-transparent bg
  - Only 7 of 35 logos have testimonials (Mastercard, Zomato, HDFC, Vistara, MG, Rupeek, NTUC)
  - Logos without testimonials: no hover action
  - **AC**: Hover Mastercard → tooltip appears with Raja Rajamannar quote. Hover Tata → nothing.

### Phase 3: Section Reordering + Lead Form Integration

- [ ] **Step 8: Reorder sections across all 3 pages**
  - index.html order: Nav → Hero → Quiz → Logo Wall → Testimonials → BrandMusiq Strip → Problem → Gap → How It Works → Earpoints → Stats → Case Studies → Calculator → Pricing → FAQ → CTA → Footer
  - Landing pages: Nav → Hero + Form → Quiz → Logo Wall → Testimonials → [page-specific content] → CTA + Form → Footer
  - "Built on 14 years of BrandMusiq" as thin strip (not full credential box)
  - **AC**: All 3 pages have correct section order

- [ ] **Step 9: Integrate lead-form.js into index.html**
  - Replace custom hero form with `mogoRenderLeadForm('heroLeadForm', 'hero')`
  - Include lead-form.js + lead-form.css
  - **AC**: Lead form in index.html matches give-mogo page form exactly

### Phase 4: Performance + Analytics

- [ ] **Step 10: Lighthouse 90+ optimization**
  - Defer all non-critical JS (quiz, calculator, testimonials)
  - Preload critical CSS (above-fold styles)
  - Lazy-load all images below fold
  - Inline critical CSS for first paint
  - Minimize render-blocking resources
  - Add `loading="lazy"` to all below-fold images
  - Compress/optimize images where possible
  - **AC**: Lighthouse desktop ≥90, mobile ≥85

- [ ] **Step 11: UTM passthrough + Google Ads Enhanced Conversions**
  - Ensure UTM params from landing URL are stored and sent with every form submission
  - Add `enhanced_conversion_data` to gtag conversion events (email, phone)
  - Fire `gtag('event', 'conversion', ...)` with Enhanced Conversion data on form submit
  - Document what user needs to configure in Google Ads (Enhanced Conversions toggle)
  - **AC**: Form submission includes UTM params + email hash in dataLayer. Conversion event fires.

### Phase 5: Regression

- [ ] **Final: Regression sweep**
  - All 3 pages render correctly
  - All forms submit and track
  - Quiz works on all pages
  - Logo wall renders on all pages
  - Testimonials work on all pages
  - GTM + Clarity fire on all pages
  - No console errors
  - Lighthouse scores verified
