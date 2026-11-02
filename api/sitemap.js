const fs = require('fs');
const path = require('path');

// Ensure server/node_modules is included in resolution path
try {
  const serverModulesPath = path.join(process.cwd(), 'server', 'node_modules');
  if (fs.existsSync(serverModulesPath) && !module.paths.includes(serverModulesPath)) {
    module.paths.push(serverModulesPath);
  }
} catch (e) {}

let connectDB = null;
let Product = null;

try {
  connectDB = require('../server/src/config/db');
  Product = require('../server/src/models/Product');
} catch (err) {
  console.warn('[Vercel Sitemap Serverless] Direct DB imports note:', err.message);
}

module.exports = async (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'm-store-lilac.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
  const siteUrl = (process.env.VITE_SITE_URL || `${proto}://${host}`).replace(/\/+$/, '');

  let products = [];

  if (connectDB && Product) {
    try {
      await connectDB();
      products = await Product.find({ available: { $ne: false } }).select('slug id updatedAt').lean();
    } catch (dbErr) {
      console.warn('[Vercel Sitemap Serverless] Direct DB error:', dbErr.message);
    }
  }

  if (!products || products.length === 0) {
    try {
      const apiRes = await fetch(`${siteUrl}/api/products`, {
        headers: { Accept: 'application/json' },
      });
      if (apiRes.ok) {
        products = await apiRes.json();
      }
    } catch (err) {
      console.error('[Vercel Sitemap Serverless] Error fetching products:', err.message);
    }
  }

  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/iphones', priority: '0.9', changefreq: 'daily' },
    { url: '/used-iphones', priority: '0.9', changefreq: 'daily' },
    { url: '/accessories', priority: '0.8', changefreq: 'daily' },
    { url: '/offers', priority: '0.8', changefreq: 'daily' },
    { url: '/stores', priority: '0.8', changefreq: 'weekly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const route of staticRoutes) {
    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}${route.url}</loc>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  if (Array.isArray(products)) {
    for (const p of products) {
      const slug = p.slug || p.id || p._id;
      if (slug) {
        const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString();
        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}/product/${encodeURIComponent(slug)}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }
    }
  }

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).send(xml);
};
