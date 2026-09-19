const fs = require('fs');
const path = require('path');

function formatINR(price) {
  if (typeof price !== 'number' || isNaN(price)) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async (req, res) => {
  const { slug, id } = req.query;
  const target = Array.isArray(slug) ? slug[0] : slug || (Array.isArray(id) ? id[0] : id) || '';
  const siteUrl = 'https://m-store-two.vercel.app';
  const defaultImage = `${siteUrl}/favicon.png`;
  const backendApiUrl = process.env.VITE_API_URL || 'https://m-store-backend.onrender.com/api';

  let product = null;

  if (target) {
    try {
      const apiRes = await fetch(`${backendApiUrl}/products/${encodeURIComponent(target)}`, {
        headers: { Accept: 'application/json' },
      });
      if (apiRes.ok) {
        product = await apiRes.json();
      } else {
        const listRes = await fetch(`${backendApiUrl}/products`, {
          headers: { Accept: 'application/json' },
        });
        if (listRes.ok) {
          const allProducts = await listRes.json();
          const targetNorm = target.toLowerCase().trim();
          product = allProducts.find(
            (p) =>
              p.id === target ||
              p.slug === target ||
              (p.name && p.name.toLowerCase().trim().replace(/\s+/g, '-') === targetNorm)
          );
        }
      }
    } catch (err) {
      console.error('[Vercel OG Serverless] Error fetching product:', err.message);
    }
  }

  let title = 'M STORE | Used & New iPhones, Accessories in Kerala';
  let description = 'Premium new & quality-checked pre-owned iPhones, accessories, and instant WhatsApp support in Kerala.';
  let imageUrl = defaultImage;
  let productUrl = `${siteUrl}/product/${target || ''}`;

  if (product) {
    title = `${product.name} | M STORE`;
    
    const priceStr = product.price ? formatINR(product.price) : '';
    const colorStr = product.color && product.color !== 'N/A' && product.color !== 'None' ? product.color : '';
    const storageStr = product.storage && product.storage !== 'N/A' && product.storage !== 'None' ? product.storage : '';

    const details = [priceStr, colorStr, storageStr].filter(Boolean).join(' • ');
    description = details || (product.description ? product.description.slice(0, 150) : description);

    const rawImage = Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : (product.image || product.img);

    if (rawImage && typeof rawImage === 'string' && rawImage.trim()) {
      let trimmed = rawImage.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        imageUrl = trimmed;
      } else {
        imageUrl = `${siteUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
      }
    }

    const resolvedSlug = product.slug || product.id || target;
    productUrl = `${siteUrl}/product/${resolvedSlug}`;
  }

  // Load index.html template
  let html = '';
  const distIndexPath = path.join(process.cwd(), 'client', 'dist', 'index.html');
  if (fs.existsSync(distIndexPath)) {
    html = fs.readFileSync(distIndexPath, 'utf8');
  } else {
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>M STORE</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  }

  const metaSnippet = `
    <!-- Product-Specific Open Graph & Twitter Social Preview Meta Tags -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:site_name" content="M STORE" />
    <meta property="og:type" content="product" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(productUrl)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
  `;

  let finalHtml = html;
  finalHtml = finalHtml.replace(/<title>.*?<\/title>/gi, '');
  finalHtml = finalHtml.replace(/<meta\s+(property|name)=["'](og:|twitter:|description).*?>/gi, '');
  finalHtml = finalHtml.replace('</head>', `${metaSnippet}\n</head>`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(finalHtml);
};
