import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCategories } from '../../hooks/useCategories';
import { INITIAL_CATEGORIES } from '../../services/categories';

export const ShopByCategory: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });
  const { activeCategories } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const displayCategories = activeCategories.length > 0 ? activeCategories : INITIAL_CATEGORIES;
  const isScrollable = displayCategories.length > 4;

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollWidth > clientWidth + 5 && scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, [displayCategories]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section ref={ref} className="py-10 sm:py-14 lg:py-[70px] bg-[#FAF9F6] border-b border-zinc-200/60 relative" id="categories">
      <div className={`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}>
        
        {/* Section Heading with Top-Right Animated Scroll Indicator */}
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
          <div className="space-y-0.5 text-left">
            <span className="text-[11px] font-extrabold text-[#E50914] tracking-[0.28em] uppercase block">
              SHOP BY
            </span>
            <h2 className="font-ds-quilter text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-none pt-0.5">
              Categories
            </h2>
            <div className="w-8 h-[2.5px] bg-[#E50914] mt-2 rounded-full" />
            <p className="text-xs sm:text-sm text-zinc-500 font-medium pt-1">
              Find exactly what you're looking for.
            </p>
          </div>

          {/* Animated Arrow Mark Scroll Indicator */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200/90 text-[#E50914] text-[11px] sm:text-xs font-extrabold tracking-wide shadow-2xs transition-all shrink-0 cursor-pointer active:scale-95 mb-1"
              title="Scroll right for more categories"
            >
              <span>Scroll</span>
              <ArrowRight className="w-3.5 h-3.5 animate-bounce-x" />
            </button>
          )}
        </div>

        {/* LAYOUT OPTION A: 4 or fewer categories (2x2 Grid on Mobile, Centered Flex Row on Desktop) */}
        {!isScrollable ? (
          <div ref={scrollContainerRef} className="flex overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory sm:flex-wrap justify-start sm:justify-center items-center gap-3 sm:gap-6 py-1">
            {displayCategories.map((cat, idx) => {
              const targetLink = cat.link || `/products?category=${cat.slug}`;
              return (
                <Link
                  key={cat.id || idx}
                  to={targetLink}
                  className="group flex flex-col items-center text-center cursor-pointer apple-reveal-card w-full sm:w-[160px] md:w-[175px] lg:w-[185px]"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  {/* Card Box Container */}
                  <div className="w-full aspect-square bg-white border border-zinc-200/90 rounded-[22px] sm:rounded-[26px] shadow-xs group-hover:shadow-md group-hover:border-zinc-300 transition-all duration-300 p-2 sm:p-2.5 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full rounded-[14px] sm:rounded-[18px] overflow-hidden bg-zinc-50/80 flex items-center justify-center relative">
                      <img
                        src={cat.image || '/images/placeholder-iphone.svg'}
                        alt={cat.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                        }}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.06] transition-transform duration-500 select-none rounded-[14px] sm:rounded-[18px]"
                      />
                    </div>
                  </div>

                  {/* Category Title Below Card Box */}
                  <h3 className="mt-2.5 sm:mt-3 font-display text-xs sm:text-sm lg:text-base font-bold text-zinc-950 tracking-tight group-hover:text-[#E50914] transition-colors truncate w-full capitalize">
                    {cat.name}
                  </h3>

                  {/* Small Red Accent Underline Bar */}
                  <div className="w-5 h-[2px] bg-[#E50914] mx-auto mt-1.5 rounded-full opacity-80 group-hover:w-7 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              );
            })}
          </div>
        ) : (
          /* LAYOUT OPTION B: More than 4 categories (Side Scrolling Slider with Hidden Scrollbar & Arrows) */
          <div className="relative">
            {/* Desktop Slider Arrows */}
            <div className="hidden sm:flex items-center justify-end gap-2 mb-3">
              <button
                onClick={() => scroll('left')}
                disabled={!showLeftArrow}
                className={`p-2 rounded-full border transition-all duration-200 flex items-center justify-center ${
                  showLeftArrow
                    ? 'bg-white border-zinc-300 text-zinc-900 shadow-xs hover:bg-zinc-100 hover:scale-105 cursor-pointer'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-300 cursor-not-allowed opacity-50'
                }`}
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!showRightArrow}
                className={`p-2 rounded-full border transition-all duration-200 flex items-center justify-center ${
                  showRightArrow
                    ? 'bg-white border-zinc-300 text-zinc-900 shadow-xs hover:bg-zinc-100 hover:scale-105 cursor-pointer'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-300 cursor-not-allowed opacity-50'
                }`}
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Track */}
            <div
              ref={scrollContainerRef}
              className="flex items-stretch gap-3 sm:gap-5 lg:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5 justify-start sm:justify-center"
            >
              {displayCategories.map((cat, idx) => {
                const targetLink = cat.link || `/products?category=${cat.slug}`;
                return (
                  <Link
                    key={cat.id || idx}
                    to={targetLink}
                    className="group flex flex-col items-center text-center cursor-pointer apple-reveal-card shrink-0 snap-start w-[calc(50%-6px)] sm:w-auto min-w-[140px] sm:min-w-[160px] md:min-w-[175px] lg:min-w-[185px] max-w-[190px]"
                    style={{ transitionDelay: `${idx * 60}ms` }}
                  >
                    {/* Card Box Container */}
                    <div className="w-full aspect-square bg-white border border-zinc-200/90 rounded-[22px] sm:rounded-[26px] shadow-xs group-hover:shadow-md group-hover:border-zinc-300 transition-all duration-300 p-2 sm:p-2.5 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full rounded-[14px] sm:rounded-[18px] overflow-hidden bg-zinc-50/80 flex items-center justify-center relative">
                        <img
                          src={cat.image || '/images/placeholder-iphone.svg'}
                          alt={cat.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                          }}
                          className="w-full h-full object-cover object-center group-hover:scale-[1.06] transition-transform duration-500 select-none rounded-[14px] sm:rounded-[18px]"
                        />
                      </div>
                    </div>

                    {/* Category Title Below Card Box */}
                    <h3 className="mt-2.5 sm:mt-3 font-display text-xs sm:text-sm lg:text-base font-bold text-zinc-950 tracking-tight group-hover:text-[#E50914] transition-colors truncate w-full capitalize">
                      {cat.name}
                    </h3>

                    {/* Small Red Accent Underline Bar */}
                    <div className="w-5 h-[2px] bg-[#E50914] mx-auto mt-1.5 rounded-full opacity-80 group-hover:w-7 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Tagline Divider Line */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4 max-w-xl mx-auto opacity-75">
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





