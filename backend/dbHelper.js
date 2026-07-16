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

// Register models
const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Coupon = mongoose.model('Coupon', CouponSchema);
const Review = mongoose.model('Review', ReviewSchema);

// Initial 9 Products dummy data
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
    isNewArrival: false
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
    isNewArrival: true
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
    isNewArrival: false
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
    isNewArrival: true
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
    isNewArrival: false
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
    isNewArrival: true
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
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading local db file, resetting...", error);
    return { users: [], products: DUMMY_PRODUCTS, orders: [], coupons: [], reviews: [] };
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

  seedMongoDB
};

module.exports = dbHelper;
module.exports.User = User;
module.exports.Product = Product;
module.exports.Order = Order;
module.exports.Coupon = Coupon;
module.exports.Review = Review;
