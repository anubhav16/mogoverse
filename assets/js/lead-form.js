// ============================================================
// Mogoverse — Lead Form Component v3
// ============================================================
// 1. Popups suppressed while user is interacting with any form
// 2. Once form submitted, no popups or exit intent shown
// 3. "How can we help?" selections saved to localStorage,
//    attached to lead on form submit, or sent as update if
//    form was already submitted
// 4. "How can we help?" renders ABOVE the lead form in hero
// ============================================================

var MOGO_COUNTRY_CODES = ['+971','+254','+234','+91','+86','+81','+65','+61','+55','+49','+44','+33','+27','+1'];

// Per-country phone digit lengths (national number, without country code)
var MOGO_PHONE_LENGTHS = {
  '+91':  [10],       // India: exactly 10
  '+1':   [10],       // US/Canada: exactly 10
  '+44':  [10,11],    // UK: 10-11
  '+971': [9],        // UAE: 9
  '+65':  [8],        // Singapore: 8
  '+61':  [9],        // Australia: 9
  '+49':  [10,11],    // Germany: 10-11
  '+81':  [10,11],    // Japan: 10-11
  '+86':  [11],       // China: 11
  '+33':  [9],        // France: 9
  '+55':  [10,11],    // Brazil: 10-11
  '+27':  [9],        // South Africa: 9
  '+234': [10,11],    // Nigeria: 10-11
  '+254': [9,10]      // Kenya: 9-10
};

function mogoValidatePhone(phone, countryCode) {
  var digits = phone.replace(/\D/g, '');
  if (!digits) return { valid: false, msg: 'Enter your phone number' };

  var lengths = MOGO_PHONE_LENGTHS[countryCode];
  if (!lengths) {
    // Fallback for unknown codes
    if (digits.length < 7 || digits.length > 15) return { valid: false, msg: 'Enter a valid phone number' };
    return { valid: true };
  }

  var expected = lengths.join(' or ');
  if (lengths.indexOf(digits.length) === -1) {
    return { valid: false, msg: countryCode + ' numbers need ' + expected + ' digits (you entered ' + digits.length + ')' };
  }
  return { valid: true };
}

// ====== State ======
// Tracks whether user is actively interacting with a form
var mogoFormFocused = false;

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

// ====== Persona dropdown options ======
function mogoPersonaOptions() {
  return '<option value="" selected>I am a...</option>' +
    '<option value="startup">Startup</option>' +
    '<option value="creator-influencer">Creator / Influencer</option>' +
    '<option value="podcaster">Podcaster</option>' +
    '<option value="agency">Agency / Production House</option>' +
    '<option value="brand-marketing">Brand / Marketing Team</option>' +
    '<option value="freelancer">Freelancer</option>' +
    '<option value="other">Other</option>';
}

// ====== "How can we help?" selections (localStorage) ======
function mogoGetHelpSelections() {
  try {
    return JSON.parse(localStorage.getItem('mogo_help_selections') || '[]');
  } catch(e) { return []; }
}

function mogoSaveHelpSelections(selections) {
  try {
    localStorage.setItem('mogo_help_selections', JSON.stringify(selections));
  } catch(e) {}
}

// ====== Render inline lead form ======
function mogoRenderLeadForm(targetId, source) {
  var uid = source.replace(/[^a-z0-9]/g, '');
  var container = document.getElementById(targetId);
  if (!container) return;

  container.innerHTML =
    '<div class="mogo-step1" id="mogo-step1-' + uid + '">' +
      '<div class="mogo-form-row"><label for="mogo-name-' + uid + '" class="sr-only">Your name</label><input type="text" id="mogo-name-' + uid + '" name="name" autocomplete="name" placeholder="Your name" class="mogo-input"></div>' +
      '<div class="mogo-phone-row">' +
        '<label for="mogo-cc-' + uid + '" class="sr-only">Country code</label><select id="mogo-cc-' + uid + '" name="country_code" autocomplete="tel-country-code" class="mogo-country-code">' + mogoCountryCodeOptions() + '</select>' +
        '<label for="mogo-phone-' + uid + '" class="sr-only">Phone number</label><input type="tel" id="mogo-phone-' + uid + '" name="phone" autocomplete="tel-national" inputmode="numeric" pattern="[0-9]*" placeholder="Phone number" class="mogo-input mogo-phone-input">' +
      '</div>' +
      '<p class="mogo-form-error" id="mogo-error-' + uid + '">Enter a valid phone number (digits only)</p>' +
      '<div class="mogo-cta-buttons">' +
        '<button class="mogo-btn-primary" onclick="mogoStep1Submit(\'' + uid + '\',\'' + source + '\',\'demo\')">Get a Demo</button>' +
        '<button class="mogo-btn-secondary" onclick="mogoStep1Submit(\'' + uid + '\',\'' + source + '\',\'trial\')">Get Started Free</button>' +
      '</div>' +
      '<p class="mogo-cta-note">No credit card required.</p>' +
    '</div>' +
    '<div class="mogo-step2" id="mogo-step2-' + uid + '" style="display:none;">' +
      '<p class="mogo-step2-label">One last thing \u2014 tell us about yourself</p>' +
      '<label for="mogo-persona-' + uid + '" class="sr-only">Your role</label><select id="mogo-persona-' + uid + '" class="mogo-select">' + mogoPersonaOptions() + '</select>' +
      '<button class="mogo-btn-primary" onclick="mogoStep2Submit(\'' + uid + '\')">Done</button>' +
      '<button class="mogo-btn-skip" onclick="mogoStep2Submit(\'' + uid + '\')">Skip</button>' +
    '</div>' +
    '<div class="mogo-success" id="mogo-success-' + uid + '" style="display:none;">' +
      '<div class="mogo-check">\u2713</div>' +
      '<h3>You\'re in!</h3>' +
      '<p>We\'ll reach out shortly to walk you through Mogoverse.</p>' +
    '</div>';

  // Bind phone auto-detect + numeric-only filter
  var phoneEl = document.getElementById('mogo-phone-' + uid);
  var ccEl = document.getElementById('mogo-cc-' + uid);
  phoneEl.addEventListener('input', function() {
    // Strip non-numeric chars (allow + for country code detection)
    var cleaned = phoneEl.value.replace(/[^0-9+\s\-]/g, '');
    if (cleaned !== phoneEl.value) phoneEl.value = cleaned;
    mogoExtractCountryCode(phoneEl, ccEl);
  });
  phoneEl.addEventListener('keypress', function(e) {
    // Block alphabets on desktop — allow digits, +, space, backspace, arrows
    var char = String.fromCharCode(e.which || e.keyCode);
    if (!/[0-9+\-\s]/.test(char) && e.which !== 8 && e.which !== 0) {
      e.preventDefault();
    }
  });
  phoneEl.addEventListener('paste', function() { setTimeout(function() {
    phoneEl.value = phoneEl.value.replace(/[^0-9+\s\-]/g, '');
    mogoExtractCountryCode(phoneEl, ccEl);
  }, 0); });

  // Track form focus — suppress popups while user is filling form
  var step1 = document.getElementById('mogo-step1-' + uid);
  step1.addEventListener('focusin', function() { mogoFormFocused = true; });
  step1.addEventListener('focusout', function() {
    setTimeout(function() { mogoFormFocused = false; }, 500);
  });
}

// ====== Step 1: Validate phone, capture lead, show step 2 ======
function mogoStep1Submit(uid, source, intent) {
  var phoneInput = document.getElementById('mogo-phone-' + uid);
  var ccSelect = document.getElementById('mogo-cc-' + uid);
  var errorEl = document.getElementById('mogo-error-' + uid);

  mogoExtractCountryCode(phoneInput, ccSelect);
  var code = ccSelect.value;
  var phone = mogoCleanPhone(phoneInput.value).replace(/\+/g, '').replace(/\D/g, '');

  phoneInput.style.borderColor = '#e5e5e5';
  errorEl.style.display = 'none';

  var validation = mogoValidatePhone(phone, code);
  if (!validation.valid) {
    phoneInput.style.borderColor = '#ef4444';
    errorEl.textContent = validation.msg;
    errorEl.style.display = 'block';
    phoneInput.focus();
    return;
  }
  var name = document.getElementById('mogo-name-' + uid).value.trim();

  // Attach any "how can we help" selections made before form submit
  var helpSelections = mogoGetHelpSelections();

  // Store for step 2 update
  window['_mogoLead_' + uid] = {
    name: name,
    phone: phone,
    country_code: code,
    use_cases: helpSelections,
    form_type: intent,
    form_location: source
  };

  // Submit lead immediately
  if (typeof mogoSubmitLead === 'function') {
    mogoSubmitLead(window['_mogoLead_' + uid]);
  }
  if (typeof mogoTrackDemoBooked === 'function') mogoTrackDemoBooked(code + ' ' + phone);

  // Mark submitted — suppresses all future popups
  if (typeof popupState !== 'undefined') popupState.anyFormSubmitted = true;
  try { localStorage.setItem('mogo_form_submitted', 'true'); } catch(e) {}

  // Show step 2
  document.getElementById('mogo-step1-' + uid).style.display = 'none';
  document.getElementById('mogo-step2-' + uid).style.display = 'block';
}

// ====== Step 2: Capture persona (optional enrichment) ======
function mogoStep2Submit(uid) {
  var persona = document.getElementById('mogo-persona-' + uid).value;

  if (persona && typeof mogoSubmitLead === 'function' && window['_mogoLead_' + uid]) {
    var lead = window['_mogoLead_' + uid];
    lead.persona = persona;
    lead.action = 'update';
    mogoSubmitLead(lead);
  }

  document.getElementById('mogo-step2-' + uid).style.display = 'none';
  document.getElementById('mogo-success-' + uid).style.display = 'block';
}

// ============================================================
// "How can we help?" — standalone section
// ============================================================
// Selections stored in localStorage.
// If form already submitted: sends update to Google Sheets.
// If form not yet submitted: selections attached when form submits.
function mogoRenderHelpSection(targetId) {
  var container = document.getElementById(targetId);
  if (!container) return;

  var usecases = [
    { value: 'audio-logo', label: 'Audio Logo' },
    { value: 'ad-jingles', label: 'Ad Jingles' },
    { value: 'hold-music', label: 'Hold Music' },
    { value: 'podcast-intro', label: 'Podcast Intro' },
    { value: 'social-reels', label: 'Social / Reels' },
    { value: 'sonic-identity', label: 'Full Sonic Identity' },
    { value: 'something-else', label: 'Something Else' }
  ];

  // Restore previous selections
  var saved = mogoGetHelpSelections();

  var html = '<div class="mogo-help-header">How can we help?</div>' +
    '<div class="mogo-help-cards">';
  for (var i = 0; i < usecases.length; i++) {
    var sel = saved.indexOf(usecases[i].value) !== -1 ? ' selected' : '';
    html += '<div class="mogo-help-card' + sel + '" onclick="mogoHelpClick(this)" data-value="' + usecases[i].value + '">' +
      usecases[i].label +
    '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

function mogoHelpClick(el) {
  el.classList.toggle('selected');
  var value = el.getAttribute('data-value');
  var isSelected = el.classList.contains('selected');

  // Update localStorage
  var selections = mogoGetHelpSelections();
  if (isSelected && selections.indexOf(value) === -1) {
    selections.push(value);
  } else if (!isSelected) {
    selections = selections.filter(function(v) { return v !== value; });
  }
  mogoSaveHelpSelections(selections);

  // Fire GA event
  if (typeof gtag === 'function') {
    gtag('event', isSelected ? 'help_interest_select' : 'help_interest_deselect', {
      event_category: 'engagement',
      event_label: value,
      page_url: window.location.href
    });
  }
  if (typeof dataLayer !== 'undefined') {
    dataLayer.push({
      event: 'help_interest',
      help_value: value,
      help_action: isSelected ? 'select' : 'deselect'
    });
  }

  // If form was already submitted, send update to Google Sheets
  var formSubmitted = false;
  try { formSubmitted = localStorage.getItem('mogo_form_submitted') === 'true'; } catch(e) {}

  if (formSubmitted && typeof mogoSubmitLead === 'function') {
    // Find the most recent lead data from any form
    var leadData = null;
    for (var key in window) {
      if (key.indexOf('_mogoLead_') === 0 && window[key]) {
        leadData = window[key];
        break;
      }
    }
    if (leadData) {
      leadData.use_cases = selections;
      leadData.action = 'update';
      mogoSubmitLead(leadData);
    }
  }
}

// ====== Popup form (timed / exit intent) ======
function mogoShowPopupForm(popupId, source, headline, description) {
  var uid = source.replace(/[^a-z0-9]/g, '');
  var existing = document.getElementById(popupId);
  if (existing) { existing.style.display = 'block'; document.body.style.overflow = 'hidden'; return; }

  var overlay = document.createElement('div');
  overlay.id = popupId;
  overlay.className = 'mogo-popup-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) mogoClosePopup(popupId); };

  var isDark = false;
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
  var anyOpen = document.querySelector('.mogo-popup-overlay[style*="display: block"], .mogo-popup-overlay:not([style*="display: none"])');
  if (!anyOpen) document.body.style.overflow = '';
}

// ====== Popup triggers ======
function mogoInitPopups() {
  var state = { timed: false, exit: false };
  if (typeof popupState === 'undefined') window.popupState = { anyFormSubmitted: false };

  // Check if form was previously submitted (cross-session)
  try {
    if (localStorage.getItem('mogo_form_submitted') === 'true') {
      popupState.anyFormSubmitted = true;
    }
  } catch(e) {}

  // Timed popup — 15 seconds
  // Suppressed if: form submitted, user is filling a form, or already shown
  setTimeout(function() {
    if (document.getElementById('mogoExitPopup') && document.getElementById('mogoExitPopup').style.display !== 'none') return;
    if (!popupState.anyFormSubmitted && !state.timed && !mogoFormFocused) {
      mogoShowPopupForm('mogoTimedPopup', 'timed_popup',
        'Hear your brand\'s sound \u2014 free',
        'Book a 15-min demo. We\'ll create a sample sonic identity for your brand \u2014 on the house.');
      state.timed = true;
    }
  }, 15000);

  // Exit intent — suppressed if form submitted or user is filling form
  document.addEventListener('mouseout', function(e) {
    if (document.getElementById('mogoTimedPopup') && document.getElementById('mogoTimedPopup').style.display !== 'none') return;
    if (e.clientY < 5 && !state.exit && !popupState.anyFormSubmitted && !mogoFormFocused) {
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
        '<p class="mogo-sticky-title">Your brand deserves its own sound</p>' +
      '</div>' +
      '<button class="mogo-btn-primary mogo-sticky-btn" onclick="mogoShowPopupForm(\'mogoBottomPopup\',\'bottom_bar\',\'Get a Demo\',\'Enter your phone number and we\\\'ll walk you through Mogoverse.\')">Book Demo</button>' +
    '</div>';
  document.body.appendChild(bar);

  // Show bar when hero section scrolls out of view, hide when it's back
  var hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        // Hero is visible → hide sticky bar; hero is gone → show sticky bar
        bar.style.display = entry.isIntersecting ? 'none' : 'block';
      });
    }, { threshold: 0 });
    observer.observe(hero);
  } else {
    // Fallback: show after 30% scroll (old behavior)
    var shown = false;
    window.addEventListener('scroll', function() {
      if (shown) return;
      var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (pct > 30) { bar.style.display = 'block'; shown = true; }
    });
  }
}

// ====== Nav CTA handler ======
function mogoNavCTA() {
  mogoShowPopupForm('mogoNavPopup', 'nav',
    'Get Early Access',
    'Enter your phone number and we\'ll walk you through Mogoverse.');
}

// ====== Hamburger toggle + contextual nudge ======
// [2026-04-03] Shows lead nudge card below menu on open; suppressed after form submission
function mogoToggleNav(btn) {
  var nav = document.getElementById('navLinks');
  var nudge = document.getElementById('navLeadNudge');
  var isOpening = !nav.classList.contains('mobile-open');

  nav.classList.toggle('mobile-open');
  btn.classList.toggle('active');

  if (!nudge) return;
  if (isOpening) {
    // Suppress if already converted this session or cross-session
    var submitted = (typeof popupState !== 'undefined' && popupState.anyFormSubmitted);
    try { submitted = submitted || localStorage.getItem('mogo_form_submitted') === 'true'; } catch(e) {}
    nudge.style.display = submitted ? 'none' : 'block';

    // [2026-04-03] Bug 2 fix: close menu when any anchor link inside it is tapped
    if (!nav._closeOnLinkAdded) {
      nav.addEventListener('click', function(e) {
        var link = e.target.closest('a[href]');
        if (link && nav.classList.contains('mobile-open')) {
          nav.classList.remove('mobile-open');
          btn.classList.remove('active');
          nudge.style.display = 'none';
        }
      });
      nav._closeOnLinkAdded = true;
    }
  } else {
    nudge.style.display = 'none';
  }
}

function mogoHamburgerCTA() {
  // Close menu first — clean UX before popup appears
  var nav = document.getElementById('navLinks');
  var btn = document.getElementById('hamburger');
  var nudge = document.getElementById('navLeadNudge');
  if (nav) nav.classList.remove('mobile-open');
  if (btn) btn.classList.remove('active');
  if (nudge) nudge.style.display = 'none';

  mogoShowPopupForm('mogoHamburgerPopup', 'hamburger_menu',
    'Hear your brand\'s sound \u2014 free',
    'Book a 15-min demo. We\'ll create a sample sonic identity for your brand on the house.');
}

// ====== Init ======
function mogoInitLeadForms() {
  // Skip popups + sticky bar on ad landing pages (clean conversion path)
  var isAdPage = window.location.pathname.indexOf('/ad/') !== -1;
  if (!isAdPage) {
    // [2026-04-03] Perf: defer non-critical UI to after LCP — sticky bar and popup listeners
    // don't need to exist during first paint. Sticky bar: 2s (after hero visible).
    // Popup init: 5s (timed popup fires at 15s internally; exit intent rarely fires <5s).
    setTimeout(mogoInitStickyBar, 2000);
    setTimeout(mogoInitPopups, 5000);
  }

  var navBtns = document.querySelectorAll('.nav-cta');
  navBtns.forEach(function(btn) {
    btn.onclick = function(e) { e.preventDefault(); mogoNavCTA(); };
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mogoInitLeadForms);
} else {
  mogoInitLeadForms();
}
