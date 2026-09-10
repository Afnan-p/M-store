import { BRAND_CONFIG } from '../services/config';
import type { Product } from '../types/product';

export function getWhatsAppProductLink(product: Product): string {
  const priceFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const productUrl = `${window.location.origin}/product/${product.id}`;

  const message = `Hi M STORE, I'm interested in:
Product: ${product.name}
Storage: ${product.storage || 'N/A'}
Color: ${product.color || 'Default'}
Price: ${priceFormatted}
Product: ${productUrl}`;

  return `https://wa.me/${BRAND_CONFIG.whatsappNumberClean}?text=${encodeURIComponent(message)}`;
}

export function getGeneralWhatsAppLink(customMessage?: string): string {
  const defaultMsg =
    customMessage ||
    `Hi M STORE, I would like to inquire about your available iPhones, pre-owned devices, offers, or store locations in Kerala.`;
  return `https://wa.me/${BRAND_CONFIG.whatsappNumberClean}?text=${encodeURIComponent(defaultMsg)}`;
}
