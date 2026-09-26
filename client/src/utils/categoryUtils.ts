import type { Product } from '../types/product';

/**
 * Keywords for non-iPhone / Android brand devices.
 */
const NON_IPHONE_KEYWORDS = [
  'realme',
  'samsung',
  'galaxy',
  'redmi',
  'xiaomi',
  'oneplus',
  'vivo',
  'oppo',
  'pixel',
  'nokia',
  'motorola',
  'iqoo',
  'poco',
  'nothing phone',
  'honor',
  'huawei',
  'tecno',
  'infinix',
];

/**
 * Category slugs designated for Android devices.
 */
const ANDROID_CATEGORIES = [
  'android',
  'android-new',
  'android-used',
  'used-android',
  'normal-phones',
  'smartphones',
  'other-phones',
  'samsung',
  'realme',
  'other',
  'others',
];

/**
 * Checks if a product is an Android / Non-iPhone device.
 */
export const isNonIPhoneDevice = (p: Product): boolean => {
  if (!p) return false;
  const cat = (p.category || '').toLowerCase().trim();
  const name = (p.name || '').toLowerCase().trim();
  const model = (p.model || '').toLowerCase().trim();

  // 1. Explicit Android / Non-iPhone Categories
  if (ANDROID_CATEGORIES.includes(cat)) return true;

  // 2. Keyword detection in name, model, or category
  if (NON_IPHONE_KEYWORDS.some((kw) => name.includes(kw) || model.includes(kw) || cat.includes(kw))) {
    return true;
  }

  // 3. Category is not a standard iPhone or accessory category
  if (cat !== '' && !['iphone-new', 'iphone-used', 'iphone', 'iphones', 'accessory'].includes(cat)) {
    return true;
  }

  return false;
};

/**
 * Checks if a product is a Brand New iPhone.
 */
export const isIPhoneNewProduct = (p: Product): boolean => {
  if (!p || p.category === 'accessory' || isNonIPhoneDevice(p)) return false;
  const cat = (p.category || '').toLowerCase().trim();
  if (cat === 'iphone-new' || cat === 'new') return true;
  if (cat === 'iphone-used' || cat === 'used-iphones' || cat === 'pre-owned' || cat === 'used' || cat === 'used-iphone') return false;
  if ((cat === 'iphone' || cat === 'iphones') && p.condition === 'Brand New') return true;
  if (cat.startsWith('iphone') && cat !== 'iphone-used' && p.condition === 'Brand New') return true;
  return p.condition === 'Brand New';
};

/**
 * Checks if a product is a Pre-Owned / Used iPhone.
 */
export const isIPhoneUsedProduct = (p: Product): boolean => {
  if (!p || p.category === 'accessory' || isNonIPhoneDevice(p)) return false;
  const cat = (p.category || '').toLowerCase().trim();
  if (cat === 'iphone-used' || cat === 'used-iphones' || cat === 'pre-owned' || cat === 'used' || cat === 'used-iphone') return true;
  if (cat === 'iphone-new' || cat === 'new') return false;
  if ((cat === 'iphone' || cat === 'iphones') && p.condition !== 'Brand New') return true;
  if (cat.startsWith('iphone') && cat !== 'iphone-new' && p.condition !== 'Brand New') return true;
  return p.condition !== 'Brand New';
};

/**
 * Checks if a product is any iPhone (Brand New or Pre-Owned).
 */
export const isIPhoneProduct = (p: Product): boolean => {
  return isIPhoneNewProduct(p) || isIPhoneUsedProduct(p);
};

/**
 * Checks if a product is a Brand New Android device.
 */
export const isAndroidNewProduct = (p: Product): boolean => {
  if (!p || p.category === 'accessory') return false;
  const cat = (p.category || '').toLowerCase().trim();
  if (cat === 'android-new') return true;
  if (cat === 'android' && p.condition === 'Brand New') return true;
  return isNonIPhoneDevice(p) && p.condition === 'Brand New';
};

/**
 * Checks if a product is a Pre-Owned / Used Android device.
 */
export const isAndroidUsedProduct = (p: Product): boolean => {
  if (!p || p.category === 'accessory') return false;
  const cat = (p.category || '').toLowerCase().trim();
  if (cat === 'android-used' || cat === 'used-android') return true;
  if (cat === 'android' && p.condition !== 'Brand New') return true;
  return isNonIPhoneDevice(p) && p.condition !== 'Brand New';
};

/**
 * Checks if a product is any Android device.
 */
export const isAndroidProduct = (p: Product): boolean => {
  return isAndroidNewProduct(p) || isAndroidUsedProduct(p) || isNonIPhoneDevice(p);
};

/**
 * Extracts a clean, normalized Android Brand Name (e.g. Samsung, Realme, Oppo, Xiaomi, Vivo, Google Pixel, OnePlus)
 * from a product's model, name, or category.
 */
export const getAndroidBrandName = (p: Product): string => {
  if (!p) return 'Other';

  const model = (p.model || '').trim();
  const name = (p.name || '').trim();
  const cat = (p.category || '').trim();

  const brandKeywords: { pattern: RegExp; name: string }[] = [
    { pattern: /\b(samsung|galaxy)\b/i, name: 'Samsung' },
    { pattern: /\b(realme)\b/i, name: 'Realme' },
    { pattern: /\b(oppo)\b/i, name: 'Oppo' },
    { pattern: /\b(vivo)\b/i, name: 'Vivo' },
    { pattern: /\b(xiaomi|redmi|mi)\b/i, name: 'Xiaomi' },
    { pattern: /\b(oneplus|1\+)\b/i, name: 'OnePlus' },
    { pattern: /\b(pixel|google)\b/i, name: 'Google Pixel' },
    { pattern: /\b(nothing)\b/i, name: 'Nothing' },
    { pattern: /\b(poco)\b/i, name: 'POCO' },
    { pattern: /\b(iqoo)\b/i, name: 'iQOO' },
    { pattern: /\b(motorola|moto)\b/i, name: 'Motorola' },
    { pattern: /\b(nokia)\b/i, name: 'Nokia' },
    { pattern: /\b(honor)\b/i, name: 'Honor' },
    { pattern: /\b(huawei)\b/i, name: 'Huawei' },
    { pattern: /\b(tecno)\b/i, name: 'Tecno' },
    { pattern: /\b(infinix)\b/i, name: 'Infinix' },
    { pattern: /\b(asus|rog)\b/i, name: 'Asus' },
  ];

  // 1. Check model field against known brands
  for (const item of brandKeywords) {
    if (item.pattern.test(model)) {
      return item.name;
    }
  }

  // 2. Check product name field against known brands
  for (const item of brandKeywords) {
    if (item.pattern.test(name)) {
      return item.name;
    }
  }

  // 3. If model exists and isn't a default string like 'Accessory' or generic titan, use model
  if (model && !model.toLowerCase().includes('iphone') && !model.toLowerCase().includes('accessory') && !model.toLowerCase().includes('titanium')) {
    return model.charAt(0).toUpperCase() + model.slice(1);
  }

  // 4. Fallback: extract first word from product name
  if (name) {
    const firstWord = name.split(/\s+/)[0];
    if (firstWord && !firstWord.toLowerCase().includes('iphone')) {
      return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    }
  }

  return 'Android';
};

