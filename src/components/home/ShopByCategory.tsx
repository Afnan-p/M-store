import React from 'react';
import { Link } from 'react-router-dom';

export const ShopByCategory: React.FC = () => {
  const categories = [
    {
      title: 'iPhones',
      image: '/images/cat-iphones.png',
      link: '/iphones',
    },
    {
      title: 'Used iPhones',
      image: '/images/cat-preowned.png?v=2',
      link: '/used-iphones',
    },
    {
      title: 'Accessories',
      image: '/images/cat-accessories.png',
      link: '/accessories',
    },
    {
      title: 'Offers',
      image: '/images/cat-offers.png',
      link: '/offers',
    },
  ];

  return (
    <section className="py-10 sm:py-14 lg:py-20 bg-[#FAF9F6] border-b border-zinc-200/60" id="categories">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading - Compact Height */}
        <div className="text-center mb-5 sm:mb-7 space-y-0.5">
          <span className="text-[11px] font-extrabold text-[#E50914] tracking-[0.28em] uppercase block">
            SHOP BY
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-none pt-0.5">
            Categories
          </h2>
          <div className="w-8 h-[2.5px] bg-[#E50914] mx-auto mt-2 rounded-full" />
          <p className="text-xs sm:text-sm text-zinc-500 font-medium pt-1">
            Find exactly what you're looking for.
          </p>
        </div>

        {/* 2-Column Mobile Grid / 4-Column Desktop Grid - Compact Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 max-w-[840px] mx-auto">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              {/* Card Box Container - Compact height */}
              <div className="w-full max-w-[160px] sm:max-w-[190px] aspect-square bg-white border border-zinc-200/80 rounded-[18px] sm:rounded-[22px] shadow-xs group-hover:shadow-md group-hover:border-zinc-300 transition-all duration-300 flex items-center justify-center overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-300 select-none"
                />
              </div>

              {/* Category Title Below Card Box */}
              <h3 className="mt-2.5 sm:mt-3 font-display text-xs sm:text-sm lg:text-base font-bold text-zinc-950 tracking-tight group-hover:text-[#E50914] transition-colors">
                {cat.title}
              </h3>

              {/* Small Red Accent Underline Bar under Each Category Title */}
              <div className="w-5 h-[2px] bg-[#E50914] mx-auto mt-1.5 rounded-full opacity-80 group-hover:w-7 group-hover:opacity-100 transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Bottom Tagline Divider Line */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-4 max-w-xl mx-auto opacity-75">
          <div className="h-[1px] bg-zinc-300/80 flex-1" />
          <span className="text-[10px] sm:text-[11px] font-bold text-zinc-400 tracking-[0.22em] uppercase whitespace-nowrap">
            PREMIUM PRODUCTS. BETTER EXPERIENCES.
          </span>
          <div className="h-[1px] bg-zinc-300/80 flex-1" />
        </div>

      </div>
    </section>
  );
};



