/* عامل خدمة خفيف: الشبكة أولاً حتى تصل التحديثات دائماً، والنسخة المحفوظة عند انقطاع الاتصال فقط.
   لا يتدخل في الصوت ولا في طلبات المواقع الخارجية. */
const C = 'sq-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || r.headers.has('range')) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(C).then(x => x.put(r, c)); }
      return res;
    }).catch(() => caches.match(r).then(m => m || caches.match('./')))
  );
});
