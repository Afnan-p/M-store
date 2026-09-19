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
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';

export const AboutPage: React.FC = () => {
  const showrooms = [
    {
      id: 'store001',
      name: 'M Store — Kootanad',
      location: 'Opp. Govt. Hospital Road, Kootanad',
      district: 'Palakkad Dist, Kerala',
      phone: '+91 98460 12341',
      timing: '9:30 AM – 8:30 PM (Mon-Sat)',
      image: '/images/store-kootanad.svg',
      mapUrl: 'https://maps.google.com/?q=Kootanad+Palakkad',
    },
    {
      id: 'store002',
      name: 'M Store — Kecheri',
      location: 'Main Road Junction, Kecheri',
      district: 'Thrissur Dist, Kerala',
      phone: '+91 98460 12342',
      timing: '9:30 AM – 8:30 PM (Mon-Sat)',
      image: '/images/store-kecheri.svg',
      mapUrl: 'https://maps.google.com/?q=Kecheri+Thrissur',
    },
    {
      id: 'store003',
      name: 'M Store — Mattom',
      location: 'Center Point Building, Mattom',
      district: 'Thrissur Dist, Kerala',
      phone: '+91 98460 12343',
      timing: '9:30 AM – 8:30 PM (Mon-Sat)',
      image: '/images/store-mattom.svg',
      mapUrl: 'https://maps.google.com/?q=Mattom+Thrissur',
    },
    {
      id: 'store004',
      name: 'M Store — Pattambi',
      location: 'Guruvayur Road, Pattambi',
      district: 'Palakkad Dist, Kerala',
      phone: '+91 98460 12344',
      timing: '9:30 AM – 8:30 PM (Mon-Sat)',
      image: '/images/store-kootanad.svg',
      mapUrl: 'https://maps.google.com/?q=Pattambi+Palakkad',
    },
  ];

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
      desc: 'Verified battery capacity against original factory specs. Zero degraded battery listings without disclosure.',
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

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-20 sm:space-y-28">
      {/* Hero Banner Header Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-xs font-bold text-[#E50914] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
          <span>Kerala's #1 Certified Pre-Owned & New iPhone Destination</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.15]">
          Redefining How Kerala Buys Apple Devices.
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal max-w-3xl mx-auto">
          At M Store, we believe buying a pre-owned or new iPhone should feel transparent, reliable, and premium. 
          Backed by <strong className="text-zinc-900 font-semibold">4 physical showroom stores</strong> across Palakkad & Thrissur, we ensure every device undergoes a 40-point technical audit before it reaches your hands.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link to="/iphones">
            <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Explore Available Stock
            </Button>
          </Link>
          <a href={getGeneralWhatsAppLink()} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary" icon={<MessageCircle className="w-4 h-4 text-emerald-600" />}>
              Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>

      {/* Metrics & Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 text-center space-y-1.5 shadow-sm hover:border-[#E50914]/30 transition-all">
          <div className="w-10 h-10 bg-red-50 text-[#E50914] rounded-xl flex items-center justify-center mx-auto mb-2 font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">4</div>
          <div className="text-xs font-bold text-zinc-800">Physical Showroom Stores</div>
          <div className="text-[11px] text-zinc-500 font-normal">Kootanad • Kecheri • Mattom • Pattambi</div>
        </div>

        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 text-center space-y-1.5 shadow-sm hover:border-[#E50914]/30 transition-all">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">40+</div>
          <div className="text-xs font-bold text-zinc-800">Diagnostic Inspection Checks</div>
          <div className="text-[11px] text-zinc-500 font-normal">Screen, Battery, Board & Camera</div>
        </div>

        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 text-center space-y-1.5 shadow-sm hover:border-[#E50914]/30 transition-all">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">100%</div>
          <div className="text-xs font-bold text-zinc-800">Authentic Apple Warranty</div>
          <div className="text-[11px] text-zinc-500 font-normal">Zero fake parts or hidden repairs</div>
        </div>

        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 text-center space-y-1.5 shadow-sm hover:border-[#E50914]/30 transition-all">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">5,000+</div>
          <div className="text-xs font-bold text-zinc-800">Happy Apple Customers</div>
          <div className="text-[11px] text-zinc-500 font-normal">Trusted across Kerala since day one</div>
        </div>
      </div>

      {/* Our Brand Story Section */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-100 text-zinc-800 text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-[#E50914]" />
            <span>The M-Store Philosophy</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            Why M-Store was Founded
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
            <p>
              For years, buying a pre-owned iPhone in Kerala meant dealing with uncertainty: unverified displays, battery health manipulation, undisclosed motherboard repair history, or lack of after-sales support.
            </p>
            <p>
              M-Store was established to completely revolutionize this experience. We created a retail standard where every single phone is physically tested, cataloged, and backed by in-store warranties.
            </p>
            <p>
              Whether you are buying a sealed <strong className="text-zinc-900 font-semibold">Brand New iPhone</strong> or a <strong className="text-zinc-900 font-semibold">Certified Pre-Owned device</strong>, you get the exact same premium unboxing and showroom testing guarantee at all our 4 locations.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/stores">
              <Button variant="secondary" size="sm" icon={<Store className="w-4 h-4 text-[#E50914]" />}>
                View All 4 Showrooms
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 bg-zinc-900 text-white rounded-2xl p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-[#E50914]/20 rounded-full blur-2xl pointer-events-none"></div>

          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E50914]" />
            <span>Our Customer Promises</span>
          </h3>

          <div className="space-y-4 text-xs text-zinc-300 font-medium">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-semibold">Physical Showroom Backup:</strong>
                <p className="text-zinc-400 mt-0.5">Visit any of our 4 showrooms in Kootanad, Kecheri, Mattom, or Pattambi anytime for assistance.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-semibold">Transparent Pricing & Trade-in:</strong>
                <p className="text-zinc-400 mt-0.5">No hidden charges or surprise costs. Get instant buy-back values for your old phone.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-semibold">Instant WhatsApp Support:</strong>
                <p className="text-zinc-400 mt-0.5">Direct manager response with exact photos, battery health screenshots, and video walk-around.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Showroom Stores Section */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            Our 4 Showroom Store Branches
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            Visit any of our physical stores in Kerala to test, verify, and purchase your favorite Apple devices in person.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {showrooms.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-zinc-200/90 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-[#E50914] border border-red-200">
                    <Store className="w-3.5 h-3.5" />
                    Showroom
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Open
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-950">{s.name}</h3>

                <div className="space-y-2 text-xs text-zinc-600 font-normal">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                    <span>
                      {s.location}, <strong className="text-zinc-800">{s.district}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700 font-semibold">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{s.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
                <a
                  href={s.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold text-center transition-colors border border-zinc-200"
                >
                  Directions
                </a>
                <a
                  href={getGeneralWhatsAppLink(`Hi M Store, I have an inquiry regarding stock at your ${s.name} showroom.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors border border-emerald-200 flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 40-Point Inspection Standards Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-block">
            Rigorous Quality Standards
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            Our 40-Point Diagnostic Protocol
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            Every pre-owned iPhone is subjected to hardware, battery, display, and camera stress tests before listing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diagnosticChecks.map((check, idx) => {
            const IconComp = check.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200/90 rounded-2xl p-6 space-y-3 shadow-sm hover:border-[#E50914]/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
                  <IconComp className="w-5 h-5 text-[#E50914]" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950">{check.title}</h3>
                <p className="text-xs text-zinc-500 font-normal leading-relaxed">{check.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Call To Action Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Find Your Next iPhone?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
            Browse our live inventory online or visit any of our 4 showrooms in Kootanad, Kecheri, Mattom, or Pattambi.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/iphones">
            <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              View Available Devices
            </Button>
          </Link>
          <Link to="/stores">
            <Button size="lg" variant="secondary" icon={<Store className="w-4 h-4 text-white" />} className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
              Find Nearby Store
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
