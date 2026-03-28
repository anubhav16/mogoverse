# Lead Capture → Google Sheets — Implementation Plan

**Overall Progress:** `0%`

## TLDR
Wire all 8 landing pages (4 form types) to submit lead data to a Google Sheet via Apps Script. Currently every form shows "success" but sends data nowhere — we're losing 100% of leads.

## Critical Decisions
- **Google Sheets over CRM/DB** — zero cost, zero infra, good enough for validation phase. Migrate when we hit ~500 leads or need drip emails.
- **Shared `leads.js` module** — single file loaded by all pages (same pattern as `tracking.js`), avoids duplicating fetch logic across 8 HTML files.
- **Fire-and-forget POST** — if the Sheets POST fails, still show success to user. Don't block UX for a backend issue during validation. Log error to console.
- **Apps Script provided as copy-paste** — no CI/CD for the script. User deploys manually in Google Sheets UI.

## Reuse Inventory
- `assets/js/tracking.js` → `mogoGetUtm()` — retrieves UTM params from sessionStorage (line 67-70)
- `assets/js/tracking.js` → `mogoTrackDemoBooked()`, `mogoTrackAuditRequested()`, `mogoTrackEmailCaptured()` — existing tracking calls we hook alongside, not replace
- All 8 landing pages already load `tracking.js` via `<script src="../assets/js/tracking.js">` at line 184-187

## Blast Radius

| At risk | Why | Regression check |
|---|---|---|
| `nextStep()` in 7 pages | Adding `submitLead()` call at step 3 | Form still advances to step 4, success screen shows, console has no errors |
| `nextStepB()` in 7 pages | Same — footer form variant | Footer form advances, success shows |
| `submitForm()` in mogo page | Adding `submitLead()` before success display | Form submits, success div shows, phone validation still works |
| `submitTimedPopup()` in 8 pages | Adding `submitLead()` after tracking | Popup still shows success, closes after 2.5s |
| `submitExitPopup()` in 8 pages | Adding `submitLead()` after tracking | Popup still shows success, closes after 2.5s |
| `tracking.js` | Not modified — only consumed by new `leads.js` | All tracking console logs still fire |

## Consumer & Ownership Checks
- `mogoGetUtm()` — called by `tracking.js` internally + will be called by new `leads.js`. Return value is an object; no truthiness issues.
- No function return values are changing. We're only **adding** a `submitLead()` call inside existing functions.

---

## Tasks

- [ ] **Step 0: Google Sheet + Apps Script setup (manual — Anubhav)**
  - [ ] Create Google Sheet with columns: `Timestamp | Email | Phone | Name | Country Code | Use Cases | Day | Time Slot | Form Type | Page URL | UTM Source | UTM Medium | UTM Campaign | Form Location`
  - [ ] Open Extensions → Apps Script, paste the script (provided below)
  - [ ] Deploy → New Deployment → Web App → "Anyone" → Deploy
  - [ ] Copy the deployment URL and share it with Claude Code
  - **Acceptance Criteria**: Hitting the URL with a POST returns `{"status":"ok"}` (can test with curl)
  - **Test Input**: `curl -L -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","form_type":"test"}' "YOUR_DEPLOYMENT_URL"`
  - **Gate**: Do NOT proceed to Step 1 until the curl test returns `{"status":"ok"}` and a row appears in the Sheet

### Apps Script (paste into Extensions → Apps Script):

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date().toISOString(),
    data.email || '',
    data.phone || '',
    data.name || '',
    data.country_code || '',
    (data.use_cases || []).join(', '),
    data.day || '',
    data.time_slot || '',
    data.form_type || '',
    data.page_url || '',
    data.utm_source || '',
    data.utm_medium || '',
    data.utm_campaign || '',
    data.form_location || ''
  ]);
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok' })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

---

- [ ] **Step 1: Create `assets/js/leads.js`**
  - [ ] Create new file `assets/js/leads.js` with a `mogoSubmitLead(data)` function
  - [ ] Function accepts an object with any/all of: `email, phone, name, country_code, use_cases, day, time_slot, form_type, form_location`
  - [ ] Function auto-appends: `page_url` (from `window.location.href`), UTM params (from `mogoGetUtm()`), timestamp
  - [ ] Uses `fetch()` POST to the Apps Script URL (stored as `MOGO_LEADS.SHEET_URL` config var at top of file)
  - [ ] Fire-and-forget: `.catch(function(err) { console.error('[Mogoverse] Lead submit failed:', err); })` — never blocks UX
  - [ ] Console log on success: `[Mogoverse] Lead submitted: {form_type}`
  - **Acceptance Criteria**: File exists, exports `mogoSubmitLead()`, no syntax errors when loaded in browser console
  - **Test Input**: Open any landing page with `leads.js` loaded, run `mogoSubmitLead({email:'test@test.com', form_type:'manual_test'})` in console — verify row appears in Sheet
  - **Gate**: Do NOT proceed to Step 2 until console test confirms a row in the Sheet

---

- [ ] **Step 2: Wire multi-step demo forms (7 pages)**
  - [ ] Add `<script src="../assets/js/leads.js"></script>` after the `tracking.js` script tag in all 7 pages
  - [ ] In `nextStep()` — at step 3 (after `mogoTrackDemoBooked`), call `mogoSubmitLead()` with: email, phone, day, time_slot, form_type='demo_booking', form_location='hero'
  - [ ] In `nextStepB()` — same, with form_location='footer'
  - **Files modified**: `ai-brand-music-generator.html`, `ai-music-generator-brand.html`, `audio-logo-sonic-branding.html`, `dont-be-herd-be-heard.html`, `royalty-free-costing-your-brand.html`, `royalty-free-music-brand.html`, `royalty-free-music-isnt-free-costing-your-brand.html`
  - **Acceptance Criteria**: Submit hero form on `dont-be-herd-be-heard.html` → row appears in Sheet with email, phone, day, time, form_type=demo_booking, form_location=hero. Submit footer form → same with form_location=footer. Success screen still shows. No console errors.
  - **Test Input**: Email: `test-hero@demo.com`, Phone: `9876543210`, Day: Today, Time: Morning
  - **Gate**: Do NOT proceed to Step 3 until both hero + footer submissions produce Sheet rows

---

- [ ] **Step 3: Wire mogo contact form (1 page)**
  - [ ] Add `<script src="../assets/js/leads.js"></script>` after the `tracking.js` script tag
  - [ ] In `submitForm()` — before the "Show success" block, call `mogoSubmitLead()` with: name, country_code, phone, use_cases (array), form_type='contact', form_location=src param
  - **File modified**: `your-brand-has-a-logo-give-mogo.html`
  - **Acceptance Criteria**: Submit the mogo form → row appears in Sheet with name, country_code, phone, use_cases, form_type=contact. Success div shows. Phone validation still rejects < 7 digits.
  - **Test Input**: Name: `Test User`, Phone: `9876543210`, Country: +91, Use Cases: select "Audio Logo" + "Ad Jingles"
  - **Gate**: Do NOT proceed to Step 4 until Sheet row appears with correct use_cases

---

- [ ] **Step 4: Wire popup forms (all 8 pages)**
  - [ ] In `submitTimedPopup()` — after `mogoTrackEmailCaptured` + `mogoTrackAuditRequested`, call `mogoSubmitLead()` with: email, form_type='timed_popup'
  - [ ] In `submitExitPopup()` — after `popupState.anyFormSubmitted = true`, call `mogoSubmitLead()` with: email, form_type='exit_popup'
  - [ ] Note: `leads.js` is already loaded from Steps 2-3. No new script tags needed.
  - **Files modified**: all 8 landing pages (popup scripts are inline in each)
  - **Acceptance Criteria**: Trigger timed popup (wait 15s) → submit email → row in Sheet with form_type=timed_popup. Trigger exit popup (move mouse out) → submit → row with form_type=exit_popup. Both popups still show success + auto-close.
  - **Test Input**: Email: `popup-test@demo.com`
  - **Gate**: Do NOT proceed to Step 5 until both popup types produce Sheet rows

---

- [ ] **Step 5: Regression Sweep**
  - For each row in Blast Radius table: run the listed check, show actual output
  - [ ] `nextStep()` — hero form advances through all 4 steps, success screen shows, no console errors
  - [ ] `nextStepB()` — footer form same behavior
  - [ ] `submitForm()` — mogo form submits, success shows, phone validation rejects bad input
  - [ ] `submitTimedPopup()` — popup shows success, closes after 2.5s
  - [ ] `submitExitPopup()` — popup shows success, closes after 2.5s
  - [ ] `tracking.js` — all `[Mogoverse] Conversion tracked:` console logs still fire
  - [ ] Verify no duplicate submissions (one form submit = exactly one Sheet row)
  - **Gate**: All rows must show PASS — BLOCKED until then
