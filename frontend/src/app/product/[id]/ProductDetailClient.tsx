'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Star, Heart, ShoppingCart, ShieldCheck, RefreshCcw, ChevronDown, CheckCircle2, Award } from 'lucide-react';
import toast from 'react-hot-toast';

import { API_URL } from '@/config';

const DUMMY_PRODUCTS = [
  {
    id: "p1",
    sku: "SK-HYDRA-FW",
    name: "Oil Cleanser with Squalane & Jojoba Oil | Removes Makeup & Sunscreen, Non-Greasy",
    category: "Cleanser",
    price: 1599.00,
    discountPrice: 1329.00,
    stock: 85,
    images: [
      "/cleanser.png",
      "/CleanserVideo.mp4",
      "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Oil Cleanser is the perfect first step in your double-cleansing routine. It effortlessly melts away stubborn makeup, sunscreen, and impurities, while nourishing your skin barrier — leaving your face soft, hydrated, and never greasy.",
    ingredients: [
      "Plant-derived Squalane 3% — deeply nourishes and mimics skin's natural oils",
      "Jojoba Oil 2% — balances oil production, non-comedogenic",
      "Rosehip Oil 2% — rich in antioxidants, supports skin repair",
      "Vitamin E 1% — protects and conditions the skin"
    ],
    benefits: [
      "Removes waterproof makeup & sunscreen effectively",
      "Dissolves excess sebum and impurities",
      "Nourishes and strengthens the skin barrier",
      "Leaves skin soft, hydrated, and non-greasy"
    ],
    howToUse: "Massage onto dry face for 30-60 seconds to dissolve makeup and sunscreen, then rinse with water or follow up with your regular face wash.",
    skinType: ["Sensitive", "Dry", "Normal", "Oily", "Combination"],
    specs: { "Volume": "150ml", "pH Range": "5.5 - 6.0", "Cruelty-Free": "Yes", "Formulation": "Oil-to-milk" },
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
    name: "Clinq 10% AHA BHA Face Serum",
    category: "Serum",
    price: 899.00,
    discountPrice: 849.00,
    stock: 50,
    images: [
      "/aha_bha_face_serum.jpg",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Give your skin a fresh new glow with this powerful AHA BHA Face Serum. Specially formulated for those struggling with dull, rough, and uneven skin texture.",
    ingredients: [
      "AHA BHA 10% — gently removes dead skin cells",
      "Niacinamide — evens out skin tone and tightens pores",
      "Ascorbyl Glucoside (Vitamin C derivative) — brightens skin and protects against free radicals"
    ],
    benefits: [
      "Effectively removes dead skin cells",
      "Reduces fine lines and wrinkles",
      "Fixes uneven skin tone, restores natural glow",
      "Regular use leaves skin smoother and more refined"
    ],
    howToUse: "Apply 3-4 drops on clean skin at night, gently massage in. Always follow with sunscreen during the day.",
    skinType: ["Normal", "Dry", "Combination", "Oily", "Acne-Prone"],
    specs: { "Volume": "30ml", "Active Ingredients": "10% AHA BHA Complex", "Cruelty-Free": "Yes", "Fragrance-Free": "Yes" },
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
    name: "UV-Aurora Sunscreen",
    category: "Sunscreen",
    price: 899.00,
    discountPrice: 798.00,
    stock: 120,
    images: [
      "/uv_aurora_sunscreen.png",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Protect your skin the smart way with UV-Aurora Sunscreen — a lightweight formula that shields against harmful sun rays while doubling up as a hydrating skincare step.",
    ingredients: [
      "Hyaluronic Acid 1% — provides deep, lasting hydration",
      "Kakadu Plum Extract 1% — rich in Vitamin C, brightens and protects skin",
      "Vitamin E 2% — antioxidant protection against environmental damage"
    ],
    benefits: [
      "Protects from UVA & UVB rays",
      "Deeply hydrates and nourishes the skin",
      "Strengthens the skin barrier",
      "Lightweight, non-sticky formula for daily use"
    ],
    howToUse: "Apply generously as the last step of your morning skincare routine, 15-20 minutes before sun exposure. Reapply every 3-4 hours if outdoors.",
    skinType: ["Combination", "Oily", "Normal", "Sensitive"],
    specs: { "Volume": "50ml", "Protection": "SPF 50 / PA++++", "Cruelty-Free": "Yes", "Non-Comedogenic": "Yes" },
    rating: 4.9,
    reviewsCount: 215,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    reviews: []
  },
  {
    id: "p4",
    sku: "SK-BENZOTREE-FW",
    name: "Benzotree Face Wash with Benzoyl Peroxide & Tea Tree Oil | Acne & Breakout Control Face Wash",
    category: "Cleanser",
    price: 885.00,
    stock: 45,
    images: [
      "/benzotree_face_wash.png"
    ],
    description: "The best solution for acne-prone skin — Benzotree Face Wash. Specially formulated to target breakouts, excess oil, and clogged pores.",
    ingredients: [
      "Benzoyl Peroxide 1% — fights acne-causing bacteria",
      "Vitamin C — helps with skin brightening and healing",
      "Tea Tree Oil — natural antibacterial properties, controls oil",
      "Vitamin E — soothes and nourishes the skin"
    ],
    benefits: [
      "Controls excess oil",
      "Clears clogged pores",
      "Works effectively on active breakouts",
      "Treats mild to moderate acne"
    ],
    howToUse: "Wet your face, take a small amount, gently massage for 1 minute, then rinse off. Use 1-2 times a day (to avoid over-drying)",
    skinType: ["Oily", "Combination", "Acne-Prone"],
    specs: { "Volume": "150ml", "Active Ingredients": "Benzoyl Peroxide 1%, Tea Tree Oil", "Cruelty-Free": "Yes" },
    rating: 4.6,
    reviewsCount: 88,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    reviews: []
  },
  {
    id: "p5",
    sku: "SK-CPEPTIDE-SRM",
    name: "C-Peptide Face Serum",
    category: "Serum",
    price: 1299.00,
    stock: 90,
    images: [
      "/c_peptide_serum.png",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600"
    ],
    description: "C-Peptide Face Serum is the name in age-defying skincare. Its advanced 6-Peptide Complex formula works deep within the skin's layers, keeping your skin firm, hydrated, and youthful.",
    ingredients: [
      "6 Peptide Complex — Boosts collagen production",
      "Hyaluronic Acid — Provides deep hydration, locks in moisture",
      "Niacinamide — Strengthens the skin barrier",
      "Allantoin — Soothes and repairs skin"
    ],
    benefits: [
      "Locks moisture into skin cells",
      "Visibly reduces fine lines and wrinkles",
      "Promotes natural collagen production",
      "Makes skin plump, firm, and youthful"
    ],
    howToUse: "Apply 3–4 drops of the serum to a clean face—morning or night—before your moisturizer.",
    skinType: ["Normal", "Dry", "Combination", "Sensitive", "Aging"],
    specs: { "Volume": "30ml", "Active Ingredients": "6-Peptide Complex", "Cruelty-Free": "Yes" },
    rating: 4.8,
    reviewsCount: 167,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    reviews: []
  },
  {
    id: "p6",
    sku: "SK-PDRN-SRM",
    name: "PDRN Regenerating Serum with Peptides & Growth Factors | Advanced Skin Repair & Anti-Aging Serum",
    category: "Serum",
    price: 1440.00,
    stock: 110,
    images: [
      "/pdrn_regenerating_serum.jpg",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Give your skin the tools to repair and renew itself with PDRN Regenerating Serum — an advanced formula built on DNA repair technology and clinically studied peptides. Designed for anyone looking to restore firmness, improve elasticity, and support long-term skin recovery.",
    ingredients: [
      "0.5% PDRN (Polydeoxyribonucleotide) — DNA repair technology that supports skin regeneration",
      "5% Acetyl Hexapeptide-8 — helps smooth the look of expression lines",
      "Copper Peptide Complex — supports collagen and elastin production",
      "Growth Factor Technology (EGF) — aids skin renewal and repair",
      "Matrixyl Peptide Complex, 5% Niacinamide, 2% Ceramide Complex — strengthen and even out the skin",
      "2% Centella Asiatica, 2% Panthenol (Pro-Vitamin B5), 1% Ectoin, 1% Beta-Glucan — soothe and hydrate",
      "Multi Molecular Hyaluronic Acid & Polyglutamic Acid — deep, multi-level hydration"
    ],
    benefits: [
      "Advanced skin regeneration and repair",
      "Supports collagen and elastin synthesis for firmer, younger-looking skin",
      "Helps reduce the appearance of fine lines and wrinkles",
      "Deeply hydrates and improves skin elasticity",
      "Restores and strengthens the skin's protective barrier",
      "Calms redness and supports recovery after dermatological or aesthetic procedures",
      "Improves overall skin texture, radiance, and quality",
      "Suitable for ageing, dehydrated, sensitive, and post-procedure skin"
    ],
    howToUse: "After cleansing and toning, apply 2-3 drops evenly over the face and neck. Gently pat until fully absorbed. Follow with a moisturizer. During the day, use a broad-spectrum sunscreen (SPF 30 or higher). Use morning and evening, or as directed by your dermatologist.",
    skinType: ["Dry", "Normal", "Combination", "Sensitive", "Aging"],
    specs: { "Volume": "30ml", "Active Ingredients": "0.5% PDRN, Peptides, EGF", "Cruelty-Free": "Yes" },
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
      "/centella_soothing_gel.png",
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
    name: "AHA BHA Face Wash",
    category: "Cleanser",
    price: 899.00,
    discountPrice: 799.00,
    stock: 150,
    images: [
      "/aha_bha_face_wash.jpg",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Meet your new daily essential — AHA BHA Face Wash, formulated to tackle uneven skin tone, acne, and excess oil all in one step, without stripping your skin.",
    ingredients: [
      "Niacinamide 5% — brightens and evens out skin tone",
      "Centella Asiatica 2% — soothes and calms irritated skin",
      "Panthenol (Vitamin B5) 2% — hydrates and repairs the skin barrier",
      "Salicylic Acid 2% — unclogs pores and fights acne-causing bacteria"
    ],
    benefits: [
      "Brightens and evens out skin tone",
      "Helps reduce acne and blackheads",
      "Controls excess oil",
      "Soothes and calms the skin"
    ],
    howToUse: "Wet your face, apply a small amount, gently massage for 30-60 seconds, then rinse off. Use twice daily (morning and night).",
    skinType: ["Normal", "Dry", "Combination", "Oily", "Sensitive"],
    specs: { "Volume": "100ml", "pH Range": "5.5 - 6.0", "Cruelty-Free": "Yes", "Fragrance-Free": "Yes" },
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
      "/sugarcane_squalane_oil.jpg",
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

const PRODUCT_FAQS: Record<string, { question: string; answer: string }[]> = {
  p2: [
    {
      question: "What is Clinq 10% AHA BHA Face Serum?",
      answer: "Clinq 10% AHA BHA Face Serum is an advanced exfoliating skincare formulation designed to remove dead skin cells, refine skin texture, and promote a clearer, brighter, and more even skin tone."
    },
    {
      question: "What are the key ingredients in Clinq 10% AHA BHA Face Serum?",
      answer: "The key active ingredients are Glycolic Acid (AHA), Salicylic Acid (BHA), Niacinamide, and Ascorbyl Glucoside (Vitamin C derivative), which work synergistically to exfoliate, brighten, and soothe the skin."
    },
    {
      question: "How does Clinq 10% AHA BHA Face Serum work?",
      answer: "The AHAs gently dissolve the bonds holding dead skin cells on the surface, while BHAs penetrate deep into the pores to clear out sebum and prevent breakouts. Niacinamide and Vitamin C work together to target dark spots and smooth skin texture."
    },
    {
      question: "How should Clinq 10% AHA BHA Face Serum be used?",
      answer: "Apply 3-4 drops to clean, dry skin in your evening routine, gently patting it in. Avoid the eye area. Always follow up with a moisturizer and apply a broad-spectrum sunscreen during the day while using this product."
    },
    {
      question: "Is Clinq 10% AHA BHA Face Serum suitable for regular use?",
      answer: "Yes, it is suitable for regular use, but if you are new to chemical exfoliants, start by using it 2-3 times a week and gradually increase to daily evening use as your skin builds tolerance."
    },
    {
      question: "What benefits can I expect from Clinq 10% AHA BHA Face Serum?",
      answer: "You can expect smoother skin texture, reduced appearance of pores, improved radiance, fewer breakouts, and a visible reduction in fine lines and uneven skin tone over 4-6 weeks of consistent use."
    }
  ],
  p1: [
    {
      question: "What is the Oil Cleanser with Squalane & Jojoba Oil?",
      answer: "This is a premium first-step oil cleanser designed to melt away stubborn makeup, water-resistant sunscreen, and excess sebum while nourishing the skin barrier."
    },
    {
      question: "Can it be used on oily or acne-prone skin?",
      answer: "Yes! Jojoba oil balances sebum production and is non-comedogenic, making this cleanser excellent for balancing all skin types, including oily and acne-prone skin."
    },
    {
      question: "Does it leave a greasy residue?",
      answer: "No, it emulsifies into a light milk when mixed with water, rinsing off cleanly without leaving any greasy residue behind."
    }
  ],
  p3: [
    {
      question: "What makes UV-Aurora Sunscreen special?",
      answer: "It provides broad-spectrum SPF 50 / PA++++ protection against UVA and UVB rays, featuring a lightweight, hydrating formula that leaves zero white cast and doubles as a moisturizer."
    },
    {
      question: "How often should I reapply the sunscreen?",
      answer: "For maximum protection, reapply every 3 to 4 hours, especially if you are outdoors, sweating, or swimming."
    },
    {
      question: "Is it suitable for acne-prone skin?",
      answer: "Yes, UV-Aurora Sunscreen is non-comedogenic, meaning it won't clog your pores, and contains soothing ingredients suitable for sensitive, acne-prone skin."
    }
  ],
  p4: [
    {
      question: "How does Benzotree Face Wash help with acne?",
      answer: "It combines Benzoyl Peroxide (which targets acne-causing bacteria) and Tea Tree Oil (a natural anti-inflammatory agent) to deep-clean pores and control breakouts."
    },
    {
      question: "Should I use it daily?",
      answer: "Yes, but if your skin experiences mild dryness, start by using it once a day or every other day, gradually increasing to twice daily as tolerated."
    }
  ],
  p5: [
    {
      question: "What is the primary benefit of C-Peptide Face Serum?",
      answer: "It boosts collagen production, locks in deep moisture, and strengthens the skin barrier to make skin look firm, plump, and youthful."
    },
    {
      question: "At what age should I start using peptide serums?",
      answer: "Peptide serums can be introduced into your routine starting in your early-to-mid 20s as a preventative measure to retain skin elasticity and firmness."
    }
  ],
  p6: [
    {
      question: "What is PDRN Regenerating Serum?",
      answer: "PDRN is DNA repair technology that actively supports skin regeneration, cell renewal, and long-term recovery, particularly after aesthetic procedures or skin irritation."
    },
    {
      question: "How do I pair PDRN with other actives?",
      answer: "PDRN pairs beautifully with Niacinamide, Hyaluronic Acid, and Centella. If using strong exfoliants or retinoids, apply PDRN afterward to soothe and speed up skin barrier recovery."
    }
  ]
};

const CATEGORY_FAQS: Record<string, { question: string; answer: string }[]> = {
  Cleanser: [
    {
      question: "Why should I use a specialized cleanser?",
      answer: "A specialized cleanser removes dirt, sweat, makeup, and skin care products without stripping your skin's natural moisture barrier, laying a healthy foundation for the rest of your routine."
    },
    {
      question: "Should I wash my face twice a day?",
      answer: "Generally, yes. Washing once in the evening is critical to remove daily impurities. A gentle rinse or light cleanse in the morning keeps your skin fresh and ready for active treatments."
    }
  ],
  Serum: [
    {
      question: "How does a serum differ from a moisturizer?",
      answer: "Serums are lightweight, fast-absorbing liquids formulated with high concentrations of active ingredients to target specific concerns like dark spots, acne, or fine lines, whereas moisturizers focus on sealing in hydration."
    },
    {
      question: "How do I layer multiple serums?",
      answer: "Layer them from thinnest consistency (water-like) to thickest. Allow each serum to absorb for a minute before applying the next one."
    }
  ],
  generic: [
    {
      question: "Are NextSkin products cruelty-free?",
      answer: "Yes, all NextSkin formulations are 100% cruelty-free and developed without any testing on animals."
    },
    {
      question: "How long does it take to see results?",
      answer: "While hydration benefits are immediate, targeting concerns like texture, pigmentation, and fine lines typically takes 4-6 weeks of consistent daily usage."
    }
  ]
};

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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    benefits: true,
    howToUse: true,
    ingredients: true,
  });
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getProductFaqs = () => {
    const productId = product?._id || product?.id;
    if (productId && PRODUCT_FAQS[productId]) {
      return PRODUCT_FAQS[productId];
    }
    const category = product?.category;
    if (category && CATEGORY_FAQS[category]) {
      return CATEGORY_FAQS[category];
    }
    return CATEGORY_FAQS.generic;
  };

  const getProductTags = () => {
    const tagsMap: Record<string, string[]> = {
      p2: ["Skin Exfoliation", "Skin Brightening", "Skin Renewal"],
      p1: ["Deep Cleansing", "Makeup Removal", "Skin Hydration"],
      p3: ["UV Protection", "Zero White Cast", "Deep Hydration"],
      p4: ["Acne Control", "Pore Cleansing", "Oil Regulation"],
      p5: ["Anti-Aging", "Collagen Boosting", "Barrier Support"],
      p6: ["Cell Regeneration", "Elasticity Boost", "Barrier Repair"],
      p7: ["Redness Relief", "Instant Cooling", "Barrier Repair"],
      p8: ["Gentle Exfoliation", "Brightening", "Acne Control"],
      p9: ["Intense Moisture", "Texture Smoothing", "Eco-Friendly"]
    };
    const productId = product?._id || product?.id;
    return tagsMap[productId] || ["100% Organic", "Dermatologically Tested", "Cruelty-Free"];
  };

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
    <main className="min-h-screen bg-stone-50 text-stone-800 pb-20 pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex space-x-2 text-xs text-stone-500 mb-2 items-center">
          <Link href="/" className="hover:text-stone-800">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-stone-800">Shop</Link>
          <span>/</span>
          <span className="text-stone-800 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Images Section (Column Span: 5/12) */}
          <div className="lg:col-span-5 flex flex-col md:flex-row gap-3">
            {/* Vertical Thumbnails (hidden/scrollable horizontally on mobile, stacked vertically on md+) */}
            {product.images && product.images.length > 1 && (
              <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible shrink-0 pb-1 md:pb-0 justify-start">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-12 h-12 rounded-lg border overflow-hidden bg-white flex items-center justify-center p-0.5 transition-all ${
                      activeImage === img ? 'border-purple-600 ring-2 ring-purple-50' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {img.toLowerCase().endsWith('.mp4') ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-stone-50">
                        <video src={img} className="object-contain max-h-full max-w-full opacity-60" preload="metadata" muted />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-purple-600/80 text-white rounded-full p-0.5 shadow-sm">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img src={img} alt="" className="object-contain max-h-full max-w-full" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Display */}
            <div className="relative flex-1 w-full max-w-[340px] aspect-square overflow-hidden rounded-xl border border-stone-200 bg-white flex items-center justify-center order-1 md:order-2 shadow-sm">
              {activeImage.toLowerCase().endsWith('.mp4') ? (
                <video
                  src={activeImage}
                  controls
                  className="object-contain max-h-full max-w-full rounded-xl"
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={activeImage || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600"}
                  alt={product.name}
                  className="object-contain max-h-[85%] max-w-[85%] transition-all duration-300"
                />
              )}
              {product.discountPrice && (
                <div className="absolute top-3 left-3 bg-purple-600 text-white text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
                  Sale
                </div>
              )}
              {/* Zoom glass icon at bottom right */}
              <div className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow border border-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Product Details Section (Column Span: 7/12) */}
          <div className="lg:col-span-7 flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight mb-2 tracking-tight">
              {product.name}
            </h1>

            {/* Key Feature Tags */}
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-2.5">
              {getProductTags().map((tag: string, idx: number) => (
                <div key={idx} className="flex items-center gap-1 text-green-700 text-[11px] sm:text-xs font-medium">
                  <svg className="w-3.5 h-3.5 text-green-600 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{tag}</span>
                </div>
              ))}
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3.5">
              <div className="flex items-center text-[#EAB308]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(product.rating || 0) ? 'fill-current' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-850 mt-0.5">{product.rating || 4.8}</span>
              <span className="text-xs text-stone-500 mt-0.5">({product.reviewsCount || 15} Reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                ₹{(product.discountPrice || product.price).toFixed(0)}
              </span>

              <span className="text-[10px] text-stone-400 font-light mt-1">(incl. of all taxes.)</span>
              {product.discountPrice && (
                <span className="bg-[#8B5CF6] text-white text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded shadow-sm">
                  SAVE {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </span>
              )}
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <span className="block text-xs font-medium text-stone-500 mb-1.5">Size:</span>
              <button className="px-3.5 py-1 rounded-lg border border-purple-600 bg-purple-50 text-purple-700 font-semibold text-xs">
                {product.specs?.Volume || "30 ml"}
              </button>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-5 max-w-[420px]">
              {/* Qty dropdown dropdown */}
              <div className="relative border border-stone-300 rounded-lg px-3 py-2.5 bg-white flex items-center justify-between gap-3 hover:border-stone-400 transition-colors shrink-0">
                <span className="text-xs text-stone-600">Qty:</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-transparent pr-5 text-xs font-bold text-stone-900 focus:outline-none cursor-pointer appearance-none"
                >
                  {[...Array(Math.min(product.stock || 10, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 pointer-events-none" />
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.stock}
                className="flex-1 border border-purple-600 bg-white text-purple-700 font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-purple-50 transition-all flex items-center justify-center gap-1.5"
              >
                <div className="w-4.5 h-4.5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  <ShoppingCart className="h-2.5 w-2.5" />
                </div>
                <span>{product.stock ? 'Add to cart' : 'Out of Stock'}</span>
              </button>

              {/* Buy It Now button */}
              <button
                onClick={() => {
                  handleAddToCart();
                  router.push('/cart');
                }}
                disabled={!product.stock}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span>Buy It Now</span>
              </button>
            </div>


            {/* Available offers */}
            <div className="mb-4 bg-purple-50/40 border border-purple-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs mb-1.5">
                <svg className="w-3.5 h-3.5 text-amber-500 fill-current" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.554-.589 1.448-.589 2.002 0l3.507 3.727c.554.59.554 1.54 0 2.13l-3.507 3.727c-.554.589-1.448.589-2.002 0l-3.507-3.727c-.554-.59-.554-1.54 0-2.13l3.507-3.727z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>Available offers</span>
              </div>
              <ul className="space-y-1.5 text-[10px] text-stone-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Get 5% Extra discount on UPI transactions.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Buy 2 Get 1 Free on all Face Serums. Use code: <span className="font-bold text-purple-700">GLOW3</span></span>
                </li>
              </ul>
            </div>

            {/* Accordion Sections */}
            <div className="border-t border-stone-200 pt-1 space-y-2">
              {/* Product Description */}
              <div className="border-b border-stone-200 pb-2.5">
                <button
                  onClick={() => toggleSection('description')}
                  className="w-full flex justify-between items-center py-2 text-left font-semibold text-sm sm:text-base text-stone-900 hover:text-stone-700 transition-colors"
                >
                  <span className="font-serif">Product Description</span>
                  <ChevronDown className={`h-4 w-4 text-violet-600 transform transition-transform duration-200 ${openSections.description ? 'rotate-180' : ''}`} />
                </button>
                {openSections.description && (
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed py-1 font-light">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Key Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="border-b border-stone-200 pb-2.5">
                  <button
                    onClick={() => toggleSection('benefits')}
                    className="w-full flex justify-between items-center py-2 text-left font-semibold text-sm sm:text-base text-stone-900 hover:text-stone-700 transition-colors"
                  >
                    <span className="font-serif">Key Benefits</span>
                    <ChevronDown className={`h-4 w-4 text-violet-600 transform transition-transform duration-200 ${openSections.benefits ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.benefits && (
                    <ul className="space-y-2 py-1">
                      {product.benefits.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          {/* Circular Green Checkmark */}
                          <svg className="h-4 w-4 text-green-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#00C853" strokeWidth="2" fill="none" />
                            <path d="M8 12L11 15L16 9" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* How to Use */}
              {product.howToUse && (
                <div className="border-b border-stone-200 pb-2.5">
                  <button
                    onClick={() => toggleSection('howToUse')}
                    className="w-full flex justify-between items-center py-2 text-left font-semibold text-sm sm:text-base text-stone-900 hover:text-stone-700 transition-colors"
                  >
                    <span className="font-serif">How to Use</span>
                    <ChevronDown className={`h-4 w-4 text-violet-600 transform transition-transform duration-200 ${openSections.howToUse ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.howToUse && (
                    <div className="flex items-start gap-3 py-1">
                      {/* Purple Hand holding droplet icon */}
                      <div className="text-purple-600 shrink-0 mt-0.5">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Droplet */}
                          <path d="M12 2.5C12 2.5 8 6.5 8 9C8 11.2 9.8 13 12 13C14.2 13 16 11.2 16 9C16 6.5 12 2.5 12 2.5Z" fill="currentColor" />
                          {/* Hand palm up */}
                          <path d="M2 17H8.5C9.8 17 11 17.8 11.5 19L12 20H19C20.1 20 21 19.1 21 18V17C21 15.9 20.1 15 19 15H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M15 15C15 13.9 14.1 13 13 13H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
                        {product.howToUse}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Key Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="border-b border-stone-200 pb-2.5">
                  <button
                    onClick={() => toggleSection('ingredients')}
                    className="w-full flex justify-between items-center py-2 text-left font-semibold text-sm sm:text-base text-stone-900 hover:text-stone-700 transition-colors"
                  >
                    <span className="font-serif">Key Ingredients</span>
                    <ChevronDown className={`h-4 w-4 text-violet-600 transform transition-transform duration-200 ${openSections.ingredients ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.ingredients && (
                    <ul className="space-y-3 py-2">
                      {product.ingredients.map((ingredient: string, idx: number) => {
                        const parts = ingredient.split('—');
                        const name = parts[0].trim();
                        const desc = parts[1]?.trim();
                        return (
                          <li key={idx} className="flex items-center gap-3">
                            {/* Purple Beaker flask icon */}
                            <div className="text-purple-600 shrink-0">
                              <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M10 3V8L4.5 17.5C3.8 18.8 4.7 20.5 6.2 20.5H17.8C19.3 20.5 20.2 18.8 19.5 17.5L14 8V3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                <path d="M6.2 18.5L8.5 14.5H15.5L17.8 18.5H6.2Z" fill="currentColor" opacity="0.6" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-stone-850 text-xs sm:text-sm font-semibold">{name}</span>
                              {desc && <span className="block text-[10px] text-stone-500 font-light mt-0.5">{desc}</span>}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              {/* Product Specifications */}
              {product.specs && (
                <div className="border-b border-stone-200 pb-2.5">
                  <button
                    onClick={() => toggleSection('specs')}
                    className="w-full flex justify-between items-center py-2 text-left font-semibold text-sm sm:text-base text-stone-900 hover:text-stone-700 transition-colors"
                  >
                    <span className="font-serif">Specifications</span>
                    <ChevronDown className={`h-4 w-4 text-violet-600 transform transition-transform duration-200 ${openSections.specs ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.specs && (
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-5 py-2 text-xs">
                      {Object.entries(product.specs).map(([key, val]: any) => (
                        <div key={key} className="flex justify-between border-b border-stone-100 pb-1.5">
                          <span className="text-stone-400 font-light">{key}:</span>
                          <span className="font-semibold text-stone-700">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Brand Core Badges */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-b border-stone-200 py-10 my-16 items-center px-4">
          {/* COD Available */}
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-[#E9D5FF] border-2 border-[#D8B4FE] text-[#7E22CE] shrink-0">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" y="12" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <path d="M7 15h10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 12v7" stroke="currentColor" strokeWidth="1.5" />
                <rect x="5" y="5" width="14" height="6" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 7.5h6M9 9.2h5.5M10.8 7.5v2.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 leading-tight">COD Available</h4>
              <p className="text-xs text-stone-400 mt-0.5">Pan-India</p>
            </div>
          </div>

          {/* Free Delivery */}
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-[#E9D5FF] border-2 border-[#D8B4FE] text-[#7E22CE] shrink-0">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8h3M1 11h4M2 14h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 6h8l4 4v7h-2M7 6v11h2M12 17h3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="10.5" cy="17.5" r="2" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                <circle cx="16.5" cy="17.5" r="2" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                <path d="M15 6v4h4L17.5 6h-2.5z" fill="currentColor" opacity="0.3" />
                <text x="8" y="12" fill="currentColor" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">FREE</text>
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 leading-tight">Free Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Above ₹599</p>
            </div>
          </div>

          {/* 100% Real */}
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-[#E9D5FF] border-2 border-[#D8B4FE] text-[#7E22CE] shrink-0">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l2.4 1.8 2.9-.8.7 3 2.2 2-1 2.8 1.8 2.4-1.8 2.4 1 2.8-2.2 2-.7 3-2.9-.8L12 22l-2.4-1.8-2.9.8-.7-3-2.2-2 1-2.8-1.8-2.4 1.8-2.4-1-2.8 2.2-2 .7-3 2.9.8L12 2Z" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <text x="12" y="13.5" textAnchor="middle" fill="currentColor" fontSize="3.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.2">CERTIFIED</text>
                <circle cx="12" cy="7.5" r="0.8" fill="currentColor" />
                <circle cx="9.5" cy="16.5" r="0.8" fill="currentColor" />
                <circle cx="12" cy="16.5" r="0.8" fill="currentColor" />
                <circle cx="14.5" cy="16.5" r="0.8" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 leading-tight">100% Real</h4>
              <p className="text-xs text-stone-400 mt-0.5">Products</p>
            </div>
          </div>

          {/* Dermatologist */}
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-[#E9D5FF] border-2 border-[#D8B4FE] text-[#7E22CE] shrink-0">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="3.5" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" />
                <path d="M8.5 8c0-2.5 5-2.5 5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M6.5 20v-1.5c0-1.8 1.5-3.3 3.3-3.3h4.4c1.8 0 3.3 1.5 3.3 3.3V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 14v1.8a2 2 0 004 0V14" stroke="currentColor" strokeWidth="1.5" />
                <rect x="15" y="11" width="6" height="7" rx="0.5" fill="white" stroke="currentColor" strokeWidth="1" />
                <line x1="17" y1="13" x2="19" y2="13" stroke="currentColor" strokeWidth="0.8" />
                <line x1="17" y1="15" x2="19" y2="15" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 leading-tight">Dermatologist</h4>
              <p className="text-xs text-stone-400 mt-0.5">Written</p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Section */}
        <section className="mt-16 border-t border-stone-200 pt-16">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-1">
            {getProductFaqs().map((faq, idx) => (
              <div key={idx} className="border-b border-stone-200 py-4">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left text-stone-900 hover:text-stone-700 transition-colors"
                >
                  <span className="text-base font-semibold tracking-tight text-stone-950">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-violet-600 transform transition-transform duration-200 shrink-0 ml-4 ${openFaq[idx] ? 'rotate-180' : ''}`} />
                </button>
                {openFaq[idx] && (
                  <p className="text-stone-500 text-sm sm:text-base leading-relaxed mt-3 font-light max-w-4xl">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
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
