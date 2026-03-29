/* ============================================================
   Mogoverse — Component Loader
   [2026-03-28] Loads shared HTML components via fetch()
   Zero build step. Works on GitHub Pages.
   ============================================================ */

/**
 * Load a component HTML file into a container element.
 * Executes any inline <script> tags in the loaded HTML.
 * @param {string} containerId - DOM element ID to inject into
 * @param {string} path - Path to the component HTML file
 * @param {Function} [callback] - Optional callback after load
 */
function mogoLoadComponent(containerId, path, callback) {
  var container = document.getElementById(containerId);
  if (!container) return;

  fetch(path)
    .then(function(res) {
      if (!res.ok) throw new Error('Component load failed: ' + path);
      return res.text();
    })
    .then(function(html) {
      container.innerHTML = html;

      /* Execute inline scripts in the loaded component */
      var scripts = container.querySelectorAll('script');
      scripts.forEach(function(oldScript) {
        var newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });

      if (typeof callback === 'function') callback();
    })
    .catch(function(err) {
      console.warn('[Mogoverse] ' + err.message);
    });
}

/**
 * Resolve component paths relative to page location.
 * Landing pages are in /landing-pages/, so need ../components/
 * Root pages use /components/ directly.
 */
function mogoComponentPath(filename) {
  var path = window.location.pathname;
  // Two levels deep (e.g., /landing-pages/ad/)
  if (path.indexOf('/landing-pages/ad/') !== -1) return '../../components/' + filename;
  // One level deep
  var isSubdir = path.indexOf('/landing-pages/') !== -1 ||
                 path.indexOf('/sonic-branding/') !== -1 ||
                 path.indexOf('/alternatives/') !== -1 ||
                 path.indexOf('/tools/') !== -1 ||
                 path.indexOf('/mockups/') !== -1;
  return (isSubdir ? '../' : '') + 'components/' + filename;
}
