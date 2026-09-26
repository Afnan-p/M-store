/**
 * Centralized SEO Configuration for M Store
 */

export const SEO_CONFIG = {
  siteName: 'M Store',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://m-store-two.vercel.app',
  defaultTitle: 'M Store Kerala | New & Pre-Owned iPhones',
  defaultDescription:
    'Shop verified new and pre-owned iPhones, accessories and great-value Apple devices at M Store Kerala. Visit our showrooms in Kootanad, Kecheri, Mattom and Pattambi.',
  defaultImage: `${import.meta.env.VITE_SITE_URL || 'https://m-store-two.vercel.app'}/mstore-logo.png`,
  defaultLocale: 'en_IN',
  twitterHandle: '@mstorekerala',
  
  // Official Physical Store Locations Data for Structured Data (LocalBusiness)
  stores: [
    {
      id: 'kootanad',
      name: 'M Store — Kootanad',
      address: 'Opp. Govt. Hospital Road, Kootanad',
      city: 'Kootanad',
      district: 'Palakkad Dist',
      state: 'Kerala',
      postalCode: '679533',
      country: 'IN',
      telephone: '+91 98460 12341',
      rawPhone: '919846012341',
      openingHours: 'Mo-Su 09:30-20:30',
      geo: {
        latitude: 10.8164,
        longitude: 76.0827,
      },
    },
    {
      id: 'kecheri',
      name: 'M Store — Kecheri',
      address: 'Main Road Junction, Kecheri',
      city: 'Kecheri',
      district: 'Thrissur Dist',
      state: 'Kerala',
      postalCode: '680501',
      country: 'IN',
      telephone: '+91 98460 12342',
      rawPhone: '919846012342',
      openingHours: 'Mo-Su 09:30-20:30',
      geo: {
        latitude: 10.6186,
        longitude: 76.1264,
      },
    },
    {
      id: 'mattom',
      name: 'M Store — Mattom',
      address: 'Center Point Building, Mattom',
      city: 'Mattom',
      district: 'Thrissur Dist',
      state: 'Kerala',
      postalCode: '680602',
      country: 'IN',
      telephone: '+91 98460 12343',
      rawPhone: '919846012343',
      openingHours: 'Mo-Su 09:30-20:30',
      geo: {
        latitude: 10.5849,
        longitude: 76.0886,
      },
    },
    {
      id: 'pattambi',
      name: 'M Store — Pattambi',
      address: 'Guruvayur Road, Pattambi',
      city: 'Pattambi',
      district: 'Palakkad Dist',
      state: 'Kerala',
      postalCode: '679303',
      country: 'IN',
      telephone: '+91 98460 12344',
      rawPhone: '919846012344',
      openingHours: 'Mo-Su 09:30-20:30',
      geo: {
        latitude: 10.8062,
        longitude: 76.1773,
      },
    },
  ],

  // Organization Information Schema
  organization: {
    name: 'M Store Kerala',
    legalName: 'M Store Retail India Pvt Ltd',
    url: import.meta.env.VITE_SITE_URL || 'https://m-store-two.vercel.app',
    logo: `${import.meta.env.VITE_SITE_URL || 'https://m-store-two.vercel.app'}/mstore-logo.png`,
    telephone: '+91 98460 12341',
    contactPoint: {
      type: 'ContactPoint',
      telephone: '+91 98460 12341',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'ml'],
    },
  },
};
