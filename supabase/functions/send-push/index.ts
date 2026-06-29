/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Smart Captcha Studios — Supabase Edge Function: send-push
 *
 * Receives an announcement payload and sends a Web Push notification to every
 * subscriber stored in the `push_subscriptions` table.
 *
 * Invoked by the admin panel after saving a live announcement.
 *
 * Environment variables required (set in Supabase Dashboard → Secrets):
 *   SUPABASE_URL            — auto-provided by Supabase runtime
 *   SUPABASE_SERVICE_ROLE_KEY — auto-provided by Supabase runtime
 *   VAPID_PRIVATE_KEY       — your VAPID private key (pkcs8, base64url)
 *   VAPID_SUBJECT           — e.g., "mailto:admin@smartcaptchagh.com"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── VAPID CONFIG ─────────────────────────────────────────────────────────────
const VAPID_PUBLIC_KEY =
  'BL1BleY3VRK-3t8Bv1EoBGeywsUA40bskUcGxMB2Ug8cEZX-8uHaqOjPGyX5Yy1hRT-NIrXwkxR-RtAY1pIN3sY';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** base64url → Uint8Array */
function base64UrlToUint8Array(b64url: string): Uint8Array {
  const pad = '='.repeat((4 - (b64url.length % 4)) % 4);
  const b64 = (b64url + pad).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

/** Uint8Array → base64url string */
function uint8ArrayToBase64Url(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Import VAPID private key from pkcs8 base64url */
async function importVapidPrivateKey(privateKeyB64: string): Promise<CryptoKey> {
  const keyData = base64UrlToUint8Array(privateKeyB64);
  return crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
}

/** Build a VAPID Authorization JWT header */
async function buildVapidJWT(
  audience: string,
  subject: string,
  privateKey: CryptoKey
): Promise<string> {
  const header = uint8ArrayToBase64Url(
    new TextEncoder().encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' }))
  );

  const now = Math.floor(Date.now() / 1000);
  const claims = {
    aud: audience,
    exp: now + 12 * 3600,   // 12 hours
    sub: subject
  };
  const payload = uint8ArrayToBase64Url(
    new TextEncoder().encode(JSON.stringify(claims))
  );

  const unsigned = `${header}.${payload}`;
  const sigBuffer = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    new TextEncoder().encode(unsigned)
  );

  const sig = uint8ArrayToBase64Url(new Uint8Array(sigBuffer));
  return `${unsigned}.${sig}`;
}

/**
 * Encrypts the push message payload using AES-128-GCM (Web Push encryption).
 * Implements RFC 8291 (Message Encryption for Web Push).
 */
async function encryptPushPayload(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  plaintext: string
): Promise<{ ciphertext: Uint8Array; salt: Uint8Array; serverPublicKey: Uint8Array }> {
  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(plaintext);

  // Client's public key (p256dh) and auth secret
  const clientPublicKey = base64UrlToUint8Array(subscription.keys.p256dh);
  const authSecret      = base64UrlToUint8Array(subscription.keys.auth);

  // Generate ephemeral server key pair for this message
  const serverKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits']
  );

  // Export server public key in raw format
  const serverPublicKeyRaw = new Uint8Array(
    await crypto.subtle.exportKey('raw', serverKeyPair.publicKey)
  );

  // Import client public key for ECDH
  const clientKey = await crypto.subtle.importKey(
    'raw',
    clientPublicKey,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // Derive shared secret via ECDH
  const sharedSecretBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: clientKey },
    serverKeyPair.privateKey,
    256
  );
  const sharedSecret = new Uint8Array(sharedSecretBits);

  // Generate random 16-byte salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // HKDF to derive PRK from auth secret
  const prkBase = await crypto.subtle.importKey('raw', sharedSecret, 'HKDF', false, ['deriveBits']);
  const prkInfo = concat(encoder.encode('WebPush: info\0'), clientPublicKey, serverPublicKeyRaw);
  const prkBits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: authSecret, info: prkInfo },
    prkBase,
    256
  );
  const prk = new Uint8Array(prkBits);

  // Derive IKM from PRK + salt
  const ikmKey  = await crypto.subtle.importKey('raw', prk, 'HKDF', false, ['deriveBits']);
  const cekInfo = encoder.encode('Content-Encoding: aes128gcm\0');
  const cekBits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info: cekInfo },
    ikmKey,
    128
  );
  const cek = new Uint8Array(cekBits);

  const nonceInfo = encoder.encode('Content-Encoding: nonce\0');
  const nonceBits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info: nonceInfo },
    ikmKey,
    96
  );
  const nonce = new Uint8Array(nonceBits);

  // Encrypt with AES-128-GCM
  const aesKey = await crypto.subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt']);

  // Padding: add a single 0x02 delimiter byte after the plaintext
  const paddedPayload = concat(plaintextBytes, new Uint8Array([2]));

  const encryptedBits = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce, tagLength: 128 },
    aesKey,
    paddedPayload
  );

  return {
    ciphertext:    new Uint8Array(encryptedBits),
    salt,
    serverPublicKey: serverPublicKeyRaw
  };
}

/** Concatenate Uint8Arrays */
function concat(...arrays: Uint8Array[]): Uint8Array {
  const totalLen = arrays.reduce((sum, a) => sum + a.length, 0);
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Builds the aes128gcm content-encoding header + body per RFC 8291.
 */
function buildEncryptedBody(
  salt: Uint8Array,
  serverPublicKey: Uint8Array,
  ciphertext: Uint8Array
): Uint8Array {
  // Header: salt (16) + record_size (4, big-endian) + keyid_len (1) + keyid
  const recordSize = new Uint8Array(4);
  new DataView(recordSize.buffer).setUint32(0, 4096, false);

  const keyIdLen = new Uint8Array([serverPublicKey.length]);
  return concat(salt, recordSize, keyIdLen, serverPublicKey, ciphertext);
}

/**
 * Sends a single Web Push notification to one subscription endpoint.
 * Returns the HTTP status code, or -1 on error.
 */
async function sendPushToSubscription(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payloadJson: string,
  vapidPrivateKey: CryptoKey,
  vapidSubject: string
): Promise<number> {
  try {
    const url      = new URL(subscription.endpoint);
    const audience = `${url.protocol}//${url.host}`;

    const jwt = await buildVapidJWT(audience, vapidSubject, vapidPrivateKey);

    const { ciphertext, salt, serverPublicKey } = await encryptPushPayload(subscription, payloadJson);
    const body = buildEncryptedBody(salt, serverPublicKey, ciphertext);

    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Authorization':      `vapid t=${jwt},k=${VAPID_PUBLIC_KEY}`,
        'Content-Type':       'application/octet-stream',
        'Content-Encoding':   'aes128gcm',
        'TTL':                '86400',     // 24 hours
        'Urgency':            'normal'
      },
      body
    });

    return response.status;
  } catch (err) {
    console.error('[send-push] Error sending to endpoint:', err);
    return -1;
  }
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // ── CORS preflight ──
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // ── Parse announcement payload from request body ──
  let announcement: {
    title?: string;
    body?: string;
    badge?: string;
    url?: string;
    image?: string;
    category?: string;
  };

  try {
    announcement = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ── Environment variables ──
  const supabaseUrl     = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const vapidPrivateB64 = Deno.env.get('VAPID_PRIVATE_KEY');
  const vapidSubject    = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@smartcaptchagh.com';

  if (!vapidPrivateB64) {
    return new Response(
      JSON.stringify({ error: 'VAPID_PRIVATE_KEY secret not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Build notification payload ──
  const notificationPayload = JSON.stringify({
    title:    announcement.title  || '📸 Smart Captcha Studios',
    body:     announcement.body   || 'You have a new update from Smart Captcha Studios.',
    icon:     'https://smartcaptchagh.com/assets/logo.jpg',
    badge:    'https://smartcaptchagh.com/assets/logo.jpg',
    url:      announcement.url    || 'https://smartcaptchagh.com/',
    tag:      'sc-announcement',
    category: announcement.category || 'announcement',
    image:    announcement.image  || null,
    actions: [
      { action: 'view',    title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  });

  // ── Fetch all subscriptions ──
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: subscriptions, error: fetchError } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth');

  if (fetchError) {
    console.error('[send-push] Error fetching subscriptions:', fetchError.message);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch subscriptions', details: fetchError.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return new Response(
      JSON.stringify({ message: 'No subscribers', sent: 0, failed: 0 }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }

  // ── Import VAPID private key ──
  let vapidPrivateKey: CryptoKey;
  try {
    vapidPrivateKey = await importVapidPrivateKey(vapidPrivateB64);
  } catch (err) {
    console.error('[send-push] Failed to import VAPID private key:', err);
    return new Response(
      JSON.stringify({ error: 'Invalid VAPID private key' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Send to all subscribers (parallel, with concurrency limit) ──
  let sent    = 0;
  let failed  = 0;
  const staleIds: string[] = [];    // 410 Gone — subscription expired

  const CONCURRENCY = 10;

  for (let i = 0; i < subscriptions.length; i += CONCURRENCY) {
    const batch = subscriptions.slice(i, i + CONCURRENCY);

    await Promise.all(batch.map(async (sub) => {
      const status = await sendPushToSubscription(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        notificationPayload,
        vapidPrivateKey,
        vapidSubject
      );

      if (status >= 200 && status < 300) {
        sent++;
      } else if (status === 410 || status === 404) {
        // Subscription expired or invalid — mark for deletion
        staleIds.push(sub.id);
        failed++;
      } else {
        failed++;
        console.warn(`[send-push] Non-success status ${status} for endpoint: ${sub.endpoint.substring(0, 40)}…`);
      }
    }));
  }

  // ── Clean up stale subscriptions ──
  if (staleIds.length > 0) {
    console.log(`[send-push] Removing ${staleIds.length} stale subscription(s)`);
    await supabase
      .from('push_subscriptions')
      .delete()
      .in('id', staleIds);
  }

  const result = {
    message: `Push sent to ${sent} subscriber(s)`,
    total:   subscriptions.length,
    sent,
    failed,
    staleRemoved: staleIds.length
  };

  console.log('[send-push] Done:', result);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
});
