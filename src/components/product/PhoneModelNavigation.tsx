import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSegments } from '../../hooks/useSegments';
import type { IPhoneSegment } from '../../types/product';

interface PhoneModelNavigationProps {
  categoryType?: 'NEW' | 'USED';
  selectedModelSlug: string;
  onSelectModel: (slug: string, name: string) => void;
}

export const PhoneModelNavigation: React.FC<PhoneModelNavigationProps> = ({
  selectedModelSlug,
  onSelectModel,
}) => {
  const { segments, loading } = useSegments();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Filter segments for current category
  const filteredModels = segments
    .filter((s) => s.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const checkScrollPosition = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [checkScrollPosition, filteredModels]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = direction === 'left' ? -280 : 280;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScrollPosition, 320);
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
    checkScrollPosition();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="w-full py-6 flex items-center justify-center gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-zinc-200" />
        <div className="w-16 h-16 rounded-2xl bg-zinc-200" />
        <div className="w-16 h-16 rounded-2xl bg-zinc-200" />
      </div>
    );
  }

  return (
    <div className="relative w-full py-2 flex items-center border-b border-zinc-200/80 mb-4">
      
      {/* Left Navigation Scroll Button */}
      <button
        type="button"
        onClick={() => handleScroll('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll models left"
        className={`absolute left-0 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-zinc-200/90 shadow-md flex items-center justify-center text-zinc-900 transition-all duration-200 ${
          canScrollLeft
            ? 'hover:bg-zinc-50 hover:scale-105 active:scale-95 cursor-pointer opacity-100'
            : 'opacity-25 cursor-not-allowed pointer-events-none'
        }`}
      >
        <ChevronLeft className="w-4 h-4 text-zinc-900" />
      </button>

      {/* Right Navigation Scroll Button */}
      <button
        type="button"
        onClick={() => handleScroll('right')}
        disabled={!canScrollRight}
        aria-label="Scroll models right"
        className={`absolute right-0 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-zinc-200/90 shadow-md flex items-center justify-center text-zinc-900 transition-all duration-200 ${
          canScrollRight
            ? 'hover:bg-zinc-50 hover:scale-105 active:scale-95 cursor-pointer opacity-100'
            : 'opacity-25 cursor-not-allowed pointer-events-none'
        }`}
      >
        <ChevronRight className="w-4 h-4 text-zinc-900" />
      </button>

      {/* Single-Row Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollPosition}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full flex items-center justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-8 sm:px-12 py-1 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        
        {/* 1. "Shop All" Item */}
        <button
          type="button"
          onClick={() => onSelectModel('all', 'Shop All')}
          className="group flex flex-col items-center shrink-0 focus:outline-none transition-all duration-200"
        >
          <div
            className={`w-[76px] h-[92px] sm:w-[100px] sm:h-[120px] rounded-2xl bg-white border p-0 flex items-center justify-center transition-all duration-200 overflow-hidden ${
              selectedModelSlug === 'all' || !selectedModelSlug
                ? 'border-[#E50914] ring-2 ring-[#E50914]/20 shadow-md bg-red-50/20'
                : 'border-zinc-200/80 shadow-xs group-hover:border-zinc-300 group-hover:scale-105'
            }`}
          >
            <svg viewBox="0 0 50 70" className="h-14 sm:h-18 w-auto object-contain">
              <rect x="4" y="14" width="22" height="48" rx="4" fill="#F2F2F7" stroke="#1C1C1E" strokeWidth="1.5" />
              <rect x="24" y="8" width="22" height="48" rx="4" fill="#1C1C1E" stroke="#F2F2F7" strokeWidth="1.5" />
            </svg>
          </div>
          <span
            className={`text-[11px] sm:text-[12.5px] tracking-tight text-center whitespace-nowrap mt-2 transition-colors ${
              selectedModelSlug === 'all' || !selectedModelSlug
                ? 'text-[#E50914] font-bold'
                : 'text-zinc-800 font-semibold group-hover:text-[#E50914]'
            }`}
          >
            Shop All
          </span>
          <div
            className={`h-0.5 rounded-full mt-1 transition-all duration-200 ${
              selectedModelSlug === 'all' || !selectedModelSlug
                ? 'w-full bg-[#E50914]'
                : 'w-0 bg-transparent group-hover:w-1/2 group-hover:bg-zinc-300'
            }`}
          />
        </button>

        {/* Dynamic Admin-Managed Models List */}
        {filteredModels.map((model: IPhoneSegment) => {
          const isSelected =
            selectedModelSlug === model.slug ||
            selectedModelSlug.toLowerCase() === model.name.toLowerCase();

          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelectModel(model.slug, model.name)}
              className="group flex flex-col items-center shrink-0 focus:outline-none transition-all duration-200"
            >
              <div
                className={`w-[76px] h-[92px] sm:w-[100px] sm:h-[120px] rounded-2xl bg-white border p-0 flex items-center justify-center transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? 'border-[#E50914] ring-2 ring-[#E50914]/20 shadow-md bg-red-50/20'
                    : 'border-zinc-200/80 shadow-xs group-hover:border-zinc-300 group-hover:scale-105'
                }`}
              >
                <img
                  src={model.thumbnail}
                  alt={model.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/featured-p1-natural.jpg';
                  }}
                />
              </div>
              <span
                className={`text-[11px] sm:text-[12.5px] tracking-tight text-center whitespace-nowrap mt-2 transition-colors ${
                  isSelected
                    ? 'text-[#E50914] font-bold'
                    : 'text-zinc-800 font-semibold group-hover:text-[#E50914]'
                }`}
              >
                {model.name}
              </span>
              <div
                className={`h-0.5 rounded-full mt-1 transition-all duration-200 ${
                  isSelected
                    ? 'w-full bg-[#E50914]'
                    : 'w-0 bg-transparent group-hover:w-1/2 group-hover:bg-zinc-300'
                }`}
              />
            </button>
          );
        })}

      </div>
    </div>
  );
};
