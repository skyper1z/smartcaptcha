/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Smart Captcha Studios — Web Push Notifications (push-notifications.js)
 *
 * Responsibilities:
 *   1. Register the Service Worker
 *   2. After a delay, show a custom "Enable Notifications" card
 *   3. Request browser permission when user opts in
 *   4. Subscribe to push and save the subscription to Supabase
 *   5. Handle all permission states gracefully
 *   6. Listen for SW re-subscription messages and update Supabase
 *
 * This file is loaded on the main site (index.html) only — NOT the admin panel.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const PUSH_CONFIG = {
  /** VAPID public key — must match sw.js and the Edge Function secret */
  vapidPublicKey: 'BL1BleY3VRK-3t8Bv1EoBGeywsUA40bskUcGxMB2Ug8cEZX-8uHaqOjPGyX5Yy1hRT-NIrXwkxR-RtAY1pIN3sY',

  /**
   * How long (ms) after page load before showing the permission card.
   * Set to 12s so it doesn't overlap with the install prompt card (4s).
   * If the install card was dismissed sooner, we still wait for this delay.
   */
  promptDelayMs: 12000,

  /** localStorage keys */
  keys: {
    dismissed:  'sc_push_dismissed',   // user clicked "Not now" — don't show again
    subscribed: 'sc_push_subscribed',  // subscription endpoint stored in Supabase
    endpoint:   'sc_push_endpoint'     // current endpoint (to detect rotation)
  },

  /** Supabase table name for storing subscriptions */
  table: 'push_subscriptions'
};

// ─── UTILITIES ────────────────────────────────────────────────────────────────

/**
 * Converts a URL-safe Base64 VAPID public key to Uint8Array.
 * Required by pushManager.subscribe() applicationServerKey.
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

/** Guards: only proceed on HTTPS or localhost */
function isSecureContext() {
  return window.isSecureContext ||
    location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1';
}

/** Guards: confirm browser supports required APIs */
function isPushSupported() {
  const sw   = 'serviceWorker' in navigator;
  const push = 'PushManager' in window;
  const notif = 'Notification' in window;
  if (!sw)   console.log('[Push] serviceWorker not supported in this browser.');
  if (!push) console.log('[Push] PushManager not supported (iOS < 16.4, or non-HTTPS).');
  if (!notif) console.log('[Push] Notification API not supported.');
  return sw && push && notif;
}

// ─── SUPABASE HELPERS ─────────────────────────────────────────────────────────

/**
 * Saves a new PushSubscription to Supabase.
 * Uses upsert on the `endpoint` column to handle re-subscriptions.
 */
async function saveSubscriptionToSupabase(subscription) {
  if (!window.supabaseClient) {
    console.warn('[Push] Supabase client not ready — subscription not saved.');
    return false;
  }

  const keys = subscription.toJSON().keys || {};
  const payload = {
    endpoint:   subscription.endpoint,
    p256dh:     keys.p256dh  || '',
    auth:       keys.auth    || '',
    user_agent: navigator.userAgent.substring(0, 200)
  };

  try {
    const { error } = await window.supabaseClient
      .from(PUSH_CONFIG.table)
      .insert([payload]);

    if (error) {
      // code 23505 = unique_violation (endpoint already stored) — treat as success
      if (error.code === '23505') {
        console.log('[Push] Subscription already stored — updating localStorage.');
        localStorage.setItem(PUSH_CONFIG.keys.subscribed, '1');
        localStorage.setItem(PUSH_CONFIG.keys.endpoint, subscription.endpoint);
        return true;
      }
      console.error('[Push] Failed to save subscription:', error.message, error.code);
      return false;
    }

    // Remember in localStorage so we don't re-register on every page load
    localStorage.setItem(PUSH_CONFIG.keys.subscribed, '1');
    localStorage.setItem(PUSH_CONFIG.keys.endpoint, subscription.endpoint);
    return true;
  } catch (err) {
    console.error('[Push] Unexpected error saving subscription:', err);
    return false;
  }
}

/**
 * Removes a subscription from Supabase (used when user unsubscribes).
 */
async function removeSubscriptionFromSupabase(endpoint) {
  if (!window.supabaseClient || !endpoint) return;
  try {
    await window.supabaseClient
      .from(PUSH_CONFIG.table)
      .delete()
      .eq('endpoint', endpoint);
    localStorage.removeItem(PUSH_CONFIG.keys.subscribed);
    localStorage.removeItem(PUSH_CONFIG.keys.endpoint);
    console.log('[Push] Subscription removed from Supabase.');
  } catch (err) {
    console.warn('[Push] Could not remove subscription from Supabase:', err);
  }
}

// ─── SERVICE WORKER REGISTRATION ─────────────────────────────────────────────

/**
 * Registers (or updates) the Service Worker.
 * Returns the SW registration, or null on failure.
 */
async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'   // always check for SW updates
    });

    // Trigger update check immediately (handles deployments)
    registration.update();

    console.log('[Push] Service Worker registered, scope:', registration.scope);

    // Handle re-subscription messages sent by the SW
    navigator.serviceWorker.addEventListener('message', async (event) => {
      if (event.data && event.data.type === 'SC_PUSH_RESUBSCRIBED') {
        console.log('[Push] SW reported subscription rotation — updating Supabase');
        await saveSubscriptionToSupabase(event.data.subscription);
      }
    });

    return registration;
  } catch (err) {
    console.error('[Push] Service Worker registration failed:', err);
    return null;
  }
}

// ─── SUBSCRIBE ────────────────────────────────────────────────────────────────

/**
 * Creates a push subscription and saves it to Supabase.
 * Returns true on success.
 */
async function subscribeToPush(registration) {
  try {
    const applicationServerKey = urlBase64ToUint8Array(PUSH_CONFIG.vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,       // required — always show a notification
      applicationServerKey
    });

    console.log('[Push] Subscribed:', subscription.endpoint.substring(0, 60) + '…');
    return await saveSubscriptionToSupabase(subscription);
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      console.warn('[Push] Permission denied by browser.');
    } else {
      console.error('[Push] Subscription failed:', err);
    }
    return false;
  }
}

// ─── PERMISSION CARD UI ───────────────────────────────────────────────────────

/**
 * Creates and appends the custom "Enable Notifications" card to the DOM.
 * The card slides up from the bottom-right of the screen.
 */
function createPermissionCard() {
  // Remove any existing card
  const existing = document.getElementById('sc-push-card');
  if (existing) existing.remove();

  const card = document.createElement('div');
  card.id = 'sc-push-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'false');
  card.setAttribute('aria-label', 'Enable push notifications');
  card.innerHTML = `
    <button class="sc-push-card-close" id="sc-push-card-close" aria-label="Close notification prompt">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <div class="sc-push-card-icon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    </div>

    <div class="sc-push-card-content">
      <h4 class="sc-push-card-title">🔔 Stay in the loop</h4>
      <p class="sc-push-card-body">
        Get instant updates about bookings, shoots, special offers, and announcements —
        even when you're not on our site.
      </p>
    </div>

    <div class="sc-push-card-actions">
      <button class="sc-push-card-btn-primary" id="sc-push-enable-btn">
        Enable Notifications
      </button>
      <button class="sc-push-card-btn-secondary" id="sc-push-later-btn">
        Not now
      </button>
    </div>
  `;

  // Inject styles if not already injected
  if (!document.getElementById('sc-push-styles')) {
    const style = document.createElement('style');
    style.id = 'sc-push-styles';
    style.textContent = `
      /* ── Push Notification Card ─────────────────────────────────────── */
      #sc-push-card {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: min(380px, calc(100vw - 32px));
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid rgba(0, 245, 212, 0.18);
        border-radius: 20px;
        padding: 22px 22px 18px;
        box-shadow:
          0 20px 60px rgba(0, 0, 0, 0.6),
          0 0 0 1px rgba(255,255,255,0.04),
          inset 0 1px 0 rgba(255,255,255,0.06);
        z-index: 99990;
        font-family: 'Space Grotesk', system-ui, sans-serif;
        color: #e2e8f0;
        transform: translateY(120px);
        opacity: 0;
        transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                    opacity 0.35s ease;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      #sc-push-card.sc-push-card-visible {
        transform: translateY(0);
        opacity: 1;
      }
      #sc-push-card.sc-push-card-hiding {
        transform: translateY(120px);
        opacity: 0;
      }

      /* Close button */
      .sc-push-card-close {
        position: absolute;
        top: 14px;
        right: 14px;
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
        flex-shrink: 0;
        padding: 0;
      }
      .sc-push-card-close:hover {
        background: rgba(255,255,255,0.12);
        color: #e2e8f0;
      }

      /* Bell icon wrapper */
      .sc-push-card-icon {
        width: 52px;
        height: 52px;
        background: linear-gradient(135deg, rgba(0,245,212,0.15), rgba(0,245,212,0.05));
        border: 1px solid rgba(0,245,212,0.2);
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #00f5d4;
        flex-shrink: 0;
      }

      .sc-push-card-content {}
      .sc-push-card-title {
        margin: 0 0 6px;
        font-size: 1rem;
        font-weight: 700;
        color: #f1f5f9;
        line-height: 1.3;
      }
      .sc-push-card-body {
        margin: 0;
        font-size: 0.85rem;
        color: #94a3b8;
        line-height: 1.55;
      }

      /* Action buttons */
      .sc-push-card-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .sc-push-card-btn-primary {
        flex: 1;
        min-width: 130px;
        background: linear-gradient(135deg, #00f5d4, #00c4b4);
        color: #0f172a;
        border: none;
        border-radius: 10px;
        padding: 10px 16px;
        font-size: 0.88rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        transition: opacity 0.2s, transform 0.15s;
        letter-spacing: 0.01em;
      }
      .sc-push-card-btn-primary:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      .sc-push-card-btn-primary:active { transform: translateY(0); }
      .sc-push-card-btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .sc-push-card-btn-secondary {
        background: transparent;
        color: #64748b;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: color 0.2s, border-color 0.2s;
      }
      .sc-push-card-btn-secondary:hover {
        color: #94a3b8;
        border-color: rgba(255,255,255,0.18);
      }

      /* Success / error state messages inside the card */
      .sc-push-card-status {
        font-size: 0.82rem;
        border-radius: 8px;
        padding: 8px 12px;
        margin-top: -4px;
        text-align: center;
        font-weight: 500;
      }
      .sc-push-card-status.success {
        background: rgba(0, 245, 212, 0.1);
        color: #00f5d4;
        border: 1px solid rgba(0, 245, 212, 0.2);
      }
      .sc-push-card-status.error {
        background: rgba(239, 68, 68, 0.1);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.2);
      }
      .sc-push-card-status.denied {
        background: rgba(234, 179, 8, 0.1);
        color: #fbbf24;
        border: 1px solid rgba(234, 179, 8, 0.2);
      }

      @media (max-width: 480px) {
        #sc-push-card {
          bottom: 16px;
          right: 16px;
          left: 16px;
          width: auto;
        }
      }
    `;
    document.head.appendChild(style);
  }

  return card;
}

/**
 * Shows the permission card with a slide-in animation.
 * @param {ServiceWorkerRegistration} registration
 */
function showPermissionCard(registration) {
  const card = createPermissionCard();
  document.body.appendChild(card);

  // Trigger animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => card.classList.add('sc-push-card-visible'));
  });

  // ── Dismiss / close without subscribing ──
  const dismiss = (permanent = true) => {
    card.classList.add('sc-push-card-hiding');
    card.classList.remove('sc-push-card-visible');
    setTimeout(() => card.remove(), 460);
    if (permanent) {
      localStorage.setItem(PUSH_CONFIG.keys.dismissed, '1');
    }
  };

  document.getElementById('sc-push-card-close').addEventListener('click', () => dismiss(true));
  document.getElementById('sc-push-later-btn').addEventListener('click', () => dismiss(true));

  // ── Enable button ──
  document.getElementById('sc-push-enable-btn').addEventListener('click', async () => {
    const enableBtn = document.getElementById('sc-push-enable-btn');
    const laterBtn  = document.getElementById('sc-push-later-btn');
    enableBtn.textContent = 'Connecting…';
    enableBtn.disabled = true;
    laterBtn.disabled  = true;

    // Remove existing status if any
    const existingStatus = card.querySelector('.sc-push-card-status');
    if (existingStatus) existingStatus.remove();

    const showStatus = (msg, type) => {
      const div = document.createElement('div');
      div.className = `sc-push-card-status ${type}`;
      div.textContent = msg;
      card.querySelector('.sc-push-card-actions').after(div);
    };

    // Request permission
    let permission;
    try {
      permission = await Notification.requestPermission();
    } catch {
      permission = 'denied';
    }

    if (permission === 'granted') {
      const success = await subscribeToPush(registration);
      if (success) {
        showStatus('✅ Notifications enabled! You\'re all set.', 'success');
        enableBtn.textContent = '✓ Enabled';
        setTimeout(() => dismiss(false), 2500);
      } else {
        showStatus('⚠️ Subscribed but could not save. Try again later.', 'error');
        enableBtn.textContent = 'Enable Notifications';
        enableBtn.disabled = false;
        laterBtn.disabled  = false;
      }
    } else if (permission === 'denied') {
      showStatus('🚫 Notifications blocked. Enable them in your browser settings.', 'denied');
      // Store dismissed so we don't keep nagging
      localStorage.setItem(PUSH_CONFIG.keys.dismissed, '1');
      enableBtn.textContent = 'Blocked';
      setTimeout(() => dismiss(false), 3000);
    } else {
      // 'default' — user closed the prompt without choosing
      enableBtn.textContent = 'Enable Notifications';
      enableBtn.disabled = false;
      laterBtn.disabled  = false;
    }
  });
}

// ─── MAIN INIT ────────────────────────────────────────────────────────────────

/**
 * Entry point — called on DOMContentLoaded.
 * Coordinates all push notification setup.
 */
async function initPushNotifications() {
  // Guard: only run in a secure context
  if (!isSecureContext()) {
    console.log('[Push] Not a secure context (HTTPS required) — skipping.');
    return;
  }

  // Guard: browser must support service workers + push
  if (!isPushSupported()) {
    console.log('[Push] Push notifications not supported in this browser.');
    return;
  }

  // Register the service worker first (silent, doesn't require permission)
  const registration = await registerServiceWorker();
  if (!registration) return;

  const currentPermission = Notification.permission;

  // ── Already granted — silently re-subscribe if needed ──────────────────────
  if (currentPermission === 'granted') {
    try {
      const existingSub = await registration.pushManager.getSubscription();
      const savedEndpoint = localStorage.getItem(PUSH_CONFIG.keys.endpoint);

      if (!existingSub) {
        // Lost subscription (browser cleared it) — re-subscribe silently
        console.log('[Push] No existing subscription found — re-subscribing silently.');
        await subscribeToPush(registration);
      } else if (existingSub.endpoint !== savedEndpoint) {
        // Endpoint rotated — update Supabase
        console.log('[Push] Subscription endpoint changed — updating Supabase.');
        await saveSubscriptionToSupabase(existingSub);
      } else {
        console.log('[Push] Already subscribed and up to date.');
      }
    } catch (err) {
      console.warn('[Push] Could not check existing subscription:', err);
    }
    return; // Don't show the card if permission already granted
  }

  // ── Already denied — never show the card again ─────────────────────────────
  if (currentPermission === 'denied') {
    console.log('[Push] Notification permission was denied — not prompting.');
    return;
  }

  // ── User previously dismissed the card — respect that choice ───────────────
  if (localStorage.getItem(PUSH_CONFIG.keys.dismissed)) {
    console.log('[Push] User previously dismissed the card — not prompting.');
    return;
  }

  // ── Default state — show custom card after delay ────────────────────────────
  setTimeout(() => {
    // Double-check permission hasn't changed while we were waiting
    if (Notification.permission !== 'default') return;
    showPermissionCard(registration);
  }, PUSH_CONFIG.promptDelayMs);
}

// ─── STARTUP ─────────────────────────────────────────────────────────────────

// Use DOMContentLoaded as the hook — script.js already uses this for other init
document.addEventListener('DOMContentLoaded', () => {
  initPushNotifications().catch((err) => {
    console.warn('[Push] Initialization error:', err);
  });
});

// ─── PUBLIC API ──────────────────────────────────────────────────────────────
// Expose a small API for the optional account settings toggle (future use)

window.SmartCapturePush = {
  /**
   * Programmatically unsubscribe the current user and remove from Supabase.
   * Call this from an account settings "Disable Notifications" button.
   */
  async unsubscribe() {
    if (!('serviceWorker' in navigator)) return false;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        const unsubOk = await sub.unsubscribe();
        if (unsubOk) {
          await removeSubscriptionFromSupabase(endpoint);
          console.log('[Push] Successfully unsubscribed.');
          return true;
        }
      }
    } catch (err) {
      console.error('[Push] Unsubscribe failed:', err);
    }
    return false;
  },

  /**
   * Returns the current notification permission state.
   */
  getPermissionState() {
    return 'Notification' in window ? Notification.permission : 'unsupported';
  },

  /**
   * Shows the permission card manually (e.g., from account settings).
   * Only works if permission is still 'default'.
   */
  async showPrompt() {
    if (!isPushSupported() || !isSecureContext()) return;
    if (Notification.permission !== 'default') return;
    const reg = await navigator.serviceWorker.ready;
    // Clear dismissed flag so the card shows
    localStorage.removeItem(PUSH_CONFIG.keys.dismissed);
    showPermissionCard(reg);
  }
};
