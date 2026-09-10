import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  className = '',
  ...props
}) => {
  let baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';
  
  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-xs rounded-md gap-1.5';
      break;
    case 'md':
      sizeStyles = 'px-4 py-2.5 text-sm rounded-lg gap-2';
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3.5 text-base rounded-xl gap-2.5';
      break;
  }

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-[#E50914] text-white hover:bg-[#C10710] shadow-lg shadow-[#E50914]/20';
      break;
    case 'secondary':
      variantStyles = 'bg-[#151518] text-white hover:bg-[#1C1C20] border border-[#27272A]';
      break;
    case 'outline':
      variantStyles = 'bg-transparent text-zinc-300 hover:text-white border border-[#27272A] hover:border-zinc-500';
      break;
    case 'whatsapp':
      variantStyles = 'bg-[#25D366] text-white font-semibold hover:bg-[#20bd5a] shadow-md shadow-[#25D366]/20 border border-[#25D366]/30';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50';
      break;
    case 'danger':
      variantStyles = 'bg-rose-600/20 text-rose-400 border border-rose-600/30 hover:bg-rose-600/30';
      break;
  }

  const widthStyle = fullWidth ? 'w-full' : '';

  const renderIcon = icon || (variant === 'whatsapp' ? (
    <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.806-.51-5.46-1.479l-.391-.228-4.06.916 1.077-3.957-.251-.399c-1.063-1.692-1.625-3.646-1.625-5.648 0-5.834 4.747-10.581 10.582-10.581 2.827 0 5.485 1.101 7.484 3.101 1.999 1.999 3.099 4.658 3.099 7.484 0 5.835-4.747 10.584-10.58 10.584m0-22.37c-6.843 0-12.41 5.567-12.41 12.41 0 2.185.57 4.316 1.652 6.191l-1.754 6.438 6.586-1.728c1.815.99 3.864 1.51 5.926 1.51 6.842 0 12.41-5.567 12.41-12.41 0-3.315-1.291-6.432-3.635-8.777c-2.345-2.344-5.463-3.634-8.775-3.634"/>
    </svg>
  ) : null);

  return (
    <button className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`} {...props}>
      {renderIcon && <span className="shrink-0">{renderIcon}</span>}
      <span>{children}</span>
    </button>
  );
};
