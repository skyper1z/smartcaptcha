/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Smart Captcha Studios — Service Worker (sw.js)
 * Handles Web Push Notifications and click actions.
 *
 * Must be served from the ROOT of the site (/) so its scope covers all pages.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const SW_VERSION = 'sc-sw-v1';

// ─── INSTALL ──────────────────────────────────────────────────────────────────
// Take control immediately — don't wait for old SW to die.
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing ${SW_VERSION}`);
  event.waitUntil(self.skipWaiting());
});

// ─── ACTIVATE ─────────────────────────────────────────────────────────────────
// Claim all open clients so this SW is active immediately.
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating ${SW_VERSION}`);
  event.waitUntil(self.clients.claim());
});

// ─── PUSH EVENT ───────────────────────────────────────────────────────────────
// Fired when the server sends a push message via Web Push Protocol.
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');

  let payload = {
    title: '📸 Smart Captcha Studios',
    body: 'You have a new update from Smart Captcha Studios.',
    icon: '/assets/logo.jpg',
    badge: '/assets/logo.jpg',
    url: 'https://smartcaptchagh.com/',
    tag: 'sc-announcement',
    category: 'announcement',
    image: null,
    actions: [
      { action: 'view',    title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  // Parse the JSON payload sent from the Edge Function
  if (event.data) {
    try {
      const data = event.data.json();
      payload = { ...payload, ...data };
    } catch (err) {
      // Fallback: use the raw text as the body
      payload.body = event.data.text() || payload.body;
    }
  }

  const notificationOptions = {
    body:      payload.body,
    icon:      payload.icon  || '/assets/logo.jpg',
    badge:     payload.badge || '/assets/logo.jpg',
    tag:       payload.tag   || 'sc-announcement',
    renotify:  true,                  // always alert, even if same tag
    silent:    false,
    vibrate:   [200, 100, 200],       // vibration pattern (mobile)
    data: {
      url:      payload.url || 'https://smartcaptchagh.com/',
      category: payload.category || 'announcement'
    },
    actions: payload.actions || [
      { action: 'view',    title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  // Attach image only if provided (rich notification)
  if (payload.image) {
    notificationOptions.image = payload.image;
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

// ─── NOTIFICATION CLICK ───────────────────────────────────────────────────────
// Handles tapping the notification or its action buttons.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const notifData = event.notification.data || {};
  const targetUrl = notifData.url || 'https://smartcaptchagh.com/';

  // "Dismiss" action — just close, no navigation
  if (action === 'dismiss') return;

  // "View" action or clicking the notification body — open/focus the tab
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        // Focus an existing tab if one is open on the same origin
        for (const client of clients) {
          if (client.url.startsWith(self.registration.scope) && 'focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        // Otherwise open a new tab
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

// ─── NOTIFICATION CLOSE ───────────────────────────────────────────────────────
// Fired when the user explicitly dismisses the notification via OS UI.
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed by user:', event.notification.tag);
});

// ─── PUSH SUBSCRIPTION CHANGE ─────────────────────────────────────────────────
// Fired when the browser rotates the push subscription (rare but important).
// We post a message to the main thread to re-subscribe and update Supabase.
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] Push subscription changed — re-subscribing');
  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // VAPID public key — must match push-notifications.js
          'BL1BleY3VRK-3t8Bv1EoBGeywsUA40bskUcGxMB2Ug8cEZX-8uHaqOjPGyX5Yy1hRT-NIrXwkxR-RtAY1pIN3sY'
        )
      })
      .then((subscription) => {
        // Notify all open windows to save the new subscription
        return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
          .then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: 'SC_PUSH_RESUBSCRIBED',
                subscription: subscription.toJSON()
              });
            });
          });
      })
  );
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────
/**
 * Converts a URL-safe Base64 VAPID public key to a Uint8Array,
 * which is the format required by pushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
