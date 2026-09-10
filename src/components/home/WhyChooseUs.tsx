import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Coins, Headphones, MapPin, ArrowRight } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const promiseItems = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-zinc-900" />,
      title: 'Verified Devices',
      subtitle: '50+ point check',
    },
    {
      icon: <Coins className="w-5 h-5 text-zinc-900" />,
      title: 'Best Value',
      subtitle: 'Fair & transparent pricing',
    },
    {
      icon: <Headphones className="w-5 h-5 text-zinc-900" />,
      title: 'Expert Support',
      subtitle: 'Real people, real help',
    },
    {
      icon: <MapPin className="w-5 h-5 text-zinc-900" />,
      title: 'Kerala Based',
      subtitle: 'Showrooms near you',
    },
  ];

  return (
    <section className="py-10 sm:py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Main Card Container with Soft Warm Tint Background */}
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#FFF8F7] border border-[#F6E3E1]/80 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xs">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            
            {/* Left Content Area (Grid with Title + Feature Badges) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Heading & CTA */}
              <div className="sm:col-span-7 space-y-5 text-left">
                <span className="text-[11px] font-semibold text-[#E50914] uppercase tracking-[0.2em] block">
                  THE M STORE STANDARD
                </span>
                
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-zinc-950 tracking-tight leading-[1.08]">
                  Trusted by <br className="hidden sm:inline" />
                  thousands in Kerala.
                </h2>
                
                <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed max-w-sm">
                  Genuine devices, transparent pricing and an elevated showroom experience.
                </p>

                <div className="pt-2">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-900 font-semibold text-xs border border-zinc-200/90 shadow-xs hover:bg-zinc-50 hover:shadow-md transition-all"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-800" />
                  </Link>
                </div>
              </div>

              {/* Right Column: 4 Circular Badge Items */}
              <div className="sm:col-span-5 space-y-5">
                {promiseItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 group">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-zinc-200/80 shadow-xs flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                      {item.icon}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-display text-sm font-semibold text-zinc-950 leading-tight">
                        {item.title}
                      </span>
                      <span className="text-xs text-zinc-500 font-normal mt-0.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Side: Showroom Photo Card */}
            <div className="lg:col-span-5 h-full flex items-center justify-center">
              <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200/60 shadow-md">
                <img
                  src="/images/promise-showroom.png"
                  alt="M Store Showroom Kerala"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
