'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Star, Heart, ShoppingCart, ShieldCheck, RefreshCcw, ChevronDown, CheckCircle2, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const DUMMY_PRODUCTS = [
  {
    id: "p1",
    sku: "SK-HYDRA-FW",
    name: "Gentle Centella Hydrating Cleanser",
    category: "Cleanser",
    price: 24.00,
    discountPrice: 19.99,
    stock: 85,
    images: [
      "/cleanser.png",
      "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"
    ],
    description: "A pH-balanced foaming cleanser designed to remove impurities, excess sebum, and makeup without stripping the skin barrier. Infused with 40% Centella Asiatica extract and multi-weight Hyaluronic Acid to soothe irritation and retain essential moisture.",
    ingredients: ["Centella Asiatica Extract", "Glycerin", "Sodium Cocoyl Isethionate", "Hyaluronic Acid", "Green Tea Extract", "Panthenol"],
    benefits: ["Maintains skin pH balance", "Soothes redness and sensitive skin", "Deeply cleanses without tight feeling"],
    howToUse: "Apply a nickel-sized amount to damp face and neck. Gently massage in circular motions for 60 seconds. Rinse thoroughly with lukewarm water. Use morning and night.",
    skinType: ["Sensitive", "Dry", "Normal", "Oily", "Combination"],
    specs: { "Volume": "150ml", "pH Range": "5.5 - 6.0", "Cruelty-Free": "Yes", "Formulation": "Gel-to-foam" },
    rating: 4.8,
    reviewsCount: 142,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    reviews: [
      { id: "r1", userName: "Sophia L.", rating: 5, comment: "Absolutely love it. My skin barrier was ruined and this helped repair it completely.", createdAt: "2026-06-12" },
      { id: "r2", userName: "Marcus T.", rating: 4, comment: "Very gentle cleanser. No fragrance, which is great. Cleanses well.", createdAt: "2026-07-02" }
    ]
  },
  {
    id: "p2",
    sku: "SK-VITC-GLOW",
    name: "15% Vitamin C Glow Brightening Serum",
    category: "Serum",
    price: 38.00,
    discountPrice: 32.00,
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
    ],
    description: "A high-potency antioxidant serum formulated with pure L-Ascorbic Acid, Vitamin E, and Ferulic Acid. This clinical combination brightens dull complexion, fades hyperpigmentation and dark spots, and shields skin against oxidative environmental stressors.",
    ingredients: ["L-Ascorbic Acid (15%)", "Tocopherol (Vitamin E)", "Ferulic Acid", "Ethoxydiglycol", "Sodium Hyaluronate"],
    benefits: ["Fades dark spots and sun damage", "Boosts collagen production", "Provides daily antioxidant defense"],
    howToUse: "Apply 4-5 drops in the morning onto clean, dry face and neck before moisturizer and sunscreen. Store in a cool, dark place to avoid oxidation.",
    skinType: ["Normal", "Dry", "Combination", "Oily"],
    specs: { "Volume": "30ml", "Active Ingredients": "15% Vitamin C, 1% Vitamin E, 0.5% Ferulic", "Cruelty-Free": "Yes", "Fragrance-Free": "Yes" },
    rating: 4.7,
    reviewsCount: 98,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    reviews: []
  },
  {
    id: "p3",
    sku: "SK-NIACIN-MOIST",
    name: "Niacinamide + Ceramide Barrier Restore Gel Cream",
    category: "Moisturizer",
    price: 28.00,
    discountPrice: 24.50,
    stock: 120,
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600"
    ],
    description: "An ultra-lightweight gel cream packed with 5% Niacinamide and 3 essential Ceramides (EOP, AP, NP). Strengthens compromised skin barriers, regulates oil production, minimizes pore appearance, and provides deep 24-hour hydration without heavy residue.",
    ingredients: ["Niacinamide (5%)", "Ceramide NP", "Ceramide AP", "Ceramide EOP", "Squalane", "Allantoin"],
    benefits: ["Restores damaged skin barrier", "Regulates excess sebum", "Smoothes skin texture & reduces pores"],
    howToUse: "Smooth a blueberry-sized amount over clean face and neck. Can be used in both AM and PM routines. Layer after serums.",
    skinType: ["Combination", "Oily", "Normal", "Sensitive"],
    specs: { "Volume": "50ml", "Texture": "Water-gel-cream", "Cruelty-Free": "Yes", "Non-Comedogenic": "Yes" },
    rating: 4.9,
    reviewsCount: 215,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    reviews: []
  },
  {
    id: "p4",
    sku: "SK-RETINOL-NIGHT",
    name: "0.3% Retinol Wrinkle Repair Night Cream",
    category: "Serum",
    price: 42.00,
    discountPrice: 35.99,
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600"
    ],
    description: "An advanced night-time treatment designed to accelerate cellular turnover, reduce fine lines, wrinkles, and boost firmness. Formulated with microencapsulated Retinol to deliver benefits slowly and minimize irritation, combined with nourishing Rosehip Oil.",
    ingredients: ["Retinol (0.3%)", "Rosehip Seed Oil", "Bakuchiol", "Peptides", "Shea Butter", "Adenosine"],
    benefits: ["Reduces fine lines and deep wrinkles", "Improves skin elasticity and firmness", "Fades post-acne marks"],
    howToUse: "In the evening, apply a pea-sized amount to clean, dry skin. Limit initial use to 2-3 times per week, gradually increasing frequency as tolerated. Always apply sunscreen the following morning.",
    skinType: ["Normal", "Dry", "Combination", "Aging"],
    specs: { "Volume": "30ml", "Retinol Concentration": "0.3%", "Formulation": "Emulsion Cream", "Cruelty-Free": "Yes" },
    rating: 4.6,
    reviewsCount: 88,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    reviews: []
  },
  {
    id: "p5",
    sku: "SK-SALICYLIC-TNR",
    name: "2% BHA Salicylic Acid Exfoliating Toner",
    category: "Toner",
    price: 22.00,
    discountPrice: 18.00,
    stock: 90,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600"
    ],
    description: "A gentle leave-on liquid exfoliant that unclogs pores, targets blackheads, and controls breakouts. Powered by 2% Salicylic Acid (BHA) and Willow Bark Extract, it sweeps away dead skin cells to reveal a refined, smooth, and clear complexion.",
    ingredients: ["Salicylic Acid (BHA 2%)", "Willow Bark Extract", "Methylpropanediol", "Licorice Root Extract", "Tea Tree Extract"],
    benefits: ["Unclogs and shrinks enlarged pores", "Clears blackheads and blemishes", "Reduces redness and inflammation"],
    howToUse: "Apply a small amount to a cotton pad or pat directly with hands onto clean, dry skin. Do not rinse. Start using 3 times a week, increasing to daily use if skin permits.",
    skinType: ["Oily", "Combination", "Acne-Prone"],
    specs: { "Volume": "120ml", "pH Range": "3.5 - 3.8", "Active BHA": "2%", "Cruelty-Free": "Yes" },
    rating: 4.8,
    reviewsCount: 167,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    reviews: []
  },
  {
    id: "p6",
    sku: "SK-HYALURONIC-PLUMP",
    name: "Triple Hyaluronic Acid + B5 Plumping Serum",
    category: "Serum",
    price: 26.00,
    discountPrice: 21.99,
    stock: 110,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600"
    ],
    description: "A supercharged hydrating serum utilizing three distinct molecular weights of Hyaluronic Acid to penetrate multiple layers of the skin. Fortified with 2% Vitamin B5 (Panthenol) to soothe skin and trap hydration for instant bounce and dewiness.",
    ingredients: ["Sodium Hyaluronate (Multi-Weight)", "Panthenol (Vitamin B5 2%)", "Glycerin", "Centella Extract", "Avena Sativa (Oat) Kernel Extract"],
    benefits: ["Multi-layer skin hydration", "Smoothes dehydrated fine lines", "Plumps skin for a dewy glow"],
    howToUse: "Apply 3-4 drops onto damp skin after cleansing and toning. Pat gently. Follow immediately with your favorite moisturizer to lock in the hydration.",
    skinType: ["Dry", "Normal", "Combination", "Sensitive", "Dehydrated"],
    specs: { "Volume": "30ml", "Hyaluronic Acid": "2.5% Complex", "Panthenol": "2%", "Cruelty-Free": "Yes" },
    rating: 4.9,
    reviewsCount: 189,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    reviews: []
  },
  {
    id: "p7",
    sku: "SK-CENTELLA-SOOTH",
    name: "Centella Soothing Recovery Gel",
    category: "Moisturizer",
    price: 25.00,
    discountPrice: 20.00,
    stock: 75,
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
    ],
    description: "An instant cooling, calming gel cream designed for highly sensitive, irritated, or compromised skin. Formulated with 70% Centella Asiatica Extract and Aloe Vera, it reduces skin temperature, alleviates itching, and minimizes redness.",
    ingredients: ["Centella Asiatica Extract (70%)", "Aloe Barbadensis Leaf Juice", "Glycerin", "Allantoin", "Madecassoside", "Chamomile Extract"],
    benefits: ["Instantly cools and calms skin irritation", "Reduces redness and blotchiness", "Extremely lightweight & non-greasy"],
    howToUse: "Apply a generous layer over skin as the final step in your routine. Can be refrigerated for an extra cooling sensation. Excellent for post-sun or post-peel recovery.",
    skinType: ["Sensitive", "Oily", "Acne-Prone", "Combination"],
    specs: { "Volume": "80ml", "Cruelty-Free": "Yes", "Fragrance-Free": "Yes", "Hypoallergenic": "Yes" },
    rating: 4.7,
    reviewsCount: 64,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    reviews: []
  },
  {
    id: "p8",
    sku: "SK-SPF50-SUN",
    name: "Broad-Spectrum SPF 50 Airy Daily Sunscreen",
    category: "Sunscreen",
    price: 30.00,
    discountPrice: 25.00,
    stock: 150,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
    ],
    description: "A ultra-lightweight, fluid sunscreen that delivers high-performance SPF 50 PA++++ broad-spectrum protection against UVA and UVB rays. Dries down to a natural, invisible finish with zero white cast or greasy film. Enriched with Hyaluronic Acid.",
    ingredients: ["Homosalate", "Ethylhexyl Salicylate", "Zinc Oxide", "Hyaluronic Acid", "Niacinamide", "Adenosine"],
    benefits: ["Protects against UVA and UVB rays", "Zero white cast or sticky feel", "Hydrates and functions as a makeup primer"],
    howToUse: "Apply liberally as the final step in your AM skincare routine, at least 15 minutes before sun exposure. Reapply every 2 hours if active outdoors.",
    skinType: ["Normal", "Dry", "Combination", "Oily", "Sensitive"],
    specs: { "Volume": "50ml", "Protection": "SPF 50 / PA++++", "White Cast": "None", "Water Resistant": "Yes (40 min)" },
    rating: 4.8,
    reviewsCount: 210,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    reviews: []
  },
  {
    id: "p9",
    sku: "SK-SQUALANE-OIL",
    name: "100% Sugarcane Squalane Facial Oil",
    category: "Oil",
    price: 32.00,
    discountPrice: 27.50,
    stock: 60,
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
    ],
    description: "A pure, sustainably-sourced squalane oil that mimics skin's natural lipids to lock in intense moisture. This lightweight, dry facial oil absorbs instantly, helping to soften skin, improve texture, and bring back a healthy, natural radiance.",
    ingredients: ["100% Plant-Derived Squalane (Sugarcane)"],
    benefits: ["Locks in deep, long-lasting moisture", "Softens skin texture and reduces dry patches", "Multi-use for face, hair, and body"],
    howToUse: "Press a few drops onto face and neck after moisturizer to seal in hydration. Can also be mixed into your moisturizer or applied to dry hair tips.",
    skinType: ["Dry", "Sensitive", "Normal", "Combination"],
    specs: { "Volume": "30ml", "Ingredient Source": "100% Sugarcane", "Cruelty-Free": "Yes", "Vegan": "Yes" },
    rating: 4.9,
    reviewsCount: 118,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    reviews: []
  }
];

interface ProductDetailClientProps {
  id: string;
}

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
  const router = useRouter();
  const { user, token, addToWishlist, removeFromWishlist } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string>('ingredients');

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      setProduct(data);
      setActiveImage(data.images?.[0] || '');
    } catch (err) {
      console.warn('API error fetching product details. Falling back to local mock item.', err);
      const fallback = DUMMY_PRODUCTS.find(p => p.id === id) || DUMMY_PRODUCTS[0];
      setProduct(fallback);
      setActiveImage(fallback.images?.[0] || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-50">
        <RefreshCcw className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-stone-50 text-stone-800">
        <h2 className="text-2xl font-serif">Product Not Found</h2>
        <Link href="/shop" className="mt-4 text-emerald-800 underline">Back to Shop</Link>
      </div>
    );
  }

  const isWishlisted = user?.wishlist?.includes(product._id || product.id) || false;

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please log in to manage your wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id || product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product._id || product.id);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product._id || product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity,
      image: product.images?.[0] || '',
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error('Please log in to leave a review.');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/products/${product._id || product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      toast.success('Review added successfully!');
      setComment('');
      fetchProductDetails();
    } catch (err: any) {
      toast.error(err.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 pb-20 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex space-x-2 text-xs text-stone-500 mb-8 items-center">
          <Link href="/" className="hover:text-stone-800">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-stone-800">Shop</Link>
          <span>/</span>
          <span className="text-stone-800 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-stone-200 bg-white flex items-center justify-center">
              <img
                src={activeImage || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600"}
                alt={product.name}
                className="object-contain max-h-[85%] max-w-[85%] transition-all duration-300"
              />
              {product.discountPrice && (
                <div className="absolute top-4 left-4 bg-emerald-800 text-white text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded">
                  Sale
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 aspect-square rounded-lg border overflow-hidden bg-white flex items-center justify-center p-1 transition-all ${
                      activeImage === img ? 'border-emerald-800 ring-1 ring-emerald-800' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img src={img} alt="" className="object-contain max-h-full max-w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-emerald-800 font-semibold mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 leading-tight mb-3">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating || 0) ? 'fill-current' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-stone-500 font-medium">
                ({product.reviewsCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-4 mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl font-medium text-stone-900">${product.discountPrice.toFixed(2)}</span>
                  <span className="text-stone-400 line-through text-sm">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-2xl font-medium text-stone-900">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="text-stone-600 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quick Specs */}
            {product.specs && (
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-b border-stone-200 py-4 mb-8 text-xs">
                {Object.entries(product.specs).map(([key, val]: any) => (
                  <div key={key} className="flex justify-between pr-4">
                    <span className="text-stone-400">{key}:</span>
                    <span className="font-medium text-stone-700">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-stone-400 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded bg-white">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-100"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-medium text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock || 10, q + 1))}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-stone-400">
                  ({product.stock || 0} items available)
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-950 disabled:bg-stone-300 text-white font-medium text-xs tracking-wider uppercase py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{product.stock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 rounded-lg border transition-all flex items-center justify-center ${
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-stone-300 hover:border-stone-500 text-stone-600'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="border-t border-stone-200 pt-2 space-y-2">
              {[
                { id: 'ingredients', label: 'Ingredients', data: product.ingredients?.join(', ') },
                { id: 'howToUse', label: 'How to Use', data: product.howToUse },
                { id: 'benefits', label: 'Benefits', data: product.benefits?.join('. ') }
              ].map(section => (
                <div key={section.id} className="border-b border-stone-200 pb-2">
                  <button
                    onClick={() => setOpenSection(openSection === section.id ? '' : section.id)}
                    className="w-full flex justify-between items-center py-2 text-left font-serif text-sm font-semibold text-stone-800 hover:text-stone-600"
                  >
                    <span>{section.label}</span>
                    <ChevronDown className={`h-4 w-4 transform transition-transform ${openSection === section.id ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === section.id && (
                    <p className="text-xs text-stone-600 leading-relaxed py-1">
                      {section.data || 'Not specified.'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Core Badges */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b border-stone-200 py-10 my-16 bg-stone-100/50 rounded-xl px-6 sm:px-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-stone-900 mb-1">Clean & Honest</h4>
              <p className="text-xs text-stone-500 leading-relaxed">Sourced from non-toxic ingredients without synthetic fillers or toxic additives.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800">
              <RefreshCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-stone-900 mb-1">Eco-Conscious</h4>
              <p className="text-xs text-stone-500 leading-relaxed">100% recyclable bottles and sustainable sugarcane packaging blocks.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-stone-900 mb-1">Clinical Strength</h4>
              <p className="text-xs text-stone-500 leading-relaxed">Scientifically tested and dermatologically approved formulas.</p>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-serif text-stone-900 mb-8">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews list */}
            <div className="lg:col-span-2 space-y-6">
              {!product.reviews || product.reviews.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-stone-200 rounded-xl">
                  <p className="text-sm text-stone-400">No reviews yet for this product.</p>
                </div>
              ) : (
                product.reviews.map((rev: any, idx: number) => (
                  <div key={rev.id || idx} className="border-b border-stone-200 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-stone-800">{rev.userName || 'Anonymous'}</h4>
                        <div className="flex items-center text-amber-500 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < rev.rating ? 'fill-current' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-stone-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mt-2">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Leave a review */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 h-fit">
              <h3 className="text-lg font-serif text-stone-900 mb-4">Write a Review</h3>
              {user ? (
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-amber-500 hover:scale-110 transition-transform"
                        >
                          <Star className={`h-6 w-6 ${rating >= star ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Comment</label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-stone-900 hover:bg-stone-850 disabled:bg-stone-300 text-white font-medium text-xs tracking-wider uppercase py-3 rounded transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-stone-500 mb-4">You must be logged in to leave a review.</p>
                  <Link
                    href="/login"
                    className="inline-block bg-stone-950 text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-4 rounded hover:bg-stone-800"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
