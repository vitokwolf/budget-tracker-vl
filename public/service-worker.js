const APP_PREFIX = 'Budget-'
const VERSION = 'version_01'
const CACHE_NAME = APP_PREFIX + VERSION

const FILES_TO_CACHE = [
  './',
  './index.html',
  './js/index.js',
  './css/styles.css',
  './icons/icon-192x192.png',
  './manifest.json',
]

self.addEventListener('install', (e) => {
  //perform install steps
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      return cache.addAll(FILES_TO_CACHE)
    }),
  )
})

//activate and instructions to manage cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      let cacheKeeplist = keyList.filter((key) => key.indexOf(APP_PREFIX))
      cacheKeeplist.push(CACHE_NAME)

      return Promise.all(
        keyList.map((key, i) => {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i])
            return caches.delete(keyList[i])
          }
        }),
      )
    }),
  )
})

//intercept fetch requests
self.addEventListener('fetch', (e) => {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches
      .match(e.request)
      .then((request) => (request ? request : fetch(e.request))),
  )
})
