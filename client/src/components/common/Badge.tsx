import React from 'react';

interface BadgeProps {
  variant?: 'new' | 'used' | 'accessory' | 'sold' | 'battery' | 'discount' | 'custom';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'custom', children, className = '' }) => {
  let baseStyles = 'inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition-all shrink-0';
  let variantStyles = '';

  switch (variant) {
    case 'new':
      variantStyles = 'bg-rose-50 text-[#E50914] border border-rose-200';
      break;
    case 'used':
      variantStyles = 'bg-zinc-800 text-white border border-zinc-700';
      break;
    case 'accessory':
      variantStyles = 'bg-sky-50 text-sky-600 border border-sky-200';
      break;
    case 'sold':
      variantStyles = 'bg-zinc-100 text-zinc-500 border border-zinc-200 line-through';
      break;
    case 'battery':
      variantStyles = 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      break;
    case 'discount':
      variantStyles = 'bg-amber-50 text-amber-700 border border-amber-200';
      break;
    default:
      variantStyles = 'bg-zinc-100 text-zinc-800 border border-zinc-300';
  }

  return <span className={`${baseStyles} ${variantStyles} ${className}`}>{children}</span>;
};
