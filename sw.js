// Service Worker for نظام الحضور والنقاط
// Handles: showing local notifications (via showNotification calls from the app),
// receiving real push messages from the server (Firebase), and reacting when the
// user taps a notification — even if the app/tab was fully closed.

const APP_URL = self.registration.scope; // e.g. https://yourdomain.com/

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// --- Real push messages from a server (Firebase Cloud Messaging or plain Web Push) ---
self.addEventListener('push', (event) => {
  let payload = {};
  try{ payload = event.data ? event.data.json() : {}; }catch(e){
    payload = { title: 'نظام الحضور والنقاط', body: event.data ? event.data.text() : '' };
  }
  const title = payload.title || payload.notification?.title || 'نظام الحضور والنقاط';
  const body  = payload.body  || payload.notification?.body  || '';
  const tag   = payload.tag   || payload.data?.tag || ('push-' + Date.now());
  const icon  = payload.icon  || payload.notification?.icon;

  const options = {
    body,
    tag,
    icon,
    badge: icon,
    renotify: true,
    data: payload.data || {}
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// --- Click handling: focus an already-open tab, or open a new one ---
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    // If the app is already open in some tab/window, focus it.
    for (const client of allClients) {
      if (client.url.startsWith(APP_URL) && 'focus' in client) {
        await client.focus();
        // Let the page know a notification was tapped, in case it wants to
        // navigate to a specific view (e.g. dashboard).
        client.postMessage({ type: 'notification-click', data: event.notification.data || {} });
        return;
      }
    }

    // Otherwise, open a new window/tab.
    if (self.clients.openWindow) {
      await self.clients.openWindow(APP_URL);
    }
  })());
});
