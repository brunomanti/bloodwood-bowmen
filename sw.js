const CACHE = 'bloodwood-bowmen-v20260620-0818-reserve-line-cache';
const CORE = ['./','./index.html','./styles.css?v=bloodwood-bowmen-v20260620-0818-reserve-line','./game.js?v=bloodwood-bowmen-v20260620-0818-reserve-line','./manifest.webmanifest?v=bloodwood-bowmen-v20260620-0818-reserve-line','./icons/icon-192.png?v=bloodwood-bowmen-v20260620-0818-reserve-line','./icons/icon-512.png?v=bloodwood-bowmen-v20260620-0818-reserve-line'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('bloodwood-bowmen-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.endsWith('/api/log')) return;
  event.respondWith(fetch(event.request, {cache:'no-store'}).then(res => {
    if (res && res.ok) { const copy=res.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{}); }
    return res;
  }).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html') || caches.match('./'))));
});
