/**
 * Utility functions for slug generation and clean product URL formatting
 */

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function getProductSlug(product: { id?: string; name?: string; slug?: string }): string {
  if (product.slug && product.slug.trim()) {
    return product.slug.trim();
  }
  if (product.name && product.name.trim()) {
    const generated = slugify(product.name);
    if (generated) return generated;
  }
  return product.id || 'product';
}

export function getProductPath(product: { id?: string; name?: string; slug?: string }): string {
  const slug = getProductSlug(product);
  return `/product/${slug}`;
}

export function getSiteBaseUrl(): string {
  const envUrl = import.meta.env.VITE_SITE_URL;
  if (envUrl && envUrl.trim() && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return 'https://mstorekerala.in';
}

export function getProductFullUrl(product: { id?: string; name?: string; slug?: string }): string {
  const siteUrl = getSiteBaseUrl();
  const slug = getProductSlug(product);
  return `${siteUrl}/product/${slug}`;
}
