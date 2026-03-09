import fs from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const BACKEND_URL = 'https://gatecrowd-backend.onrender.com';

const routeMeta = {
  '/': {
    title: 'Jagannath Temple Puri Crowd Today – Live Darshan Waiting Time & Gate Status | GateCrowd',
    description:
      'Check Jagannath Temple Puri crowd today with real-time gate congestion updates and darshan waiting times. Plan your visit efficiently and avoid long queues.'
  },
  '/home': {
    title: 'Live Crowd Monitoring for Puri Jagannath Temple | GateCrowd',
    description:
      'Track live crowd conditions and best gate recommendations for a smoother darshan at Puri Jagannath Temple.'
  },
  '/gates': {
    title: 'Temple Gates Live Status | GateCrowd',
    description: 'Compare all gate crowd ranges and find the best gate to enter now.'
  },
  '/alerts': {
    title: 'Live Crowd Alerts and Recommendations | GateCrowd',
    description: 'Get crowd warnings, congestion updates, and recommended entry guidance.'
  },
  '/about': {
    title: 'About GateCrowd Frontend Architecture | GateCrowd',
    description: 'Frontend architecture, backend integration, and realtime-ready design details.'
  }
};

function routeToPath(route) {
  if (route === '/') {
    return '';
  }
  return route === '/home' ? 'home' : route.replace(/^\//, '');
}

function applyMeta(html, route, title, description) {
  const canonical = `https://gatecrowd.vercel.app${route}`;
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  out = out.replace(/<meta name="description"[\s\S]*?>/i, `<meta name="description" content="${description}" />`);

  if (out.includes('rel="canonical"')) {
    out = out.replace(/<link rel="canonical"[\s\S]*?>/i, `<link rel="canonical" href="${canonical}" />`);
  } else {
    out = out.replace('</head>', `  <link rel="canonical" href="${canonical}" />\n</head>`);
  }

  return out;
}

async function getDynamicGateRoutes() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/gates`, { method: 'GET' });
    if (!response.ok) {
      return [];
    }
    const gates = await response.json();
    return gates
      .map((gate) => gate?._id)
      .filter(Boolean)
      .map((id) => ({
        route: `/gates/${id}`,
        title: `Gate ${id} Live Crowd Details | GateCrowd`,
        description: 'Live crowd range, timing insights, and gate detail information.'
      }));
  } catch {
    return [];
  }
}

async function writeRouteSnapshot(baseHtml, route, title, description) {
  const dirName = routeToPath(route);
  const outputDir = path.join(DIST_DIR, dirName);
  const outputPath = dirName ? path.join(outputDir, 'index.html') : path.join(DIST_DIR, 'index.html');

  await fs.mkdir(outputDir, { recursive: true });
  const html = applyMeta(baseHtml, route, title, description);
  await fs.writeFile(outputPath, html, 'utf8');
}

async function run() {
  const baseHtmlPath = path.join(DIST_DIR, 'index.html');
  const baseHtml = await fs.readFile(baseHtmlPath, 'utf8');

  const staticTasks = Object.entries(routeMeta).map(([route, meta]) =>
    writeRouteSnapshot(baseHtml, route, meta.title, meta.description)
  );

  const dynamicRoutes = await getDynamicGateRoutes();
  const dynamicTasks = dynamicRoutes.map((entry) =>
    writeRouteSnapshot(baseHtml, entry.route, entry.title, entry.description)
  );

  await Promise.all([...staticTasks, ...dynamicTasks]);
  process.stdout.write(`prerender snapshots generated for ${Object.keys(routeMeta).length + dynamicRoutes.length} routes\n`);
}

run();
