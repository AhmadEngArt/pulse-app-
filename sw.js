const CACHE='pulse-shell-v5';
const FILES=['./','./index.html','./styles.css','./app.js','./v5.js','./manifest.webmanifest','./pulse.svg','./pulse-192.png','./pulse-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)))});
