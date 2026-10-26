// 一度開いたら、インターネットがなくても動くように必要なファイルを保存しておく
const CACHE = "bingo-v1";
const FILES = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icons/apple-touch-icon.png", "./icons/icon-192.png", "./icons/icon-512.png",
  "./fonts/fonts.css",
  "./fonts/dela-gothic-one-latin-400-normal.woff2", "./fonts/dela-gothic-one-japanese-400-normal.woff2",
  "./fonts/m-plus-rounded-1c-latin-500-normal.woff2", "./fonts/m-plus-rounded-1c-japanese-500-normal.woff2",
  "./fonts/m-plus-rounded-1c-latin-700-normal.woff2", "./fonts/m-plus-rounded-1c-japanese-700-normal.woff2",
  "./fonts/m-plus-rounded-1c-latin-800-normal.woff2", "./fonts/m-plus-rounded-1c-japanese-800-normal.woff2"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// 新しい版があればそれを使い、つながらないときは保存しておいた版を使う
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
  );
});
