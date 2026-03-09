import fs from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://gatecrowd.vercel.app';
const BACKEND_URL = 'https://gatecrowd-backend.onrender.com';
const OUT_FILES = [path.resolve('public', 'sitemap.xml'), path.resolve('dist', 'sitemap.xml')];

async function getGateRoutes() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/gates`, { method: 'GET' });
    if (!response.ok) {
      return [];
    }

    const gates = await response.json();
    return gates
      .map((gate) => gate?._id)
      .filter(Boolean)
      .map((id) => `/gates/${id}`);
  } catch {
    return [];
  }
}

async function generateSitemap() {
  const staticRoutes = ['/', '/home', '/gates', '/alerts', '/about'];
  const dynamicGateRoutes = await getGateRoutes();
  const allRoutes = [...new Set([...staticRoutes, ...dynamicGateRoutes])];
  const today = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === '/' || route === '/home' ? 'daily' : 'hourly'}</changefreq>
    <priority>${route === '/' || route === '/home' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  await Promise.all(
    OUT_FILES.map(async (filePath) => {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, xml, 'utf8');
    })
  );
  process.stdout.write(`sitemap.xml generated with ${allRoutes.length} routes\n`);
}

generateSitemap();
