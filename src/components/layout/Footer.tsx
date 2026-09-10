import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageSquare, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const Footer: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.05 });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      alert('Thank you for subscribing to M Store updates!');
      setEmailInput('');
    }
  };

  return (
    <footer ref={ref} className={`w-full font-sans bg-white border-t border-zinc-200 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}>
      
      {/* Main Upper Footer Section - Clean Pure White Background */}
      <div className="w-full pt-12 pb-14 text-zinc-800 text-xs relative bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          
          {/* Desktop Layout (>= 1024px) */}
          <div className="hidden lg:flex flex-row items-start justify-between gap-8">
            
            {/* Column 1: Brand Info & Socials */}
            <div className="w-[30%] space-y-4 pr-4">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-black overflow-hidden flex items-center justify-center border border-zinc-900 shrink-0 shadow-xs">
                  <img
                    src="/images/mstore-logo.jpg"
                    alt="M Store Logo"
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-base text-zinc-900 tracking-wider leading-none">M STORE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] inline-block"></span>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                    USED & NEW IPHONES
                  </span>
                </div>
              </Link>

              <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-snug">
                More Than Just <span className="text-[#E50914]">iPhones.</span>
              </h3>

              <p className="text-xs text-zinc-600 leading-relaxed font-medium max-w-xs">
                Your trusted destination for <strong className="font-bold text-zinc-800">new & pre-owned</strong> iPhones, accessories and more. Always with you.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-zinc-100/80 border border-zinc-200/80 flex items-center justify-center text-zinc-700 hover:text-[#E50914] hover:border-zinc-300 transition-colors shadow-2xs"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-zinc-100/80 border border-zinc-200/80 flex items-center justify-center text-zinc-700 hover:text-[#25D366] hover:border-zinc-300 transition-colors shadow-2xs"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-zinc-100/80 border border-zinc-200/80 flex items-center justify-center text-zinc-700 hover:text-[#E50914] hover:border-zinc-300 transition-colors shadow-2xs"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>

              {/* Tag Line */}
              <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-zinc-400 tracking-[0.2em] uppercase">
                <div className="h-[1px] w-6 bg-zinc-300" />
                <span>STAY CONNECTED</span>
              </div>
            </div>

            {/* Column 2: QUICK LINKS */}
            <div className="w-[18%] space-y-3">
              <div>
                <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">QUICK LINKS</h4>
                <div className="w-5 h-[2px] bg-[#E50914] mt-1"></div>
              </div>

              <ul className="space-y-2 text-xs">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'iPhones', path: '/iphones' },
                  { label: 'Used iPhones', path: '/used-iphones' },
                  { label: 'Accessories', path: '/accessories' },
                  { label: 'Offers', path: '/offers' },
                  { label: 'Stores', path: '/stores' },
                  { label: 'About', path: '/about' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="group flex items-center justify-between text-zinc-600 hover:text-zinc-950 transition-colors py-0.5 max-w-[130px]"
                    >
                      <span className="font-semibold">{item.label}</span>
                      <span className="text-zinc-400 group-hover:translate-x-1 transition-transform text-xs">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: CONTACT */}
            <div className="w-[24%] space-y-3">
              <div>
                <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">CONTACT</h4>
                <div className="w-5 h-[2px] bg-[#E50914] mt-1"></div>
              </div>

              <ul className="space-y-3 text-xs text-zinc-700">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100/80 border border-zinc-200/80 flex items-center justify-center shrink-0 text-zinc-800 shadow-2xs">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-zinc-800">+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100/80 border border-zinc-200/80 flex items-center justify-center shrink-0 text-zinc-800 shadow-2xs">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-zinc-800">admin@mstore.in</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100/80 border border-zinc-200/80 flex items-center justify-center shrink-0 text-zinc-800 shadow-2xs">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-zinc-800">Kootanad, Palakkad</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100/80 border border-zinc-200/80 flex items-center justify-center shrink-0 text-zinc-800 shadow-2xs">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-zinc-800 text-[11px]">Mon - Sun: 10AM - 9PM</span>
                </li>
              </ul>
            </div>

            {/* Column 4: STAY UPDATED & Trust Features */}
            <div className="w-[28%] space-y-4">
              <div>
                <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">STAY UPDATED</h4>
                <div className="w-5 h-[2px] bg-[#E50914] mt-1"></div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                Get the latest offers and arrivals straight to your inbox.
              </p>

              {/* Email Input */}
              <form onSubmit={handleNewsletter} className="relative w-full">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-4 pr-12 py-3 bg-zinc-50 border border-zinc-200/90 rounded-full text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 3 Trust Feature Badges */}
              <div className="pt-2 flex items-center justify-between text-zinc-800 gap-1 border-t border-zinc-100 mt-4">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-zinc-900 shrink-0" />
                  <span className="font-bold text-[10px] text-zinc-900 leading-tight">
                    Fast<br />Delivery
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-zinc-200"></div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-zinc-900 shrink-0" />
                  <span className="font-bold text-[10px] text-zinc-900 leading-tight">
                    Trusted<br />Quality
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-zinc-200"></div>
                <div className="flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-zinc-900 shrink-0" />
                  <span className="font-bold text-[10px] text-zinc-900 leading-tight">
                    Dedicated<br />Support
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Mobile Layout (< 1024px) */}
          <div className="flex flex-col gap-5 lg:hidden">
            
            {/* Mobile Card 1: Brand Info */}
            <div className="bg-zinc-50/80 rounded-2xl p-5 border border-zinc-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 group">
                  <div className="w-9 h-9 rounded-xl bg-black overflow-hidden flex items-center justify-center border border-zinc-900 shrink-0 shadow-xs">
                    <img
                      src="/images/mstore-logo.jpg"
                      alt="M Store Logo"
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-black text-base text-zinc-900 tracking-wider leading-none">M STORE</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] inline-block"></span>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                      USED & NEW IPHONES
                    </span>
                  </div>
                </Link>

                <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-white text-zinc-700 rounded-full border border-zinc-200">
                  Kerala Store
                </span>
              </div>

              <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-snug">
                More Than Just <span className="text-[#E50914]">iPhones.</span>
              </h3>

              <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                Your trusted destination for <strong className="font-bold text-zinc-800">new & pre-owned</strong> iPhones, accessories and more. Always with you.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-[#E50914]"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-[#25D366]"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-[#E50914]"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile Quick Links & Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Quick Links Card */}
              <div className="bg-zinc-50/80 rounded-2xl p-4 sm:p-5 border border-zinc-200/80 space-y-3">
                <div>
                  <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">QUICK LINKS</h4>
                  <div className="w-5 h-[2px] bg-[#E50914] mt-1"></div>
                </div>

                <ul className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 text-xs">
                  {[
                    { label: 'Home', path: '/' },
                    { label: 'iPhones', path: '/iphones' },
                    { label: 'Used iPhones', path: '/used-iphones' },
                    { label: 'Accessories', path: '/accessories' },
                    { label: 'Offers', path: '/offers' },
                    { label: 'Stores', path: '/stores' },
                    { label: 'About', path: '/about' },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.path}
                        className="group flex items-center justify-between text-zinc-700 hover:text-zinc-950 transition-colors py-1 px-2 rounded-lg hover:bg-zinc-100"
                      >
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-zinc-400 group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Card */}
              <div className="bg-zinc-50/80 rounded-2xl p-4 sm:p-5 border border-zinc-200/80 space-y-3">
                <div>
                  <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">CONTACT US</h4>
                  <div className="w-5 h-[2px] bg-[#E50914] mt-1"></div>
                </div>

                <ul className="space-y-2.5 text-xs text-zinc-700">
                  <li className="flex items-center gap-2.5 p-1 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-800">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold">+91 98765 43210</span>
                  </li>
                  <li className="flex items-center gap-2.5 p-1 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-800">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold truncate">admin@mstore.in</span>
                  </li>
                  <li className="flex items-center gap-2.5 p-1 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-800">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold">Kootanad, Palakkad</span>
                  </li>
                  <li className="flex items-center gap-2.5 p-1 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-800">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-[11px]">10AM - 9PM (Daily)</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Mobile Newsletter Card */}
            <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200 space-y-4">
              <div>
                <h4 className="text-sm font-black tracking-tight text-zinc-900">STAY UPDATED</h4>
                <p className="text-xs text-zinc-500 mt-1 font-medium">Get the latest offers and arrivals straight to your inbox.</p>
              </div>

              <form onSubmit={handleNewsletter} className="relative w-full">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-4 pr-12 py-3 bg-white border border-zinc-200 rounded-full text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 3 Trust Feature Badges */}
              <div className="pt-2 flex items-center justify-around text-zinc-700 border-t border-zinc-200 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-zinc-800 shrink-0" />
                  <span className="font-semibold text-[10px] text-zinc-800 leading-tight">
                    Fast Delivery
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-zinc-200"></div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-zinc-800 shrink-0" />
                  <span className="font-semibold text-[10px] text-zinc-800 leading-tight">
                    Trusted Quality
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-zinc-200"></div>
                <div className="flex flex-col items-center gap-1">
                  <Headphones className="w-4 h-4 text-zinc-800 shrink-0" />
                  <span className="font-semibold text-[10px] text-zinc-800 leading-tight">
                    Dedicated Support
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar - Pure White Background with Clean Top Border */}
      <div className="bg-white text-zinc-500 py-5 px-4 sm:px-8 lg:px-12 border-t border-zinc-200/80">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500 text-center sm:text-left">
          
          {/* Left Copyright */}
          <div>
            <span>© {new Date().getFullYear()} M Store. All rights reserved.</span>
          </div>

          {/* Center Links */}
          <div className="flex items-center justify-center gap-3 text-[11px] font-medium text-zinc-500">
            <Link to="/privacy" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link>
            <span className="text-zinc-300">|</span>
            <Link to="/terms" className="hover:text-zinc-900 transition-colors">Terms & Conditions</Link>
            <span className="text-zinc-300">|</span>
            <Link to="/support" className="hover:text-zinc-900 transition-colors">Support</Link>
          </div>

          {/* Right Credit Badge */}
          <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100/90 border border-zinc-200/80 text-[11px] font-medium text-zinc-600 shadow-2xs">
            <span>Built with</span>
            <span className="text-[#E50914] text-xs animate-pulse">❤️</span>
            <span>by</span>
            <span className="font-bold text-zinc-950">Zynexta</span>
            <span>for iPhone lovers in Kerala.</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
