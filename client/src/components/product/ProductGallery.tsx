import React, { useState } from 'react';
import { getOptimizedImageUrl } from '../../services/cloudinary';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState<string>(images[0] || '');

  const mainSrc = getOptimizedImageUrl(selectedImage || images[0], { width: 1000 });

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image Stage */}
      <div className="relative aspect-square sm:aspect-[4/3] bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center justify-center overflow-hidden group select-none shadow-xs">
        <img
          src={mainSrc}
          alt={productName}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
          }}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {/* Image Thumbnail Selector */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl border p-1 flex items-center justify-center shrink-0 transition-all overflow-hidden ${
                (selectedImage || images[0]) === img
                  ? 'border-[#E50914] shadow-xs ring-2 ring-[#E50914]/20'
                  : 'border-zinc-200/80 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={getOptimizedImageUrl(img, { width: 160 })}
                alt={`${productName} thumbnail ${idx + 1}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-iphone.svg';
                }}
                className="max-h-full max-w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
