import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  Menu, 
  X,
  Home,
  Smartphone,
  RotateCcw,
  Headphones,
  Tag,
  Store
} from 'lucide-react';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'iPhones', path: '/iphones' },
    { name: 'Used iPhones', path: '/used-iphones' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Offers', path: '/offers' },
    { name: 'Stores', path: '/stores' },
  ];

  const mobileNavTabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'iPhones', path: '/iphones', icon: Smartphone },
    { name: 'Used', path: '/used-iphones', icon: RotateCcw },
    { name: 'Accessories', path: '/accessories', icon: Headphones },
    { name: 'Offers', path: '/offers', icon: Tag },
    { name: 'Stores', path: '/stores', icon: Store },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out w-full bg-white border-b border-zinc-200/90 shadow-xs py-3.5">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Left Brand Logo Container */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black border border-zinc-800 shadow-xs flex items-center justify-center p-0.5 shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <img
                src="/images/mstore-logo.jpg"
                alt="M STORE Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base sm:text-lg tracking-[0.06em] leading-none flex items-center gap-1.5 text-zinc-950">
                M STORE
                <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse"></span>
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.18em] uppercase font-semibold mt-1 text-zinc-500">
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

          {/* Right Action Buttons: Search | Wishlist | Authentic WhatsApp Us */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* 1. Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 rounded-xl border text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200 transition-all duration-200"
              aria-label="Search products"
              title="Search iPhones & Accessories"
            >
              <Search className="w-4 h-4" />
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

            {/* 3. Official WhatsApp Us Button (Compact Icon on Mobile, Icon + Text on Desktop) */}
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 p-2 sm:px-4 sm:py-2 rounded-xl bg-white border border-[#25D366]/50 text-[#25D366] font-bold text-xs hover:bg-[#25D366]/10 hover:border-[#25D366] transition-all duration-200 shadow-xs shrink-0"
              title="Chat with M Store on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.806-.51-5.46-1.479l-.391-.228-4.06.916 1.077-3.957-.251-.399c-1.063-1.692-1.625-3.646-1.625-5.648 0-5.834 4.747-10.581 10.582-10.581 2.827 0 5.485 1.101 7.484 3.101 1.999 1.999 3.099 4.658 3.099 7.484 0 5.835-4.747 10.584-10.58 10.584m0-22.37c-6.843 0-12.41 5.567-12.41 12.41 0 2.185.57 4.316 1.652 6.191l-1.754 6.438 6.586-1.728c1.815.99 3.864 1.51 5.926 1.51 6.842 0 12.41-5.567 12.41-12.41 0-3.315-1.291-6.432-3.635-8.777c-2.345-2.344-5.463-3.634-8.775-3.634"/>
              </svg>
              <span className="hidden sm:inline font-extrabold text-xs">WhatsApp</span>
            </a>

            {/* Mobile Menu Toggle (Desktop Drawer) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 border rounded-xl text-zinc-900 bg-zinc-100 border-zinc-200 transition-all"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation (Top Toggle) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-zinc-200 px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-3">
            <div className="grid grid-cols-2 gap-2 pb-4 border-b border-zinc-200">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    isActive(link.path)
                      ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/20'
                      : 'bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-zinc-200'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-[#25D366] text-[#25D366] font-bold text-xs shadow-xs"
            >
              <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.806-.51-5.46-1.479l-.391-.228-4.06.916 1.077-3.957-.251-.399c-1.063-1.692-1.625-3.646-1.625-5.648 0-5.834 4.747-10.581 10.582-10.581 2.827 0 5.485 1.101 7.484 3.101 1.999 1.999 3.099 4.658 3.099 7.484 0 5.835-4.747 10.584-10.58 10.584m0-22.37c-6.843 0-12.41 5.567-12.41 12.41 0 2.185.57 4.316 1.652 6.191l-1.754 6.438 6.586-1.728c1.815.99 3.864 1.51 5.926 1.51 6.842 0 12.41-5.567 12.41-12.41 0-3.315-1.291-6.432-3.635-8.777c-2.345-2.344-5.463-3.634-8.775-3.634"/>
              </svg>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        )}
      </header>

      {/* Mobile Floating Curved Pill Navigation Bar (iOS / Dynamic Island Curved Pill Style) */}
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


