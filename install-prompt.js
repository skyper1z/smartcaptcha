/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Smart Captcha Studios — Install Prompt (install-prompt.js)
 *
 * Shows a beautiful "Add to Home Screen" card:
 *   • Android / Chrome: intercepts the beforeinstallprompt event and shows
 *     a one-tap install button that triggers the native browser prompt.
 *   • iOS Safari: detects iOS and shows a step-by-step instruction card
 *     (iOS doesn't support beforeinstallprompt so manual guidance is needed).
 *
 * The card never shows if:
 *   - The app is already installed (running in standalone mode)
 *   - The user previously dismissed it (localStorage flag)
 *   - The browser doesn't support installation at all
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const INSTALL_CONFIG = {
  /** Delay before showing the install card (ms) */
  promptDelayMs: 4000,

  /** localStorage key — set when user dismisses the card */
  dismissedKey: 'sc_install_dismissed',

  /** localStorage key — set after successful install */
  installedKey: 'sc_installed'
};

// ─── DETECTION HELPERS ───────────────────────────────────────────────────────

/** Returns true if already running as an installed PWA */
function isAlreadyInstalled() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||   // iOS standalone
    document.referrer.includes('android-app://') ||
    localStorage.getItem(INSTALL_CONFIG.installedKey) === '1'
  );
}

/** Returns true on iOS Safari (which needs manual install instructions) */
function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPad on iOS 13+ reports as Macintosh
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/** Returns true if the browser is Safari on iOS */
function isIOSSafari() {
  return isIOS() && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS/.test(navigator.userAgent);
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

function injectInstallStyles() {
  if (document.getElementById('sc-install-styles')) return;
  const style = document.createElement('style');
  style.id = 'sc-install-styles';
  style.textContent = `
    /* ── Install Prompt Card ─────────────────────────────────────────── */
    #sc-install-card {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(140px);
      width: min(420px, calc(100vw - 32px));
      background: linear-gradient(145deg, #1a2540 0%, #0f172a 100%);
      border: 1px solid rgba(99, 179, 237, 0.22);
      border-radius: 22px;
      padding: 20px 20px 16px;
      box-shadow:
        0 24px 64px rgba(0,0,0,0.65),
        0 0 0 1px rgba(255,255,255,0.04),
        inset 0 1px 0 rgba(255,255,255,0.07);
      z-index: 99995;
      font-family: 'Space Grotesk', system-ui, sans-serif;
      color: #e2e8f0;
      opacity: 0;
      transition: transform 0.48s cubic-bezier(0.34, 1.56, 0.64, 1),
                  opacity  0.36s ease;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    #sc-install-card.sc-install-visible {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    #sc-install-card.sc-install-hiding {
      transform: translateX(-50%) translateY(140px);
      opacity: 0;
    }

    /* Close button */
    .sc-install-close {
      position: absolute;
      top: 13px;
      right: 13px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #94a3b8;
      transition: background 0.2s, color 0.2s;
      padding: 0;
      flex-shrink: 0;
    }
    .sc-install-close:hover { background: rgba(255,255,255,0.12); color: #e2e8f0; }

    /* Header row */
    .sc-install-header {
      display: flex;
      align-items: center;
      gap: 13px;
    }
    .sc-install-icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(99,179,237,0.2);
      flex-shrink: 0;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sc-install-icon-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .sc-install-title {
      margin: 0 0 3px;
      font-size: 0.98rem;
      font-weight: 700;
      color: #f1f5f9;
      line-height: 1.3;
    }
    .sc-install-subtitle {
      margin: 0;
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.4;
    }

    /* iOS steps */
    .sc-install-steps {
      background: rgba(99,179,237,0.05);
      border: 1px solid rgba(99,179,237,0.12);
      border-radius: 14px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .sc-install-step {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.84rem;
      color: #cbd5e1;
      line-height: 1.4;
    }
    .sc-install-step-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(99,179,237,0.15);
      border: 1px solid rgba(99,179,237,0.25);
      color: #63b3ed;
      font-size: 0.72rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .sc-install-step-icon {
      display: inline-flex;
      align-items: center;
      background: rgba(99,179,237,0.12);
      border-radius: 6px;
      padding: 2px 5px;
      margin: 0 2px;
    }

    /* Action buttons */
    .sc-install-actions {
      display: flex;
      gap: 10px;
    }
    .sc-install-btn-primary {
      flex: 1;
      background: linear-gradient(135deg, #63b3ed, #3182ce);
      color: #fff;
      border: none;
      border-radius: 11px;
      padding: 11px 18px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s, transform 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      letter-spacing: 0.01em;
    }
    .sc-install-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .sc-install-btn-primary:active { transform: translateY(0); }
    .sc-install-btn-secondary {
      background: transparent;
      color: #64748b;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 11px;
      padding: 11px 14px;
      font-size: 0.83rem;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      transition: color 0.2s, border-color 0.2s;
      white-space: nowrap;
    }
    .sc-install-btn-secondary:hover { color: #94a3b8; border-color: rgba(255,255,255,0.18); }

    /* Arrow indicator for iOS */
    .sc-install-arrow {
      text-align: center;
      font-size: 0.78rem;
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    .sc-install-arrow::before,
    .sc-install-arrow::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255,255,255,0.06);
    }

    @media (max-width: 480px) {
      #sc-install-card {
        bottom: 12px;
        left: 16px;
        right: 16px;
        transform: translateY(140px);
        width: auto;
      }
      #sc-install-card.sc-install-visible  { transform: translateY(0); }
      #sc-install-card.sc-install-hiding   { transform: translateY(140px); }
    }
  `;
  document.head.appendChild(style);
}

// ─── CARD BUILDER ────────────────────────────────────────────────────────────

/**
 * Builds and returns the install card element.
 * @param {'android'|'ios'} platform
 * @param {BeforeInstallPromptEvent|null} deferredPrompt
 */
function buildInstallCard(platform, deferredPrompt) {
  const card = document.createElement('div');
  card.id = 'sc-install-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-label', 'Add to Home Screen');

  const iosSteps = `
    <div class="sc-install-steps">
      <div class="sc-install-step">
        <span class="sc-install-step-num">1</span>
        <span>Tap the <span class="sc-install-step-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#63b3ed" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </span> <strong>Share</strong> button at the bottom of Safari</span>
      </div>
      <div class="sc-install-step">
        <span class="sc-install-step-num">2</span>
        <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
      </div>
      <div class="sc-install-step">
        <span class="sc-install-step-num">3</span>
        <span>Tap <strong>"Add"</strong> — done! 🎉</span>
      </div>
    </div>
    <div class="sc-install-arrow">Tap the share icon below ↓</div>
  `;

  const androidContent = `
    <div class="sc-install-actions">
      <button class="sc-install-btn-primary" id="sc-install-add-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        Add to Home Screen
      </button>
      <button class="sc-install-btn-secondary" id="sc-install-later-btn">Not now</button>
    </div>
  `;

  const iosActions = `
    <div class="sc-install-actions">
      <button class="sc-install-btn-secondary" id="sc-install-later-btn" style="flex:1; color:#94a3b8;">Got it, thanks!</button>
    </div>
  `;

  card.innerHTML = `
    <button class="sc-install-close" id="sc-install-close-btn" aria-label="Close">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div class="sc-install-header">
      <div class="sc-install-icon-wrap">
        <img src="/assets/logo.jpg" alt="Smart Captcha Studios" onerror="this.parentElement.innerHTML='📸'">
      </div>
      <div>
        <p class="sc-install-title">📸 Smart Captcha Studios</p>
        <p class="sc-install-subtitle">
          ${platform === 'ios'
            ? 'Add to your Home Screen for quick access & notifications'
            : 'Install the app for instant access & push notifications'}
        </p>
      </div>
    </div>

    ${platform === 'ios' ? iosSteps : ''}
    ${platform === 'android' ? androidContent : iosActions}
  `;

  return card;
}

// ─── SHOW CARD ───────────────────────────────────────────────────────────────

function showInstallCard(platform, deferredPrompt) {
  // Remove any existing card
  const existing = document.getElementById('sc-install-card');
  if (existing) existing.remove();

  injectInstallStyles();
  const card = buildInstallCard(platform, deferredPrompt);
  document.body.appendChild(card);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => card.classList.add('sc-install-visible'));
  });

  const dismiss = () => {
    card.classList.add('sc-install-hiding');
    card.classList.remove('sc-install-visible');
    setTimeout(() => card.remove(), 480);
    localStorage.setItem(INSTALL_CONFIG.dismissedKey, '1');
    // Slightly delay the push notification card so it doesn't overlap
    window._scInstallDismissedAt = Date.now();
  };

  // Close button
  document.getElementById('sc-install-close-btn').addEventListener('click', dismiss);

  // "Not now" / "Got it" button
  const laterBtn = document.getElementById('sc-install-later-btn');
  if (laterBtn) laterBtn.addEventListener('click', dismiss);

  // Android "Add to Home Screen" button
  const addBtn = document.getElementById('sc-install-add-btn');
  if (addBtn && deferredPrompt) {
    addBtn.addEventListener('click', async () => {
      addBtn.textContent = 'Opening…';
      addBtn.disabled = true;

      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          localStorage.setItem(INSTALL_CONFIG.installedKey, '1');
          addBtn.textContent = '✓ Added!';
          setTimeout(dismiss, 1500);
        } else {
          // User dismissed native prompt — dismiss our card too
          dismiss();
        }
      } catch (err) {
        console.warn('[Install] prompt() failed:', err);
        dismiss();
      }
    });
  }

  // Click outside to dismiss
  card.addEventListener('click', (e) => { if (e.target === card) dismiss(); });
}

// ─── INIT ────────────────────────────────────────────────────────────────────

(function initInstallPrompt() {
  // Never show if already installed
  if (isAlreadyInstalled()) {
    console.log('[Install] Already installed as PWA — skipping prompt.');
    return;
  }

  // Never show if user previously dismissed
  if (localStorage.getItem(INSTALL_CONFIG.dismissedKey)) {
    console.log('[Install] User previously dismissed install prompt.');
    return;
  }

  let deferredPrompt = null; // holds the beforeinstallprompt event

  // ── Android / Chrome: capture the native install event ──────────────────
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // stop the browser showing its own mini-infobar
    deferredPrompt = e;
    console.log('[Install] beforeinstallprompt captured — will show custom card.');

    setTimeout(() => {
      if (isAlreadyInstalled() || localStorage.getItem(INSTALL_CONFIG.dismissedKey)) return;
      showInstallCard('android', deferredPrompt);
    }, INSTALL_CONFIG.promptDelayMs);
  });

  // ── iOS Safari: show manual instructions ────────────────────────────────
  if (isIOSSafari() && !isAlreadyInstalled()) {
    setTimeout(() => {
      if (localStorage.getItem(INSTALL_CONFIG.dismissedKey)) return;
      showInstallCard('ios', null);
    }, INSTALL_CONFIG.promptDelayMs);
  }

  // ── Track successful install ─────────────────────────────────────────────
  window.addEventListener('appinstalled', () => {
    console.log('[Install] App installed successfully!');
    localStorage.setItem(INSTALL_CONFIG.installedKey, '1');
    const card = document.getElementById('sc-install-card');
    if (card) card.remove();
  });
})();
