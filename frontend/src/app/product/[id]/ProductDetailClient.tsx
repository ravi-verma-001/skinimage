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
    name: "Nourishing Cleansing Oil",
    category: "Cleanser",
    price: 1599.00,
    discountPrice: 1329.00,
    stock: 85,
    images: [
      "/cleanser.png",
      "/CleanserVideo.mp4",
      "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Skinimage Nourishing Cleansing Oil (10+ Nourishing Botanical Oils + Plant-Derived Squalane + Amla, Bhringraj & Brahmi Extracts) is a luxury-grade, deep-cleansing oil-to-milk formula. It effortlessly dissolves water-resistant makeup, long-wear sunscreen, excess sebum, and urban pollutants without damaging the skin barrier. If you are looking for an effective cleansing oil for makeup removal that breaks down waterproof products within minutes, this gentle yet deep-action formula is the ultimate essential step in your skincare routine.\n\nThis formula features an optimal blend of premium botanical oils and Ayurvedic extracts: Sweet Almond, Argan, Jojoba, Rosehip, Coconut & Sesame Oils for skin barrier repair and deep nourishment, Plant-Derived Squalane to maintain skin hydration and softness, Amla, Bhringraj & Brahmi (Bacopa Monnieri) for antioxidant protection, and Neem Seed Oil, Bisabolol & Vitamin E to soothe irritation and promote a clear complexion. Systematically designed for all skin types, this cleanser stands out as the best cleansing oil for double cleansing, instantly transforming into a lightweight, non-greasy milky emulsion upon contact with water, leaving the skin feeling velvety soft and perfectly clean.",
    ingredients: [
      "Plant-Derived Squalane – Moisture barrier restoration & deep hydration",
      "Argan & Rosehip Seed Oils – Anti-aging, skin repair & elasticity",
      "Sweet Almond & Jojoba Seed Oils – Dissolves excess sebum & nourishes skin",
      "Caprylic/Capric Triglyceride – Lightweight base for fast makeup breakdown",
      "Amla, Bhringraj & Brahmi Extracts – Antioxidant protection & skin tone revitalizing",
      "Neem Seed Oil & Bisabolol – Anti-bacterial defense & anti-inflammatory calming",
      "Tocopherol (Vitamin E) – Free-radical protection & skin smoothness"
    ],
    benefits: [
      "Effortless Makeup & Sunscreen Removal: Formulated as the ideal cleansing oil for makeup removal, it easily breaks down heavy, waterproof makeup, SPF, and stubborn impurities.",
      "Transformative Oil-to-Milk Emulsion: Uniquely transforms into a smooth, milky lotion upon contact with water, rinsing off completely without leaving any heavy or greasy residue.",
      "Perfect 1st Step for Double Cleansing: Widely trusted as the best cleansing oil for double cleansing, it unclogs pores and prepares your skin for a water-based wash.",
      "Restores & Strengthens Skin Barrier: Packed with plant-derived Squalane, Ceramide-building oils, and Vitamin E to soothe reactive, dry, or sensitive skin.",
      "Nourishes & Soothes Skin: Infused with natural Bisabolol, Neem, and Lavender to calm redness, leaving the skin feeling deeply hydrated and refreshed."
    ],
    howToUse: "Pump/apply a sufficient quantity onto dry hands and apply directly onto a dry face.\n\nGently massage in circular motions for 1–2 minutes to melt away makeup, sunscreen, and daily grime.\n\nAdd a small amount of water to emulsify the oil into a rich, milky lotion.\n\nRinse thoroughly with water.\n\nDouble Cleanse: Follow up with a gentle water-based cleanser (like Skinimage Acne & Oil Control Face Cleanser) for a complete deep-pore clean.",
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
    name: "AHA & BHA Face Serum",
    category: "Serum",
    price: 899.00,
    discountPrice: 849.00,
    stock: 50,
    images: [
      "/aha_bha_face_serum.jpg",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
    ],
    description: "AHA & BHA Face Serum is an advanced exfoliating skincare formulation designed to remove dead skin cells, refine skin texture, and promote a clearer, brighter, and more youthful complexion with regular use. This resurfacing serum is powered by a potent blend of AHA and BHA actives, featuring Glycolic Acid to gently exfoliate and reduce fine lines, Betaine Salicylate to unclog pores and improve acne-prone skin, and Alpha Arbutin to help reduce pigmentation and uneven skin tone. It is further enriched with Niacinamide to strengthen the skin barrier and enhance radiance, Ascorbyl Glucoside for antioxidant protection and brightening, Sodium Hyaluronate for deep hydration, Panthenol and Allantoin to soothe and repair the skin, and fruit extracts such as Kiwi Fruit Extract, Dragon Fruit Extract, and Sea Buckthorn Extract to nourish the skin with natural antioxidants. Lightweight and fast-absorbing, this serum helps improve skin clarity, smoothness, and glow, making it suitable for those seeking radiant, youthful-looking skin when used as directed.",
    ingredients: [
      "Glycolic Acid",
      "Betaine Salicylate",
      "Alpha Arbutin",
      "Niacinamide",
      "Ascorbyl Glucoside",
      "Sodium Hyaluronate",
      "Panthenol",
      "Allantoin",
      "Kiwi Fruit Extract",
      "Dragon Fruit Extract",
      "Sea Buckthorn Extract"
    ],
    benefits: [
      "Gently exfoliates and removes dead skin cells.",
      "Helps reduce fine lines and uneven texture.",
      "Unclogs pores and supports clearer skin.",
      "Brightens skin tone and improves radiance.",
      "Hydrates and soothes the skin barrier."
    ],
    howToUse: "After cleansing, apply a few drops to the face, gently massage until absorbed, and use as directed, preferably at night.",
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
    description: "Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++ is an ultra-lightweight, fast-absorbing sunscreen formulated to provide broad-spectrum protection against UVA and UVB rays while delivering deep hydration and a non-greasy, water-light feel suitable for daily use. This advanced aqua sunscreen gel is powered by key ingredients such as Hyaluronic Acid to deeply hydrate and maintain skin moisture, Homosalate and Octyl Methoxy Cinnamate to provide effective UVB protection, Tinosorb M for broad-spectrum UVA and UVB defense, Zinc PCA to help balance oil and support skin clarity, Vitamin E for antioxidant protection, Kakadu Plum Extract to support skin radiance and environmental defense, Silk Protein Extract for a smooth and soft skin finish, Aristoflex AVC for lightweight gel texture, Allantoin to soothe and calm the skin, and Melanin to enhance photoprotection. Designed for all skin types, this sunscreen spreads effortlessly, absorbs quickly without white cast, and helps protect skin from sun damage, premature ageing, and dehydration when applied regularly as directed.",
    ingredients: [
      "Hyaluronic Acid",
      "Homosalate",
      "Octyl Methoxy Cinnamate",
      "Tinosorb M",
      "Zinc PCA",
      "Vitamin E",
      "Kakadu Plum Extract",
      "Silk Protein Extract",
      "Allantoin",
      "Melanin"
    ],
    benefits: [
      "Provides broad-spectrum UVA and UVB protection.",
      "Hydrates skin with a lightweight aqua gel texture.",
      "Helps prevent sun damage and premature ageing.",
      "Non-greasy, fast-absorbing, and comfortable for daily use.",
      "Suitable for all skin types."
    ],
    howToUse: "Clean and pat dry the face, apply two finger-lengths of sunscreen to the face and neck, massage gently until absorbed, apply 20 minutes before sun exposure, and reapply every 2–3 hours for continued protection.",
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
    description: "Skinimage Benzotree  Face Wash is a paraben-free facial cleanser formulated for oily and acne-prone skin, designed to help maintain skin clarity and freshness with a balanced cleansing approach, combining active and supportive ingredients that contribute to a clean, refreshed skin feel without excessive dryness, enriched with key ingredients such as Benzoyl Peroxide, Vitamin C, and Tea Tree Oil which are commonly used in formulations aimed at supporting clearer-looking skin and maintaining overall skin condition, along with a blend of cleansing agents and hydrating components that help remove impurities, excess oil, and buildup from the skin surface while keeping the skin feeling smooth and comfortable after every wash.",
    ingredients: [
      "Benzoyl Peroxide",
      "Vitamin C",
      "Tea Tree Oil"
    ],
    benefits: [
      "Helps support oil control for a less greasy skin feel throughout the day.",
      "Effectively cleanses dirt, impurities, and excess sebum from the skin surface.",
      "Maintains a refreshed and clean skin feel after every wash.",
      "Suitable for oily and acne-prone skin types.",
      "Leaves skin feeling balanced, smooth, and comfortable without over-drying."
    ],
    howToUse: "Wet your face and apply a small amount of Skinimage Benzotree Face Wash. Gently massage for 10–20 seconds and rinse thoroughly with water.",
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
    description: "Skinimage C-Peptide Super Face Serum is an advanced anti-ageing and skin-repair formulation designed to lock in moisture, strengthen the skin barrier, and visibly reduce fine lines and wrinkles for smoother, firmer, and youthful-looking skin. This high-performance serum is powered by a multi-peptide complex including Acetyl Hexapeptide-8 and Copper Tripeptide-1 to help boost collagen production, improve skin elasticity, and minimize the appearance of expression lines, supported by Niacinamide to refine skin texture and strengthen the barrier, and Hyaluronic Acid to deeply hydrate and plump the skin. It is further enriched with Adenosine to help reduce wrinkles, Allantoin to soothe and calm the skin, Sodium PCA and Betaine to maintain optimal moisture balance, and Amino Acids to support skin repair and resilience. Lightweight and fast-absorbing, this serum works effectively as the first step of skincare to enhance skin smoothness, firmness, and overall radiance with consistent use.",
    ingredients: [
      "Peptide Complex",
      "Acetyl Hexapeptide-8",
      "Copper Tripeptide-1",
      "Niacinamide",
      "Hyaluronic Acid",
      "Adenosine",
      "Allantoin",
      "Sodium PCA",
      "Betaine",
      "Amino Acids"
    ],
    benefits: [
      "Locks moisture and deeply hydrates skin.",
      "Helps reduce fine lines and wrinkles.",
      "Boosts collagen and improves elasticity.",
      "Strengthens skin barrier and texture.",
      "Promotes smoother and youthful-looking skin."
    ],
    howToUse: "After cleansing, apply the serum evenly over the face, massage gently until absorbed, and use as the first step of your skincare routine.",
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
    name: "Gluta Foaming Facewash",
    category: "Cleanser",
    price: 599.00,
    stock: 75,
    images: [
      "/centella_soothing_gel.png",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Skinimage Gluta Foaming Facewash is a gentle yet effective daily cleanser formulated to purify the skin, remove impurities, and enhance natural brightness while maintaining skin hydration and balance. This foaming facewash is enriched with key skin-beneficial ingredients such as Vitamin C to help brighten the complexion and support an even skin tone, Vitamin E to provide antioxidant protection and nourish the skin, Glutathione to support skin clarity and radiance, and Aloe Vera Extract to soothe, hydrate, and calm the skin during cleansing. Its mild foaming action helps lift dirt, excess oil, and pollutants without stripping moisture, making it suitable for regular use to achieve refreshed, clean, and visibly brighter skin. With consistent use, Skinimage Gluta Foaming Facewash helps promote clearer-looking skin, improved glow, and a smooth, healthy appearance.",
    ingredients: [
      "Vitamin C",
      "Vitamin E",
      "Glutathione",
      "Aloe Vera Extract"
    ],
    benefits: [
      "Gently cleanses and removes impurities.",
      "Helps brighten and clarify skin tone.",
      "Provides antioxidant and skin-nourishing support.",
      "Soothes and hydrates during cleansing.",
      "Suitable for daily facial cleansing."
    ],
    howToUse: "Wet face and hands, apply the facewash, massage gently in circular motions for about a minute, rinse with lukewarm water, and pat dry.",
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
    description: "Skinimage AHA & BHA Face Wash Acne & Oil Control Gentle Face Cleanser (Niacinamide 5% + Salicylic Acid 2% + Zinc PCA 1%) is a dermatologist-tested, skin-barrier friendly daily foaming cleanser. This formula deeply purifies pores, removes blackheads, and reduces acne-causing bacteria. If you are looking for an effective salicylic acid face wash for acne that deeply cleanses without drying out the skin, this cleanser is the perfect solution. Its balanced pH 5.5 protects the skin's natural protective barrier.\n\nThis cleanser is enriched with high-performance active ingredients: Niacinamide (5%) to brighten skin tone and improve texture, Salicylic Acid (2%) to deeply unclog pores, and Zinc PCA (1%) to control excess oil and sebum. This formula is specially formulated to be the best face wash for oily skin, combination, and acne-prone skin types. The inclusion of Centella Asiatica (Cica) & Green Tea Extract helps calm inflammation and redness, while Sodium Hyaluronate and Panthenol (Pro-Vitamin B5) keep the skin hydrated and smooth.",
    ingredients: [
      "Salicylic Acid (2%) – Deep pore cleansing, exfoliation & acne control",
      "Niacinamide (5%) – Sebum balance, spot reduction & skin brightening",
      "Zinc PCA (1%) – Oil control & anti-bacterial defense",
      "Panthenol / Pro-Vitamin B5 (2%) – Skin barrier restoration & hydration",
      "Betaine (2%) – Moisture retention & smoothing",
      "Centella Asiatica Extract (2%) – Redness reduction & skin calming",
      "Green Tea Extract (1%) – Antioxidant protection & oil regulation",
      "Sodium Hyaluronate (0.2%) – Deep & lightweight hydration",
      "Allantoin (0.5%) – Anti-irritation & soothing"
    ],
    benefits: [
      "Deep Pore Cleansing: Actively works as a powerful salicylic acid face wash for acne, clearing dead skin cells, unclogging pores, and preventing pimples.",
      "Oil & Sebum Control: Formulated to be the best face wash for oily skin, regulating shine and excess sebum production throughout the day.",
      "Blemish & Spot Reduction: Fades dark spots, improves uneven skin tone, and restores natural radiance.",
      "Soothes Irritated Skin: Centella Asiatica and Green Tea extracts calm active acne redness, irritation, and inflammation.",
      "Maintains pH 5.5 Balance: Gentle on the skin barrier, keeping skin hydrated, soft, and non-stripping after every wash."
    ],
    howToUse: "Wet your face and neck with lukewarm water.\n\nApply a sufficient quantity onto damp palms and gently work into a soft lather.\n\nMassage gently onto the face in circular motions for 30–60 seconds, paying extra attention to oil-prone areas (T-zone).\n\nRinse thoroughly with water and gently pat dry.\n\nUse twice daily (morning and evening) for optimal results or as directed by a dermatologist.",
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
    name: "Milk Barrier Repair Hydrating Toner",
    category: "Toner",
    price: 1099.00,
    discountPrice: 939.00,
    stock: 60,
    images: [
      "/sugarcane_squalane_oil.jpg",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Skinimage Milk Barrier Repair Hydrating Toner (Ceramide NP + Hyaluronic Acid + Snow Mushroom + Squalane + Meadowfoam Seed Oil) is an ultra-nourishing, milky-hydrating toner. It instantly replenishes skin moisture loss after cleansing, reduces transepidermal water loss (TEWL), and rebuilds the skin's natural protective barrier. If you are looking for an effective ceramide toner for skin barrier repair to treat a damaged barrier, irritation, or dehydration, this advanced milky formula is the ultimate hydrating base for your skincare routine.\n\nThis toner features a scientific blend of rich emollient oils, peptides, and hydrating active ingredients: Ceramide NP for skin barrier strengthening, Hyaluronic Acid & Tremella Fuciformis (Snow Mushroom) Extract for multi-layer deep hydration, Squalane & Meadowfoam Seed Oil to restore the skin's lipid barrier, Acetyl Tetrapeptide-11 to smooth fine lines and improve elasticity, and Green Tea & Camellia Japonica Flower Extracts for powerful antioxidant protection. Being completely fragrance-free and alcohol-free, it stands out as the best hydrating toner for dry skin, sensitive skin, and post-dermatological procedure care.",
    ingredients: [
      "Ceramide NP – Essential lipid that repairs and fortifies the protective skin barrier",
      "Hyaluronic Acid – Attracts and holds moisture for surface plumpness",
      "Tremella Fuciformis (Snow Mushroom) Extract – Deep-penetrating natural hydrating agent",
      "Squalane & Meadowfoam Seed Oil – Lightweight emollient oils that lock in moisture",
      "Acetyl Tetrapeptide-11 – Anti-aging peptide that improves elasticity and firmness",
      "Green Tea & Camellia Japonica Extracts – Powerful antioxidants that calm redness and protect skin",
      "Vitamin E (Tocopherol) – Protects against environmental damage and oxidative stress"
    ],
    benefits: [
      "Restores & Strengthens Skin Barrier: Formulated as an advanced ceramide toner for skin barrier repair, it reinforces the lipid layer to prevent moisture loss and skin sensitivity.",
      "Intense Multi-Layer Hydration: Recognized as the best hydrating toner for dry skin, Snow Mushroom and Hyaluronic Acid deeply quench dehydrated skin, leaving it plump and glowing.",
      "Milky & Nourishing Texture: Enriched with Squalane and Meadowfoam Seed Oil to deliver rich emollient comfort without feeling heavy or greasy.",
      "Smoothes Fine Lines & Boosts Elasticity: Acetyl Tetrapeptide-11 helps plump dehydration lines and improve overall skin texture.",
      "Preps Skin for Maximum Absorption: Prepares your skin barrier to absorb subsequent serums and moisturizers more effectively.",
      "Safe for Sensitive & Post-Procedure Skin: Completely fragrance-free, alcohol-free, essential oil-free, and non-comedogenic."
    ],
    howToUse: "Cleanse your face with a gentle face wash and pat dry.\n\nDispense an adequate amount of toner onto a cotton pad or directly into the palms of clean hands.\n\nGently sweep or pat over your face and neck until fully absorbed (do not rinse).\n\nFollow with your favorite serum (like Skinimage PDRN Regenerating Serum) and moisturizer.\n\nUse twice daily (morning and evening).",
    skinType: ["Dry", "Sensitive", "Normal", "Combination"],
    specs: { "Volume": "150ml", "pH Range": "5.5", "Cruelty-Free": "Yes", "Fragrance-Free": "Yes", "Alcohol-Free": "Yes" },
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
      question: "What is AHA & BHA Face Serum?",
      answer: "AHA & BHA Face Serum is an exfoliating face serum designed to improve skin texture, reduce dead skin buildup, and promote radiant, youthful-looking skin."
    },
    {
      question: "What are the key ingredients in AHA & BHA Face Serum?",
      answer: "The serum contains Glycolic Acid, Betaine Salicylate, Alpha Arbutin, Niacinamide, Ascorbyl Glucoside, Sodium Hyaluronate, Panthenol, Allantoin, and antioxidant-rich fruit extracts."
    },
    {
      question: "How does AHA & BHA Face Serum work?",
      answer: "It works by exfoliating the skin surface and pores, brightening uneven tone, hydrating the skin, and supporting smoother, clearer skin over time."
    },
    {
      question: "How should AHA & BHA Face Serum be used?",
      answer: "Apply a few drops to clean skin, gently massage until absorbed, and use as recommended, preferably in the evening routine."
    },
    {
      question: "Is AHA & BHA Face Serum suitable for regular use?",
      answer: "Yes, it can be used regularly as directed, with proper sun protection during the day."
    },
    {
      question: "What benefits can I expect from AHA & BHA Face Serum?",
      answer: "You may notice smoother texture, brighter skin tone, reduced fine lines, clearer pores, and improved overall skin radiance."
    }
  ],
  p1: [
    {
      question: "Will using a cleansing oil make my skin more oily or clog my pores?",
      answer: "No! This formula uses non-comedogenic botanical oils and emulsifiers. According to the principle of \"like dissolves like,\" the cleansing oil attracts and dissolves oil-based impurities (sebum, makeup, sunscreen) without clogging pores or leaving an oily residue once rinsed."
    },
    {
      question: "Why should I apply the cleansing oil on DRY skin with DRY hands?",
      answer: "Applying cleansing oil on dry skin allows the botanical oils to directly bind to water-resistant makeup, sunscreen, and excess sebum. Adding water too early causes it to emulsify before it can effectively break down dirt."
    },
    {
      question: "Is this product suitable for oily and acne-prone skin types?",
      answer: "Yes, it is suitable for all skin types, including oily and acne-prone skin. It contains Neem Oil, Jojoba Oil, and Bisabolol, which help balance natural oil production and soothe skin inflammation while removing clogged pore debris."
    },
    {
      question: "Do I need to use another face wash after using this cleansing oil?",
      answer: "Yes, if you practice Double Cleansing! The cleansing oil acts as Step 1 to remove oil-soluble impurities (makeup, SPF, pollution), while a water-based face wash (Step 2) clears remaining water-soluble debris (sweat, dirt)."
    },
    {
      question: "Can this cleansing oil remove heavy waterproof mascara and eye makeup?",
      answer: "Absolutely. The blend of plant oils breaks down tough, waterproof eye and lip makeup effortlessly. Just massage gently over the eye area and rinse with lukewarm water. Avoid direct contact inside the eyes."
    }
  ],
  p3: [
    {
      question: "What is Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++?",
      answer: "Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++ is a lightweight sunscreen gel designed to protect the skin from UVA and UVB rays while providing deep hydration."
    },
    {
      question: "What are the key ingredients in Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++?",
      answer: "The sunscreen contains Hyaluronic Acid, Homosalate, Octyl Methoxy Cinnamate, Tinosorb M, Zinc PCA, Vitamin E, Kakadu Plum Extract, Silk Protein Extract, Allantoin, and Melanin."
    },
    {
      question: "How does Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++ work?",
      answer: "It works by forming a protective shield against harmful UVA and UVB rays while hydrating, soothing, and protecting the skin from sun-induced damage."
    },
    {
      question: "How should Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++ be used?",
      answer: "Apply two finger-lengths to the face and neck 20 minutes before sun exposure and reapply every 2–3 hours for optimal protection."
    },
    {
      question: "Is Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++ suitable for daily use?",
      answer: "Yes, it is suitable for daily use and can be comfortably worn under makeup."
    },
    {
      question: "What benefits can I expect from Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++?",
      answer: "You can expect effective sun protection, lightweight hydration, reduced sun damage, and a smooth, non-greasy skin finish."
    }
  ],
  p4: [
    {
      question: "What is Skinimage Benzotree Face Wash?",
      answer: "Skinimage Benzotree Face Wash is a paraben-free facial cleanser designed for oily and acne-prone skin to help maintain clean and fresh skin."
    },
    {
      question: "What are the key ingredients in Skinimage Benzotree Face Wash?",
      answer: "Skinimage Benzotree Face Wash contains key ingredients such as Benzoyl Peroxide, Vitamin C, and Tea Tree Oil."
    },
    {
      question: "Is Skinimage Benzotree Face Wash suitable for oily skin?",
      answer: "Yes, Skinimage Benzotree Face Wash is formulated for oily and acne-prone skin."
    },
    {
      question: "Does Skinimage Benzotree Face Wash contain Benzoyl Peroxide?",
      answer: "Yes, Skinimage Benzotree Face Wash contains Benzoyl Peroxide as mentioned in the product details."
    },
    {
      question: "Is Skinimage Benzotree Face Wash paraben-free?",
      answer: "Yes, Skinimage Benzotree Face Wash is paraben-free."
    },
    {
      question: "How often can Skinimage Benzotree Face Wash be used?",
      answer: "Skinimage Benzotree Face Wash can be used as part of your regular skincare routine as directed."
    },
    {
      question: "Does Skinimage Benzotree Face Wash help with acne-prone skin?",
      answer: "Skinimage Benzotree Face Wash is formulated for acne-prone skin and helps maintain a clean and balanced skin surface."
    },
    {
      question: "How do I use Skinimage Benzotree Face Wash?",
      answer: "Wet your face, apply a small amount of Skinimage Benzotree Face Wash, massage gently for 10–20 seconds, and rinse thoroughly."
    },
    {
      question: "Does Skinimage Benzotree Face Wash help control oil?",
      answer: "Yes, Skinimage Benzotree Face Wash is designed to support oil control and remove excess sebum."
    },
    {
      question: "What makes Skinimage Benzotree Face Wash different?",
      answer: "Skinimage Benzotree Face Wash combines Benzoyl Peroxide with ingredients like Vitamin C and Tea Tree Oil in a paraben-free formulation for targeted skin care."
    }
  ],
  p5: [
    {
      question: "What is Skinimage C-Peptide Super Face Serum?",
      answer: "Skinimage C-Peptide Face Serum is an advanced anti-ageing serum formulated to hydrate, strengthen skin, and reduce fine lines and wrinkles."
    },
    {
      question: "What are the key ingredients in Skinimage C-Peptide Face Serum?",
      answer: "The serum contains a peptide complex including Acetyl Hexapeptide-8 and Copper Tripeptide-1, along with Niacinamide, Hyaluronic Acid, Adenosine, and Allantoin."
    },
    {
      question: "How does Skinimage C-Peptide Face Serum work?",
      answer: "It works by boosting collagen, locking in moisture, improving elasticity, and smoothing wrinkles for firmer and youthful-looking skin."
    },
    {
      question: "How should Skinimage C-Peptide Face Serum be used?",
      answer: "Apply after cleansing as the first step of skincare, spread evenly on the face, and massage gently until absorbed."
    },
    {
      question: "Is Skinimage C-Peptide Face Serum suitable for daily use?",
      answer: "Yes, it is suitable for daily use when used as directed."
    },
    {
      question: "What benefits can I expect from Skinimage C-Peptide Face Serum?",
      answer: "Regular use may help improve hydration, reduce wrinkles, enhance firmness, and promote smoother, radiant skin."
    }
  ],
  p6: [
    {
      question: "What is PDRN and how does it benefit my skin?",
      answer: "PDRN (Polydeoxyribonucleotide) is a cutting-edge DNA repair technology that works at a cellular level to stimulate tissue repair, boost collagen production, and heal damaged skin. It is widely used in anti-aging treatments and post-procedure recovery."
    },
    {
      question: "Can I use this serum after derma-rolling, chemical peels, or laser treatments?",
      answer: "Yes! This serum is specially formulated with soothing ingredients like Centella Asiatica, Ceramides, and Ectoin, making it ideal to calm redness and accelerate recovery after dermatological or aesthetic procedures."
    },
    {
      question: "Is this serum suitable for young skin or only aging skin?",
      answer: "While it is a powerful anti-aging treatment for fine lines and wrinkles, it is also beneficial for younger individuals (in their 20s & 30s) dealing with damaged skin barriers, acne scars, dehydration, or dullness."
    },
    {
      question: "How long does it take to see results?",
      answer: "With regular twice-daily application, you will notice improved hydration, smoother texture, and reduced redness within 1 to 2 weeks. Significant improvements in skin firmness, elasticity, and fine lines generally appear after 4 to 6 weeks."
    },
    {
      question: "Can I layer this serum with other active ingredients like Vitamin C or Retinol?",
      answer: "Yes, PDRN and Peptides pair exceptionally well with most skincare actives. However, if using strong exfoliating acids or Retinol, apply the PDRN serum afterwards to soothe the skin barrier and prevent irritation."
    }
  ],
  p7: [
    {
      question: "What is Skinimage Gluta Foaming Facewash?",
      answer: "Skinimage Gluta Foaming Facewash is a daily facial cleanser designed to gently cleanse the skin while promoting brightness, clarity, and hydration."
    },
    {
      question: "What are the key ingredients in Skinimage Gluta Foaming Facewash?",
      answer: "The facewash contains key ingredients such as Vitamin C, Vitamin E, Glutathione, and Aloe Vera Extract."
    },
    {
      question: "How does Skinimage Gluta Foaming Facewash work?",
      answer: "It works by removing dirt, oil, and impurities while nourishing the skin with antioxidants and soothing extracts to maintain a fresh and clear complexion."
    },
    {
      question: "How should Skinimage Gluta Foaming Facewash be used?",
      answer: "Apply on wet face, massage gently in circular motions for about a minute, rinse thoroughly, and pat dry."
    },
    {
      question: "Is Skinimage Gluta Foaming Facewash suitable for daily use?",
      answer: "Yes, it is suitable for daily use as part of a regular skincare routine."
    },
    {
      question: "What benefits can I expect from Skinimage Gluta Foaming Facewash?",
      answer: "Regular use may help improve skin cleanliness, brightness, clarity, and overall skin freshness."
    }
  ],
  p8: [
    {
      question: "Is this face cleanser suitable for sensitive skin?",
      answer: "Yes! Although it contains 2% Salicylic Acid and 5% Niacinamide, the formula is balanced with a skin-friendly pH 5.5 and enriched with soothing ingredients like Centella Asiatica (Cica), Aloe Vera, and Allantoin. This prevents dryness and irritation, making it safe for oily, acne-prone, and sensitive skin types."
    },
    {
      question: "How often should I use this face cleanser?",
      answer: "For best results, use it twice daily—once in the morning and once at night as part of your daily skincare routine. Massage gently onto damp skin for 30–60 seconds before rinsing with water."
    },
    {
      question: "Will this cleanser dry out my skin?",
      answer: "No. Unlike harsh acne cleansers, it uses gentle, sulfate-free cleansers combined with deeply hydrating ingredients like Sodium Hyaluronate, Panthenol (Pro-Vitamin B5), and Betaine to keep your skin hydrated and soft after every wash."
    },
    {
      question: "Can I use this cleanser if I have active acne and blackheads?",
      answer: "Absolutely! 2% Salicylic Acid (BHA) penetrates deep into the pores to dissolve excess oil, clear blackheads, and prevent active breakouts. 1% Zinc PCA helps reduce acne-causing bacteria and regulates sebum production."
    },
    {
      question: "Is a mild tingling sensation normal after using this cleanser?",
      answer: "Yes, a very mild tingling sensation can occur initially due to active Salicylic Acid working on the skin. However, if severe irritation or redness persists, discontinue use and consult a dermatologist."
    }
  ],
  p9: [
    {
      question: "What makes a \"Barrier Repair Toner\" different from regular alcohol-based toners?",
      answer: "Traditional toners often contain alcohol and harsh astringents that strip the skin's natural oils. Skinimage Barrier Repair Toner is completely alcohol-free and fragrance-free, formulated with Ceramides, Squalane, and Hyaluronic Acid to nourish, hydrate, and strengthen the skin barrier instead of stripping it."
    },
    {
      question: "Can I use this toner if I have oily or acne-prone skin?",
      answer: "Yes! This toner is non-comedogenic (won't clog pores). Oily skin often produces excess oil due to a damaged or dehydrated barrier; using a Ceramide and Squalane-rich toner helps balance oil-water levels without causing breakouts."
    },
    {
      question: "How should I apply this toner—with hands or a cotton pad?",
      answer: "Both methods work well! For maximum hydration and less product waste, pouring 3–4 drops directly into your clean palms and gently patting it onto your face is highly recommended. If you prefer mild surface refinement, use a soft cotton pad."
    },
    {
      question: "Is this toner suitable after chemical peels, laser treatments, or micro-needling?",
      answer: "Yes, absolutely. It is specially designed for post-procedure skin. Free from fragrances, essential oils, and drying alcohols, it calms redness and speeds up barrier recovery following dermatological treatments."
    },
    {
      question: "Can I layer this toner multiple times (7-skin method)?",
      answer: "Yes! Its lightweight, milky-gel texture makes it perfect for layering. If your skin feels extra dehydrated or tight, you can layer 2 to 3 applications of this toner before applying your serum for intense moisture."
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
    const sku = product?.sku;
    
    let key = productId;
    if (sku === "SK-HYDRA-FW") key = "p1";
    else if (sku === "SK-VITC-GLOW") key = "p2";
    else if (sku === "SK-NIACIN-MOIST") key = "p3";
    else if (sku === "SK-BENZOTREE-FW") key = "p4";
    else if (sku === "SK-CPEPTIDE-SRM") key = "p5";
    else if (sku === "SK-PDRN-SRM") key = "p6";
    else if (sku === "SK-CENTELLA-GEL") key = "p7";
    else if (sku === "SK-AHABHA-FW" || sku === "SK-SPF50-SUN") key = "p8";
    else if (sku === "SK-SQUALANE-OIL") key = "p9";

    if (key && PRODUCT_FAQS[key]) {
      return PRODUCT_FAQS[key];
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
    const sku = product?.sku;
    
    let key = productId;
    if (sku === "SK-HYDRA-FW") key = "p1";
    else if (sku === "SK-VITC-GLOW") key = "p2";
    else if (sku === "SK-NIACIN-MOIST") key = "p3";
    else if (sku === "SK-BENZOTREE-FW") key = "p4";
    else if (sku === "SK-CPEPTIDE-SRM") key = "p5";
    else if (sku === "SK-PDRN-SRM") key = "p6";
    else if (sku === "SK-CENTELLA-GEL") key = "p7";
    else if (sku === "SK-AHABHA-FW" || sku === "SK-SPF50-SUN") key = "p8";
    else if (sku === "SK-SQUALANE-OIL") key = "p9";

    return tagsMap[key] || ["100% Organic", "Dermatologically Tested", "Cruelty-Free"];
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
