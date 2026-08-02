// Firebase background messaging service worker.
// This file runs even when the app/tab is fully closed — it's what lets a
// push notification arrive on the phone with no browser tab open at all.
// It must sit at the site root (same folder as app.html) and be named exactly
// firebase-messaging-sw.js.

importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');
importScripts('./firebase-config.js');

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Fired when a push arrives while nothing is open.
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'نظام الحضور والنقاط';
  const body  = payload.notification?.body  || payload.data?.body  || '';
  const tag   = payload.data?.tag || ('push-' + Date.now());

  self.registration.showNotification(title, {
    body,
    tag,
    icon: payload.notification?.icon,
    badge: payload.notification?.icon,
    renotify: true,
    data: payload.data || {}
  });
});

// Tapping the notification: focus an open tab or open a new one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const APP_URL = self.registration.scope;

  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      if (client.url.startsWith(APP_URL) && 'focus' in client) {
        await client.focus();
        client.postMessage({ type: 'notification-click', data: event.notification.data || {} });
        return;
      }
    }
    if (self.clients.openWindow) {
      await self.clients.openWindow(APP_URL);
    }
  })());
});
