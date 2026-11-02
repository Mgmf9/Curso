/* Deixa o site instalável e abrindo mesmo com internet fraca.
   Sempre tenta a versão nova da internet primeiro; só usa a cópia guardada se estiver sem conexão. */
const CACHE = 'linha-producao-v4';
const ARQUIVOS = ['./', 'index.html', 'style.css', 'app.js', 'curso.js', 'config.js', 'logo.png', 'modulo-1.png', 'modulo-2.png', 'modulo-3.png', 'modulo-4.png', 'modulo-5.png', 'modulo-6.png', 'manifest.webmanifest', 'archivo-latin.woff2', 'archivo-latin-ext.woff2'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(ARQUIVOS.map((a) => c.add(a).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then((r) => {
      if (r.ok) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
      return r;
    }).catch(() => caches.match(req).then((m) => m || caches.match('index.html')))
  );
});
