
const CACHE_NAME = 'prueba-pwa-v1'
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/index.js',
    '/manifest.json',
    '/img'

]

/******  instalar **********/
self.addEventListener('install', async e =>{
    const cache = await caches.open( CACHE_NAME )
    await cache.addAll( STATIC_ASSETS )
    return self.skipWaiting()
})

/******  activar **********/
self.addEventListener( 'activate', e => {
    self.clients.claim()
})

/****** ofline **********/
self.addEventListener( 'fetch', async e => {
    const req = e.request
    const url = new URL (req.url)

    if (url.origin === location.origin ) {
        e.respondWith(cacheFirst(req))
    } else {
        e.respondWith( networkAndCache(req))
    }
})

async function cacheFirst(req) {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(req)
    return cached || fetch(req)
}

/******  cuando vuelve a tener conexion **********/
async function networkAndCache(req){
    const cache = await caches.open(CACHE_NAME)
    try{
        const fresh = await fetch(req)
        await cache.put( req, fresh.clone())
        return fresh
    }catch (e) {
        const cached = await cache.match(req)
        return cached
    }
}


