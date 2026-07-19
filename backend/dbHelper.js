const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
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
    isNewArrival: false
  },
  {
    id: "p2",
    sku: "SK-VITC-GLOW",
    name: "AHA & BHA FACE SERUM",
    category: "Serum",
    price: 1199.00,
    discountPrice: 899.00,
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
    isNewArrival: false
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
    isNewArrival: false
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
    isNewArrival: false
  }
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
      // Update Squalane Cleanser images to include CleanserVideo.mp4 if missing
      const targetName = "Oil Cleanser with Squalane & Jojoba Oil | Removes Makeup & Sunscreen, Non-Greasy";
      const product = await Product.findOne({ name: targetName });
      if (product && !product.images.includes("/CleanserVideo.mp4")) {
        product.images = [
          "/cleanser.png",
          "/CleanserVideo.mp4",
          "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"
        ];
        await product.save();
        console.log('Successfully updated Squalane Cleanser in MongoDB with the video.');
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
        oldToner.description = "C-Peptide Face Serum is the name in age-defying skincare. Its advanced 6-Peptide Complex formula works deep within the skin's layers, keeping your skin firm, hydrated, and youthful.";
        oldToner.ingredients = [
          "6 Peptide Complex — Boosts collagen production",
          "Hyaluronic Acid — Provides deep hydration, locks in moisture",
          "Niacinamide — Strengthens the skin barrier",
          "Allantoin — Soothes and repairs skin"
        ];
        oldToner.benefits = [
          "Locks moisture into skin cells",
          "Visibly reduces fine lines and wrinkles",
          "Promotes natural collagen production",
          "Makes skin plump, firm, and youthful"
        ];
        oldToner.howToUse = "Apply 3–4 drops of the serum to a clean face—morning or night—before your moisturizer.";
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
        oldNightCream.description = "The best solution for acne-prone skin — Benzotree Face Wash. Specially formulated to target breakouts, excess oil, and clogged pores.";
        oldNightCream.ingredients = [
          "Benzoyl Peroxide 1% — fights acne-causing bacteria",
          "Vitamin C — helps with skin brightening and healing",
          "Tea Tree Oil — natural antibacterial properties, controls oil",
          "Vitamin E — soothes and nourishes the skin"
        ];
        oldNightCream.benefits = [
          "Controls excess oil",
          "Clears clogged pores",
          "Works effectively on active breakouts",
          "Treats mild to moderate acne"
        ];
        oldNightCream.howToUse = "Wet your face, take a small amount, gently massage for 1 minute, then rinse off. Use 1-2 times a day (to avoid over-drying)";
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
        oldPlumpingSerum.description = "Give your skin the tools to repair and renew itself with PDRN Regenerating Serum — an advanced formula built on DNA repair technology and clinically studied peptides. Designed for anyone looking to restore firmness, improve elasticity, and support long-term skin recovery.";
        oldPlumpingSerum.ingredients = [
          "0.5% PDRN (Polydeoxyribonucleotide) — DNA repair technology that supports skin regeneration",
          "5% Acetyl Hexapeptide-8 — helps smooth the look of expression lines",
          "Copper Peptide Complex — supports collagen and elastin production",
          "Growth Factor Technology (EGF) — aids skin renewal and repair",
          "Matrixyl Peptide Complex, 5% Niacinamide, 2% Ceramide Complex — strengthen and even out the skin",
          "2% Centella Asiatica, 2% Panthenol (Pro-Vitamin B5), 1% Ectoin, 1% Beta-Glucan — soothe and hydrate",
          "Multi Molecular Hyaluronic Acid & Polyglutamic Acid — deep, multi-level hydration"
        ];
        oldPlumpingSerum.benefits = [
          "Advanced skin regeneration and repair",
          "Supports collagen and elastin synthesis for firmer, younger-looking skin",
          "Helps reduce the appearance of fine lines and wrinkles",
          "Deeply hydrates and improves skin elasticity",
          "Restores and strengthens the skin's protective barrier",
          "Calms redness and supports recovery after dermatological or aesthetic procedures",
          "Improves overall skin texture, radiance, and quality",
          "Suitable for ageing, dehydrated, sensitive, and post-procedure skin"
        ];
        oldPlumpingSerum.howToUse = "After cleansing and toning, apply 2-3 drops evenly over the face and neck. Gently pat until fully absorbed. Follow with a moisturizer. During the day, use a broad-spectrum sunscreen (SPF 30 or higher). Use morning and evening, or as directed by your dermatologist.";
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
        await sunScreen.save();
        console.log('Successfully updated/verified UV-Aurora Sunscreen in MongoDB.');
      }

      // Update Centella Soothing Recovery Gel images if they exist
      const centellaGel = await Product.findOne({ name: "Centella Soothing Recovery Gel" });
      if (centellaGel) {
        centellaGel.images = [
          "/centella_soothing_gel.png",
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
        ];
        await centellaGel.save();
        console.log('Successfully updated/verified Centella Soothing Recovery Gel in MongoDB.');
      }

      // Update 100% Sugarcane Squalane Facial Oil images if they exist
      const squalaneOil = await Product.findOne({ name: "100% Sugarcane Squalane Facial Oil" });
      if (squalaneOil) {
        squalaneOil.images = [
          "/sugarcane_squalane_oil.jpg",
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
        ];
        await squalaneOil.save();
        console.log('Successfully updated/verified 100% Sugarcane Squalane Facial Oil in MongoDB.');
      }

      // Update AHA & BHA FACE SERUM images if they exist
      const faceSerum = await Product.findOne({ name: "AHA & BHA FACE SERUM" });
      if (faceSerum) {
        faceSerum.images = [
          "/aha_bha_face_serum.jpg",
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600"
        ];
        await faceSerum.save();
        console.log('Successfully updated/verified AHA & BHA FACE SERUM in MongoDB.');
      }

      // Update AHA BHA Face Wash images if they exist
      const faceWash = await Product.findOne({ name: "AHA BHA Face Wash" });
      if (faceWash) {
        faceWash.images = [
          "/aha_bha_face_wash.jpg",
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
        ];
        await faceWash.save();
        console.log('Successfully updated/verified AHA BHA Face Wash in MongoDB.');
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
