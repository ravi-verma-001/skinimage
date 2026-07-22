'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export interface ProductType {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  description: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  sku?: string;
}

interface ProductCardProps {
  product: ProductType;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user, addToWishlist, removeFromWishlist } = useAuth();
  const { addToCart } = useCart();
  
  const id = product._id || product.id || '';
  const isWishlisted = user?.wishlist?.includes(id) || false;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to your wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await removeFromWishlist(id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Error updating wishlist');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart({
      productId: id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity: 1,
      image: product.images[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
    });
    toast.success('Added to cart!');
  };

  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/50 bg-white transition-all duration-500 hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:border-stone-300/60">
      {/* Product Image & Badges */}
      <Link href={`/product/${id}`} className="relative block aspect-[4/5] w-full overflow-hidden bg-stone-50">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-750 ease-out group-hover:scale-106"
          loading="lazy"
        />

        {/* Ambient Darkened Bottom Edge on Image for Better Contrast */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white text-stone-700 hover:text-red-500 border border-stone-100 backdrop-blur-md hover:scale-105"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4.5 w-4.5 transition-transform active:scale-95 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Labels (Featured / Best Seller / Out of stock) */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {product.stock <= 0 ? (
            <span className="rounded-full bg-stone-900/90 backdrop-blur-sm px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase text-white border border-stone-800">
              Out of stock
            </span>
          ) : (
            <>
              {product.isBestSeller && (
                <span className="rounded-full bg-emerald-800/95 backdrop-blur-sm px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase text-white border border-emerald-700/30">
                  Best Seller
                </span>
              )}
              {product.isNewArrival && (
                <span className="rounded-full bg-stone-900/95 backdrop-blur-sm px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase text-white border border-stone-800/30">
                  New Arrival
                </span>
              )}
            </>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 bg-white">
        <span className="text-[10px] tracking-[0.15em] uppercase text-stone-400 font-bold mb-1.5 block">
          {product.category}
        </span>
        <Link href={`/product/${id}`} className="block">
          <h3 className="font-serif text-base font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors duration-300 min-h-[2.75rem]">
            {product.name}
          </h3>
        </Link>

        {/* Reviews Summary */}
        <div className="mt-3 flex items-center space-x-2">
          <div className="flex text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-200'}`} />
            ))}
          </div>
          <span className="text-[11px] font-bold text-stone-500">
            {product.rating.toFixed(1)} <span className="text-stone-300 font-normal">({product.reviewsCount})</span>
          </span>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-400 line-through leading-none">₹{product.price}</span>
                <span className="text-lg font-bold text-stone-950 mt-0.5">₹{product.discountPrice}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-stone-950">₹{product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-300 hover:bg-emerald-800 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed shadow-sm hover:shadow"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-3 w-3" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
