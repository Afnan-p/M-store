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
    <div className={`bg-white border border-zinc-200 ${accentColor} p-3.5 sm:p-5 rounded-2xl space-y-2 sm:space-y-3 shadow-sm`}>
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider truncate">{title}</span>
        <div className="p-1.5 sm:p-2 rounded-xl bg-zinc-100 border border-zinc-200 shrink-0">{icon}</div>
      </div>

      <div className="flex items-baseline justify-between gap-1">
        <div className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">{value}</div>
        {trend && <span className="text-[10px] sm:text-xs text-emerald-600 font-semibold shrink-0">{trend}</span>}
      </div>

      {subtitle && <p className="text-[10px] sm:text-[11px] text-zinc-500 line-clamp-1">{subtitle}</p>}
    </div>
  );
};
