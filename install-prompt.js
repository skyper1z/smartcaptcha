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

/**
 * Returns the major iOS version number (e.g. 17, 26), or null if not iOS.
 * iOS 26 = the 2026 redesign with Liquid Glass & three-dot share menu.
 */
function getIOSVersion() {
  // Standard UA: "OS 17_0" or "OS 26_0"
  const match = navigator.userAgent.match(/OS (\d+)[_.](\d+)/);
  if (match) return parseInt(match[1], 10);
  // iPad on iOS 13+ may report as Macintosh — version unknown, assume modern
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return 17;
  return null;
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
      width: min(400px, calc(100vw - 32px));
      background: linear-gradient(145deg, #1a2540 0%, #0f172a 100%);
      border: 1px solid rgba(99, 179, 237, 0.22);
      border-radius: 22px;
      padding: 18px 18px 14px;
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
      width: 50px;
      height: 50px;
      border-radius: 13px;
      overflow: hidden;
      border: 1px solid rgba(99,179,237,0.2);
      flex-shrink: 0;
      background: #0f172a;
    }
    .sc-install-icon-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .sc-install-title {
      margin: 0 0 3px;
      font-size: 0.96rem;
      font-weight: 700;
      color: #f1f5f9;
      line-height: 1.3;
    }
    .sc-install-subtitle {
      margin: 0;
      font-size: 0.79rem;
      color: #64748b;
      line-height: 1.4;
    }

    /* Action buttons */
    .sc-install-actions {
      display: flex;
      gap: 9px;
    }
    .sc-install-btn-primary {
      flex: 1;
      background: linear-gradient(135deg, #63b3ed, #3182ce);
      color: #fff;
      border: none;
      border-radius: 11px;
      padding: 11px 16px;
      font-size: 0.88rem;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s, transform 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
    }
    .sc-install-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .sc-install-btn-primary:active { transform: translateY(0); }
    .sc-install-btn-secondary {
      background: transparent;
      color: #64748b;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 11px;
      padding: 11px 13px;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      transition: color 0.2s, border-color 0.2s;
      white-space: nowrap;
    }
    .sc-install-btn-secondary:hover { color: #94a3b8; border-color: rgba(255,255,255,0.18); }

    /* ── iOS full-screen guided overlay ────────────────────────────────── */
    #sc-ios-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.82);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 90px;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      opacity: 0;
      transition: opacity 0.3s ease;
      cursor: pointer;
    }
    #sc-ios-overlay.sc-ios-visible { opacity: 1; }

    .sc-ios-message-box {
      background: linear-gradient(145deg, #1e293b, #0f172a);
      border: 1px solid rgba(99,179,237,0.25);
      border-radius: 20px;
      padding: 20px 24px;
      max-width: 320px;
      width: calc(100% - 48px);
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      position: relative;
    }
    .sc-ios-share-icon {
      width: 52px;
      height: 52px;
      background: rgba(99,179,237,0.12);
      border: 1px solid rgba(99,179,237,0.25);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
    }
    .sc-ios-title {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0 0 6px;
    }
    .sc-ios-body {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 0.84rem;
      color: #94a3b8;
      margin: 0 0 4px;
      line-height: 1.5;
    }
    .sc-ios-hint {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 0.75rem;
      color: #475569;
      margin: 8px 0 0;
    }

    /* Bouncing arrow — downward (iOS < 26: share button at the bottom) */
    .sc-ios-arrow {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      animation: sc-bounce 1.2s ease-in-out infinite;
    }
    .sc-ios-arrow-shaft {
      width: 2px;
      height: 36px;
      background: linear-gradient(to bottom, rgba(99,179,237,0), #63b3ed);
      border-radius: 2px;
    }
    .sc-ios-arrow-head {
      width: 0;
      height: 0;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-top: 12px solid #63b3ed;
    }

    /* iOS 26+: layout flips — arrow points UP to the top-right ··· menu */
    #sc-ios-overlay.sc-ios-top {
      justify-content: flex-start;
      padding-top: 80px;
      padding-bottom: 0;
    }
    #sc-ios-overlay.sc-ios-top .sc-ios-arrow {
      order: -1;
      margin-top: 0;
      margin-bottom: 16px;
      flex-direction: column-reverse;
      animation: sc-bounce-up 1.2s ease-in-out infinite;
      /* shift right so arrow aligns with top-right ··· button */
      align-self: flex-end;
      margin-right: 28px;
    }
    #sc-ios-overlay.sc-ios-top .sc-ios-arrow-shaft {
      background: linear-gradient(to top, rgba(99,179,237,0), #63b3ed);
    }
    #sc-ios-overlay.sc-ios-top .sc-ios-arrow-head {
      border-top: none;
      border-bottom: 12px solid #63b3ed;
      order: -1;
    }

    /* Bonus note for iOS 26 */
    .sc-ios-bonus {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 0.78rem;
      color: #34d399;
      background: rgba(52,211,153,0.08);
      border: 1px solid rgba(52,211,153,0.18);
      border-radius: 8px;
      padding: 6px 10px;
      margin: 8px 0 0;
      line-height: 1.4;
    }

    @keyframes sc-bounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(10px); }
    }
    @keyframes sc-bounce-up {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
}

// ─── iOS OVERLAY ─────────────────────────────────────────────────────────────

/**
 * Shows a full-screen dark overlay with an animated arrow pointing to
 * the correct Safari control for the user's iOS version:
 *
 *   iOS < 26  → Share button (↑ upload icon) at the BOTTOM — arrow points ↓
 *   iOS 26+   → Three-dot (···) button at the TOP RIGHT — arrow points ↑
 */
function showIOSOverlay() {
  const version = getIOSVersion();
  const isIOS26 = version !== null && version >= 26;

  // ── Version-specific icon ───────────────────────────────────────────────
  const iconHTML = isIOS26
    // ··· ellipsis — matches the iOS 26 Safari top-right menu button
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="10" viewBox="0 0 24 8" fill="#63b3ed">
        <circle cx="3"  cy="4" r="2.5"/>
        <circle cx="12" cy="4" r="2.5"/>
        <circle cx="21" cy="4" r="2.5"/>
       </svg>`
    // Classic share/upload arrow — matches the iOS < 26 Safari bottom share button
    : `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
         fill="none" stroke="#63b3ed" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
         <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
         <polyline points="16 6 12 2 8 6"/>
         <line x1="12" y1="2" x2="12" y2="15"/>
       </svg>`;

  // ── Version-specific body text ──────────────────────────────────────────
  const bodyHTML = isIOS26
    ? `Tap <strong style="color:#63b3ed;">···</strong> at the <strong style="color:#63b3ed;">top right of Safari</strong>,
       tap <strong style="color:#63b3ed;">Share</strong>, then
       <strong style="color:#63b3ed;">"Add to Home Screen"</strong>`
    : `Tap the <strong style="color:#63b3ed;">Share</strong> button at the
       <strong style="color:#63b3ed;">bottom of Safari</strong>,
       then tap <strong style="color:#63b3ed;">"Add to Home Screen"</strong>`;

  // iOS 26 bonus: Apple now opens installed sites as Web Apps by default ✨
  const bonusHTML = isIOS26
    ? `<p class="sc-ios-bonus">✨ iOS 26 opens the site as a full app automatically!</p>`
    : '';

  const overlay = document.createElement('div');
  overlay.id = 'sc-ios-overlay';
  // sc-ios-top flips the layout so the arrow points UP toward the top-right ··· button
  if (isIOS26) overlay.classList.add('sc-ios-top');

  overlay.innerHTML = `
    <div class="sc-ios-message-box">
      <div class="sc-ios-share-icon">${iconHTML}</div>
      <p class="sc-ios-title">Almost there!</p>
      <p class="sc-ios-body">${bodyHTML}</p>
      ${bonusHTML}
      <p class="sc-ios-hint">Tap anywhere to dismiss</p>
    </div>
    <div class="sc-ios-arrow">
      <div class="sc-ios-arrow-shaft"></div>
      <div class="sc-ios-arrow-head"></div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add('sc-ios-visible'));
  });

  const dismiss = () => {
    overlay.classList.remove('sc-ios-visible');
    setTimeout(() => overlay.remove(), 320);
  };

  overlay.addEventListener('click', dismiss);
}

// ─── CARD BUILDER ────────────────────────────────────────────────────────────

function buildInstallCard(platform, deferredPrompt) {
  const card = document.createElement('div');
  card.id = 'sc-install-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-label', 'Add to Home Screen');

  card.innerHTML = `
    <button class="sc-install-close" id="sc-install-close-btn" aria-label="Close">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <div class="sc-install-header">
      <div class="sc-install-icon-wrap">
        <img src="/assets/logo.jpg" alt="Smart Captcha Studios">
      </div>
      <div>
        <p class="sc-install-title">📸 Smart Captcha Studios</p>
        <p class="sc-install-subtitle">Add to your Home Screen for instant access &amp; notifications</p>
      </div>
    </div>

    <div class="sc-install-actions">
      <button class="sc-install-btn-primary" id="sc-install-add-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${platform === 'ios'
            ? '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>'
            : '<path d="M12 5v14M5 12h14"/>'}
        </svg>
        Add to Home Screen
      </button>
      <button class="sc-install-btn-secondary" id="sc-install-later-btn">Not now</button>
    </div>
  `;

  return card;
}

// ─── SHOW CARD ───────────────────────────────────────────────────────────────

function showInstallCard(platform, deferredPrompt) {
  const existing = document.getElementById('sc-install-card');
  if (existing) existing.remove();

  injectInstallStyles();
  const card = buildInstallCard(platform, deferredPrompt);
  document.body.appendChild(card);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => card.classList.add('sc-install-visible'));
  });

  const dismiss = () => {
    card.classList.add('sc-install-hiding');
    card.classList.remove('sc-install-visible');
    setTimeout(() => card.remove(), 480);
    localStorage.setItem(INSTALL_CONFIG.dismissedKey, '1');
    window._scInstallDismissedAt = Date.now();
  };

  document.getElementById('sc-install-close-btn').addEventListener('click', dismiss);
  document.getElementById('sc-install-later-btn').addEventListener('click', dismiss);

  document.getElementById('sc-install-add-btn').addEventListener('click', async () => {
    if (platform === 'ios') {
      // Dismiss the card first, then show the overlay guide
      dismiss();
      setTimeout(() => showIOSOverlay(), 300);
      return;
    }

    // Android: trigger the native install prompt
    const addBtn = document.getElementById('sc-install-add-btn');
    if (!deferredPrompt) { dismiss(); return; }

    if (addBtn) { addBtn.textContent = 'Opening…'; addBtn.disabled = true; }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem(INSTALL_CONFIG.installedKey, '1');
        if (addBtn) addBtn.textContent = '✓ Added!';
        setTimeout(dismiss, 1200);
      } else {
        dismiss();
      }
    } catch (err) {
      console.warn('[Install] prompt() failed:', err);
      dismiss();
    }
  });
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
