import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  accentColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'border-zinc-200',
}) => {
  return (
    <div className={`bg-white border border-zinc-200 ${accentColor} p-5 rounded-2xl space-y-3 shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200">{icon}</div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-black text-zinc-900">{value}</div>
        {trend && <span className="text-xs text-emerald-600 font-semibold">{trend}</span>}
      </div>

      {subtitle && <p className="text-[11px] text-zinc-500">{subtitle}</p>}
    </div>
  );
};
