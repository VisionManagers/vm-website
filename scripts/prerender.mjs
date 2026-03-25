/**
 * Post-build pre-rendering script.
 * Spins up a local server on the built dist/, uses Puppeteer to render each
 * public route, and writes the full HTML back so crawlers get real content.
 *
 * Before overwriting dist/index.html (the SPA shell), it saves a copy as
 * dist/_shell.html so Vercel can still serve it as the SPA fallback for
 * dynamic routes like /insights/:slug.
 *
 * Also fetches published post slugs from Supabase so insight articles are
 * pre-rendered and discoverable by search engines, and generates a fresh
 * sitemap.xml that includes all routes with lastmod dates.
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, extname } from 'path';
import puppeteer from 'puppeteer';

const DIST = join(process.cwd(), 'dist');
const PORT = 4173;
const SITE_URL = 'https://visionmanagers.com';

// Static routes to pre-render (skip admin)
const STATIC_ROUTES = [
  '/',
  '/ai-voice',
  '/solutions',
  '/lab',
  '/insights',
  '/insights/digest',
  '/contact',
  '/about',
  '/privacy',
  '/start',
];

// Priority + changefreq for sitemap generation
const ROUTE_META = {
  '/':                { priority: '1.0', changefreq: 'weekly' },
  '/ai-voice':        { priority: '0.9', changefreq: 'monthly' },
  '/solutions':       { priority: '0.9', changefreq: 'monthly' },
  '/start':           { priority: '0.8', changefreq: 'monthly' },
  '/insights':        { priority: '0.8', changefreq: 'weekly' },
  '/insights/digest': { priority: '0.6', changefreq: 'weekly' },
  '/lab':             { priority: '0.7', changefreq: 'monthly' },
  '/about':           { priority: '0.7', changefreq: 'monthly' },
  '/contact':         { priority: '0.6', changefreq: 'monthly' },
  '/privacy':         { priority: '0.3', changefreq: 'yearly' },
};

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.xml':  'application/xml',
  '.txt':  'text/plain',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

/* ------------------------------------------------------------------ */
/*  Load Supabase env vars (process.env on Vercel, .env.local locally) */
/* ------------------------------------------------------------------ */
function loadEnv() {
  let url = process.env.VITE_SUPABASE_URL;
  let key = process.env.VITE_SUPABASE_ANON_KEY;

  if (url && key) return { url, key };

  // Fallback: parse .env.local
  const envPath = join(process.cwd(), '.env.local');
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed.slice(eqIdx + 1).trim();
      if (k === 'VITE_SUPABASE_URL') url = v;
      if (k === 'VITE_SUPABASE_ANON_KEY') key = v;
    }
  }

  return { url, key };
}

/* ------------------------------------------------------------------ */
/*  Fetch published post slugs from Supabase REST API                  */
/* ------------------------------------------------------------------ */
async function fetchPostSlugs() {
  const { url, key } = loadEnv();

  if (!url || !key) {
    console.warn('  ⚠ Supabase env vars not found — skipping dynamic post routes');
    return [];
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/posts?select=slug,published_at,updated_at&published=eq.true&order=published_at.desc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );

    if (!res.ok) {
      console.warn(`  ⚠ Supabase query failed (${res.status}) — skipping dynamic post routes`);
      return [];
    }

    const posts = await res.json();
    console.log(`  Found ${posts.length} published post(s) to pre-render`);
    return posts;
  } catch (err) {
    console.warn(`  ⚠ Could not reach Supabase — skipping dynamic post routes: ${err.message}`);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Generate sitemap.xml with all routes                               */
/* ------------------------------------------------------------------ */
function generateSitemap(allRoutes, postMeta) {
  const today = new Date().toISOString().split('T')[0];

  const entries = allRoutes.map((route) => {
    const meta = ROUTE_META[route] || { priority: '0.5', changefreq: 'monthly' };

    // For insight posts, use their published/updated date
    let lastmod = today;
    const post = postMeta.find((p) => route === `/insights/${p.slug}`);
    if (post) {
      lastmod = (post.updated_at || post.published_at || today).split('T')[0];
    }

    const loc = route === '/' ? SITE_URL + '/' : `${SITE_URL}${route}`;

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}

/* ------------------------------------------------------------------ */
/*  Static file server for the dist folder                             */
/* ------------------------------------------------------------------ */
function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST, req.url === '/' ? 'index.html' : req.url);

      // SPA fallback: if file doesn't exist, serve index.html
      if (!existsSync(filePath) || !extname(filePath)) {
        filePath = join(DIST, 'index.html');
      }

      try {
        const content = readFileSync(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(PORT, () => {
      console.log(`  Static server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */
async function prerender() {
  console.log('\n⚡ Pre-rendering routes for SEO...\n');

  // 1. Fetch dynamic post slugs from Supabase
  const posts = await fetchPostSlugs();
  const postRoutes = posts.map((p) => `/insights/${p.slug}`);

  // 2. Combine static + dynamic routes
  const allRoutes = [...STATIC_ROUTES, ...postRoutes];
  console.log(`  ${allRoutes.length} total routes to pre-render\n`);

  // 3. Preserve the original SPA shell before we overwrite index.html
  const shellSrc = join(DIST, 'index.html');
  const shellDst = join(DIST, '_shell.html');
  copyFileSync(shellSrc, shellDst);
  console.log('  Saved SPA shell as _shell.html\n');

  // 4. Pre-render each route with Puppeteer
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const route of allRoutes) {
    const page = await browser.newPage();
    const url = `http://localhost:${PORT}${route}`;

    console.log(`  Rendering ${route}`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for React to finish rendering
    await page.waitForSelector('#root > *', { timeout: 10000 });

    const html = await page.content();
    await page.close();

    // Write the rendered HTML to the correct path in dist
    const outDir = route === '/'
      ? DIST
      : join(DIST, route);

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    const outFile = join(outDir, 'index.html');
    writeFileSync(outFile, html, 'utf-8');
    console.log(`  ✓ Wrote ${outFile.replace(process.cwd(), '.')}`);
  }

  await browser.close();
  server.close();

  // 5. Generate sitemap.xml with all routes (including dynamic posts)
  console.log('\n  Generating sitemap.xml...');
  const sitemap = generateSitemap(allRoutes, posts);
  writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf-8');
  console.log('  ✓ sitemap.xml updated with all routes');

  console.log(`\n✅ Pre-rendered ${allRoutes.length} routes.\n`);
}

prerender().catch((err) => {
  console.error('Pre-render failed:', err);
  process.exit(1);
});
