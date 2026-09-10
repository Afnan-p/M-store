import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatters';
import { getWhatsAppProductLink } from '../../utils/whatsapp';

export const WishlistModal: React.FC = () => {
  const { wishlistProducts, isWishlistOpen, setIsWishlistOpen, toggleWishlist } = useWishlist();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-zinc-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E50914]/10 flex items-center justify-center text-[#E50914]">
                <Heart className="w-4 h-4 fill-[#E50914]" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-zinc-950 tracking-tight">Your Wishlist</h2>
                <p className="text-xs text-zinc-500 font-medium">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200/60 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Saved Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
                  <Heart className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-900">Your wishlist is empty</h3>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                    Click the heart icon on any device or accessory to save it for later.
                  </p>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => {
                const whatsappUrl = getWhatsAppProductLink(product);
                return (
                  <div
                    key={product.id}
                    className="flex gap-3.5 p-3 rounded-2xl border border-zinc-200/80 bg-white hover:border-zinc-300 transition-all shadow-xs group"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-100">
                      <img
                        src={product.images[0] || '/images/placeholder-iphone.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/product/${product.id}`}
                            onClick={() => setIsWishlistOpen(false)}
                            className="font-extrabold text-sm text-zinc-950 hover:text-[#E50914] transition-colors truncate block"
                          >
                            {product.name}
                          </Link>
                          <span className="text-[11px] text-zinc-500 font-medium">
                            {product.storage !== 'N/A' ? `${product.storage} • ` : ''}
                            {product.color}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-black text-zinc-950">
                          {formatCurrency(product.price)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/product/${product.id}`}
                            onClick={() => setIsWishlistOpen(false)}
                            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold rounded-lg transition-colors"
                          >
                            Details
                          </Link>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-[#25D366] text-white text-[11px] font-bold rounded-lg hover:bg-[#20bd5a] transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.806-.51-5.46-1.479l-.391-.228-4.06.916 1.077-3.957-.251-.399c-1.063-1.692-1.625-3.646-1.625-5.648 0-5.834 4.747-10.581 10.582-10.581 2.827 0 5.485 1.101 7.484 3.101 1.999 1.999 3.099 4.658 3.099 7.484 0 5.835-4.747 10.584-10.58 10.584m0-22.37c-6.843 0-12.41 5.567-12.41 12.41 0 2.185.57 4.316 1.652 6.191l-1.754 6.438 6.586-1.728c1.815.99 3.864 1.51 5.926 1.51 6.842 0 12.41-5.567 12.41-12.41 0-3.315-1.291-6.432-3.635-8.777c-2.345-2.344-5.463-3.634-8.775-3.634"/>
                            </svg>
                            <span>Enquire</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer CTA */}
          {wishlistProducts.length > 0 && (
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/80 space-y-2">
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
