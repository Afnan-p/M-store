import React from 'react';

interface BadgeProps {
  variant?: 'new' | 'used' | 'accessory' | 'sold' | 'battery' | 'discount' | 'custom';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'custom', children, className = '' }) => {
  let baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-all';
  let variantStyles = '';

  switch (variant) {
    case 'new':
      variantStyles = 'bg-red-500/10 text-[#E50914] border border-[#E50914]/30';
      break;
    case 'used':
      variantStyles = 'bg-zinc-800/80 text-zinc-300 border border-zinc-700';
      break;
    case 'accessory':
      variantStyles = 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      break;
    case 'sold':
      variantStyles = 'bg-zinc-900 text-zinc-500 border border-zinc-800 line-through';
      break;
    case 'battery':
      variantStyles = 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50';
      break;
    case 'discount':
      variantStyles = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      break;
    default:
      variantStyles = 'bg-zinc-800 text-zinc-300 border border-zinc-700';
  }

  return <span className={`${baseStyles} ${variantStyles} ${className}`}>{children}</span>;
};
