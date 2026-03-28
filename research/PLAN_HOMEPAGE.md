# Mogoverse Homepage + SEO Architecture — Implementation Plan

**Overall Progress:** `0%`

---

## TLDR

Build the flagship homepage for mogoverse.ai — a 16-section, SEO/AEO-optimized page that synthesizes 8 existing landing page angles into one conversion-focused narrative. Includes interactive sound quiz, first-ever sonic branding ROI calculator, full structured data graph, and scalable pillar/cluster folder architecture. Also standalone tool pages (`/tools/`) and SEO content cluster pages (`/sonic-branding/`, `/alternatives/`). All pages get GTM tracking (`GTM-TFX2NPMP`).

---

## Critical Decisions

1. **Static HTML, no framework** — Matches existing landing pages. Zero build step, GitHub Pages deploys on push. SSR not needed because there's no client-side rendering framework to worry about (unlike Audity's fatal React SPA mistake).

2. **Audio served from repo** — 3 MP3 files total (Airtel, Netflix, IRCTC) at ~1-3MB each. Lazy-loaded on user interaction. No CDN needed at this scale. Videos stay as YouTube embeds (zero hosting cost, already have video IDs).

3. **Pillar/cluster folder structure** — `/sonic-branding/`, `/alternatives/`, `/tools/` as separate URL paths. Landing pages stay isolated in `/landing-pages/` for paid campaigns. Scalable for future keyword clusters.

4. **AEO baked in from day 1** — FAQPage schema, definitive citable statements, Organization schema with BrandMusiq heritage, SoftwareApplication schema (price=0 for rich snippets). No competitor does this well — first-mover advantage.

5. **ROI calculator = first-ever in category** — No sonic branding ROI calculator exists anywhere online (verified via competitor research). Every formula backed by sourced data (MusicGrid, SoundOut, Sixieme Son).

6. **GTM on every page** — Existing `assets/js/tracking.js` (GTM-TFX2NPMP + Google Ads AW-18045691311) included on all new pages. New dataLayer events for quiz completion, calculator interaction, and pillar page engagement.

7. **Sound quiz as engagement hook** — Play Airtel/Netflix/IRCTC audio, user guesses brand from 3 options. Lead capture after quiz completion. Shareable result for virality.

8. **Navigation links landing pages** — Homepage nav includes links to pillar pages and tools. Landing pages remain self-contained (no back-navigation to homepage) to preserve ad campaign isolation.

---

## Reuse Inventory

Existing assets to reuse (DO NOT rewrite):

| File | What It Provides | Used In |
|---|---|---|
| `assets/js/tracking.js` | GTM + Google Ads + UTM capture + conversion functions | Every new page |
| `assets/logos/*.png/svg` | 12 client brand logos (Mastercard, Zomato, HDFC, etc.) | Homepage trust wall, all pages |
| `assets/audio-logos/netflix-tadum.mp3` | Netflix ta-dum audio | Sound quiz |
| `assets/audio-logos/airtel-signature-tune.mp3` | Airtel signature tune | Sound quiz |
| `assets/audio-logos/indian-railways-jingle.mp3` | Indian Railways jingle | Sound quiz |
| `landing-pages/*.html` | Design system: Inter font, navy #1a1a2e / purple #6d28d9, grid layouts, form patterns, popup logic, testimonials, YouTube video embed IDs | Copy CSS patterns + content |
| `.github/workflows/deploy-pages.yml` | Auto-deploy on push to main | No changes needed |

### YouTube Video IDs (from existing landing pages)
Already embedded across landing pages — reuse these for case study sections:
- Mastercard sonic identity videos
- Zomato MOGO
- MG Motors, Vistara, Raymond, RCB MOGOs

### Key Content Blocks to Extract (from landing pages)
- 6 C-suite testimonials (Raja Rajamannar, Gaurav Verma, Phee Teik Yeoh, Pallavi Singh, Shalabh Atray, Kartik Jain)
- Multi-step lead form HTML/JS (email → phone → day/time)
- Popup system (15s timed + exit intent + sticky bar)
- Stats: 40+ brands, 2.5M+ earpoints, 89% recall, 86% engagement lift

### Key Content from BMQ Deck (extracted)
- Opening hook: "If the whole world were blind, how would your brand be recognised?"
- Core claim: "MOGO is the new LOGO"
- MUSE framework: Avatar (4 archetypes) + Rasa (9 emotions) → Sonic Mapping → MOGOSCAPE/MOGO/Mini MOGO
- Mastercard: 57M merchant outlets, 5x Best Audio Brand winner (2020-2024), regional adaptations (Middle East, LatAm, India)
- Client sectors: Financial Services, E-Com, FMCG, Lifestyle
- BrandMusiq: 14 years, 40+ brands
- Earpoints: TV, Social, App, Spaces, Customer Service, ATM, In-flight, Delivery notifications

### Key Data from Market Research (for ROI calculator + FAQ)
- 96% brand recall increase with sonic vs visual alone (MusicGrid/Ipsos)
- 191% brand awareness lift in first 2 seconds (SoundOut Index 2025)
- 9x more effective attribution with sonic logos containing brand names (SoundOut 2025)
- 0.146s sound recognition vs 0.4s visual (MusicGrid)
- 77% consumer trust increase after sonic identity (Mastercard/GfK)
- +76% brand power, +138% ad effectiveness (Sixieme Son)
- +38% recall, +70% appeal (Tostitos/MusicGrid)
- +20% purchase intent with retail audio (MusicGrid)
- 2.2B Content ID claims on YouTube (2024, TorrentFreak)
- Agency pricing: $15K-$500K verified
- Suno: $300M ARR, 2M paid subs (TechCrunch)
- 44% of major brands lack sonic identity (amp Best Audio Brands)

---

## Blast Radius

| At Risk | Why | Regression Check |
|---|---|---|
| `landing-pages/*.html` | Homepage links TO these, but must not modify them | Open each landing page URL, verify layout + forms + tracking unchanged |
| `assets/js/tracking.js` | Shared across all pages — must not modify | Verify GTM fires on existing landing pages after deploy |
| `.github/workflows/deploy-pages.yml` | Deploys entire repo — new files auto-deploy | Verify workflow still deploys and all existing URLs resolve |
| `assets/logos/*` | Referenced by relative path from landing pages (`../assets/logos/`) | Verify logo images load on existing landing pages |
| `assets/audio-logos/*` | Currently unused in landing pages but referenced by quiz | Verify files exist and play correctly |

### Consumer & Ownership Checks

- **tracking.js**: Called from every landing page via `<script src="../assets/js/tracking.js">`. Homepage will use `<script src="assets/js/tracking.js">` (one level up). No modifications to the file itself.
- **deploy-pages.yml**: Deploys root `.` — all new files auto-included. No changes needed.
- **Logo paths**: Landing pages use `../assets/logos/`, homepage will use `assets/logos/`. Different relative paths, same files.

---

## Keyword Targeting Strategy

### Homepage Primary Keywords
| Keyword | Volume (USA) | Volume (India) | KD | Intent |
|---|---|---|---|---|
| sonic branding | 720 | 260 | 26 | Informational |
| audio branding | 590 | 170 | 11 | Informational |
| audio logo | 1,000 | 1,000 | 19 | Informational |
| AI music generator for brands | — | — | — | Commercial |
| sonic branding platform | — | — | — | Commercial |
| MOGO sonic identity | — | — | — | Branded |

### Tool Pages Keywords
| Keyword | Opportunity | Target Page |
|---|---|---|
| sonic branding ROI | First-ever calculator — zero competition | `/tools/sonic-branding-roi-calculator.html` |
| sonic branding quiz | Interactive — zero competition | `/tools/sound-quiz.html` |

### Pillar/Cluster Keywords (Phase 3)
| Keyword | Volume | KD | Target Page |
|---|---|---|---|
| suno alternative | 210 | 18 | `/alternatives/suno-alternative.html` |
| epidemic sound alternative | 90 | 6 | `/alternatives/epidemic-sound-alternative.html` |
| artlist alternative | 70 | 4 | `/alternatives/artlist-alternative.html` |
| what is sonic branding | 480 | 26 | `/sonic-branding/index.html` |
| sonic branding cost | 0 (but high AEO potential) | — | `/sonic-branding/sonic-branding-cost.html` |

---

## Tasks

### Phase 1: Homepage + SEO Infrastructure

- [ ] :red_square: **Step 1: Create site scaffolding + SEO infra**
  - [ ] :red_square: Create `robots.txt` — allow all crawlers, disallow `/business files/`, `/research/`, `/mockups/`, point to `sitemap.xml`
  - [ ] :red_square: Create `sitemap.xml` — list all existing landing pages + homepage + placeholder entries for tools and pillar pages (add as built)
  - [ ] :red_square: Create `assets/css/global.css` — extract shared design tokens from landing pages (colors, typography, grid system, button styles, form styles). Landing pages keep their inline styles; new pages reference this shared CSS
  - [ ] :red_square: Create folder structure: `/tools/`, `/sonic-branding/`, `/alternatives/`
  - **Acceptance Criteria**:
    - `robots.txt` exists at repo root, contains `Disallow: /business files/`, `Sitemap:` directive
    - `sitemap.xml` is valid XML, lists homepage + all 8 landing pages with correct URLs under `mogoverse.ai`
    - `global.css` contains color variables, Inter font import, responsive grid classes, button/form base styles matching existing landing page design system
    - Empty folders exist for `/tools/`, `/sonic-branding/`, `/alternatives/`
    - Existing landing pages load unchanged (no file modifications)
  - **Test Input**: Validate `sitemap.xml` structure with `xmllint` or manual inspection. Load any existing landing page, confirm no changes.
  - **Gate**: Do NOT proceed to Step 2 until Step 1 criteria are confirmed PASS :white_check_mark:

- [ ] :red_square: **Step 2: Build homepage — structure + hero + navigation**
  - [ ] :red_square: Create `index.html` at repo root
  - [ ] :red_square: `<head>`: meta description (targeting "sonic branding platform" + "AI audio branding"), Open Graph tags, Twitter cards, canonical URL (`https://www.mogoverse.ai/`), Inter font, `global.css`, viewport meta
  - [ ] :red_square: Navigation bar: Mogoverse logo + "by BrandMusiq" branding, links to pillar sections (Sonic Branding, Tools, Case Studies), "Get Early Access" CTA button. Mobile hamburger menu
  - [ ] :red_square: Hero section: H1 = "MOGO is the New LOGO" (from BMQ deck), subheading = "Enterprise-quality sonic branding. Self-serve pricing. Powered by BrandMusiq — creators of Mastercard's sound.", CTA = "Get Early Access" linking to `#signup`. Eyebrow badge: "The world's first self-serve sonic branding platform"
  - [ ] :red_square: Include `assets/js/tracking.js` via script tag + GTM noscript iframe
  - [ ] :red_square: JSON-LD in `<head>`: Organization schema (BrandMusiq parent, 14 years, founder, social links), WebSite schema, WebPage schema
  - **Acceptance Criteria**:
    - `index.html` loads in browser with no console errors
    - H1 renders "MOGO is the New LOGO"
    - Meta description contains target keywords
    - OG tags render when URL is pasted in social preview tools
    - Navigation links are present and styled (mobile responsive)
    - GTM fires `mogo_pageview` event in dataLayer (check browser console)
    - JSON-LD validates at schema.org validator (Organization + WebSite + WebPage)
  - **Test Input**: Open `index.html` in browser. Inspect `<head>` for meta/OG/schema. Check `window.dataLayer` in console for GTM event. Resize to mobile width, verify hamburger menu.
  - **Gate**: Do NOT proceed to Step 3 until Step 2 criteria are confirmed PASS :white_check_mark:

- [ ] :red_square: **Step 3: Build homepage — Sound Quiz section**
  - [ ] :red_square: Section with heading: "Can You Recognize These Brands By Sound Alone?"
  - [ ] :red_square: 3-round quiz: Round 1 = Netflix ta-dum, Round 2 = Airtel signature tune, Round 3 = Indian Railways jingle
  - [ ] :red_square: Each round: play button (loads audio on click, NOT auto-play), 3 brand options as clickable cards (correct + 2 decoys), instant feedback (correct/wrong animation), fun fact about the brand's sonic identity after answer
  - [ ] :red_square: Score display after 3 rounds: "You got X/3 — Sound is more memorable than you think. That's the power of a MOGO."
  - [ ] :red_square: Post-quiz CTA: "Want your brand to be this recognizable? Get Early Access" with email capture field
  - [ ] :red_square: Audio lazy-loaded — MP3s fetched only when play button clicked
  - [ ] :red_square: GTM events: `quiz_started`, `quiz_answer` (with round + correct/wrong), `quiz_completed` (with score), `quiz_email_captured`
  - **Acceptance Criteria**:
    - Quiz renders 3 rounds sequentially
    - Audio plays on button click (not auto-play — critical for mobile UX)
    - Correct/wrong feedback displays immediately
    - Score shows after round 3
    - Email field appears after quiz completion
    - `dataLayer` contains `quiz_started` and `quiz_completed` events
    - All 3 MP3 files load and play without errors
    - Works on mobile (touch targets ≥44px)
  - **Test Input**: Click through all 3 rounds with correct answers, verify score = 3/3. Repeat with all wrong answers, verify score = 0/3. Check dataLayer for all quiz events.
  - **Gate**: Do NOT proceed to Step 4 until Step 3 criteria are confirmed PASS :white_check_mark:

- [ ] :red_square: **Step 4: Build homepage — Problem + Gap + How It Works sections**
  - [ ] :red_square: **The Problem** section: "The Digital Age: Visual Fatigue, Shorter Attention Spans, More 'Opportunities to Hear'" (from BMQ deck). Stats: 44% of brands lack sonic identity, $15K-$500K agency barrier, 3-6 month timelines. 3-card grid layout.
  - [ ] :red_square: **The Gap** section: Visual barbell diagram. Left = "Cheap & Generic" (Suno $10/mo, Epidemic $9/mo — no brand identity). Right = "Expensive & Exclusive" (agencies $15K-$500K — no self-serve). Center = "MOGOVERSE" (AI + BrandMusiq methodology, $0-$199/mo, self-serve). This is the core positioning visual.
  - [ ] :red_square: **How It Works** section: MUSE framework simplified to 3 steps. Step 1: "Tell us who your brand is" (30 sec) — describe personality + emotion. Step 2: "AI generates your MOGO" (2 min) — powered by BrandMusiq's methodology. Step 3: "Deploy everywhere" — across all earpoints. HowTo JSON-LD schema for this section.
  - **Acceptance Criteria**:
    - 3 sections render in order: Problem → Gap → How It Works
    - Barbell gap diagram is visually clear (left/right/center positioning)
    - How It Works has 3 numbered steps with time badges
    - HowTo schema validates at schema.org validator
    - Responsive: cards stack on mobile, barbell diagram adapts
  - **Test Input**: Visual inspection at 1440px, 768px, and 375px widths. Validate HowTo JSON-LD.
  - **Gate**: Do NOT proceed to Step 5 until Step 4 criteria are confirmed PASS :white_check_mark:

- [ ] :red_square: **Step 5: Build homepage — Earpoints + Case Studies + Stats**
  - [ ] :red_square: **Earpoints Ecosystem** section: "Your MOGO Plays Everywhere" — 12 touchpoint cards (TV, Social, Podcast, Digital, App, Spaces, Events, Customer Service, POS/ATM, Airlines, Smart Speakers, Voice Bots/AI Agents). Each card: icon + touchpoint name + example (e.g., "POS Transactions — Mastercard card tap, 500M+ times/year"). Grid layout (4-col desktop, 2-col tablet, 1-col mobile).
  - [ ] :red_square: **Case Studies** section: Mastercard (flagship — 57M outlets, 5x Best Audio Brand, regional adaptations), HDFC Bank, Zomato. Each with YouTube video embed (lazy-loaded iframe), key stat callout, and 2-line description. Video modal on click (reuse pattern from landing pages).
  - [ ] :red_square: **Stats Bar** section: Dark background, 4-5 key numbers in a row: "40+ Brands" | "14 Years" | "57M Outlets (Mastercard)" | "89% Brand Recall" | "5x Best Audio Brand". Animated count-up on scroll into view.
  - **Acceptance Criteria**:
    - 12 earpoint cards render in responsive grid
    - At least 3 case study videos load as YouTube thumbnails and play in modal on click
    - Stats bar shows animated count-up when scrolled into view
    - No YouTube embeds load until user clicks (performance: thumbnail-first pattern)
  - **Test Input**: Scroll to each section, verify rendering. Click a video thumbnail, verify modal plays. Scroll to stats bar, verify count-up animation triggers.
  - **Gate**: Do NOT proceed to Step 6 until Step 5 criteria are confirmed PASS :white_check_mark:

- [ ] :red_square: **Step 6: Build homepage — ROI Calculator section**
  - [ ] :red_square: Section heading: "Calculate Your Sonic Branding ROI" with subtext: "The first sonic branding ROI calculator — backed by published research"
  - [ ] :red_square: Calculator inputs (form-style, no backend):
    - Industry dropdown: Retail, Financial Services, Tech, FMCG, Hospitality, Media, Other
    - Annual marketing budget: slider or input ($10K - $10M range)
    - Number of audio touchpoints: checkboxes (TV, Social, Podcast, App, IVR/Hold, In-store, Events) — count selected
    - Monthly customer impressions: slider or input
  - [ ] :red_square: Calculator outputs (computed client-side, shown in real-time):
    - Estimated brand recall lift: based on +96% baseline (MusicGrid) × touchpoint multiplier
    - Estimated ad effectiveness gain: +138% baseline (Sixieme Son) × budget factor
    - Estimated annual value: impressions × recall lift × industry-average conversion rate
    - Comparison: "Agency cost: $15K-$500K | Mogoverse: $79/mo ($948/year)" — show savings
  - [ ] :red_square: Each output number has a small "Source" tooltip citing the research (MusicGrid, SoundOut, Sixieme Son)
  - [ ] :red_square: Below calculator: CTA = "Get Your Custom Sonic Branding Strategy" with email capture
  - [ ] :red_square: GTM events: `calculator_started` (first input interaction), `calculator_completed` (all inputs filled), `calculator_email_captured`
  - **Acceptance Criteria**:
    - Calculator renders with all input fields
    - Output values update in real-time as inputs change (no submit button needed)
    - Source tooltips show on hover for each output metric
    - Email capture field appears below results
    - GTM events fire in dataLayer
    - Numbers are mathematically defensible (no made-up multipliers — all sourced)
    - Works on mobile (inputs are touch-friendly)
  - **Test Input**: Set Industry=Retail, Budget=$100K, 4 touchpoints, 500K impressions. Verify output values are non-zero and change when inputs change. Hover source tooltips. Check dataLayer for calculator events.
  - **Gate**: Do NOT proceed to Step 7 until Step 6 criteria are confirmed PASS :white_check_mark:

- [ ] :red_square: **Step 7: Build homepage — Trust + Social Proof + Pricing Preview**
  - [ ] :red_square: **Client Logos** section: 12 brand logos in grayscale, color on hover (reuse pattern from landing pages). Logos: Mastercard, Zomato, HDFC, Asian Paints, Vistara, Raymond, MG Motors, Infosys, Amazon Pay, Tata, Truecaller, Toyota.
  - [ ] :red_square: **Testimonials** section: Carousel/slider with C-suite quotes. Minimum 4: Raja Rajamannar (Mastercard CMO), Gaurav Verma (Zomato), Phee Teik Yeoh (Vistara), Kartik Jain (HDFC). Each: quote text, name, title, company logo. Auto-advance every 6 seconds, manual arrows.
  - [ ] :red_square: **Pricing Preview** section: "Enterprise Quality. Startup Pricing." 4 tier cards: Free ($0 — 3 generations, watermarked), Starter ($19/mo — creators), Pro ($79/mo — SMEs), Business ($199/mo — teams). Each card: price, target audience, 3-4 features. Enterprise callout: "$999/mo — Contact sales." Anchor text: "Agencies charge $15K-$500K. You pay $79/mo." CTA: "Get Early Access"
  - **Acceptance Criteria**:
    - 12 logos render, grayscale with color on hover
    - Testimonial carousel advances and has manual controls
    - 4 pricing cards render side by side (stack on mobile)
    - Agency anchor price ($15K-$500K) is prominently displayed near Mogoverse pricing
  - **Test Input**: Visual inspection at 1440px and 375px. Click testimonial arrows. Hover logos.
  - **Gate**: Do NOT proceed to Step 8 until Step 7 criteria are confirmed PASS :white_check_mark:

- [ ] :red_square: **Step 8: Build homepage — FAQ (AEO) + Lead Form + Footer**
  - [ ] :red_square: **FAQ section**: 8-10 questions targeting AEO/featured snippets. Questions:
    1. "What is sonic branding?" — definitive answer citing market size + BrandMusiq heritage
    2. "How much does sonic branding cost?" — agency range ($15K-$500K) vs Mogoverse ($0-$199/mo)
    3. "What is a MOGO?" — BrandMusiq's trademarked musical logo concept
    4. "What is the MUSE framework?" — Musical Strategy Exercise: Avatar + Rasa system
    5. "Can AI create a sonic identity for my brand?" — yes, Mogoverse uses BrandMusiq's methodology
    6. "What are earpoints?" — every touchpoint where a brand's sound plays
    7. "How is Mogoverse different from Suno or Epidemic Sound?" — brand identity vs generic music
    8. "What ROI can I expect from sonic branding?" — cite MusicGrid/SoundOut/Sixieme Son data
    9. "Who uses sonic branding?" — Mastercard, Netflix, Intel, Airtel + 44% of brands still don't
    10. "Is Mogoverse's music copyright safe?" — 100% original, full rights, no Content ID claims
  - [ ] :red_square: FAQPage JSON-LD schema for all questions
  - [ ] :red_square: Accordion UI (click to expand, one open at a time)
  - [ ] :red_square: **Lead form** (reuse multi-step pattern from landing pages): Email → Phone → Day/Time → "Demo Booked" confirmation. Anchor: `#signup`
  - [ ] :red_square: **Popups**: 15-second timed popup, exit intent popup, sticky bottom CTA bar (30% scroll). Reuse logic from landing pages.
  - [ ] :red_square: **Footer**: Mogoverse logo, "by BrandMusiq" credit, links to pillar pages + tools + landing pages, social links, copyright. "Powered by 14 years of BrandMusiq methodology"
  - [ ] :red_square: Add `SoftwareApplication` JSON-LD (name: Mogoverse, price: 0, category: BusinessApplication)
  - **Acceptance Criteria**:
    - FAQ accordion opens/closes, only one question open at a time
    - FAQPage JSON-LD validates at schema.org validator with all 10 Q&A pairs
    - SoftwareApplication JSON-LD validates
    - Lead form multi-step works (email → phone → day/time → confirmation)
    - All 3 popup types fire at correct triggers (15s, exit intent, 30% scroll)
    - Footer renders with all links
    - GTM tracks `demo_booked`, `email_captured` events on form submissions
    - Total JSON-LD on page: Organization + WebSite + WebPage + FAQPage + HowTo + SoftwareApplication
  - **Test Input**: Click each FAQ, verify accordion behavior. Validate all JSON-LD blocks. Fill form through all steps. Wait 15s for timed popup. Scroll 30% for sticky bar. Check dataLayer for all events.
  - **Gate**: Do NOT proceed to Step 9 until Step 8 criteria are confirmed PASS :white_check_mark:

---

### Phase 2: Standalone Tool Pages

- [ ] :red_square: **Step 9: Create standalone Sound Quiz page**
  - [ ] :red_square: Create `/tools/sound-quiz.html` — full-page version of the homepage quiz section
  - [ ] :red_square: Extended quiz: 5 rounds (add Mastercard checkout sound and Zomato notification to the 3 existing)
  - [ ] :red_square: Shareable results: "I scored X/5 on Mogoverse's Sound Recognition Quiz — can you beat me?" with copy-to-clipboard link
  - [ ] :red_square: SEO: title "Sound Recognition Quiz — Can You Identify Brands By Sound?", meta description targeting "sonic branding quiz", OG image
  - [ ] :red_square: Post-quiz: full lead form + "What is sonic branding?" explainer section + link back to homepage
  - [ ] :red_square: GTM tracking + all JSON-LD schemas
  - **Acceptance Criteria**:
    - 5-round quiz works end to end
    - Share button generates copyable link/text
    - Page has unique meta/OG tags
    - GTM events fire for all quiz interactions
  - **Test Input**: Complete quiz, click share, verify clipboard content. View page source for meta tags.
  - **Gate**: Do NOT proceed to Step 10 until Step 9 criteria are confirmed PASS :white_check_mark:

- [ ] :red_square: **Step 10: Create standalone ROI Calculator page**
  - [ ] :red_square: Create `/tools/sonic-branding-roi-calculator.html` — full-page version with expanded inputs
  - [ ] :red_square: Additional inputs vs homepage version: company size (employees), current audio spend, whether they have existing sonic identity (yes/no)
  - [ ] :red_square: Expanded outputs: yearly savings vs agency, estimated brand recall curve over 12 months (simple chart using CSS/SVG — no JS chart library), comparison table (Agency vs Stock Music vs Mogoverse)
  - [ ] :red_square: Below calculator: methodology section explaining every formula + source citation
  - [ ] :red_square: SEO: title "Sonic Branding ROI Calculator — Free Tool", meta description targeting "sonic branding ROI", "audio branding cost calculator"
  - [ ] :red_square: Lead form: "Get a detailed ROI report for your brand" with email capture
  - [ ] :red_square: GTM tracking + all JSON-LD schemas
  - **Acceptance Criteria**:
    - All expanded inputs work, outputs update in real-time
    - Comparison table renders Agency vs Stock vs Mogoverse with real pricing data
    - Methodology section cites every source
    - Page has unique SEO meta tags
    - No external JS chart libraries loaded (CSS/SVG only)
  - **Test Input**: Fill all inputs, verify outputs change. Read methodology section, verify every number has a source. Validate JSON-LD.
  - **Gate**: Do NOT proceed to Step 11 until Step 10 criteria are confirmed PASS :white_check_mark:

---

### Phase 3: SEO Pillar & Cluster Pages

- [ ] :red_square: **Step 11: Create competitor alternative pages (/alternatives/)**
  - [ ] :red_square: Create `/alternatives/suno-alternative.html` — "Suno Alternative for Brand Music | Mogoverse" (KD 18, 210 volume)
  - [ ] :red_square: Create `/alternatives/epidemic-sound-alternative.html` — "Epidemic Sound Alternative for Brands | Mogoverse" (KD 6, 90 volume)
  - [ ] :red_square: Create `/alternatives/artlist-alternative.html` — "Artlist Alternative for Brand Audio | Mogoverse" (KD 4, 70 volume)
  - [ ] :red_square: Each page: H1 targeting "[Competitor] Alternative", comparison table (Competitor vs Mogoverse on 8+ features), "Why brands switch" section, FAQ section with FAQPage schema, lead form, GTM tracking
  - [ ] :red_square: Content angle: these tools make generic music, Mogoverse makes YOUR brand's music
  - [ ] :red_square: Internal links: link to homepage, to each other, to `/sonic-branding/` pillar
  - **Acceptance Criteria**:
    - 3 pages exist with unique H1s, meta descriptions, and comparison tables
    - Each page has FAQPage schema, lead form, GTM tracking
    - Internal links form a cluster (each page links to the other 2 + homepage + pillar)
    - Pages follow the same design system as homepage
  - **Test Input**: Open each page, verify unique content. Validate JSON-LD. Click internal links.
  - **Gate**: Do NOT proceed to Step 12 until Step 11 criteria are confirmed PASS :white_check_mark:

- [ ] :red_square: **Step 12: Create sonic branding pillar page (/sonic-branding/)**
  - [ ] :red_square: Create `/sonic-branding/index.html` — "What is Sonic Branding? The Complete Guide (2026)" — 2000+ word pillar content
  - [ ] :red_square: Sections: Definition, History (from Sixieme Son's 20+ year narrative), Why it matters (stats from market research), How it works (MUSE framework), Examples (Mastercard, Netflix, Intel, Airtel with playable audio), Cost breakdown (agencies vs AI vs stock), FAQ
  - [ ] :red_square: AEO-optimized: definitive statements for LLM citation, e.g., "Sonic branding is the strategic use of sound to reinforce brand identity across every customer touchpoint."
  - [ ] :red_square: Internal links: to homepage, tools (quiz + calculator), alternatives cluster, and landing pages where relevant
  - [ ] :red_square: All JSON-LD schemas: Article, FAQPage, BreadcrumbList
  - [ ] :red_square: GTM tracking
  - **Acceptance Criteria**:
    - Page is 2000+ words of original, sourced content
    - Every stat has a citation
    - Article + FAQPage + BreadcrumbList JSON-LD validates
    - Internal links create hub-and-spoke from pillar to cluster pages
    - Playable audio examples work (Netflix, Airtel)
  - **Test Input**: Word count check (2000+). Validate all JSON-LD. Click all internal links. Play audio examples.
  - **Gate**: Do NOT proceed to Step 13 until Step 12 criteria are confirmed PASS :white_check_mark:

- [ ] :red_square: **Step 13: Update sitemap + cross-linking + final SEO pass**
  - [ ] :red_square: Update `sitemap.xml` with all new pages (tools, alternatives, pillar) with correct `<priority>` and `<lastmod>`
  - [ ] :red_square: Add meta descriptions to all 8 existing landing pages (currently missing — quick SEO win)
  - [ ] :red_square: Add canonical tags to all pages
  - [ ] :red_square: Verify all internal links work (no 404s)
  - [ ] :red_square: Verify GTM fires on every new page
  - [ ] :red_square: Add homepage link in navigation of all new pages (tools, alternatives, pillar) — but NOT on landing pages (keep those isolated)
  - **Acceptance Criteria**:
    - `sitemap.xml` contains all pages (homepage + 8 landing pages + 2 tools + 3 alternatives + 1 pillar = 15 URLs)
    - Every page has `<meta name="description">` and `<link rel="canonical">`
    - Zero 404s when clicking any internal link
    - GTM `mogo_pageview` fires on every page (check dataLayer)
  - **Test Input**: Parse sitemap, count URLs (expect 15). Open each page, inspect `<head>` for meta description + canonical. Check dataLayer on each page.
  - **Gate**: Do NOT proceed to Final Step until Step 13 criteria are confirmed PASS :white_check_mark:

---

### Phase 4: Regression & Verification

- [ ] :red_square: **Final Step: Regression Sweep**
  - [ ] :red_square: **Landing pages unchanged**: Open each of the 8 landing pages, verify layout, forms, popups, and tracking are identical to pre-change state
  - [ ] :red_square: **Asset integrity**: Verify all 12 logo files, 3 audio files load correctly from both homepage and landing page contexts (different relative paths)
  - [ ] :red_square: **tracking.js unmodified**: `git diff assets/js/tracking.js` shows no changes
  - [ ] :red_square: **deploy-pages.yml unmodified**: `git diff .github/workflows/deploy-pages.yml` shows no changes
  - [ ] :red_square: **GitHub Pages deployment**: Push to main, verify workflow runs, verify homepage loads at root URL
  - [ ] :red_square: **Mobile responsive**: Test homepage, quiz, calculator, and pillar page at 375px width — no horizontal scroll, all touch targets ≥44px
  - [ ] :red_square: **Performance**: Homepage loads in <3s on throttled 3G (check with browser DevTools). Lazy-loaded assets (audio, YouTube, below-fold images) don't load until needed
  - [ ] :red_square: **Schema validation**: Run all JSON-LD blocks through validator — zero errors across all pages

  | Blast Radius Row | Regression Check | Expected Result |
  |---|---|---|
  | `landing-pages/*.html` | Open each URL, visual inspection | Layout + forms + tracking identical |
  | `assets/js/tracking.js` | `git diff` | No changes |
  | `.github/workflows/deploy-pages.yml` | `git diff` | No changes |
  | `assets/logos/*` | Load from landing page + homepage | All 12 logos render |
  | `assets/audio-logos/*` | Play in quiz | All 3 MP3s play |

  - **Gate**: All rows must show PASS :white_check_mark: — BLOCKED until then
