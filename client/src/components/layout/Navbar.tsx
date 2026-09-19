import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  X,
  Home,
  Smartphone,
  RotateCcw,
  Headphones,
  Tag,
  Store,
  Info,
  ChevronRight
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types/product';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { getProductPath } from '../../utils/slug';
import { CustomSelect } from '../common/CustomSelect';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { products } = useProducts();
  const { stores, activeStoreId, setActiveStoreId } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Auto focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when pressing Esc, clicking/touching outside, or scrolling page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(target)
      ) {
        setIsSearchOpen(false);
      }
    };

    const handleScroll = () => {
      setIsSearchOpen(false);
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSearchOpen]);

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.storage.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectProduct = (product: Product) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(getProductPath(product));
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'iPhones', path: '/iphones' },
    { name: 'Used iPhones', path: '/used-iphones' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Offers', path: '/offers' },
    { name: 'Stores', path: '/stores' },
    { name: 'About', path: '/about' },
  ];

  const mobileNavTabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'iPhones', path: '/iphones', icon: Smartphone },
    { name: 'Used', path: '/used-iphones', icon: RotateCcw },
    { name: 'Accessories', path: '/accessories', icon: Headphones },
    { name: 'Offers', path: '/offers', icon: Tag },
    { name: 'Stores', path: '/stores', icon: Store },
    { name: 'About', path: '/about', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out w-full bg-white/95 backdrop-blur-xl border-b border-zinc-200/90 shadow-xs">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between relative">
          
          {/* Left Brand Logo Container */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black border border-zinc-800 shadow-xs flex items-center justify-center p-0.5 shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <img
                src="/images/mstore-logo.jpg"
                alt="M STORE Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-center -ml-1 sm:-ml-1">
              <img
                src="/images/M-store-word.png"
                alt="mStore"
                className="h-6 sm:h-7.5 w-auto object-contain object-left mix-blend-multiply"
              />
              <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.18em] uppercase font-semibold text-zinc-500 mt-0.5 pl-0.5">
                Used & New iPhones
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full border bg-zinc-100/90 border-zinc-200/80">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-white bg-[#E50914] font-semibold shadow-sm shadow-[#E50914]/30'
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons: Store Context Selector (Desktop) | Search | Wishlist */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Active Store Switcher Pill (Desktop Only) */}
            <div className="hidden lg:block">
              <CustomSelect
                options={[
                  { value: 'ALL', label: 'All Stores' },
                  ...stores
                    .filter((s) => s.status === 'active')
                    .map((s) => ({ value: s.id, label: s.name })),
                ]}
                value={activeStoreId}
                onChange={(val) => setActiveStoreId(val)}
                icon={<Store className="w-3.5 h-3.5 text-[#E50914]" />}
                size="sm"
                align="right"
                buttonClassName="bg-zinc-100/90 border-zinc-200/90 text-zinc-900 rounded-xl font-bold"
              />
            </div>

            {/* 1. Search Trigger Button */}
            <button
              ref={searchButtonRef}
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-200 ${
                isSearchOpen
                  ? 'text-[#E50914] bg-red-50 border-[#E50914]/40 shadow-xs'
                  : 'text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200'
              }`}
              aria-label="Search products"
              title="Search iPhones & Accessories"
            >
              {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* 2. Wishlist Icon */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl border text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200 transition-all duration-200"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E50914] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-50">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sleek Search Dropdown: Compact Popover under Search button on Desktop, Full-width under Header on Mobile */}
        {isSearchOpen && (
          <div
            ref={searchContainerRef}
            className="
              lg:absolute lg:right-12 lg:top-full lg:mt-3.5 lg:w-[380px] lg:bg-white lg:border lg:border-zinc-200/90 lg:shadow-2xl lg:rounded-2xl lg:p-3
              w-full bg-white/98 border-t border-b border-zinc-200/90 shadow-lg p-3 lg:border-t-0 lg:border-b-0
              animate-popover-smooth z-50
            "
          >
            {/* Search Input Row */}
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search iPhone models, storage (e.g., 256GB)..."
                className="w-full pl-10 pr-20 py-2.5 bg-zinc-100/90 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#E50914] focus:bg-white text-xs sm:text-sm transition-all"
              />
              
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-zinc-400 hover:text-zinc-900 rounded-md transition-colors"
                    title="Clear search query"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2.5 py-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 bg-zinc-200/70 hover:bg-zinc-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Instant Live Search Results Panel */}
            {searchQuery.trim() !== '' && (
              <div className="mt-2 bg-white border border-zinc-200/90 rounded-xl shadow-lg max-h-[360px] overflow-y-auto p-1.5 space-y-1">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="flex items-center justify-between p-2.5 hover:bg-zinc-100/90 rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                          <img
                            src={product.images[0] || '/images/placeholder-iphone.svg'}
                            alt={product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                            }}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-[#E50914] transition-colors">
                              {product.name}
                            </h4>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 font-medium">
                              {product.storage}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {product.condition} {product.batteryHealth ? `• ${product.batteryHealth}% Battery` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-zinc-900">{formatCurrency(product.price)}</span>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-zinc-500 text-xs sm:text-sm flex flex-col items-center gap-1.5">
                    <Smartphone className="w-6 h-6 text-zinc-400" />
                    <span>No iPhones or accessories matching "<span className="font-semibold text-zinc-800">{searchQuery}</span>"</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Floating Curved Pill Navigation Bar */}
      <div className="lg:hidden fixed bottom-4 left-3 right-3 sm:left-6 sm:right-6 z-50 max-w-[420px] mx-auto pointer-events-auto">
        <div className="bg-zinc-950/92 backdrop-blur-2xl border border-zinc-800/80 shadow-[0_12px_36px_rgba(0,0,0,0.4)] rounded-full px-2 py-1.5 flex items-center justify-around">
          {mobileNavTabs.map((tab) => {
            const active = isActive(tab.path);
            const IconComponent = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-300 ${
                  active
                    ? 'text-white font-bold bg-[#E50914] shadow-md shadow-[#E50914]/40 scale-105'
                    : 'text-zinc-400 hover:text-zinc-200 font-medium'
                }`}
              >
                <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                <span className="text-[9px] sm:text-[10px] tracking-tight mt-0.5 whitespace-nowrap">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
