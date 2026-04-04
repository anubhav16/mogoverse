// ============================================================
// Mogoverse — Google Ads Conversion Tracking + UTM Capture
// ============================================================
// SETUP: Replace these placeholder IDs with your actual values
// 1. GTM Container ID → tagmanager.google.com → Create Account → Get ID
// 2. Google Ads Conversion ID → ads.google.com → Tools → Conversions → New → Get ID
// 3. Conversion Label → same place as #2, one label per conversion action
// ============================================================

var MOGO_TRACKING = {
  GTM_ID: 'GTM-TFX2NPMP',                      // Mogoverse GTM container
  GADS_ID: 'AW-18045691311',                 // Google Ads conversion ID
  CONVERSION_LABELS: {
    demo_booked: 'XXXXXXXXXXXXXXXXXXX',      // Replace: conversion label for "Book Demo"
    audit_requested: 'XXXXXXXXXXXXXXXXXXX',  // Replace: conversion label for "Get Free Audit"
    email_captured: 'XXXXXXXXXXXXXXXXXXX'    // Replace: conversion label for popup email capture
  }
};

// ============================================================
// 1. GOOGLE TAG MANAGER — inject container snippet
// ============================================================
(function(w,d,s,l,i){
  if (!i || i === 'GTM-XXXXXXX') { return; }
  w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', MOGO_TRACKING.GTM_ID);

// ============================================================
// 2. GOOGLE ADS GTAG.JS — load global site tag
// ============================================================
(function(){
  if (!MOGO_TRACKING.GADS_ID || MOGO_TRACKING.GADS_ID === 'AW-XXXXXXXXXX') { return; }
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MOGO_TRACKING.GADS_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', MOGO_TRACKING.GADS_ID);
})();

// ============================================================
// 3. UTM PARAMETER CAPTURE — store in sessionStorage
// ============================================================
(function(){
  var params = new URLSearchParams(window.location.search);
  var utmKeys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'];
  var utm = {};
  utmKeys.forEach(function(key){
    var val = params.get(key);
    if (val) utm[key] = val;
  });
  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem('mogo_utm', JSON.stringify(utm));
  }
})();

// ============================================================
// 4. CONVERSION TRACKING FUNCTIONS — call these on form submit
// ============================================================

// Get stored UTM data
function mogoGetUtm() {
  try { return JSON.parse(sessionStorage.getItem('mogo_utm')) || {}; }
  catch(e) { return {}; }
}

// Fire a Google Ads conversion event
function mogoTrackConversion(label, extraData) {
  if (typeof gtag !== 'function') return;
  var conversionId = MOGO_TRACKING.GADS_ID + '/' + label;
  gtag('event', 'conversion', {
    send_to: conversionId,
    value: extraData && extraData.value || 0,
    currency: 'USD'
  });

  // Also push to dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    event: 'mogo_conversion',
    conversion_type: extraData && extraData.type || 'unknown',
    utm: mogoGetUtm()
  });
}

// Track: Demo booked (hero form + footer form)
function mogoTrackDemoBooked(email, phone) {
  mogoTrackEnhancedConversion(email, phone);
  mogoTrackConversion(MOGO_TRACKING.CONVERSION_LABELS.demo_booked, {
    type: 'demo_booked',
    value: 50
  });
  if (typeof clarity === 'function') clarity('event', 'demo_booked');
  console.log('[Mogoverse] Conversion tracked: demo_booked', email);
}

// Track: Audit requested (exit intent popup)
function mogoTrackAuditRequested(email) {
  mogoTrackEnhancedConversion(email);
  mogoTrackConversion(MOGO_TRACKING.CONVERSION_LABELS.audit_requested, {
    type: 'audit_requested',
    value: 25
  });
  if (typeof clarity === 'function') clarity('event', 'audit_requested');
  console.log('[Mogoverse] Conversion tracked: audit_requested', email);
}

// Track: Email captured (timed popup)
function mogoTrackEmailCaptured(email) {
  mogoTrackEnhancedConversion(email);
  mogoTrackConversion(MOGO_TRACKING.CONVERSION_LABELS.email_captured, {
    type: 'email_captured',
    value: 10
  });
  if (typeof clarity === 'function') clarity('event', 'email_captured');
  console.log('[Mogoverse] Conversion tracked: email_captured', email);
}

// ============================================================
// 5. MICROSOFT CLARITY — loaded via GTM (no manual script needed)
// [2026-03-28] Project ID: w2uv9zdrgv — connected to GTM-TFX2NPMP
// [2026-04-04] Perf: Clarity is loaded by GTM on page load (461ms main thread cost).
// We stub window.clarity to queue calls, then push a GTM event on first user
// interaction so GTM's Clarity tag fires only after first touch/click/key.
// All clarity('set',...) and clarity('event',...) calls are queued and replayed.
// ============================================================
(function() {
  // Install stub — queues all clarity() calls until real Clarity loads
  if (typeof window.clarity === 'undefined') {
    var _clarityQueue = [];
    window.clarity = function() { _clarityQueue.push(arguments); };
    window._clarityQueue = _clarityQueue;
  }

  // Fire GTM 'mogo_clarity_init' on first user interaction
  // GTM should have a trigger on this event to fire the Clarity tag
  var _clarityFired = false;
  function _initClarity() {
    if (_clarityFired) return;
    _clarityFired = true;
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({ event: 'mogo_clarity_init' });
  }
  ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach(function(evt) {
    window.addEventListener(evt, _initClarity, { once: true, passive: true });
  });
})();

// ============================================================
// 6. PAGE VIEW + LANDING PAGE TRACKING
// ============================================================
(function(){
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    event: 'mogo_pageview',
    page_path: window.location.pathname,
    page_title: document.title,
    page_url: window.location.href,
    page_referrer: document.referrer,
    landing_page: document.title.replace('Mogoverse — ', ''),
    utm: mogoGetUtm(),
    timestamp: new Date().toISOString()
  });

  // [2026-03-28] Tag Clarity session with UTM + page data
  if (typeof clarity === 'function') {
    var utm = mogoGetUtm();
    if (utm.utm_source) clarity('set', 'utm_source', utm.utm_source);
    if (utm.utm_medium) clarity('set', 'utm_medium', utm.utm_medium);
    if (utm.utm_campaign) clarity('set', 'utm_campaign', utm.utm_campaign);
    if (utm.gclid) clarity('set', 'gclid', utm.gclid);
    clarity('set', 'page_type', window.location.pathname === '/' ? 'homepage' : 'landing_page');
  }
})();

// ============================================================
// 7. ENHANCED CONVERSION HELPER — sends user data with conversions
// [2026-03-28] For Google Ads Smart Bidding optimization
// ============================================================
function mogoTrackEnhancedConversion(email, phone) {
  if (typeof gtag !== 'function') return;
  // Send enhanced conversion data for Google Ads bid optimization
  gtag('set', 'user_data', {
    email: email || '',
    phone_number: phone || ''
  });

  // Push to dataLayer for GTM Enhanced Conversions
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    event: 'enhanced_conversion',
    enhanced_conversion_data: {
      email: email || '',
      phone_number: phone || ''
    },
    utm: mogoGetUtm()
  });

  // Tag Clarity session with lead info
  if (typeof clarity === 'function') {
    clarity('set', 'lead_email_domain', (email || '').split('@')[1] || 'unknown');
    clarity('set', 'has_phone', phone ? 'yes' : 'no');
    clarity('identify', email || 'anonymous');
  }
}
