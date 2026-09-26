import React from 'react';
import { Hero } from '../../components/home/Hero';
import { ShopByCategory } from '../../components/home/ShopByCategory';
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import { AccessoriesSection } from '../../components/home/AccessoriesSection';
import { WhyChooseUs } from '../../components/home/WhyChooseUs';
import { SpecialOffer } from '../../components/home/SpecialOffer';
import { OurStoresSection } from '../../components/home/OurStoresSection';
import { useProducts } from '../../hooks/useProducts';
import { SEO } from '../../components/common/SEO';
import { generateOrganizationSchema, generateWebSiteSchema, generateLocalBusinessSchemas } from '../../utils/seo';

export const HomePage: React.FC = () => {
  const { products, loading } = useProducts();

  const homeJsonLd = [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    ...generateLocalBusinessSchemas(),
  ];

  return (
    <div className="space-y-0">
      <SEO
        title="M Store Kerala | New & Pre-Owned iPhones"
        description="Shop verified new and pre-owned iPhones, accessories and great-value Apple devices at M Store Kerala. Visit our showrooms in Kootanad, Kecheri, Mattom and Pattambi."
        jsonLd={homeJsonLd}
      />
      <Hero />
      <ShopByCategory />
      <div id="featured-products">
        <FeaturedProducts products={products} loading={loading} />
      </div>
      <WhyChooseUs />
      <AccessoriesSection />
      <SpecialOffer />
      <OurStoresSection />
    </div>
  );
};

