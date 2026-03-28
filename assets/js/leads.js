// ============================================================
// Mogoverse — Lead Capture to Google Sheets
// ============================================================
// Sends form submissions to a Google Sheet via Apps Script.
// Loaded after tracking.js — reuses mogoGetUtm() from there.
// ============================================================

var MOGO_LEADS = {
  SHEET_URL: 'https://script.google.com/macros/s/AKfycbwpiUeI2nOpFm2HcCJU5ixPOnI7G6BICzyr8md9_8yPQHex51nKF81H2qk-5CYSwHhi/exec'
};

// Submit a lead to Google Sheets. Fire-and-forget — never blocks UX.
// @param {Object} data — any of: email, phone, name, country_code, use_cases, day, time_slot, form_type, form_location
function mogoSubmitLead(data) {
  if (!data || typeof data !== 'object') return;

  var utm = (typeof mogoGetUtm === 'function') ? mogoGetUtm() : {};

  var payload = {
    email: data.email || '',
    phone: data.phone || '',
    name: data.name || '',
    country_code: data.country_code || '',
    persona: data.persona || '',
    use_cases: data.use_cases || [],
    day: data.day || '',
    time_slot: data.time_slot || '',
    form_type: data.form_type || '',
    page_url: window.location.href,
    utm_source: utm.utm_source || '',
    utm_medium: utm.utm_medium || '',
    utm_campaign: utm.utm_campaign || '',
    form_location: data.form_location || '',
    action: data.action || 'create'
  };

  fetch(MOGO_LEADS.SHEET_URL, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(function() {
    console.log('[Mogoverse] Lead submitted:', payload.form_type);
  })
  .catch(function(err) {
    console.error('[Mogoverse] Lead submit failed:', err);
  });
}
