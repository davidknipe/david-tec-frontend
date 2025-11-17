# Cloudflare Worker API Proxy Setup

This Cloudflare Worker proxies requests to the Optimizely API and adds CORS headers to allow requests from localhost and your production domain.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Wrangler CLI installed: `npm install -g wrangler`

## Setup Instructions

### 1. Install Wrangler (if not already installed)

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window for you to authorize Wrangler with your Cloudflare account.

### 3. Deploy the Worker

```bash
wrangler deploy cloudflare-worker.js
```

After deployment, you'll get a URL like:
`https://david-tec-api-proxy.your-subdomain.workers.dev`

### 4. Update Your Code

Once deployed, update your `lib/api.ts` file to use the worker URL instead of the direct API:

```typescript
// Change this:
const baseUrl = 'https://www.david-tec.com/api/episerver/v1.0/search/content/'

// To this (using your worker URL):
const baseUrl = 'https://david-tec-api-proxy.your-subdomain.workers.dev/search/content/'
```

### 5. Optional: Use a Custom Domain

If you want to use a custom domain like `api.david-tec.com`:

1. Go to your Cloudflare dashboard
2. Navigate to Workers & Pages
3. Select your worker
4. Go to Settings → Triggers
5. Add a custom domain or route

Then update `wrangler.toml` with your custom domain route.

## Testing

After deployment, test the proxy:

```bash
curl "https://your-worker-url.workers.dev/search/content/?filter=ContentType%2Fany%28t%3At+eq+%27BlogPostPage%27%29&top=1"
```

You should get a response with the CORS headers included.

## Configuration

### Allowed Origins

The worker is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `https://david-tec.com`
- `https://www.david-tec.com`

To add more origins, edit the `ALLOWED_ORIGINS` array in `cloudflare-worker.js`.

### Cache Duration

The worker caches responses for 1 hour (3600 seconds). To change this, modify the `cacheTtl` value in `cloudflare-worker.js`.

## Troubleshooting

If you encounter issues:

1. Check the worker logs: `wrangler tail`
2. Verify the worker is deployed: `wrangler deployments list`
3. Ensure your Cloudflare account has Workers enabled
4. Check that the CORS headers are being added by inspecting network requests in browser DevTools
