import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-xs font-bold text-[#E50914]">
          <span>Kerala's Trusted Mobile Store</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight">
          Built for people who want a better iPhone buying experience.
        </h1>

        <p className="text-base text-zinc-600 leading-relaxed">
          At M Store, we believe buying a pre-owned or new iPhone should feel transparent, reliable, and premium.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 bg-white border border-zinc-200 p-8 rounded-3xl space-y-6 shadow-xl">
          <h2 className="text-2xl font-extrabold text-zinc-900">Our Verification Guarantee</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Every device that enters our Kootanad, Kecheri, or Mattom showrooms undergoes a 40-point diagnostic protocol before being listed for sale.
          </p>

          <div className="space-y-3 text-xs text-zinc-700 font-semibold">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full True Tone, Face ID, and camera matrix testing</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Battery capacity verified against original Apple specs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero hidden board repairs — complete transparency</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Physical showrooms for immediate in-person testing</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 aspect-video bg-zinc-100 border border-zinc-200 rounded-3xl overflow-hidden relative shadow-lg">
          <img
            src="/images/store-kootanad.svg"
            alt="M Store Showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-zinc-900 text-xs font-bold bg-white/90 p-4 rounded-2xl border border-zinc-200 backdrop-blur-md shadow-md">
            Physical Showrooms in Kootanad • Kecheri • Mattom
          </div>
        </div>
      </div>
    </div>
  );
};
