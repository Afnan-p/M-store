import React from 'react';
import { Hero } from '../../components/home/Hero';
import { OurStoresSection } from '../../components/home/OurStoresSection';
import { ShopByCategory } from '../../components/home/ShopByCategory';
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import { AccessoriesSection } from '../../components/home/AccessoriesSection';
import { WhyChooseUs } from '../../components/home/WhyChooseUs';
import { SpecialOffer } from '../../components/home/SpecialOffer';
import { StoreLocationsSection } from '../../components/home/StoreLocationsSection';
import { useProducts } from '../../hooks/useProducts';

export const HomePage: React.FC = () => {
  const { products, loading } = useProducts();

  return (
    <div className="space-y-0">
      <Hero />
      <OurStoresSection />
      <ShopByCategory />
      <div id="featured-products">
        <FeaturedProducts products={products} loading={loading} />
      </div>
      <WhyChooseUs />
      <AccessoriesSection />
      <SpecialOffer />
      <StoreLocationsSection />
    </div>
  );
};

