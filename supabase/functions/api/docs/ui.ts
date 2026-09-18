/**
 * Srushti AI API Documentation Renderers
 * Supports:
 * 1. Swagger UI (Classic & Dark Mode interactive console with 'Try it out' & Authorize)
 * 2. Scalar UI (Modern developer reference)
 */

export function renderSwaggerDocsHtml(
  specOrUrl: any,
  title = "Srushti AI API Documentation"
): string {
  const isUrl = typeof specOrUrl === "string";
  const specJson = isUrl
    ? null
    : JSON.stringify(specOrUrl).replace(/<\/script>/gi, "<\\/script>");

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="icon" type="image/svg+xml" href="https://supabase.com/favicon/favicon.ico" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.33.0/swagger-ui.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      :root {
        --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        --font-mono: 'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
        font-family: var(--font-sans);
        transition: background-color 0.2s ease, color 0.2s ease;
      }

      /* Custom Branded Top Navbar */
      .srushti-navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 24px;
        background: #0b0f19;
        border-bottom: 1px solid #1f2937;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      }

      .srushti-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
      }

      .srushti-logo-icon {
        font-size: 22px;
        filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.4));
      }

      .srushti-title {
        font-size: 17px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -0.01em;
      }

      .srushti-badge {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 3px 8px;
        border-radius: 9999px;
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      .srushti-nav-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .nav-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 500;
        padding: 6px 12px;
        border-radius: 6px;
        text-decoration: none;
        color: #cbd5e1;
        background: #1e293b;
        border: 1px solid #334155;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .nav-btn:hover {
        background: #334155;
        color: #ffffff;
        border-color: #475569;
      }

      .theme-btn {
        font-family: var(--font-sans);
      }

      /* Loader */
      #swagger-loading {
        color: #94a3b8;
        text-align: center;
        padding: 60px 20px;
        font-family: var(--font-mono);
        font-size: 15px;
      }

      .spinner {
        display: inline-block;
        width: 22px;
        height: 22px;
        border: 3px solid rgba(16, 185, 129, 0.2);
        border-radius: 50%;
        border-top-color: #10b981;
        animation: spin 0.8s linear infinite;
        vertical-align: middle;
        margin-right: 12px;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Swagger UI Base Styles */
      .swagger-ui {
        font-family: var(--font-sans) !important;
      }

      .swagger-ui .topbar {
        display: none !important; /* Replaced by custom Srushti navbar */
      }

      .swagger-ui .info {
        margin: 25px 0 !important;
      }

      .swagger-ui code, .swagger-ui pre {
        font-family: var(--font-mono) !important;
      }

      /* ========================================================= */
      /* DARK THEME OVERRIDES (Enabled by default)                 */
      /* ========================================================= */
      html[data-theme="dark"] body {
        background-color: #0b0f19;
        color: #f1f5f9;
      }

      html[data-theme="dark"] .swagger-ui {
        color: #e2e8f0;
      }

      html[data-theme="dark"] .swagger-ui .info .title,
      html[data-theme="dark"] .swagger-ui .info h1,
      html[data-theme="dark"] .swagger-ui .info h2,
      html[data-theme="dark"] .swagger-ui .info h3,
      html[data-theme="dark"] .swagger-ui .info h4,
      html[data-theme="dark"] .swagger-ui .info h5 {
        color: #f8fafc;
      }

      html[data-theme="dark"] .swagger-ui .info p,
      html[data-theme="dark"] .swagger-ui .info li,
      html[data-theme="dark"] .swagger-ui .info table {
        color: #94a3b8;
      }

      html[data-theme="dark"] .swagger-ui .scheme-container {
        background-color: #111827;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid #1f2937;
        padding: 15px 0;
      }

      html[data-theme="dark"] .swagger-ui .schemes-title,
      html[data-theme="dark"] .swagger-ui label {
        color: #e2e8f0;
      }

      html[data-theme="dark"] .swagger-ui select {
        background-color: #1e293b;
        color: #f8fafc;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: 6px 10px;
      }

      html[data-theme="dark"] .swagger-ui .opblock-tag {
        color: #f8fafc;
        border-bottom: 1px solid #1f2937;
      }

      html[data-theme="dark"] .swagger-ui .opblock-tag:hover {
        color: #10b981;
      }

      html[data-theme="dark"] .swagger-ui .opblock-tag small {
        color: #94a3b8;
      }

      /* Opblock Container styling */
      html[data-theme="dark"] .swagger-ui .opblock {
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        margin-bottom: 14px;
        border-width: 1px;
      }

      html[data-theme="dark"] .swagger-ui .opblock .opblock-summary {
        padding: 8px 14px;
      }

      html[data-theme="dark"] .swagger-ui .opblock .opblock-summary-path,
      html[data-theme="dark"] .swagger-ui .opblock .opblock-summary-path__deprecated {
        color: #f1f5f9;
        font-family: var(--font-mono);
        font-size: 14px;
        font-weight: 600;
      }

      html[data-theme="dark"] .swagger-ui .opblock .opblock-summary-description {
        color: #94a3b8;
        font-size: 13px;
      }

      html[data-theme="dark"] .swagger-ui .opblock-body {
        background-color: #0f172a;
      }

      html[data-theme="dark"] .swagger-ui .opblock .opblock-section-header {
        background-color: #111827;
        box-shadow: none;
        border-bottom: 1px solid #1e293b;
      }

      html[data-theme="dark"] .swagger-ui .opblock .opblock-section-header h4 {
        color: #f8fafc;
      }

      html[data-theme="dark"] .swagger-ui .tabli .tabitem button.tablinks {
        color: #94a3b8;
      }

      html[data-theme="dark"] .swagger-ui .tabli .tabitem.active button.tablinks {
        color: #10b981;
        font-weight: 600;
      }

      html[data-theme="dark"] .swagger-ui table thead tr td,
      html[data-theme="dark"] .swagger-ui table thead tr th {
        color: #94a3b8;
        border-bottom: 1px solid #1e293b;
      }

      html[data-theme="dark"] .swagger-ui .parameters-col_name {
        color: #f1f5f9;
      }

      html[data-theme="dark"] .swagger-ui .parameter__name {
        color: #f8fafc;
        font-family: var(--font-mono);
        font-size: 13px;
      }

      html[data-theme="dark"] .swagger-ui .parameter__name.required span {
        color: #ef4444;
      }

      html[data-theme="dark"] .swagger-ui .parameter__type {
        color: #38bdf8;
        font-family: var(--font-mono);
      }

      html[data-theme="dark"] .swagger-ui .parameter__in {
        color: #64748b;
        font-family: var(--font-mono);
      }

      html[data-theme="dark"] .swagger-ui input[type=text],
      html[data-theme="dark"] .swagger-ui textarea {
        background-color: #1e293b;
        color: #f8fafc;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: 8px 10px;
        font-family: var(--font-mono);
      }

      html[data-theme="dark"] .swagger-ui input[type=text]:focus,
      html[data-theme="dark"] .swagger-ui textarea:focus {
        border-color: #10b981;
        outline: none;
      }

      html[data-theme="dark"] .swagger-ui .response-col_status {
        color: #f8fafc;
        font-family: var(--font-mono);
        font-weight: 700;
      }

      html[data-theme="dark"] .swagger-ui .response-col_description {
        color: #cbd5e1;
      }

      html[data-theme="dark"] .swagger-ui .responses-inner h4,
      html[data-theme="dark"] .swagger-ui .responses-inner h5 {
        color: #f8fafc;
      }

      html[data-theme="dark"] .swagger-ui .highlight-code,
      html[data-theme="dark"] .swagger-ui .microlight {
        background-color: #030712 !important;
        color: #e2e8f0 !important;
        border-radius: 6px;
      }

      /* Models Accordion */
      html[data-theme="dark"] .swagger-ui section.models {
        background-color: #111827;
        border: 1px solid #1f2937;
        border-radius: 8px;
        margin-top: 30px;
      }

      html[data-theme="dark"] .swagger-ui section.models h4 {
        color: #f8fafc;
      }

      html[data-theme="dark"] .swagger-ui .model-box {
        background-color: #0f172a;
        border-radius: 6px;
      }

      html[data-theme="dark"] .swagger-ui .model-title {
        color: #f8fafc;
        font-family: var(--font-mono);
      }

      html[data-theme="dark"] .swagger-ui .model {
        color: #cbd5e1;
      }

      html[data-theme="dark"] .swagger-ui .prop-name {
        color: #f1f5f9;
        font-family: var(--font-mono);
      }

      html[data-theme="dark"] .swagger-ui .prop-type {
        color: #38bdf8;
        font-family: var(--font-mono);
      }

      html[data-theme="dark"] .swagger-ui .property-row {
        border-top: 1px solid #1e293b;
      }

      /* Authorize Dialog & Buttons */
      html[data-theme="dark"] .swagger-ui .btn.authorize {
        background-color: transparent;
        border-color: #10b981;
        color: #10b981;
        border-radius: 6px;
        font-weight: 600;
        transition: all 0.15s ease;
      }

      html[data-theme="dark"] .swagger-ui .btn.authorize:hover {
        background-color: #10b981;
        color: #ffffff;
      }

      html[data-theme="dark"] .swagger-ui .btn.authorize svg {
        fill: currentColor;
      }

      html[data-theme="dark"] .swagger-ui .btn.try-out__btn {
        background-color: #1e293b;
        border-color: #334155;
        color: #cbd5e1;
        border-radius: 6px;
        font-weight: 500;
      }

      html[data-theme="dark"] .swagger-ui .btn.try-out__btn:hover {
        background-color: #334155;
        color: #ffffff;
      }

      html[data-theme="dark"] .swagger-ui .btn.execute {
        background-color: #10b981;
        border-color: #10b981;
        color: #ffffff;
        border-radius: 6px;
        font-weight: 600;
      }

      html[data-theme="dark"] .swagger-ui .btn.cancel {
        background-color: #ef4444;
        border-color: #ef4444;
        color: #ffffff;
        border-radius: 6px;
      }

      html[data-theme="dark"] .swagger-ui .dialog-ux .backdrop-ux {
        background: rgba(0, 0, 0, 0.7);
      }

      html[data-theme="dark"] .swagger-ui .dialog-ux .modal-ux {
        background-color: #111827;
        border: 1px solid #1f2937;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        border-radius: 12px;
      }

      html[data-theme="dark"] .swagger-ui .dialog-ux .modal-ux-header {
        border-bottom: 1px solid #1f2937;
      }

      html[data-theme="dark"] .swagger-ui .dialog-ux .modal-ux-header h3 {
        color: #f8fafc;
      }

      html[data-theme="dark"] .swagger-ui .dialog-ux .modal-ux-content h4 {
        color: #f8fafc;
      }

      html[data-theme="dark"] .swagger-ui .dialog-ux .modal-ux-content p {
        color: #94a3b8;
      }

      /* Filter Search Bar */
      html[data-theme="dark"] .swagger-ui .filter .operation-filter-input {
        background-color: #111827;
        color: #f8fafc;
        border: 1px solid #1f2937;
        border-radius: 6px;
        margin: 15px 0;
        padding: 8px 14px;
      }
    </style>
  </head>
  <body>
    <!-- Top Branded Header -->
    <header class="srushti-navbar">
      <a href="/api/docs" class="srushti-brand">
        <span class="srushti-logo-icon">⚡</span>
        <span class="srushti-title">Srushti AI API</span>
        <span class="srushti-badge">OpenAPI 3.1</span>
      </a>
      <div class="srushti-nav-actions">
        <a href="/api/docs/openapi.json" target="_blank" class="nav-btn" title="View raw JSON specification">
          📄 OpenAPI JSON
        </a>
        <a href="/api/docs/scalar" class="nav-btn" title="Switch to Scalar documentation view">
          ✨ Scalar View
        </a>
        <button id="theme-toggle" class="nav-btn theme-btn" onclick="toggleTheme()" title="Toggle Dark/Light Mode">
          🌙 Dark
        </button>
      </div>
    </header>

    <div id="swagger-loading">
      <span class="spinner"></span> Loading Swagger UI...
    </div>

    <!-- Swagger UI Mount Point -->
    <div id="swagger-ui"></div>

    <!-- Embedded OpenAPI Specification Data -->
    <script id="swagger-spec" type="application/json">${specJson || "{}"}</script>

    <!-- Swagger UI CDN Bundles -->
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.33.0/swagger-ui-bundle.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.33.0/swagger-ui-standalone-preset.js"></script>

    <script>
      // Theme Toggle Logic
      function initTheme() {
        var savedTheme = localStorage.getItem("srushti_swagger_theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
        updateThemeButton(savedTheme);
      }

      function toggleTheme() {
        var current = document.documentElement.getAttribute("data-theme") || "dark";
        var next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("srushti_swagger_theme", next);
        updateThemeButton(next);
      }

      function updateThemeButton(theme) {
        var btn = document.getElementById("theme-toggle");
        if (btn) {
          btn.innerHTML = theme === "dark" ? "🌙 Dark" : "☀️ Light";
        }
      }

      initTheme();

      // Initialize Swagger UI
      window.addEventListener("DOMContentLoaded", function () {
        var specData = null;
        var specEl = document.getElementById("swagger-spec");
        if (specEl && specEl.textContent && specEl.textContent.trim() !== "{}") {
          try {
            specData = JSON.parse(specEl.textContent);
          } catch (e) {
            console.warn("Failed to parse embedded spec, falling back to URL fetch", e);
          }
        }

        var config = {
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "BaseLayout",
          defaultModelsExpandDepth: 1,
          defaultModelExpandDepth: 1,
          docExpansion: "list",
          filter: true,
          showExtensions: true,
          showCommonExtensions: true,
          displayRequestDuration: true,
          tryItOutEnabled: true,
          persistAuthorization: true,
          onComplete: function() {
            var loader = document.getElementById("swagger-loading");
            if (loader) loader.style.display = "none";
          }
        };

        if (specData) {
          config.spec = specData;
        } else {
          config.url = "${isUrl ? specOrUrl : "/api/docs/openapi.json"}";
        }

        window.ui = SwaggerUIBundle(config);

        // Fallback hide loader
        setTimeout(function() {
          var loader = document.getElementById("swagger-loading");
          if (loader) loader.style.display = "none";
        }, 800);
      });
    </script>
  </body>
</html>`;
}

export function renderScalarDocsHtml(
  specOrUrl: any,
  title = "Srushti AI API Reference"
): string {
  const isUrl = typeof specOrUrl === "string";
  const specJson = isUrl
    ? null
    : JSON.stringify(specOrUrl).replace(/<\/script>/gi, "<\\/script>");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="icon" type="image/svg+xml" href="https://supabase.com/favicon/favicon.ico" />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        background-color: #0d1117;
        color: #f1f5f9;
      }
      .scalar-api-reference {
        --scalar-color-primary: #10b981;
        --scalar-color-1: #ffffff;
        --scalar-color-2: #94a3b8;
        --scalar-color-3: #64748b;
        --scalar-background-1: #0f172a;
        --scalar-background-2: #1e293b;
        --scalar-background-3: #334155;
      }
      #loading {
        color: #94a3b8;
        text-align: center;
        padding: 60px 20px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 15px;
      }
      .spinner {
        display: inline-block;
        width: 22px;
        height: 22px;
        border: 3px solid rgba(16, 185, 129, 0.2);
        border-radius: 50%;
        border-top-color: #10b981;
        animation: spin 0.8s linear infinite;
        vertical-align: middle;
        margin-right: 12px;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .top-switch {
        position: fixed;
        top: 10px;
        right: 16px;
        z-index: 99999;
      }
      .switch-btn {
        background: #1e293b;
        color: #e2e8f0;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 500;
        text-decoration: none;
        display: inline-block;
      }
      .switch-btn:hover {
        background: #334155;
        color: #ffffff;
      }
    </style>
  </head>
  <body>
    <div class="top-switch">
      <a href="/api/docs" class="switch-btn">⚡ Switch to Swagger UI</a>
    </div>

    <div id="loading"><span class="spinner"></span> Loading Scalar Reference...</div>

    <!-- Scalar Interactive API Reference -->
    <script
      id="api-reference"
      ${isUrl ? `data-url="${specOrUrl}"` : `type="application/json"`}
      data-configuration='{
        "theme": "kepler",
        "darkMode": true,
        "showSidebar": true,
        "hideDownloadButton": false,
        "searchHotKey": "k",
        "metaData": {
          "title": "${title}",
          "description": "Interactive API Documentation & Testing Console"
        }
      }'
    >${specJson || ""}</script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.25.101/dist/browser/standalone.min.js"></script>
    <script>
      function hideLoader() {
        var loader = document.getElementById("loading");
        if (loader) loader.style.display = "none";
      }
      window.addEventListener("load", function() {
        setTimeout(hideLoader, 200);
      });
      var observer = new MutationObserver(function() {
        if (document.querySelector(".scalar-api-reference, .scalar-app, #headlessui-portal-root")) {
          hideLoader();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    </script>
  </body>
</html>`;
}

// By default, renderDocsHtml produces the Swagger UI!
export const renderDocsHtml = renderSwaggerDocsHtml;

