import type { Product } from '../types/product';
import { SEO_CONFIG } from '../config/seoConfig';
import { getProductFullUrl } from './slug';

/**
 * Format currency for schema text if needed
 */
export function formatINRPrice(price: number): string {
  return price.toString();
}

/**
 * Legacy product SEO updater helper
 */
export function updateProductSEO(product: Product | null) {
  if (typeof document === 'undefined') return;
  if (!product) {
    document.title = SEO_CONFIG.defaultTitle;
    return;
  }
  document.title = `${product.name} | M Store Kerala`;
}

/**
 * Generate Schema.org Product JSON-LD structured data
 * Standard schema specification for Google Merchant Experience
 */
export function generateProductSchema(product: Product, inStock: boolean, canonicalUrl?: string) {
  if (!product) return null;

  const siteUrl = canonicalUrl || getProductFullUrl(product);
  const primaryImg = product.images && product.images.length > 0 ? product.images[0] : (product.image || SEO_CONFIG.defaultImage);
  const imageUrl = primaryImg.startsWith('http') ? primaryImg : `${SEO_CONFIG.siteUrl}${primaryImg.startsWith('/') ? '' : '/'}${primaryImg}`;
  
  const finalPrice = product.offerPrice || product.price;
  const isUsed = product.condition === 'Used' || product.isUsed || product.category === 'Used iPhones';

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [imageUrl],
    description: product.description || `Buy ${product.name} at M Store Kerala with official warranty and quality guarantee.`,
    sku: String(product.id || product._id || 'MSTORE-PROD'),
    brand: {
      '@type': 'Brand',
      name: 'Apple',
    },
    category: product.category || 'iPhones',
    offers: {
      '@type': 'Offer',
      url: siteUrl,
      priceCurrency: 'INR',
      price: finalPrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: isUsed ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SEO_CONFIG.siteName,
      },
    },
  };

  // Add optional details if present
  if (product.color && product.color !== 'N/A' && product.color !== 'None') {
    schema.color = product.color;
  }
  
  return schema;
}

/**
 * Generate LocalBusiness structured data for physical showroom locations
 */
export function generateLocalBusinessSchemas(storeId?: string) {
  const storesToProcess = storeId 
    ? SEO_CONFIG.stores.filter((s) => s.id.toLowerCase() === storeId.toLowerCase())
    : SEO_CONFIG.stores;

  return storesToProcess.map((store) => ({
    '@context': 'https://schema.org',
    '@type': 'ElectronicsStore',
    '@id': `${SEO_CONFIG.siteUrl}/stores#${store.id}`,
    name: store.name,
    image: `${SEO_CONFIG.siteUrl}/images/promise-showroom.jpg`,
    telephone: store.telephone,
    url: `${SEO_CONFIG.siteUrl}/stores`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address,
      addressLocality: store.city,
      addressRegion: store.state,
      postalCode: store.postalCode,
      addressCountry: store.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: store.geo.latitude,
      longitude: store.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:30',
        closes: '20:30',
      },
    ],
    priceRange: '₹₹₹',
  }));
}

/**
 * Generate Organization schema for M Store
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.organization.name,
    legalName: SEO_CONFIG.organization.legalName,
    url: SEO_CONFIG.organization.url,
    logo: SEO_CONFIG.organization.logo,
    telephone: SEO_CONFIG.organization.telephone,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SEO_CONFIG.organization.contactPoint.telephone,
      contactType: SEO_CONFIG.organization.contactPoint.contactType,
      areaServed: SEO_CONFIG.organization.contactPoint.areaServed,
      availableLanguage: SEO_CONFIG.organization.contactPoint.availableLanguage,
    },
  };
}

/**
 * Generate WebSite schema for search snippet integration
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
  };
}

/**
 * Generate BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SEO_CONFIG.siteUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
    })),
  };
}
