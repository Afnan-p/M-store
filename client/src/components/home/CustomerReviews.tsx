import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../../data/reviewsData';

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#E50914] uppercase tracking-widest">
            Verified Buyers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm text-zinc-600 max-w-lg mx-auto">
            Real feedback from customer purchases at our Kootanad, Kecheri, and Mattom stores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-all relative group shadow-sm"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-zinc-200 group-hover:text-[#E50914]/20 transition-colors pointer-events-none" />

              <div className="space-y-3 relative z-10">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-zinc-700 italic leading-relaxed">"{rev.comment}"</p>
              </div>

              <div className="pt-4 border-t border-zinc-200 space-y-1 z-10">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900">{rev.name}</span>
                  {rev.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                </div>
                <div className="text-[11px] text-[#E50914] font-semibold">{rev.deviceBought}</div>
                <div className="text-[10px] text-zinc-500">{rev.location} • {rev.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
