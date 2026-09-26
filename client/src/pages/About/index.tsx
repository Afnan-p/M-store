import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Award,
  Sparkles,
  Smartphone,
  Cpu,
  Battery,
  Camera,
  Wifi,
  ArrowRight,
  Clock,
  ThumbsUp,
  Tag,
  Headphones,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';
import { useStore } from '../../context/StoreContext';
import { INITIAL_STORES } from '../../services/stores';
import { SEO } from '../../components/common/SEO';
import { generateBreadcrumbSchema } from '../../utils/seo';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();
  const { stores } = useStore();

  const activeStoresList = stores.filter((s) => s.status === 'active');
  const displayStores = activeStoresList.length > 0 ? activeStoresList : INITIAL_STORES;

  const diagnosticChecks = [
    {
      title: 'True Tone & Display Originality',
      desc: 'Verified authentic Apple Retina displays with full True Tone feature retention and touch responsiveness.',
      icon: Smartphone,
    },
    {
      title: 'Face ID & Biometric Sensors',
      desc: 'Precision infrared sensor testing to ensure zero-latency Face ID & Touch ID functionality.',
      icon: Cpu,
    },
    {
      title: 'Battery Health & Cycle Audit',
      desc: 'Verified battery capacity against original factory specs. Zero grade-B battery listings without disclosure.',
      icon: Battery,
    },
    {
      title: 'Multi-Camera Matrix & Optical Zoom',
      desc: 'Testing main, ultra-wide, telephoto lenses, LiDAR optical stabilization, and 4K video recording.',
      icon: Camera,
    },
    {
      title: '5G / Cellular & Wireless Connectivity',
      desc: 'Full RF signal diagnostics for 5G, LTE, Wi-Fi 6E, Bluetooth 5.3, and AirDrop speed.',
      icon: Wifi,
    },
    {
      title: 'Chassis & Liquid Damage Verification',
      desc: 'Microscopic inspection ensuring clean water-seal indicator badges and zero internal board repair.',
      icon: ShieldCheck,
    },
  ];

  const aboutBreadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
  ]);

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16 sm:space-y-24">
      <SEO
        title="About M Store Kerala | Premium New & Pre-Owned iPhone Retailer"
        description="Learn about M Store Kerala — your trusted Apple device partner with 4 physical showrooms across Kootanad, Kecheri, Mattom and Pattambi. 40-point quality check & genuine devices."
        jsonLd={aboutBreadcrumbs}
      />
      {/* 1. TOP HERO SECTION */}
      <div className="bg-[#FFF8F7] border border-[#F6E3E1]/80 rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E50914]/10 border border-[#E50914]/25 text-[11px] font-bold text-[#E50914] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
              <span>ABOUT M STORE</span>
            </span>

            <h1 className="font-ds-quilter text-3xl sm:text-5xl lg:text-[52px] font-bold text-zinc-950 tracking-tight leading-[1.08]">
              Redefining How Kerala Buys <br className="hidden sm:inline" />
              <span className="text-zinc-950">Apple Devices.</span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 font-normal leading-relaxed max-w-xl">
              At M Store, we believe buying a pre-owned or new iPhone should feel transparent, reliable, and premium. Backed by <strong className="text-zinc-900 font-bold">4 physical showroom stores</strong> across Palakkad & Thrissur, we ensure every device undergoes a 40-point technical audit before it reaches your hands.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link to="/iphones">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  <span>Explore Available Stock</span>
                </button>
              </Link>
              <a
                href={getGeneralWhatsAppLink(undefined, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#0E2419] hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-emerald-900/50 group cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </button>
              </a>
            </div>
          </div>

          {/* Right Showroom Image Card */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200/80 shadow-md">
              <img
                src="/images/promise-showroom.jpg"
                alt="M Store Showroom Kerala"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. METRICS HIGHLIGHTS GRID (4 Counter Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:border-[#E50914]/30 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-[#E50914] shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">4</div>
            <div className="text-xs font-bold text-zinc-800">Physical Showroom Stores</div>
            <div className="text-[11px] text-zinc-500 font-normal">Kootanad • Kecheri • Mattom • Pattambi</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:border-[#E50914]/30 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-[#E50914] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">40+</div>
            <div className="text-xs font-bold text-zinc-800">Diagnostic Inspection Checks</div>
            <div className="text-[11px] text-zinc-500 font-normal">Screen, Battery, Board & Camera</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:border-[#E50914]/30 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-[#E50914] shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">100%</div>
            <div className="text-xs font-bold text-zinc-800">Authentic Apple Warranty</div>
            <div className="text-[11px] text-zinc-500 font-normal">Zero fake parts or hidden repairs</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:border-[#E50914]/30 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-[#E50914] shrink-0">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">5,000+</div>
            <div className="text-xs font-bold text-zinc-800">Happy Apple Customers</div>
            <div className="text-[11px] text-zinc-500 font-normal">Trusted across Kerala since day one</div>
          </div>
        </div>
      </div>

      {/* 3. WHY M-STORE WAS FOUNDED & CUSTOMER PROMISES */}
      <div className="bg-[#FFF8F7] border border-[#F6E3E1]/80 rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[11px] font-bold text-[#E50914] uppercase tracking-[0.2em] block">
            THE M-STORE STORY
          </span>

          <h2 className="font-ds-quilter text-3xl sm:text-4xl lg:text-[44px] font-bold text-zinc-950 tracking-tight leading-[1.08]">
            Why M-Store was <span className="text-[#E50914]">Founded.</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
            <p>
              For years, buying a pre-owned iPhone in Kerala meant dealing with uncertainty — unverified displays, battery health manipulation, undisclosed motherboard repair history, or lack of after-sales support.
            </p>
            <p>
              M-Store was established to completely revolutionize this experience. We created a retail standard where every single phone is physically tested, cataloged, and backed by in-store warranties.
            </p>
            <p>
              Whether you are buying a sealed <strong className="text-zinc-900 font-bold">Brand New iPhone</strong> or a <strong className="text-zinc-900 font-bold">Certified Pre-Owned</strong> device, you get the exact same premium unboxing and showroom testing guarantee at all our 4 locations.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/stores"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-900 font-bold text-xs border border-zinc-200/90 shadow-xs hover:bg-zinc-50 hover:shadow-md transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
              <span>View All 4 Showrooms</span>
            </Link>
          </div>
        </div>

        {/* Right Dark Card: Customer Promises */}
        <div className="lg:col-span-5 bg-zinc-950 text-white rounded-3xl p-7 sm:p-8 space-y-6 shadow-xl border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-[#E50914]/20 rounded-full blur-2xl pointer-events-none"></div>

          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2 pb-2 border-b border-zinc-800">
            <ShieldCheck className="w-5 h-5 text-[#E50914]" />
            <span>Our Customer Promises</span>
          </h3>

          <div className="space-y-4 text-xs text-zinc-300 font-normal">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-[#E50914] mt-0.5">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-white font-bold text-xs">Physical Showroom Backup</strong>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                  Visit any of our M Store showrooms across Kerala anytime for hands-on assistance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-[#E50914] mt-0.5">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-white font-bold text-xs">Transparent Pricing & Trade-in</strong>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                  No hidden charges or surprise costs. Get instant buy-back for your old iPhone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-[#E50914] mt-0.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              </div>
              <div>
                <strong className="text-white font-bold text-xs">Instant WhatsApp Support</strong>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                  Direct manager response with exact photos, battery health screenshots, and video walk-around.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-[#E50914] mt-0.5">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-white font-bold text-xs">Real People, Real Support</strong>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                  Experienced team ready to guide you before and after your purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SHOWROOM STORE BRANCHES */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-ds-quilter text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            Our <span className="text-[#E50914]">{displayStores.length} Showroom</span> Store Branches
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 font-normal">
            Visit any of our physical stores in Kerala to test, verify, and purchase your favorite Apple devices in person.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStores.map((s) => {
            const cleanName = s.name.includes('-') ? s.name : `M Store — ${s.name}`;
            const mapUrl = s.maps || `https://maps.google.com/?q=${encodeURIComponent(s.name + ' ' + s.location)}`;
            const storePhone = s.phone || settings.phone;
            const storeImage = s.image || '/images/store-kootanad.png';

            return (
              <div
                key={s.id}
                className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Top Store Image Header */}
                <div className="relative h-40 overflow-hidden bg-zinc-100">
                  <img
                    src={storeImage}
                    alt={cleanName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/store-kootanad.png';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E50914] text-white shadow-xs flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    Showroom
                  </span>
                </div>

                {/* Store Details Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-zinc-950">{cleanName}</h3>

                    <div className="space-y-1.5 text-xs text-zinc-600 font-normal">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                        <span>{s.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-700 font-bold text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{storePhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center gap-2">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold text-center transition-colors border border-zinc-200"
                    >
                      Directions
                    </a>
                    <a
                      href={getGeneralWhatsAppLink(
                        `Hi M Store, I have an inquiry regarding stock at your ${cleanName} showroom.`,
                        settings.whatsappNumber
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors border border-emerald-200 flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Ask</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. 40-POINT DIAGNOSTIC PROTOCOL */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#FFF5F4] text-[#E50914] border border-[#F6E3E1] text-[11px] font-bold tracking-wider uppercase inline-block">
            RIGOROUS QUALITY STANDARDS
          </span>
          <h2 className="font-ds-quilter text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            Our 40-Point Diagnostic Protocol
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 font-normal">
            Every pre-owned iPhone is subjected to hardware, battery, display, and camera stress tests before listing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diagnosticChecks.map((check, idx) => {
            const IconComp = check.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200/90 rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#E50914]/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#E50914]">
                  <IconComp className="w-5 h-5 text-[#E50914]" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950">{check.title}</h3>
                <p className="text-xs text-zinc-600 font-normal leading-relaxed">{check.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. READY TO FIND YOUR NEXT IPHONE CTA BANNER */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl border border-zinc-800 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-red-500 text-[11px] font-bold uppercase tracking-widest block">
            FIND YOUR NEXT IPHONE
          </span>
          <h2 className="font-ds-quilter text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Find Your Next iPhone?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
            Browse our live inventory online or visit any of our 4 showrooms in Kootanad, Kecheri, Mattom, or Pattambi.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/iphones">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>View Available Devices</span>
            </button>
          </Link>
          <Link to="/stores">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-zinc-800/90 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm border border-zinc-700 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Find Nearby Store</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
