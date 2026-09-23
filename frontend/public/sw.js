// Service Worker de base pour CoSider Agrico UEV
const CACHE_NAME = 'cosider-agrico-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through
});