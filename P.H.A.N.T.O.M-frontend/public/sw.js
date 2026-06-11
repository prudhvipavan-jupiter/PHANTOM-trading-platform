// P.H.A.N.T.O.M Service Worker
// Version: 1.0.0
// Purpose: Offline functionality, caching, and performance optimization

const CACHE_NAME = 'phantom-cache-v1.0.0';
const STATIC_CACHE = 'phantom-static-v1.0.0';
const DYNAMIC_CACHE = 'phantom-dynamic-v1.0.0';
const API_CACHE = 'phantom-api-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/phantom-logo.svg',
  '/phantom-logo.css',
  '/phantom-logo.html'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/dashboard',
  '/api/portfolio',
  '/api/market-data',
  '/api/user/profile',
  '/api/trading/signals'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔄 P.H.A.N.T.O.M Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 P.H.A.N.T.O.M Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network first with cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith('/static/') || url.pathname.includes('.')) {
    // Static assets - Cache first with network fallback
    event.respondWith(handleStaticRequest(request));
  } else {
    // HTML pages - Network first with cache fallback
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      
      console.log('🌐 API request served from network:', request.url);
      return networkResponse;
    }
  } catch (error) {
    console.log('📡 Network failed, trying cache for:', request.url);
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('💾 API request served from cache:', request.url);
    return cachedResponse;
  }

  // Return offline response for API requests
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'No internet connection. Please check your connection and try again.',
      timestamp: new Date().toISOString()
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

// Handle static asset requests
async function handleStaticRequest(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('💾 Static asset served from cache:', request.url);
    return cachedResponse;
  }

  try {
    // Fallback to network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      
      console.log('🌐 Static asset served from network:', request.url);
      return networkResponse;
    }
  } catch (error) {
    console.log('❌ Static asset not found:', request.url);
  }

  // Return 404 for missing static assets
  return new Response('Not Found', { status: 404 });
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      
      console.log('🌐 Page served from network:', request.url);
      return networkResponse;
    }
  } catch (error) {
    console.log('📡 Network failed, trying cache for:', request.url);
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('💾 Page served from cache:', request.url);
    return cachedResponse;
  }

  // Return offline page
  return caches.match('/offline.html') || new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>P.H.A.N.T.O.M - Offline</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #00f2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
        }
        .offline-container {
          text-align: center;
          padding: 2rem;
          border: 2px solid #00f2ff;
          border-radius: 1rem;
          background: rgba(0, 242, 255, 0.1);
          backdrop-filter: blur(10px);
        }
        h1 { color: #00f2ff; margin-bottom: 1rem; }
        p { color: #94a3b8; margin-bottom: 1rem; }
        .retry-btn {
          background: linear-gradient(45deg, #00f2ff, #3b82f6);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          color: #000;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 242, 255, 0.3);
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <h1>🚀 P.H.A.N.T.O.M</h1>
        <p>You're currently offline</p>
        <p>Please check your internet connection and try again</p>
        <button class="retry-btn" onclick="window.location.reload()">
          Retry Connection
        </button>
      </div>
    </body>
    </html>
    `,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

// Perform background sync
async function performBackgroundSync() {
  try {
    console.log('🔄 Performing background sync...');
    
    // Sync any pending trades or data
    const pendingData = await getPendingData();
    
    if (pendingData.length > 0) {
      for (const data of pendingData) {
        await syncData(data);
      }
    }
    
    console.log('✅ Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Get pending data from IndexedDB
async function getPendingData() {
  // This would typically interact with IndexedDB
  // For now, return empty array
  return [];
}

// Sync data to server
async function syncData(data) {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      console.log('✅ Data synced successfully');
    }
  } catch (error) {
    console.error('❌ Data sync failed:', error);
    throw error;
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from P.H.A.N.T.O.M',
    icon: '/phantom-logo.svg',
    badge: '/phantom-logo.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Dashboard',
        icon: '/phantom-logo.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/phantom-logo.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('P.H.A.N.T.O.M', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('📨 Message received in service worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_API_DATA') {
    event.waitUntil(cacheApiData(event.data.url, event.data.data));
  }
});

// Cache API data
async function cacheApiData(url, data) {
  try {
    const cache = await caches.open(API_CACHE);
    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300' // 5 minutes
      }
    });
    
    await cache.put(url, response);
    console.log('💾 API data cached:', url);
  } catch (error) {
    console.error('❌ Error caching API data:', error);
  }
}

console.log('🚀 P.H.A.N.T.O.M Service Worker loaded successfully'); 