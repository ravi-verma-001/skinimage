const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getDBMode } = require('./db');

const DB_FILE = path.join(__dirname, 'db.json');

// Mongoose Schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  addresses: [{
    country: String,
    state: String,
    city: String,
    pincode: String,
    addressLine: String,
    landmark: String,
    isDefault: { type: Boolean, default: false }
  }],
  wishlist: [{ type: String }], // Product IDs
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  description: { type: String, required: true },
  ingredients: [{ type: String }],
  benefits: [{ type: String }],
  howToUse: { type: String },
  skinType: [{ type: String }],
  specs: { type: Map, of: String },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false }
});

const OrderSchema = new mongoose.Schema({
  userId: { type: String },
  guestInfo: {
    name: String,
    email: String,
    phone: String
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  shippingAddress: {
    country: String,
    state: String,
    city: String,
    pincode: String,
    addressLine: String,
    landmark: String
  },
  deliveryMethod: { type: String, default: 'Standard' },
  paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  paymentDetails: { type: Map, of: String },
  couponApplied: {
    code: String,
    discountAmount: Number
  },
  totals: {
    subtotal: Number,
    discount: Number,
    shipping: Number,
    tax: Number,
    grandTotal: Number
  },
  status: { type: String, enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'], default: 'Placed' },
  trackingNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 100 },
  usageCount: { type: Number, default: 0 }
});

const ReviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const AnalysisReportSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  guestEmail: { type: String, default: null },
  skinScore: { type: Number, required: true },
  skinType: { type: String, required: true },
  hydration: { type: String },
  oiliness: { type: String },
  acne: { type: String },
  pigmentation: { type: String },
  darkCircles: { type: String },
  redness: { type: String },
  pores: { type: String },
  texture: { type: String },
  wrinkles: { type: String },
  summary: { type: String },
  rawResponse: { type: Object },
  recommendations: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Register models
const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Coupon = mongoose.model('Coupon', CouponSchema);
const Review = mongoose.model('Review', ReviewSchema);
const AnalysisReport = mongoose.model('AnalysisReport', AnalysisReportSchema);

// Initial 9 Products dummy data
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
    isNewArrival: false
  },
  {
    id: "p2",
    sku: "SK-VITC-GLOW",
    name: "AHA & BHA Face Serum",
    category: "Serum",
    price: 1199.00,
    discountPrice: 899.00,
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
    isNewArrival: true
  },
  {
    id: "p3",
    sku: "SK-NIACIN-MOIST",
    name: "UV-Aurora Sunscreen",
    category: "Sunscreen",
    price: 999.00,
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
    isNewArrival: false
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
    isNewArrival: true
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
    isNewArrival: false
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
    description: "Skinimage PDRN Regenerating Serum (0.5% PDRN + 5% Acetyl Hexapeptide-8 + Copper Peptide + EGF + 5% Niacinamide) is a next-generation, clinical-grade skin repair serum. This advanced formula works at a deep cellular level to accelerate skin regeneration, visibly reduce fine lines and wrinkles, and restore skin firmness. If you are looking for a high-performance pdrn serum for skin repair for anti-aging remedies or post-procedure recovery, this advanced treatment is perfectly formulated to boost your skin's natural healing mechanism.\n\nThis serum features a powerful blend of anti-aging and barrier-repairing active ingredients: 0.5% PDRN (Polydeoxyribonucleotide) with DNA-repair technology to boost collagen, 5% Acetyl Hexapeptide-8 & Copper Peptides to smooth fine lines and wrinkles, EGF (Growth Factors) and Matrixyl® Peptide Complex to enhance skin elasticity and firmness, 5% Niacinamide to brighten skin tone and refine texture, 2% Ceramide Complex to restore the skin barrier, and Multi-Molecular Hyaluronic Acid & Polyglutamic Acid for deep multi-layer hydration. This formula is designed as the ultimate best anti aging serum for glowing skin, sagging skin, dehydration, and post-treatment (derma roller/peels) recovery.",
    ingredients: [
      "0.5% PDRN (DNA Repair Tech) – Cell regeneration & deep skin repair",
      "5% Acetyl Hexapeptide-8 – \"Botox-like\" effect on expression lines & wrinkles",
      "Copper Peptide & EGF Growth Factors – Firmness, elasticity & collagen synthesis",
      "Matrixyl® Peptide Complex – Deep wrinkle reduction & skin tightening",
      "5% Niacinamide – Brightening, pore tightening & spot reduction",
      "2% Ceramide Complex – Restores protective skin barrier & prevents moisture loss",
      "2% Centella Asiatica & Drieline® – Calms redness & provides soothing defense",
      "1% Ectoin & Beta-Glucan – Environmental protection & intense hydration",
      "Multi-Molecular Hyaluronic Acid & Polyglutamic Acid – Multi-depth hydration"
    ],
    benefits: [
      "Cellular Skin Regeneration: Formulated as an advanced pdrn serum for skin repair, it stimulates collagen and elastin synthesis to accelerate skin recovery.",
      "Reduces Fine Lines & Wrinkles: Peptides and EGF (Growth Factors) visibly plump the skin, smooth out expression lines, and improve skin elasticity.",
      "Ultimate Anti-Aging & Glow: Recognized as the best anti aging serum for glowing skin, it brightens dull complexions, tightens sagging skin, and refines texture.",
      "Strengthens Skin Barrier: 2% Ceramide Complex along with Ectoin and Beta-Glucan rebuilds the compromised skin barrier and locks in moisture.",
      "Soothes Post-Procedure Skin: Calms redness, sensitivity, and irritation following dermatological procedures like micro-needling, laser, or chemical peels."
    ],
    howToUse: "Cleanse your face with a gentle cleanser and pat dry.\n\nApply 2–3 drops of Skinimage PDRN Serum onto your face and neck.\n\nGently pat with fingertips in upward motions until fully absorbed (do not rub harshly).\n\nFollow with your favorite moisturizer to lock in the actives.\n\nDaytime Routine: Always finish with a broad-spectrum sunscreen (SPF 30 or higher). Use twice daily (morning & night).",
    skinType: ["Dry", "Normal", "Combination", "Sensitive", "Aging"],
    specs: { "Volume": "30ml", "Active Ingredients": "0.5% PDRN, Peptides, EGF", "Cruelty-Free": "Yes" },
    rating: 4.9,
    reviewsCount: 189,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false
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
    isNewArrival: true
  },
  {
    id: "p8",
    sku: "SK-SPF50-SUN",
    name: "AHA BHA Face Wash",
    category: "Cleanser",
    price: 999.00,
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
    isNewArrival: false
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
    isNewArrival: false
  },
];

// File system DB helpers (Mock DB)
const readLocalDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: [],
      products: DUMMY_PRODUCTS,
      orders: [],
      coupons: [
        { code: "WELCOME10", discountType: "percentage", discountValue: 10, expiryDate: new Date("2030-12-31"), usageLimit: 1000, usageCount: 0 },
        { code: "SKINCARE20", discountType: "percentage", discountValue: 20, expiryDate: new Date("2030-12-31"), usageLimit: 500, usageCount: 0 }
      ],
      reviews: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (!parsed.analysisReports) parsed.analysisReports = [];
    return parsed;
  } catch (error) {
    console.error("Error reading local db file, resetting...", error);
    return { users: [], products: DUMMY_PRODUCTS, orders: [], coupons: [], reviews: [], analysisReports: [] };
  }
};

const writeLocalDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// Seeding function for MongoDB
const seedMongoDB = async () => {
  try {
    // Seed default admin if not exists, or update password
    const adminExists = await User.findOne({ email: 'admin@skinimage.com' });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('9818660316@puru', salt);
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@skinimage.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Seeded default Admin: admin@skinimage.com');
    } else {
      adminExists.password = hashedPassword;
      await adminExists.save();
      console.log('Updated default Admin password.');
    }

    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(DUMMY_PRODUCTS.map(p => {
        const { id, ...prodWithoutId } = p;
        return prodWithoutId;
      }));
      console.log('MongoDB Seeded with 9 Premium Products');
      // Create some default coupons
      await Coupon.create([
        { code: "WELCOME10", discountType: "percentage", discountValue: 10, expiryDate: new Date("2030-12-31"), usageLimit: 1000, usageCount: 0 },
        { code: "SKINCARE20", discountType: "percentage", discountValue: 20, expiryDate: new Date("2030-12-31"), usageLimit: 500, usageCount: 0 }
      ]);
    } else {
      // Update Squalane Cleanser to Nourishing Cleansing Oil if it exists
      const targetName = "Oil Cleanser with Squalane & Jojoba Oil | Removes Makeup & Sunscreen, Non-Greasy";
      const product = await Product.findOne({ $or: [{ sku: "SK-HYDRA-FW" }, { name: targetName }, { name: "Nourishing Cleansing Oil" }] });
      if (product) {
        product.name = "Nourishing Cleansing Oil";
        product.sku = "SK-HYDRA-FW";
        product.description = "Skinimage Nourishing Cleansing Oil (10+ Nourishing Botanical Oils + Plant-Derived Squalane + Amla, Bhringraj & Brahmi Extracts) is a luxury-grade, deep-cleansing oil-to-milk formula. It effortlessly dissolves water-resistant makeup, long-wear sunscreen, excess sebum, and urban pollutants without damaging the skin barrier. If you are looking for an effective cleansing oil for makeup removal that breaks down waterproof products within minutes, this gentle yet deep-action formula is the ultimate essential step in your skincare routine.\n\nThis formula features an optimal blend of premium botanical oils and Ayurvedic extracts: Sweet Almond, Argan, Jojoba, Rosehip, Coconut & Sesame Oils for skin barrier repair and deep nourishment, Plant-Derived Squalane to maintain skin hydration and softness, Amla, Bhringraj & Brahmi (Bacopa Monnieri) for antioxidant protection, and Neem Seed Oil, Bisabolol & Vitamin E to soothe irritation and promote a clear complexion. Systematically designed for all skin types, this cleanser stands out as the best cleansing oil for double cleansing, instantly transforming into a lightweight, non-greasy milky emulsion upon contact with water, leaving the skin feeling velvety soft and perfectly clean.";
        product.ingredients = [
          "Plant-Derived Squalane – Moisture barrier restoration & deep hydration",
          "Argan & Rosehip Seed Oils – Anti-aging, skin repair & elasticity",
          "Sweet Almond & Jojoba Seed Oils – Dissolves excess sebum & nourishes skin",
          "Caprylic/Capric Triglyceride – Lightweight base for fast makeup breakdown",
          "Amla, Bhringraj & Brahmi Extracts – Antioxidant protection & skin tone revitalizing",
          "Neem Seed Oil & Bisabolol – Anti-bacterial defense & anti-inflammatory calming",
          "Tocopherol (Vitamin E) – Free-radical protection & skin smoothness"
        ];
        product.benefits = [
          "Effortless Makeup & Sunscreen Removal: Formulated as the ideal cleansing oil for makeup removal, it easily breaks down heavy, waterproof makeup, SPF, and stubborn impurities.",
          "Transformative Oil-to-Milk Emulsion: Uniquely transforms into a smooth, milky lotion upon contact with water, rinsing off completely without leaving any heavy or greasy residue.",
          "Perfect 1st Step for Double Cleansing: Widely trusted as the best cleansing oil for double cleansing, it unclogs pores and prepares your skin for a water-based wash.",
          "Restores & Strengthens Skin Barrier: Packed with plant-derived Squalane, Ceramide-building oils, and Vitamin E to soothe reactive, dry, or sensitive skin.",
          "Nourishes & Soothes Skin: Infused with natural Bisabolol, Neem, and Lavender to calm redness, leaving the skin feeling deeply hydrated and refreshed."
        ];
        product.howToUse = "Pump/apply a sufficient quantity onto dry hands and apply directly onto a dry face.\n\nGently massage in circular motions for 1–2 minutes to melt away makeup, sunscreen, and daily grime.\n\nAdd a small amount of water to emulsify the oil into a rich, milky lotion.\n\nRinse thoroughly with water.\n\nDouble Cleanse: Follow up with a gentle water-based cleanser (like Skinimage Acne & Oil Control Face Cleanser) for a complete deep-pore clean.";
        product.images = [
          "/cleanser.png",
          "/CleanserVideo.mp4",
          "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"
        ];
        await product.save();
        console.log('Successfully updated Squalane Cleanser to Nourishing Cleansing Oil in MongoDB.');
      }

      // Update Toner to C-Peptide Face Serum if it exists
      const oldToner = await Product.findOne({ $or: [{ sku: "SK-SALICYLIC-TNR" }, { name: "2% BHA Salicylic Acid Exfoliating Toner" }, { sku: "SK-CPEPTIDE-SRM" }, { name: "C-Peptide Face Serum" }] });
      if (oldToner) {
        oldToner.name = "C-Peptide Face Serum";
        oldToner.sku = "SK-CPEPTIDE-SRM";
        oldToner.category = "Serum";
        oldToner.price = 1299.00;
        oldToner.discountPrice = undefined;
        oldToner.images = [
          "/c_peptide_serum.png",
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600"
        ];
        oldToner.description = "Skinimage C-Peptide Super Face Serum is an advanced anti-ageing and skin-repair formulation designed to lock in moisture, strengthen the skin barrier, and visibly reduce fine lines and wrinkles for smoother, firmer, and youthful-looking skin. This high-performance serum is powered by a multi-peptide complex including Acetyl Hexapeptide-8 and Copper Tripeptide-1 to help boost collagen production, improve skin elasticity, and minimize the appearance of expression lines, supported by Niacinamide to refine skin texture and strengthen the barrier, and Hyaluronic Acid to deeply hydrate and plump the skin. It is further enriched with Adenosine to help reduce wrinkles, Allantoin to soothe and calm the skin, Sodium PCA and Betaine to maintain optimal moisture balance, and Amino Acids to support skin repair and resilience. Lightweight and fast-absorbing, this serum works effectively as the first step of skincare to enhance skin smoothness, firmness, and overall radiance with consistent use.";
        oldToner.ingredients = [
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
        ];
        oldToner.benefits = [
          "Locks moisture and deeply hydrates skin.",
          "Helps reduce fine lines and wrinkles.",
          "Boosts collagen and improves elasticity.",
          "Strengthens skin barrier and texture.",
          "Promotes smoother and youthful-looking skin."
        ];
        oldToner.howToUse = "After cleansing, apply the serum evenly over the face, massage gently until absorbed, and use as the first step of your skincare routine.";
        oldToner.specs = { "Volume": "30ml", "Active Ingredients": "6-Peptide Complex", "Cruelty-Free": "Yes" };
        await oldToner.save();
        console.log('Successfully updated/verified C-Peptide Face Serum in MongoDB with the correct image.');
      }

      // Update Night Cream to Benzotree Face Wash if it exists
      const oldNightCream = await Product.findOne({ $or: [{ sku: "SK-RETINOL-NIGHT" }, { name: "0.3% Retinol Wrinkle Repair Night Cream" }, { sku: "SK-BENZOTREE-FW" }, { name: "Benzotree Face Wash with Benzoyl Peroxide & Tea Tree Oil | Acne & Breakout Control Face Wash" }] });
      if (oldNightCream) {
        oldNightCream.name = "Benzotree Face Wash with Benzoyl Peroxide & Tea Tree Oil | Acne & Breakout Control Face Wash";
        oldNightCream.sku = "SK-BENZOTREE-FW";
        oldNightCream.category = "Cleanser";
        oldNightCream.price = 885.00;
        oldNightCream.discountPrice = undefined;
        oldNightCream.images = [
          "/benzotree_face_wash.png"
        ];
        oldNightCream.description = "Skinimage Benzotree  Face Wash is a paraben-free facial cleanser formulated for oily and acne-prone skin, designed to help maintain skin clarity and freshness with a balanced cleansing approach, combining active and supportive ingredients that contribute to a clean, refreshed skin feel without excessive dryness, enriched with key ingredients such as Benzoyl Peroxide, Vitamin C, and Tea Tree Oil which are commonly used in formulations aimed at supporting clearer-looking skin and maintaining overall skin condition, along with a blend of cleansing agents and hydrating components that help remove impurities, excess oil, and buildup from the skin surface while keeping the skin feeling smooth and comfortable after every wash.";
        oldNightCream.ingredients = [
          "Benzoyl Peroxide",
          "Vitamin C",
          "Tea Tree Oil"
        ];
        oldNightCream.benefits = [
          "Helps support oil control for a less greasy skin feel throughout the day.",
          "Effectively cleanses dirt, impurities, and excess sebum from the skin surface.",
          "Maintains a refreshed and clean skin feel after every wash.",
          "Suitable for oily and acne-prone skin types.",
          "Leaves skin feeling balanced, smooth, and comfortable without over-drying."
        ];
        oldNightCream.howToUse = "Wet your face and apply a small amount of Skinimage Benzotree Face Wash. Gently massage for 10–20 seconds and rinse thoroughly with water.";
        oldNightCream.specs = { "Volume": "150ml", "Active Ingredients": "Benzoyl Peroxide 1%, Tea Tree Oil", "Cruelty-Free": "Yes" };
        await oldNightCream.save();
        console.log('Successfully updated/verified Benzotree Face Wash in MongoDB with the correct image.');
      }

      // Update Plumping Serum to PDRN Regenerating Serum if it exists
      const oldPlumpingSerum = await Product.findOne({ $or: [{ sku: "SK-HYALURONIC-PLUMP" }, { name: "Triple Hyaluronic Acid + B5 Plumping Serum" }, { sku: "SK-PDRN-SRM" }, { name: "PDRN Regenerating Serum with Peptides & Growth Factors | Advanced Skin Repair & Anti-Aging Serum" }] });
      if (oldPlumpingSerum) {
        oldPlumpingSerum.name = "PDRN Regenerating Serum with Peptides & Growth Factors | Advanced Skin Repair & Anti-Aging Serum";
        oldPlumpingSerum.sku = "SK-PDRN-SRM";
        oldPlumpingSerum.category = "Serum";
        oldPlumpingSerum.price = 1440.00;
        oldPlumpingSerum.discountPrice = undefined;
        oldPlumpingSerum.images = [
          "/pdrn_regenerating_serum.jpg",
          "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600"
        ];
        oldPlumpingSerum.description = "Skinimage PDRN Regenerating Serum (0.5% PDRN + 5% Acetyl Hexapeptide-8 + Copper Peptide + EGF + 5% Niacinamide) is a next-generation, clinical-grade skin repair serum. This advanced formula works at a deep cellular level to accelerate skin regeneration, visibly reduce fine lines and wrinkles, and restore skin firmness. If you are looking for a high-performance pdrn serum for skin repair for anti-aging remedies or post-procedure recovery, this advanced treatment is perfectly formulated to boost your skin's natural healing mechanism.\n\nThis serum features a powerful blend of anti-aging and barrier-repairing active ingredients: 0.5% PDRN (Polydeoxyribonucleotide) with DNA-repair technology to boost collagen, 5% Acetyl Hexapeptide-8 & Copper Peptides to smooth fine lines and wrinkles, EGF (Growth Factors) and Matrixyl® Peptide Complex to enhance skin elasticity and firmness, 5% Niacinamide to brighten skin tone and refine texture, 2% Ceramide Complex to restore the skin barrier, and Multi-Molecular Hyaluronic Acid & Polyglutamic Acid for deep multi-layer hydration. This formula is designed as the ultimate best anti aging serum for glowing skin, sagging skin, dehydration, and post-treatment (derma roller/peels) recovery.";
        oldPlumpingSerum.ingredients = [
          "0.5% PDRN (DNA Repair Tech) – Cell regeneration & deep skin repair",
          "5% Acetyl Hexapeptide-8 – \"Botox-like\" effect on expression lines & wrinkles",
          "Copper Peptide & EGF Growth Factors – Firmness, elasticity & collagen synthesis",
          "Matrixyl® Peptide Complex – Deep wrinkle reduction & skin tightening",
          "5% Niacinamide – Brightening, pore tightening & spot reduction",
          "2% Ceramide Complex – Restores protective skin barrier & prevents moisture loss",
          "2% Centella Asiatica & Drieline® – Calms redness & provides soothing defense",
          "1% Ectoin & Beta-Glucan – Environmental protection & intense hydration",
          "Multi-Molecular Hyaluronic Acid & Polyglutamic Acid – Multi-depth hydration"
        ];
        oldPlumpingSerum.benefits = [
          "Cellular Skin Regeneration: Formulated as an advanced pdrn serum for skin repair, it stimulates collagen and elastin synthesis to accelerate skin recovery.",
          "Reduces Fine Lines & Wrinkles: Peptides and EGF (Growth Factors) visibly plump the skin, smooth out expression lines, and improve skin elasticity.",
          "Ultimate Anti-Aging & Glow: Recognized as the best anti aging serum for glowing skin, it brightens dull complexions, tightens sagging skin, and refines texture.",
          "Strengthens Skin Barrier: 2% Ceramide Complex along with Ectoin and Beta-Glucan rebuilds the compromised skin barrier and locks in moisture.",
          "Soothes Post-Procedure Skin: Calms redness, sensitivity, and irritation following dermatological procedures like micro-needling, laser, or chemical peels."
        ];
        oldPlumpingSerum.howToUse = "Cleanse your face with a gentle cleanser and pat dry.\n\nApply 2–3 drops of Skinimage PDRN Serum onto your face and neck.\n\nGently pat with fingertips in upward motions until fully absorbed (do not rub harshly).\n\nFollow with your favorite moisturizer to lock in the actives.\n\nDaytime Routine: Always finish with a broad-spectrum sunscreen (SPF 30 or higher). Use twice daily (morning & night).";
        oldPlumpingSerum.specs = { "Volume": "30ml", "Active Ingredients": "0.5% PDRN, Peptides, EGF", "Cruelty-Free": "Yes" };
        await oldPlumpingSerum.save();
        console.log('Successfully updated/verified PDRN Regenerating Serum in MongoDB.');
      }

      // Update UV-Aurora Sunscreen images if they exist
      const sunScreen = await Product.findOne({ name: "UV-Aurora Sunscreen" });
      if (sunScreen) {
        sunScreen.images = [
          "/uv_aurora_sunscreen.png",
          "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600"
        ];
        sunScreen.description = "Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++ is an ultra-lightweight, fast-absorbing sunscreen formulated to provide broad-spectrum protection against UVA and UVB rays while delivering deep hydration and a non-greasy, water-light feel suitable for daily use. This advanced aqua sunscreen gel is powered by key ingredients such as Hyaluronic Acid to deeply hydrate and maintain skin moisture, Homosalate and Octyl Methoxy Cinnamate to provide effective UVB protection, Tinosorb M for broad-spectrum UVA and UVB defense, Zinc PCA to help balance oil and support skin clarity, Vitamin E for antioxidant protection, Kakadu Plum Extract to support skin radiance and environmental defense, Silk Protein Extract for a smooth and soft skin finish, Aristoflex AVC for lightweight gel texture, Allantoin to soothe and calm the skin, and Melanin to enhance photoprotection. Designed for all skin types, this sunscreen spreads effortlessly, absorbs quickly without white cast, and helps protect skin from sun damage, premature ageing, and dehydration when applied regularly as directed.";
        sunScreen.ingredients = [
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
        ];
        sunScreen.benefits = [
          "Provides broad-spectrum UVA and UVB protection.",
          "Hydrates skin with a lightweight aqua gel texture.",
          "Helps prevent sun damage and premature ageing.",
          "Non-greasy, fast-absorbing, and comfortable for daily use.",
          "Suitable for all skin types."
        ];
        sunScreen.howToUse = "Clean and pat dry the face, apply two finger-lengths of sunscreen to the face and neck, massage gently until absorbed, apply 20 minutes before sun exposure, and reapply every 2–3 hours for continued protection.";
        await sunScreen.save();
        console.log('Successfully updated/verified UV-Aurora Sunscreen in MongoDB.');
      }

      // Update Centella Soothing Recovery Gel images if they exist
      // Update Centella Soothing Recovery Gel to Gluta Foaming Facewash
      const centellaGel = await Product.findOne({ $or: [{ sku: "SK-CENTELLA-SOOTH" }, { name: "Centella Soothing Recovery Gel" }, { name: "Gluta Foaming Facewash" }] });
      if (centellaGel) {
        centellaGel.name = "Gluta Foaming Facewash";
        centellaGel.category = "Cleanser";
        centellaGel.price = 599.00;
        centellaGel.discountPrice = undefined;
        centellaGel.images = [
          "/centella_soothing_gel.png",
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
        ];
        centellaGel.description = "Skinimage Gluta Foaming Facewash is a gentle yet effective daily cleanser formulated to purify the skin, remove impurities, and enhance natural brightness while maintaining skin hydration and balance. This foaming facewash is enriched with key skin-beneficial ingredients such as Vitamin C to help brighten the complexion and support an even skin tone, Vitamin E to provide antioxidant protection and nourish the skin, Glutathione to support skin clarity and radiance, and Aloe Vera Extract to soothe, hydrate, and calm the skin during cleansing. Its mild foaming action helps lift dirt, excess oil, and pollutants without stripping moisture, making it suitable for regular use to achieve refreshed, clean, and visibly brighter skin. With consistent use, Skinimage Gluta Foaming Facewash helps promote clearer-looking skin, improved glow, and a smooth, healthy appearance.";
        centellaGel.ingredients = [
          "Vitamin C",
          "Vitamin E",
          "Glutathione",
          "Aloe Vera Extract"
        ];
        centellaGel.benefits = [
          "Gently cleanses and removes impurities.",
          "Helps brighten and clarify skin tone.",
          "Provides antioxidant and skin-nourishing support.",
          "Soothes and hydrates during cleansing.",
          "Suitable for daily facial cleansing."
        ];
        centellaGel.howToUse = "Wet face and hands, apply the facewash, massage gently in circular motions for about a minute, rinse with lukewarm water, and pat dry.";
        await centellaGel.save();
        console.log('Successfully updated/verified Gluta Foaming Facewash in MongoDB.');
      }

      // Update 100% Sugarcane Squalane Facial Oil to Milk Barrier Repair Hydrating Toner if it exists
      const squalaneOil = await Product.findOne({ $or: [{ sku: "SK-SQUALANE-OIL" }, { name: "100% Sugarcane Squalane Facial Oil" }, { name: "Milk Barrier Repair Hydrating Toner" }] });
      if (squalaneOil) {
        squalaneOil.name = "Milk Barrier Repair Hydrating Toner";
        squalaneOil.category = "Toner";
        squalaneOil.price = 1099.00;
        squalaneOil.discountPrice = 939.00;
        squalaneOil.images = [
          "/sugarcane_squalane_oil.jpg",
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
        ];
        squalaneOil.description = "Skinimage Milk Barrier Repair Hydrating Toner (Ceramide NP + Hyaluronic Acid + Snow Mushroom + Squalane + Meadowfoam Seed Oil) is an ultra-nourishing, milky-hydrating toner. It instantly replenishes skin moisture loss after cleansing, reduces transepidermal water loss (TEWL), and rebuilds the skin's natural protective barrier. If you are looking for an effective ceramide toner for skin barrier repair to treat a damaged barrier, irritation, or dehydration, this advanced milky formula is the ultimate hydrating base for your skincare routine.\n\nThis toner features a scientific blend of rich emollient oils, peptides, and hydrating active ingredients: Ceramide NP for skin barrier strengthening, Hyaluronic Acid & Tremella Fuciformis (Snow Mushroom) Extract for multi-layer deep hydration, Squalane & Meadowfoam Seed Oil to restore the skin's lipid barrier, Acetyl Tetrapeptide-11 to smooth fine lines and improve elasticity, and Green Tea & Camellia Japonica Flower Extracts for powerful antioxidant protection. Being completely fragrance-free and alcohol-free, it stands out as the best hydrating toner for dry skin, sensitive skin, and post-dermatological procedure care.";
        squalaneOil.ingredients = [
          "Ceramide NP – Essential lipid that repairs and fortifies the protective skin barrier",
          "Hyaluronic Acid – Attracts and holds moisture for surface plumpness",
          "Tremella Fuciformis (Snow Mushroom) Extract – Deep-penetrating natural hydrating agent",
          "Squalane & Meadowfoam Seed Oil – Lightweight emollient oils that lock in moisture",
          "Acetyl Tetrapeptide-11 – Anti-aging peptide that improves elasticity and firmness",
          "Green Tea & Camellia Japonica Extracts – Powerful antioxidants that calm redness and protect skin",
          "Vitamin E (Tocopherol) – Protects against environmental damage and oxidative stress"
        ];
        squalaneOil.benefits = [
          "Restores & Strengthens Skin Barrier: Formulated as an advanced ceramide toner for skin barrier repair, it reinforces the lipid layer to prevent moisture loss and skin sensitivity.",
          "Intense Multi-Layer Hydration: Recognized as the best hydrating toner for dry skin, Snow Mushroom and Hyaluronic Acid deeply quench dehydrated skin, leaving it plump and glowing.",
          "Milky & Nourishing Texture: Enriched with Squalane and Meadowfoam Seed Oil to deliver rich emollient comfort without feeling heavy or greasy.",
          "Smoothes Fine Lines & Boosts Elasticity: Acetyl Tetrapeptide-11 helps plump dehydration lines and improve overall skin texture.",
          "Preps Skin for Maximum Absorption: Prepares your skin barrier to absorb subsequent serums and moisturizers more effectively.",
          "Safe for Sensitive & Post-Procedure Skin: Completely fragrance-free, alcohol-free, essential oil-free, and non-comedogenic."
        ];
        squalaneOil.howToUse = "Cleanse your face with a gentle face wash and pat dry.\n\nDispense an adequate amount of toner onto a cotton pad or directly into the palms of clean hands.\n\nGently sweep or pat over your face and neck until fully absorbed (do not rinse).\n\nFollow with your favorite serum (like Skinimage PDRN Regenerating Serum) and moisturizer.\n\nUse twice daily (morning and evening).";
        squalaneOil.specs = { "Volume": "150ml", "pH Range": "5.5", "Cruelty-Free": "Yes", "Fragrance-Free": "Yes", "Alcohol-Free": "Yes" };
        await squalaneOil.save();
        console.log('Successfully updated/verified Milk Barrier Repair Hydrating Toner in MongoDB.');
      }

      // Update AHA & BHA Face Serum details if they exist
      const faceSerum = await Product.findOne({ $or: [{ sku: "SK-VITC-GLOW" }, { name: "AHA & BHA FACE SERUM" }, { name: "Clinq 10% AHA BHA Face Serum" }, { name: "10% AHA BHA Face Serum" }, { name: "AHA & BHA Face Serum" }] });
      if (faceSerum) {
        faceSerum.name = "AHA & BHA Face Serum";
        faceSerum.description = "AHA & BHA Face Serum is an advanced exfoliating skincare formulation designed to remove dead skin cells, refine skin texture, and promote a clearer, brighter, and more youthful complexion with regular use. This resurfacing serum is powered by a potent blend of AHA and BHA actives, featuring Glycolic Acid to gently exfoliate and reduce fine lines, Betaine Salicylate to unclog pores and improve acne-prone skin, and Alpha Arbutin to help reduce pigmentation and uneven skin tone. It is further enriched with Niacinamide to strengthen the skin barrier and enhance radiance, Ascorbyl Glucoside for antioxidant protection and brightening, Sodium Hyaluronate for deep hydration, Panthenol and Allantoin to soothe and repair the skin, and fruit extracts such as Kiwi Fruit Extract, Dragon Fruit Extract, and Sea Buckthorn Extract to nourish the skin with natural antioxidants. Lightweight and fast-absorbing, this serum helps improve skin clarity, smoothness, and glow, making it suitable for those seeking radiant, youthful-looking skin when used as directed.";
        faceSerum.ingredients = [
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
        ];
        faceSerum.benefits = [
          "Gently exfoliates and removes dead skin cells.",
          "Helps reduce fine lines and uneven texture.",
          "Unclogs pores and supports clearer skin.",
          "Brightens skin tone and improves radiance.",
          "Hydrates and soothes the skin barrier."
        ];
        faceSerum.howToUse = "After cleansing, apply a few drops to the face, gently massage until absorbed, and use as directed, preferably at night.";
        faceSerum.images = [
          "/aha_bha_face_serum.jpg",
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
        ];
        await faceSerum.save();
        console.log('Successfully updated/verified AHA & BHA Face Serum in MongoDB.');
      }

      // Update AHA BHA Face Wash details if they exist
      const faceWash = await Product.findOne({ name: "AHA BHA Face Wash" });
      if (faceWash) {
        faceWash.images = [
          "/aha_bha_face_wash.jpg",
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
        ];
        faceWash.description = "Skinimage AHA & BHA Face Wash Acne & Oil Control Gentle Face Cleanser (Niacinamide 5% + Salicylic Acid 2% + Zinc PCA 1%) is a dermatologist-tested, skin-barrier friendly daily foaming cleanser. This formula deeply purifies pores, removes blackheads, and reduces acne-causing bacteria. If you are looking for an effective salicylic acid face wash for acne that deeply cleanses without drying out the skin, this cleanser is the perfect solution. Its balanced pH 5.5 protects the skin's natural protective barrier.\n\nThis cleanser is enriched with high-performance active ingredients: Niacinamide (5%) to brighten skin tone and improve texture, Salicylic Acid (2%) to deeply unclog pores, and Zinc PCA (1%) to control excess oil and sebum. This formula is specially formulated to be the best face wash for oily skin, combination, and acne-prone skin types. The inclusion of Centella Asiatica (Cica) & Green Tea Extract helps calm inflammation and redness, while Sodium Hyaluronate and Panthenol (Pro-Vitamin B5) keep the skin hydrated and smooth.";
        faceWash.ingredients = [
          "Salicylic Acid (2%) – Deep pore cleansing, exfoliation & acne control",
          "Niacinamide (5%) – Sebum balance, spot reduction & skin brightening",
          "Zinc PCA (1%) – Oil control & anti-bacterial defense",
          "Panthenol / Pro-Vitamin B5 (2%) – Skin barrier restoration & hydration",
          "Betaine (2%) – Moisture retention & smoothing",
          "Centella Asiatica Extract (2%) – Redness reduction & skin calming",
          "Green Tea Extract (1%) – Antioxidant protection & oil regulation",
          "Sodium Hyaluronate (0.2%) – Deep & lightweight hydration",
          "Allantoin (0.5%) – Anti-irritation & soothing"
        ];
        faceWash.benefits = [
          "Deep Pore Cleansing: Actively works as a powerful salicylic acid face wash for acne, clearing dead skin cells, unclogging pores, and preventing pimples.",
          "Oil & Sebum Control: Formulated to be the best face wash for oily skin, regulating shine and excess sebum production throughout the day.",
          "Blemish & Spot Reduction: Fades dark spots, improves uneven skin tone, and restores natural radiance.",
          "Soothes Irritated Skin: Centella Asiatica and Green Tea extracts calm active acne redness, irritation, and inflammation.",
          "Maintains pH 5.5 Balance: Gentle on the skin barrier, keeping skin hydrated, soft, and non-stripping after every wash."
        ];
        faceWash.howToUse = "Wet your face and neck with lukewarm water.\n\nApply a sufficient quantity onto damp palms and gently work into a soft lather.\n\nMassage gently onto the face in circular motions for 30–60 seconds, paying extra attention to oil-prone areas (T-zone).\n\nRinse thoroughly with water and gently pat dry.\n\nUse twice daily (morning and evening) for optimal results or as directed by a dermatologist.";
        await faceWash.save();
        console.log('Successfully updated/verified AHA BHA Face Wash in MongoDB with the correct image and details.');
      }
    }
  } catch (err) {
    console.warn("Could not seed MongoDB:", err.message);
  }
};

// Unified Database Helpers
const dbHelper = {
  // Products
  findProducts: async (filters = {}, sort = {}) => {
    if (getDBMode()) {
      const data = readLocalDB();
      let list = [...data.products];
      
      // Filter logic
      if (filters.category) {
        list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.skinType) {
        list = list.filter(p => p.skinType.some(s => s.toLowerCase() === filters.skinType.toLowerCase()));
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (filters.isFeatured !== undefined) {
        list = list.filter(p => p.isFeatured === filters.isFeatured);
      }
      if (filters.isBestSeller !== undefined) {
        list = list.filter(p => p.isBestSeller === filters.isBestSeller);
      }
      if (filters.isNewArrival !== undefined) {
        list = list.filter(p => p.isNewArrival === filters.isNewArrival);
      }
      
      // Sort logic
      if (sort.price === 1) list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      if (sort.price === -1) list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      if (sort.rating === -1) list.sort((a, b) => b.rating - a.rating);

      return list;
    } else {
      let query = {};
      if (filters.category) query.category = new RegExp('^' + filters.category + '$', 'i');
      if (filters.skinType) query.skinType = new RegExp('^' + filters.skinType + '$', 'i');
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }
      if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
      if (filters.isBestSeller !== undefined) query.isBestSeller = filters.isBestSeller;
      if (filters.isNewArrival !== undefined) query.isNewArrival = filters.isNewArrival;

      return await Product.find(query).sort(sort);
    }
  },

  findProductById: async (id) => {
    if (getDBMode()) {
      const data = readLocalDB();
      return data.products.find(p => p.id === id || p._id === id);
    } else {
      return await Product.findById(id);
    }
  },

  saveProduct: async (productData) => {
    if (getDBMode()) {
      const data = readLocalDB();
      const existingIdx = data.products.findIndex(p => p.id === productData.id || p._id === productData.id);
      if (existingIdx >= 0) {
        data.products[existingIdx] = { ...data.products[existingIdx], ...productData };
      } else {
        const newProduct = {
          id: 'p_' + Math.random().toString(36).substr(2, 9),
          _id: 'p_' + Math.random().toString(36).substr(2, 9),
          rating: 5,
          reviewsCount: 0,
          ...productData
        };
        data.products.push(newProduct);
        productData = newProduct;
      }
      writeLocalDB(data);
      return productData;
    } else {
      if (productData._id || productData.id) {
        const id = productData._id || productData.id;
        return await Product.findByIdAndUpdate(id, productData, { new: true });
      } else {
        return await Product.create(productData);
      }
    }
  },

  deleteProduct: async (id) => {
    if (getDBMode()) {
      const data = readLocalDB();
      data.products = data.products.filter(p => p.id !== id && p._id !== id);
      writeLocalDB(data);
      return true;
    } else {
      await Product.findByIdAndDelete(id);
      return true;
    }
  },

  // Users
  findUserByEmail: async (email) => {
    if (getDBMode()) {
      const data = readLocalDB();
      return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      return await User.findOne({ email });
    }
  },

  findUserById: async (id) => {
    if (getDBMode()) {
      const data = readLocalDB();
      return data.users.find(u => u.id === id || u._id === id);
    } else {
      return await User.findById(id);
    }
  },

  createUser: async (userData) => {
    if (getDBMode()) {
      const data = readLocalDB();
      const newUser = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        _id: 'u_' + Math.random().toString(36).substr(2, 9),
        addresses: [],
        wishlist: [],
        createdAt: new Date(),
        ...userData
      };
      data.users.push(newUser);
      writeLocalDB(data);
      return newUser;
    } else {
      return await User.create(userData);
    }
  },

  updateUser: async (id, userData) => {
    if (getDBMode()) {
      const data = readLocalDB();
      const idx = data.users.findIndex(u => u.id === id || u._id === id);
      if (idx >= 0) {
        data.users[idx] = { ...data.users[idx], ...userData };
        writeLocalDB(data);
        return data.users[idx];
      }
      return null;
    } else {
      return await User.findByIdAndUpdate(id, userData, { new: true });
    }
  },

  // Orders
  createOrder: async (orderData) => {
    if (getDBMode()) {
      const data = readLocalDB();
      const newOrder = {
        id: 'o_' + Math.random().toString(36).substr(2, 9),
        _id: 'o_' + Math.random().toString(36).substr(2, 9),
        status: 'Placed',
        createdAt: new Date(),
        ...orderData
      };
      data.orders.push(newOrder);
      // Deduct inventory
      newOrder.items.forEach(item => {
        const prod = data.products.find(p => p.id === item.productId || p._id === item.productId);
        if (prod) prod.stock = Math.max(0, prod.stock - item.quantity);
      });
      writeLocalDB(data);
      return newOrder;
    } else {
      // Deduct inventory in mongoose
      const newOrder = await Order.create(orderData);
      for (const item of orderData.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
      }
      return newOrder;
    }
  },

  findOrders: async (query = {}) => {
    if (getDBMode()) {
      const data = readLocalDB();
      let list = [...data.orders];
      if (query.userId) {
        list = list.filter(o => o.userId === query.userId);
      }
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return list;
    } else {
      return await Order.find(query).sort({ createdAt: -1 });
    }
  },

  findOrderById: async (id) => {
    if (getDBMode()) {
      const data = readLocalDB();
      return data.orders.find(o => o.id === id || o._id === id);
    } else {
      return await Order.findById(id);
    }
  },

  updateOrder: async (id, updates) => {
    if (getDBMode()) {
      const data = readLocalDB();
      const idx = data.orders.findIndex(o => o.id === id || o._id === id);
      if (idx >= 0) {
        data.orders[idx] = { ...data.orders[idx], ...updates };
        writeLocalDB(data);
        return data.orders[idx];
      }
      return null;
    } else {
      return await Order.findByIdAndUpdate(id, updates, { new: true });
    }
  },

  // Coupons
  findCouponByCode: async (code) => {
    const qCode = code.toUpperCase();
    if (getDBMode()) {
      const data = readLocalDB();
      return data.coupons.find(c => c.code === qCode);
    } else {
      return await Coupon.findOne({ code: qCode });
    }
  },

  getCoupons: async () => {
    if (getDBMode()) {
      const data = readLocalDB();
      return data.coupons;
    } else {
      return await Coupon.find();
    }
  },

  saveCoupon: async (couponData) => {
    if (getDBMode()) {
      const data = readLocalDB();
      const existingIdx = data.coupons.findIndex(c => c.code === couponData.code.toUpperCase());
      if (existingIdx >= 0) {
        data.coupons[existingIdx] = { ...data.coupons[existingIdx], ...couponData };
      } else {
        data.coupons.push(couponData);
      }
      writeLocalDB(data);
      return couponData;
    } else {
      return await Coupon.findOneAndUpdate({ code: couponData.code.toUpperCase() }, couponData, { upsert: true, new: true });
    }
  },

  deleteCoupon: async (code) => {
    if (getDBMode()) {
      const data = readLocalDB();
      data.coupons = data.coupons.filter(c => c.code !== code.toUpperCase());
      writeLocalDB(data);
      return true;
    } else {
      await Coupon.findOneAndDelete({ code: code.toUpperCase() });
      return true;
    }
  },

  // Reviews
  createReview: async (reviewData) => {
    if (getDBMode()) {
      const data = readLocalDB();
      const newReview = {
        id: 'r_' + Math.random().toString(36).substr(2, 9),
        _id: 'r_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        ...reviewData
      };
      data.reviews.push(newReview);
      
      // Update product rating average
      const prod = data.products.find(p => p.id === reviewData.productId || p._id === reviewData.productId);
      if (prod) {
        const prodReviews = data.reviews.filter(r => r.productId === reviewData.productId);
        const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
        prod.rating = parseFloat((totalRating / prodReviews.length).toFixed(1));
        prod.reviewsCount = prodReviews.length;
      }
      
      writeLocalDB(data);
      return newReview;
    } else {
      const newReview = await Review.create(reviewData);
      // Recalculate average rating
      const reviews = await Review.find({ productId: reviewData.productId });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(reviewData.productId, {
        rating: parseFloat(avgRating.toFixed(1)),
        $inc: { reviewsCount: 1 }
      });
      return newReview;
    }
  },

  findReviewsByProduct: async (productId) => {
    if (getDBMode()) {
      const data = readLocalDB();
      return data.reviews.filter(r => r.productId === productId);
    } else {
      return await Review.find({ productId }).sort({ createdAt: -1 });
    }
  },

  saveAnalysisReport: async (reportData) => {
    if (getDBMode()) {
      const data = readLocalDB();
      const newReport = {
        id: 'rep_' + Math.random().toString(36).substr(2, 9),
        _id: 'rep_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        ...reportData
      };
      if (!data.analysisReports) data.analysisReports = [];
      data.analysisReports.push(newReport);
      writeLocalDB(data);
      return newReport;
    } else {
      return await AnalysisReport.create(reportData);
    }
  },

  findAnalysisReportsByUserId: async (userId) => {
    if (getDBMode()) {
      const data = readLocalDB();
      return (data.analysisReports || []).filter(r => r.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      return await AnalysisReport.find({ userId }).sort({ createdAt: -1 });
    }
  },

  seedMongoDB
};

module.exports = dbHelper;
module.exports.User = User;
module.exports.Product = Product;
module.exports.Order = Order;
module.exports.Coupon = Coupon;
module.exports.Review = Review;
module.exports.AnalysisReport = AnalysisReport;
