// ============================================================
// Mogoverse — Reusable Lead Form Component
// ============================================================
// Renders inline forms, popup forms, nav/bottom bar triggers.
// Each form instance tracks its source for CPL attribution.
// Requires: leads.js (mogoSubmitLead), tracking.js (mogoGetUtm)
// ============================================================

var MOGO_COUNTRY_CODES = ['+971','+254','+234','+91','+86','+81','+65','+61','+55','+49','+44','+33','+27','+1'];

// ====== Phone helpers ======
function mogoCleanPhone(val) {
  return val.replace(/[\s\-\(\)]/g, '');
}

function mogoExtractCountryCode(phoneInput, codeSelect) {
  var raw = mogoCleanPhone(phoneInput.value);
  if (raw.charAt(0) !== '+') return;
  for (var i = 0; i < MOGO_COUNTRY_CODES.length; i++) {
    if (raw.indexOf(MOGO_COUNTRY_CODES[i]) === 0) {
      codeSelect.value = MOGO_COUNTRY_CODES[i];
      phoneInput.value = raw.substring(MOGO_COUNTRY_CODES[i].length);
      return;
    }
  }
}

function mogoIsValidPhone(val) {
  var digits = mogoCleanPhone(val).replace(/\+/g, '').replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

// ====== Country code options HTML ======
function mogoCountryCodeOptions() {
  return '<option value="+91">\u{1F1EE}\u{1F1F3} +91</option>' +
    '<option value="+1">\u{1F1FA}\u{1F1F8} +1</option>' +
    '<option value="+44">\u{1F1EC}\u{1F1E7} +44</option>' +
    '<option value="+971">\u{1F1E6}\u{1F1EA} +971</option>' +
    '<option value="+65">\u{1F1F8}\u{1F1EC} +65</option>' +
    '<option value="+61">\u{1F1E6}\u{1F1FA} +61</option>' +
    '<option value="+49">\u{1F1E9}\u{1F1EA} +49</option>' +
    '<option value="+81">\u{1F1EF}\u{1F1F5} +81</option>' +
    '<option value="+86">\u{1F1E8}\u{1F1F3} +86</option>' +
    '<option value="+33">\u{1F1EB}\u{1F1F7} +33</option>' +
    '<option value="+55">\u{1F1E7}\u{1F1F7} +55</option>' +
    '<option value="+27">\u{1F1FF}\u{1F1E6} +27</option>' +
    '<option value="+234">\u{1F1F3}\u{1F1EC} +234</option>' +
    '<option value="+254">\u{1F1F0}\u{1F1EA} +254</option>';
}

// ====== Use-case chips HTML ======
function mogoUsecaseChips(id) {
  var chips = [
    { value: 'audio-logo', label: 'Audio Logo' },
    { value: 'ad-jingles', label: 'Ad Jingles' },
    { value: 'hold-music', label: 'Hold Music' },
    { value: 'podcast-intro', label: 'Podcast Intro' },
    { value: 'social-reels', label: 'Social / Reels' },
    { value: 'brand-identity', label: 'Full Sonic Identity' },
    { value: 'other', label: 'Other' }
  ];
  var html = '<div class="mogo-usecase-prompt">How can we help?</div><div class="mogo-usecase-chips" id="' + id + '">';
  for (var i = 0; i < chips.length; i++) {
    html += '<div class="mogo-chip" onclick="this.classList.toggle(\'selected\')" data-value="' + chips[i].value + '">' + chips[i].label + '</div>';
  }
  html += '</div>';
  return html;
}

// ====== Render inline form ======
// targetId: DOM element id to render into
// source: attribution string (hero, footer, timed_popup, exit_popup, nav, bottom_bar)
function mogoRenderLeadForm(targetId, source) {
  var uid = source.replace(/[^a-z0-9]/g, '');
  var container = document.getElementById(targetId);
  if (!container) return;

  container.innerHTML =
    '<div class="mogo-form-fields" id="mogo-fields-' + uid + '">' +
      '<div class="mogo-form-row"><input type="text" id="mogo-name-' + uid + '" name="name" autocomplete="name" placeholder="Your name" class="mogo-input"></div>' +
      '<div class="mogo-phone-row">' +
        '<select id="mogo-cc-' + uid + '" name="country_code" autocomplete="tel-country-code" class="mogo-country-code">' + mogoCountryCodeOptions() + '</select>' +
        '<input type="tel" id="mogo-phone-' + uid + '" name="phone" autocomplete="tel-national" placeholder="Phone number" class="mogo-input mogo-phone-input">' +
      '</div>' +
      '<p class="mogo-form-error" id="mogo-error-' + uid + '">Please enter a valid phone number</p>' +
      mogoUsecaseChips('mogo-chips-' + uid) +
      '<div class="mogo-cta-buttons">' +
        '<button class="mogo-btn-primary" onclick="mogoSubmitForm(\'' + uid + '\',\'' + source + '\',\'demo\')">Get a Demo</button>' +
        '<button class="mogo-btn-secondary" onclick="mogoSubmitForm(\'' + uid + '\',\'' + source + '\',\'trial\')">Get Started Free</button>' +
      '</div>' +
      '<p class="mogo-cta-note">No credit card required. Powered by BrandMusiq.</p>' +
    '</div>' +
    '<div class="mogo-success" id="mogo-success-' + uid + '" style="display:none;">' +
      '<div class="mogo-check">\u2713</div>' +
      '<h3>You\'re in!</h3>' +
      '<p>We\'ll reach out shortly to walk you through Mogoverse.</p>' +
    '</div>';

  // Bind phone auto-detect
  var phoneEl = document.getElementById('mogo-phone-' + uid);
  var ccEl = document.getElementById('mogo-cc-' + uid);
  phoneEl.addEventListener('input', function() { mogoExtractCountryCode(phoneEl, ccEl); });
  phoneEl.addEventListener('paste', function() { setTimeout(function() { mogoExtractCountryCode(phoneEl, ccEl); }, 0); });
}

// ====== Submit handler ======
function mogoSubmitForm(uid, source, intent) {
  var phoneInput = document.getElementById('mogo-phone-' + uid);
  var ccSelect = document.getElementById('mogo-cc-' + uid);
  var errorEl = document.getElementById('mogo-error-' + uid);

  // Auto-detect country code one more time
  mogoExtractCountryCode(phoneInput, ccSelect);
  var phone = mogoCleanPhone(phoneInput.value).replace(/\+/g, '').replace(/\D/g, '');

  // Reset
  phoneInput.style.borderColor = '#e5e5e5';
  errorEl.style.display = 'none';

  if (!phone || phone.length < 7 || phone.length > 15) {
    phoneInput.style.borderColor = '#ef4444';
    errorEl.style.display = 'block';
    phoneInput.focus();
    return;
  }

  // Collect use cases
  var chips = document.querySelectorAll('#mogo-chips-' + uid + ' .mogo-chip.selected');
  var usecases = [];
  chips.forEach(function(c) { usecases.push(c.getAttribute('data-value')); });

  var code = ccSelect.value;
  var name = document.getElementById('mogo-name-' + uid).value.trim();

  // Submit to Google Sheets
  if (typeof mogoSubmitLead === 'function') {
    mogoSubmitLead({
      name: name,
      phone: phone,
      country_code: code,
      use_cases: usecases,
      form_type: intent,
      form_location: source
    });
  }

  // Track
  if (typeof mogoTrackDemoBooked === 'function') mogoTrackDemoBooked(code + ' ' + phone);

  // Show success
  document.getElementById('mogo-fields-' + uid).style.display = 'none';
  document.getElementById('mogo-success-' + uid).style.display = 'block';

  // Mark popups as submitted
  if (typeof popupState !== 'undefined') popupState.anyFormSubmitted = true;
}

// ====== Popup form (timed / exit intent) ======
// Shows a modal overlay with the lead form inside
function mogoShowPopupForm(popupId, source, headline, description) {
  var uid = source.replace(/[^a-z0-9]/g, '');
  var existing = document.getElementById(popupId);
  if (existing) { existing.style.display = 'block'; document.body.style.overflow = 'hidden'; return; }

  var overlay = document.createElement('div');
  overlay.id = popupId;
  overlay.className = 'mogo-popup-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) mogoClosePopup(popupId); };

  var isDark = source === 'exit_popup';
  var bg = isDark ? '#1a1a2e' : 'white';
  var headColor = isDark ? 'white' : '#1a1a2e';
  var descColor = isDark ? '#999' : '#888';

  overlay.innerHTML =
    '<div class="mogo-popup-card" style="background:' + bg + ';">' +
      '<button onclick="mogoClosePopup(\'' + popupId + '\')" class="mogo-popup-close" style="color:' + (isDark ? '#666' : '#999') + ';">\u2715</button>' +
      '<h3 style="color:' + headColor + ';">' + headline + '</h3>' +
      '<p style="color:' + descColor + ';">' + description + '</p>' +
      '<div id="mogo-popup-form-' + uid + '" class="mogo-popup-form-container"></div>' +
    '</div>';

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  mogoRenderLeadForm('mogo-popup-form-' + uid, source);
}

function mogoClosePopup(popupId) {
  var el = document.getElementById(popupId);
  if (el) el.style.display = 'none';
  // Restore scroll only if no other overlays are open
  var anyOpen = document.querySelector('.mogo-popup-overlay[style*="display: block"], .mogo-popup-overlay:not([style*="display: none"])');
  if (!anyOpen) document.body.style.overflow = '';
}

// ====== Popup triggers ======
function mogoInitPopups() {
  var state = { timed: false, exit: false };
  if (typeof popupState === 'undefined') window.popupState = { anyFormSubmitted: false };

  // Timed popup — 15 seconds
  setTimeout(function() {
    if (!popupState.anyFormSubmitted && !state.timed) {
      mogoShowPopupForm('mogoTimedPopup', 'timed_popup',
        'Hear your brand\'s sound \u2014 free',
        'Book a 15-min demo. We\'ll create a sample sonic identity for your brand \u2014 on the house.');
      state.timed = true;
    }
  }, 15000);

  // Exit intent
  document.addEventListener('mouseout', function(e) {
    if (e.clientY < 5 && !state.exit && !popupState.anyFormSubmitted) {
      mogoShowPopupForm('mogoExitPopup', 'exit_popup',
        'Wait \u2014 don\'t leave without this',
        'Get a free sonic brand audit \u2014 we\'ll analyze your current brand audio and show you what\'s missing.');
      state.exit = true;
    }
  });
}

// ====== Sticky bottom bar ======
function mogoInitStickyBar() {
  var bar = document.createElement('div');
  bar.id = 'mogoStickyBar';
  bar.className = 'mogo-sticky-bar';
  bar.innerHTML =
    '<div class="mogo-sticky-inner">' +
      '<div class="mogo-sticky-text">' +
        '<p class="mogo-sticky-title">Get your free sonic brand demo</p>' +
        '<p class="mogo-sticky-sub">Powered by BrandMusiq \u00B7 No credit card</p>' +
      '</div>' +
      '<button class="mogo-btn-primary mogo-sticky-btn" onclick="mogoShowPopupForm(\'mogoBottomPopup\',\'bottom_bar\',\'Get a Demo\',\'Enter your phone number and we\\\'ll walk you through Mogoverse.\')">Book Demo</button>' +
    '</div>';
  document.body.appendChild(bar);

  var shown = false;
  window.addEventListener('scroll', function() {
    if (shown) return;
    var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (pct > 30) { bar.style.display = 'block'; shown = true; }
  });
}

// ====== Nav CTA handler ======
function mogoNavCTA() {
  mogoShowPopupForm('mogoNavPopup', 'nav',
    'Get Early Access',
    'Enter your phone number and we\'ll walk you through Mogoverse.');
}

// ====== Init everything ======
function mogoInitLeadForms() {
  mogoInitPopups();
  mogoInitStickyBar();

  // Wire up nav CTA buttons
  var navBtns = document.querySelectorAll('.nav-cta');
  navBtns.forEach(function(btn) {
    btn.href = 'javascript:void(0)';
    btn.onclick = function(e) { e.preventDefault(); mogoNavCTA(); };
  });
}

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mogoInitLeadForms);
} else {
  mogoInitLeadForms();
}
