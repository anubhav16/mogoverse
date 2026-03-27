// ============================================================
// Mogoverse — Google Ads Conversion Tracking + UTM Capture
// ============================================================
// SETUP: Replace these placeholder IDs with your actual values
// 1. GTM Container ID → tagmanager.google.com → Create Account → Get ID
// 2. Google Ads Conversion ID → ads.google.com → Tools → Conversions → New → Get ID
// 3. Conversion Label → same place as #2, one label per conversion action
// ============================================================

var MOGO_TRACKING = {
  GTM_ID: 'GTM-XXXXXXX',                    // Replace with your GTM container ID
  GADS_ID: 'AW-XXXXXXXXXX',                 // Replace with your Google Ads conversion ID
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
  if (i === 'GTM-XXXXXXX') { console.warn('[Mogoverse Tracking] GTM_ID not configured — skipping GTM.'); return; }
  w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', MOGO_TRACKING.GTM_ID);

// ============================================================
// 2. GOOGLE ADS GTAG.JS — load global site tag
// ============================================================
(function(){
  if (MOGO_TRACKING.GADS_ID === 'AW-XXXXXXXXXX') { console.warn('[Mogoverse Tracking] GADS_ID not configured — skipping gtag.'); return; }
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
function mogoTrackDemoBooked(email) {
  mogoTrackConversion(MOGO_TRACKING.CONVERSION_LABELS.demo_booked, {
    type: 'demo_booked',
    value: 50  // estimated lead value — adjust as needed
  });
  console.log('[Mogoverse] Conversion tracked: demo_booked', email);
}

// Track: Audit requested (exit intent popup)
function mogoTrackAuditRequested(email) {
  mogoTrackConversion(MOGO_TRACKING.CONVERSION_LABELS.audit_requested, {
    type: 'audit_requested',
    value: 25
  });
  console.log('[Mogoverse] Conversion tracked: audit_requested', email);
}

// Track: Email captured (timed popup)
function mogoTrackEmailCaptured(email) {
  mogoTrackConversion(MOGO_TRACKING.CONVERSION_LABELS.email_captured, {
    type: 'email_captured',
    value: 10
  });
  console.log('[Mogoverse] Conversion tracked: email_captured', email);
}

// ============================================================
// 5. PAGE VIEW + LANDING PAGE TRACKING
// ============================================================
(function(){
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    event: 'mogo_pageview',
    page_path: window.location.pathname,
    page_title: document.title,
    landing_page: document.title.replace('Mogoverse — ', ''),
    utm: mogoGetUtm(),
    timestamp: new Date().toISOString()
  });
})();
