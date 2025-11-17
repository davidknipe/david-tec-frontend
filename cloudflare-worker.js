// Cloudflare Worker to proxy Optimizely API requests and add CORS headers

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://david-tec.com',
  'https://www.david-tec.com',
  'https://david-tec-frontend.vercel.app'
]

const TARGET_API = 'https://www.david-tec.com/api/episerver/v1.0'

async function handleRequest(request) {
  const url = new URL(request.url)
  const origin = request.headers.get('Origin')

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCORS(origin)
  }

  // Build the target URL
  const targetUrl = `${TARGET_API}${url.pathname}${url.search}`

  // Forward the request to the Optimizely API
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
    },
    cf: {
      // Cloudflare cache settings
      cacheTtl: 3600, // Cache for 1 hour
      cacheEverything: true,
    },
  })

  // Clone the response so we can modify headers
  const modifiedResponse = new Response(response.body, response)

  // Add CORS headers
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    modifiedResponse.headers.set('Access-Control-Allow-Origin', origin)
  } else if (!origin) {
    // Allow server-to-server requests (no origin header)
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*')
  }
  modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  modifiedResponse.headers.set('Access-Control-Max-Age', '86400')

  return modifiedResponse
}

function handleCORS(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  return new Response(null, {
    status: 204,
    headers: headers,
  })
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
