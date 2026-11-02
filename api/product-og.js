const fs = require('fs');
const path = require('path');

// Ensure server/node_modules is included in resolution path in Vercel serverless environment
try {
  const serverModulesPath = path.join(process.cwd(), 'server', 'node_modules');
  if (fs.existsSync(serverModulesPath) && !module.paths.includes(serverModulesPath)) {
    module.paths.push(serverModulesPath);
  }
} catch (e) {
  // Silent fallback
}

let connectDB = null;
let Product = null;
let mongoose = null;

try {
  connectDB = require('../server/src/config/db');
  Product = require('../server/src/models/Product');
  mongoose = require('mongoose');
} catch (err) {
  console.warn('[Vercel OG Serverless] Direct DB imports note:', err.message);
}

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

function getOptimizedWhatsAppImage(rawImage, siteUrl) {
  if (!rawImage || typeof rawImage !== 'string' || !rawImage.trim()) {
    return `${siteUrl}/images/mstore-logo.jpg`;
  }
  let trimmed = rawImage.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = `${siteUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
  }

  // Cloudinary image transformation for 100% WhatsApp Link Preview compatibility:
  // Converts to JPEG, pads to standard 1200x630 OG banner with white background
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/upload/')) {
    if (!trimmed.includes('/c_pad') && !trimmed.includes('/c_fill')) {
      trimmed = trimmed.replace('/upload/', '/upload/c_pad,b_white,w_1200,h_630,f_jpg,q_auto:good/');
    }
    trimmed = trimmed.replace(/\.webp($|\?)/i, '.jpg$1');
  }

  return trimmed;
}

module.exports = async (req, res) => {
  const { slug, id } = req.query;
  const target = Array.isArray(slug) ? slug[0] : slug || (Array.isArray(id) ? id[0] : id) || '';

  // Dynamically resolve current host from request headers
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'm-store-lilac.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
  const siteUrl = (process.env.VITE_SITE_URL || `${proto}://${host}`).replace(/\/+$/, '');
  const defaultImage = `${siteUrl}/images/mstore-logo.jpg`;

  let product = null;

  if (target) {
    // 1. Direct MongoDB Query (Fastest, ~30ms, no network timeout or Render sleep issues)
    if (connectDB && Product) {
      try {
        await connectDB();
        const isObjectId = mongoose && mongoose.isValidObjectId ? mongoose.isValidObjectId(target) : false;
        product = await Product.findOne({
          $or: [
            { id: target },
            { slug: target },
            ...(isObjectId ? [{ _id: target }] : []),
          ],
        }).lean();

        if (!product) {
          const allDocs = await Product.find({}).lean();
          const targetNorm = target.toLowerCase().trim();
          product = allDocs.find(
            (p) =>
              p.id === target ||
              p.slug === target ||
              (p.name && p.name.toLowerCase().trim().replace(/\s+/g, '-') === targetNorm)
          );
        }
      } catch (dbErr) {
        console.warn('[Vercel OG Serverless] DB query error:', dbErr.message);
      }
    }

    // 2. Fallback: Query live Vercel internal API endpoint if DB direct query didn't find
    if (!product) {
      try {
        const localApiUrl = `${siteUrl}/api/products/${encodeURIComponent(target)}`;
        const apiRes = await fetch(localApiUrl, {
          headers: { Accept: 'application/json' },
          signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined,
        });

        if (apiRes.ok) {
          product = await apiRes.json();
        } else {
          const listRes = await fetch(`${siteUrl}/api/products`, {
            headers: { Accept: 'application/json' },
            signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined,
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
        console.warn('[Vercel OG Serverless] API fallback fetch error:', err.message);
      }
    }
  }

  let title = 'M STORE | Used & New iPhones, Accessories in Kerala';
  let description = 'Premium new & quality-checked pre-owned iPhones, accessories, and instant WhatsApp support in Kerala.';
  let imageUrl = defaultImage;
  let imageType = 'image/jpeg';
  let productUrl = `${siteUrl}/product/${target || ''}`;

  if (product) {
    title = `${product.name} | M STORE`;

    const priceStr = product.price ? formatINR(product.price) : '';
    const colorStr = product.color && product.color !== 'N/A' && product.color !== 'None' ? product.color : '';
    const storageStr = product.storage && product.storage !== 'N/A' && product.storage !== 'None' ? product.storage : '';

    let offerStr = product.offerBadge || '';
    if (!offerStr && product.originalPrice && product.originalPrice > product.price) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      if (discount > 0) offerStr = `${discount}% OFF`;
    }

    const details = [priceStr, colorStr, storageStr, offerStr].filter(Boolean).join(' • ');
    description = details
      ? `${details} — Available at M STORE Kerala with instant WhatsApp support.`
      : (product.description ? product.description.slice(0, 150) : description);

    const rawImage = Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : (product.image || product.img);

    imageUrl = getOptimizedWhatsAppImage(rawImage, siteUrl);
    if (imageUrl.endsWith('.png')) imageType = 'image/png';
    else if (imageUrl.endsWith('.webp')) imageType = 'image/webp';
    else imageType = 'image/jpeg';

    const resolvedSlug = product.slug || product.id || target;
    productUrl = `${siteUrl}/product/${resolvedSlug}`;
  }

  // Load index.html template from client dist
  let html = '';
  const candidatePaths = [
    path.join(process.cwd(), 'client', 'dist', 'index.html'),
    path.join(__dirname, '..', 'client', 'dist', 'index.html'),
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(__dirname, 'dist', 'index.html'),
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      html = fs.readFileSync(candidate, 'utf8');
      break;
    }
  }

  if (!html) {
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
    <meta property="og:image:type" content="${escapeHtml(imageType)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
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
