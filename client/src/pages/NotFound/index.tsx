import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import { Button } from '../../components/common/Button';
import { Smartphone, Home, Compass, ShoppingBag, Store } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] pt-32 pb-20 flex items-center justify-center bg-[#FAF9F6] text-zinc-900 px-4">
      <SEO
        title="404 Page Not Found | M Store Kerala"
        description="The requested page could not be found on M Store."
        noindex={true}
      />
      
      <div className="max-w-md w-full text-center space-y-6 bg-white border border-zinc-200/90 p-8 sm:p-10 rounded-3xl shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-[#E50914]">
          <Smartphone className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#E50914] tracking-widest uppercase block">Error 404</span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            The page or device link you are looking for might have been moved, renamed, or is no longer available.
          </p>
        </div>

        {/* Suggested Quick Links */}
        <div className="pt-2 border-t border-zinc-100 space-y-2 text-left">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Explore M Store:</span>
          
          <Link
            to="/iphones"
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-red-500" />
              New iPhones Catalog
            </span>
            <span className="text-zinc-400">&rarr;</span>
          </Link>

          <Link
            to="/used-iphones"
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              Quality Checked Pre-Owned iPhones
            </span>
            <span className="text-zinc-400">&rarr;</span>
          </Link>

          <Link
            to="/stores"
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-600" />
              Our 4 Showroom Locations
            </span>
            <span className="text-zinc-400">&rarr;</span>
          </Link>
        </div>

        <div className="pt-3">
          <Link to="/">
            <Button variant="primary" className="w-full justify-center gap-2">
              <Home className="w-4 h-4" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
