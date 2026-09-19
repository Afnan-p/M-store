import React from 'react';
import { ShieldCheck, BatteryCharging, PackageCheck, Store, Headphones } from 'lucide-react';

export const TrustStats: React.FC = () => {
  const trustPoints = [
    { title: 'Quality Checked', desc: 'Trusted devices', icon: <ShieldCheck className="w-5 h-5 text-zinc-900" /> },
    { title: 'Battery Verified', desc: 'Clear health report', icon: <BatteryCharging className="w-5 h-5 text-zinc-900" /> },
    { title: 'Genuine Products', desc: 'No compromises', icon: <PackageCheck className="w-5 h-5 text-zinc-900" /> },
    { title: 'Multiple Stores', desc: 'Across Kerala', icon: <Store className="w-5 h-5 text-zinc-900" /> },
    { title: 'Dedicated Support', desc: "We're here to help", icon: <Headphones className="w-5 h-5 text-zinc-900" /> },
  ];

  return (
    <section className="py-8 bg-[#F6F6F6] border-y border-zinc-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {trustPoints.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs">
              <div className="p-2 rounded-xl bg-zinc-100/80 shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-extrabold text-zinc-900 leading-tight">{item.title}</div>
                <div className="text-[10px] text-zinc-500 font-medium leading-tight mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
