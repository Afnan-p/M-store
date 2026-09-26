import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_CONFIG } from '../../config/seoConfig';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
  nofollow?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Production SEO component that dynamically updates head metadata on client side routes
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  image,
  type = 'website',
  noindex = false,
  nofollow = false,
  jsonLd,
}) => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Title
    const finalTitle = title ? (title.includes('M Store') ? title : `${title} | M Store Kerala`) : SEO_CONFIG.defaultTitle;
    document.title = finalTitle;

    // Helper to update or inject meta tag
    const setMetaTag = (attribute: 'name' | 'property', attrValue: string, contentValue: string) => {
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    // Helper to update or inject link tag
    const setLinkTag = (rel: string, hrefValue: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', hrefValue);
    };

    // 2. Description
    const finalDescription = description || SEO_CONFIG.defaultDescription;
    setMetaTag('name', 'description', finalDescription);

    // 3. Canonical URL
    const rawUrl = canonical || `${SEO_CONFIG.siteUrl}${location.pathname}${location.search}`;
    // Strip trailing slashes or duplicate query params if clean
    const cleanCanonical = rawUrl.split('?')[0]; // clean base path for canonicals unless specifically passed
    const finalCanonical = canonical || cleanCanonical;
    setLinkTag('canonical', finalCanonical);

    // 4. Robots Directives
    let robotsValue = 'index, follow';
    if (noindex && nofollow) {
      robotsValue = 'noindex, nofollow';
    } else if (noindex) {
      robotsValue = 'noindex, follow';
    }
    setMetaTag('name', 'robots', robotsValue);

    // 5. Open Graph Metadata
    const finalImage = image
      ? image.startsWith('http')
        ? image
        : `${SEO_CONFIG.siteUrl}${image.startsWith('/') ? '' : '/'}${image}`
      : SEO_CONFIG.defaultImage;

    setMetaTag('property', 'og:site_name', SEO_CONFIG.siteName);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:image:secure_url', finalImage);
    setMetaTag('property', 'og:locale', SEO_CONFIG.defaultLocale);

    // 6. Twitter Card Metadata
    setMetaTag('name', 'twitter:card', type === 'product' ? 'summary_large_image' : 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:image', finalImage);

    // 7. Dynamic JSON-LD Structured Data
    const existingScript = document.getElementById('seo-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'seo-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, image, type, noindex, nofollow, jsonLd, location.pathname, location.search]);

  return null;
};
