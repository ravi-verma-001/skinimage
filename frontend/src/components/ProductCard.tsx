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
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-stone-200/80 bg-white transition-all duration-300 hover:shadow-md">
      {/* Product Image & Badges */}
      <Link href={`/product/${id}`} className="relative block aspect-square w-full overflow-hidden bg-stone-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:bg-white text-stone-700 hover:text-red-500 backdrop-blur-xs"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Labels (Featured / Best Seller / Out of stock) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.stock <= 0 ? (
            <span className="rounded bg-stone-800 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase text-white">
              Out of stock
            </span>
          ) : (
            <>
              {product.isBestSeller && (
                <span className="rounded bg-emerald-700 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase text-white">
                  Best Seller
                </span>
              )}
              {product.isNewArrival && (
                <span className="rounded bg-stone-900 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase text-white">
                  New Arrival
                </span>
              )}
            </>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs tracking-wider uppercase text-stone-500 mb-1">{product.category}</p>
        <Link href={`/product/${id}`} className="group-hover:text-emerald-700 transition">
          <h3 className="font-serif text-sm sm:text-base font-semibold text-stone-900 line-clamp-1">{product.name}</h3>
        </Link>

        {/* Reviews Summary */}
        <div className="mt-2.5 flex items-center space-x-1.5">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'}`} />
            ))}
          </div>
          <span className="text-[11px] font-medium text-stone-500">{product.rating} ({product.reviewsCount})</span>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            {hasDiscount ? (
              <>
                <span className="text-base font-bold text-stone-950">${product.discountPrice}</span>
                <span className="text-xs text-stone-400 line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-base font-bold text-stone-950">${product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:bg-stone-300 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
