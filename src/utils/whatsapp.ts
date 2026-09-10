import { BRAND_CONFIG } from '../services/config';
import type { Product } from '../types/product';

export function getWhatsAppProductLink(product: Product): string {
  const priceFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  let details = `${product.name}`;
  if (product.storage && product.storage !== 'N/A') {
    details += ` (${product.storage})`;
  }
  if (product.color) {
    details += ` - ${product.color}`;
  }

  if (product.category === 'iphone-used' && product.batteryHealth) {
    details += ` [Pre-Owned • ${product.batteryHealth}% Battery Health]`;
  } else if (product.category === 'iphone-new') {
    details += ` [Brand New]`;
  }

  const productUrl = `${window.location.origin}/product/${product.id}`;

  const message = `Hi M STORE, I would like to enquire about:
📌 *${details}*
💰 Price: *${priceFormatted}*
🔗 Link: ${productUrl}

Is this item available in stock? Please share availability and store location details.`;

  return `https://wa.me/${BRAND_CONFIG.whatsappNumberClean}?text=${encodeURIComponent(message)}`;
}

export function getGeneralWhatsAppLink(customMessage?: string): string {
  const defaultMsg =
    customMessage ||
    `Hi M STORE, I would like to inquire about your available iPhones, pre-owned devices, offers, or store locations in Kerala.`;
  return `https://wa.me/${BRAND_CONFIG.whatsappNumberClean}?text=${encodeURIComponent(defaultMsg)}`;
}
