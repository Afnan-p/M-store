import { BRAND_CONFIG } from '../services/config';
import type { Product } from '../types/product';
import { OfferProductService } from '../services/offerProducts';
import { getProductFullUrl } from './slug';

/**
 * Checks if a product attribute value is valid and meaningful to display
 */
function isValidField(value?: string | null): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return (
    normalized !== '' &&
    normalized !== 'n/a' &&
    normalized !== 'none' &&
    normalized !== 'null' &&
    normalized !== 'undefined' &&
    normalized !== 'default'
  );
}

/**
 * Formats a currency value cleanly in INR
 */
function formatINR(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Generates a clean, professional, human-readable WhatsApp enquiry link
 */
export function getWhatsAppProductLink(product: Product, offerContext?: string): string {
  if (!product) {
    return getGeneralWhatsAppLink();
  }

  const productUrl = getProductFullUrl(product);

  // 1. Determine Product Type & Header Emoji
  const isAccessory = product.category === 'accessory';
  const productEmoji = isAccessory ? '🎧' : '📱';

  // 2. Resolve Offer Details cleanly
  let offerText = offerContext || product.offerBadge || '';
  if (!offerText && product.offer?.enabled && (product.offer?.status || 'active') === 'active') {
    try {
      const offerProds = OfferProductService.getOfferProductsSync();
      const map = new Map(offerProds.map((item) => [item.id, item]));
      const itemNames = (product.offer.items || [])
        .map((item) => {
          const op = map.get(item.offerProductId);
          return op ? op.name : '';
        })
        .filter(Boolean);

      if (itemNames.length > 0) {
        offerText = `Free ${itemNames.join(', ')}`;
      } else if (product.offer.title) {
        offerText = product.offer.title;
      }
    } catch {
      if (product.offer.title) {
        offerText = product.offer.title;
      }
    }
  }

  // Calculate percentage discount if originalPrice > price and no free item offer
  if (!offerText && product.originalPrice && product.originalPrice > product.price) {
    const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    if (discountPercent > 0) {
      offerText = `${discountPercent}% OFF`;
    }
  }

  // 3. Dynamically build message lines with clean UTF-8 emojis
  const lines: string[] = [
    "👋 Hi M Store, I'm interested in this product:",
    '',
    `${productEmoji} Product: ${product.name}`,
  ];

  if (!isAccessory && isValidField(product.storage)) {
    lines.push(`💾 Storage: ${product.storage}`);
  }

  if (isValidField(product.color)) {
    lines.push(`🎨 Color: ${product.color}`);
  }

  lines.push(`💰 Price: ${formatINR(product.price)}`);

  if (offerText && offerText.trim()) {
    lines.push(`🎁 Offer: ${offerText.trim()}`);
  }

  lines.push('');
  lines.push('🔗 Product Link:');
  lines.push(productUrl);
  lines.push('');
  lines.push('Please share more details.');

  const message = lines.join('\n');

  // Format phone number (digits only)
  const cleanPhone = (import.meta.env.VITE_WHATSAPP_NUMBER || BRAND_CONFIG.whatsappNumberClean || '918891003031').replace(/\D/g, '');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a clean general WhatsApp enquiry link for general customer questions
 */
export function getGeneralWhatsAppLink(customMessage?: string): string {
  const defaultMsg =
    customMessage ||
    `👋 Hi M Store, I would like to inquire about available iPhones, pre-owned devices, offers, or showroom locations in Kerala.`;

  const cleanPhone = (import.meta.env.VITE_WHATSAPP_NUMBER || BRAND_CONFIG.whatsappNumberClean || '918891003031').replace(/\D/g, '');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg)}`;
}
