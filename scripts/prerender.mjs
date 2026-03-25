/**
 * Post-build pre-rendering + sitemap generation script.
 *
 * 1. Fetches published post slugs from Supabase (works everywhere).
 * 2. Generates an up-to-date sitemap.xml in dist/.
 * 3. Attempts to pre-render every public route with Puppeteer so crawlers
 *    get full HTML. If Chrome isn't available (e.g. Vercel CI), prerendering
 *    is skipped gracefully — the SPA still works, and the sitemap is correct.
 *
 * Before overwriting dist/index.html (the SPA shell), it saves a copy as
 * dist/_shell.html so Vercel can still serve it as the SPA fallback for
 * dynamic routes like /insights/:slug.
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, extname } from 'path';

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
    console.log(`  Found ${posts.length} published post(s)`);
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
/*  Puppeteer pre-rendering (may be unavailable in CI)                 */
/* ------------------------------------------------------------------ */
async function prerenderRoutes(allRoutes) {
  // Resolve Chrome: on Vercel CI use @sparticuz/chromium (headless
  // Chromium built for Lambda/CI), locally use puppeteer's bundled Chrome.
  let puppeteer, chromiumArgs = [], executablePath;
  const isCI = !!process.env.VERCEL || !!process.env.CI;

  if (isCI) {
    try {
      const chromium = (await import('@sparticuz/chromium')).default;
      // puppeteer-core is shipped inside puppeteer — import from there
      puppeteer = (await import('puppeteer-core')).default
                ?? (await import('puppeteer')).default;
      executablePath = await chromium.executablePath();
      chromiumArgs = chromium.args;
      console.log('  Using @sparticuz/chromium for pre-rendering (CI)');
    } catch (err) {
      console.warn(`  ⚠ @sparticuz/chromium not available in CI — skipping pre-rendering: ${err.message}`);
      return false;
    }
  } else {
    try {
      puppeteer = (await import('puppeteer')).default;
      console.log('  Using bundled Puppeteer Chrome for pre-rendering');
    } catch {
      console.warn('  ⚠ Puppeteer not available — skipping pre-rendering');
      return false;
    }
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      ...(executablePath ? { executablePath } : {}),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        ...chromiumArgs,
      ],
    });
  } catch (err) {
    console.warn(`  ⚠ Could not launch Chrome — skipping pre-rendering: ${err.message}`);
    return false;
  }

  const server = await startServer();

  try {
    for (const route of allRoutes) {
      const page = await browser.newPage();

      // Block external scripts (chat widgets, analytics) — they cause frame
      // detach errors and aren't needed in the pre-rendered HTML. They'll
      // still load at runtime for real visitors.
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const url = req.url();
        if (
          req.resourceType() === 'script' &&
          !url.startsWith(`http://localhost:${PORT}`)
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });

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
  } finally {
    await browser.close();
    server.close();
  }

  return true;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */
async function main() {
  console.log('\n⚡ Post-build: sitemap + pre-rendering...\n');

  // 1. Fetch dynamic post slugs from Supabase
  const posts = await fetchPostSlugs();
  const postRoutes = posts.map((p) => `/insights/${p.slug}`);
  const allRoutes = [...STATIC_ROUTES, ...postRoutes];

  // 2. Always create _shell.html (Vercel rewrites non-static routes here)
  const shellSrc = join(DIST, 'index.html');
  const shellDst = join(DIST, '_shell.html');
  copyFileSync(shellSrc, shellDst);
  console.log('  ✓ Saved SPA shell as _shell.html');

  // 3. Generate sitemap.xml (always — no browser needed)
  console.log(`  Generating sitemap.xml (${allRoutes.length} URLs)...`);
  const sitemap = generateSitemap(allRoutes, posts);
  writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf-8');
  console.log('  ✓ sitemap.xml written\n');

  // 4. Attempt pre-rendering (skips gracefully if Chrome unavailable)
  const didPrerender = await prerenderRoutes(allRoutes);

  if (didPrerender) {
    console.log(`\n✅ Pre-rendered ${allRoutes.length} routes + sitemap generated.\n`);
  } else {
    console.log('\n✅ Sitemap generated. Pre-rendering skipped (no Chrome). SPA will serve all routes.\n');
  }
}

main().catch((err) => {
  console.error('Post-build script failed:', err);
  process.exit(1);
});
