import React from 'react';
import { StoreLocationsSection } from '../../components/home/StoreLocationsSection';
import { SEO } from '../../components/common/SEO';
import { generateLocalBusinessSchemas, generateBreadcrumbSchema } from '../../utils/seo';

export const StoresPage: React.FC = () => {
  const storesJsonLd = [
    ...generateLocalBusinessSchemas(),
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Stores', url: '/stores' },
    ]),
  ];

  return (
    <div className="pt-24">
      <SEO
        title="M Store Showrooms Kerala | iPhone Stores in Kootanad, Kecheri, Mattom & Pattambi"
        description="Visit M Store Apple showrooms in Kootanad (Palakkad), Kecheri (Thrissur), Mattom (Thrissur), and Pattambi (Palakkad). Test, verify and purchase iPhones locally."
        jsonLd={storesJsonLd}
      />
      <StoreLocationsSection />
    </div>
  );
};
