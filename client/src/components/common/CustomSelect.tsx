import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  size?: 'sm' | 'md';
  align?: 'left' | 'right';
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  icon,
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  size = 'md',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const isSmall = size === 'sm';

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${isOpen ? 'z-40' : 'z-10'} ${className}`}>
      {/* Select Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl transition-all duration-200 text-zinc-900 font-semibold cursor-pointer shadow-2xs hover:bg-zinc-50/80 focus:outline-none focus:ring-2 focus:ring-[#E50914]/20 ${
          isSmall ? 'px-2.5 py-1.5 text-[11px]' : 'px-3.5 py-2 text-xs'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="shrink-0 text-zinc-500">{icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
            isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'
          } ${isOpen ? 'rotate-180 text-zinc-700' : ''}`}
        />
      </button>

      {/* Custom Animated Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1.5 z-50 min-w-[160px] max-w-[280px] bg-white border border-zinc-200 shadow-xl rounded-2xl p-1.5 space-y-0.5 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 ${dropdownClassName}`}
        >
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50/80 text-[#E50914] font-bold'
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {opt.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-zinc-100 text-zinc-600 font-bold">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E50914] shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
