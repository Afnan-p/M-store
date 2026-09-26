const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Store = require('../models/Store');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const siteUrl = process.env.CLIENT_URL || 'https://m-store-two.vercel.app';
    const products = await Product.find({ isActive: { $ne: false } }).select('slug updatedAt createdAt').lean();
    const stores = await Store.find({ isActive: { $ne: false } }).select('slug updatedAt createdAt').lean();

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

    // Static pages
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}${route.url}</loc>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic Product Pages
    for (const product of products) {
      const productSlug = product.slug || product._id;
      const lastmod = product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString();
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/product/${productSlug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic Store Pages (if stores have individual locations)
    for (const store of stores) {
      if (store.slug) {
        const lastmod = store.updatedAt ? new Date(store.updatedAt).toISOString() : new Date().toISOString();
        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}/stores/${store.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
