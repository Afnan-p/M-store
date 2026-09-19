/**
 * SEO & Open Graph Metadata Utility for Product Pages
 * Dynamically updates document title and meta tags for rich social/WhatsApp link previews
 */
import type { Product } from '../types/product';
import { getProductFullUrl } from './slug';

function setMetaTag(propertyOrName: 'property' | 'name', attrValue: string, contentValue: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${propertyOrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(propertyOrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', contentValue);
}

export function updateProductSEO(product: Product | null) {
  if (typeof document === 'undefined') return;

  const defaultImg = 'https://m-store-two.vercel.app/favicon.png';

  if (!product) {
    document.title = 'M STORE | Used & New iPhones, Accessories in Kerala';
    setMetaTag('property', 'og:title', 'M STORE | Used & New iPhones, Accessories in Kerala');
    setMetaTag('property', 'og:description', 'Premium new & quality-checked pre-owned iPhones, accessories, and instant WhatsApp support.');
    setMetaTag('property', 'og:image', defaultImg);
    setMetaTag('property', 'og:image:secure_url', defaultImg);
    setMetaTag('name', 'twitter:image', defaultImg);
    return;
  }

  const title = `${product.name} | M STORE Kerala`;
  const description = product.description
    ? product.description.slice(0, 160)
    : `Buy ${product.name} at M STORE. Quality checked with best value warranty and fast Kerala delivery.`;

  // Get primary valid Cloudinary or HTTP image URL
  const primaryImg = product.images && product.images.length > 0 ? product.images[0] : defaultImg;
  const siteUrl = getProductFullUrl(product);

  let imageUrl = primaryImg;
  if (imageUrl && !imageUrl.startsWith('http')) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mstorekerala.in';
    imageUrl = `${origin.replace(/\/+$/, '')}${imageUrl}`;
  }

  document.title = title;
  setMetaTag('name', 'description', description);
  setMetaTag('property', 'og:title', product.name);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', 'product');
  setMetaTag('property', 'og:url', siteUrl);
  setMetaTag('property', 'og:image', imageUrl);
  setMetaTag('property', 'og:image:secure_url', imageUrl);
  setMetaTag('property', 'og:image:width', '1200');
  setMetaTag('property', 'og:image:height', '630');
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', product.name);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', imageUrl);
}
