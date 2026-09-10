import React from 'react';
import { Hero } from '../../components/home/Hero';
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
      <ShopByCategory />
      <FeaturedProducts products={products} loading={loading} />
      <WhyChooseUs />
      <AccessoriesSection />
      <SpecialOffer />
      <StoreLocationsSection />
    </div>
  );
};

