export interface ProductType {
  _id: string;
  id?: string;
  sku: string;
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
  ingredients?: string[];
  benefits?: string[];
  howToUse?: string;
  specs?: Record<string, string>;
  reviews?: any[];
}

export const FALLBACK_PRODUCTS: ProductType[] = [
  {
    _id: "p1",
    sku: "SK-HYDRA-FW",
    name: "Oil Cleanser with Squalane & Jojoba Oil | Removes Makeup & Sunscreen, Non-Greasy",
    category: "Cleanser",
    price: 1329.00,
    stock: 85,
    images: ["/cleanser.png"],
    description: "Oil Cleanser is the perfect first step in your double-cleansing routine. It effortlessly melts away stubborn makeup, sunscreen, and impurities, while nourishing your skin barrier — leaving your face soft, hydrated, and never greasy.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
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
    specs: { "Volume": "100ml", "pH Range": "5.5 - 6.0", "Cruelty-Free": "Yes", "Formulation": "Oil-to-milk" }
  },
  {
    _id: "p2",
    sku: "SK-VITC-GLOW",
    name: "AHA & BHA FACE SERUM",
    category: "Serum",
    price: 899.00,
    stock: 50,
    images: ["/aha_bha_face_serum.jpg"],
    description: "Give your skin a fresh new glow with this powerful AHA BHA Face Serum. Specially formulated for those struggling with dull, rough, and uneven skin texture.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    specs: { "Volume": "30ml", "Active Ingredients": "10% AHA BHA Complex", "Cruelty-Free": "Yes", "Fragrance-Free": "Yes" }
  },
  {
    _id: "p3",
    sku: "SK-NIACIN-MOIST",
    name: "UV-Aurora Sunscreen",
    category: "Sunscreen",
    price: 798.00,
    stock: 120,
    images: ["/uv_aurora_sunscreen.png"],
    description: "Skinimage UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++ is an ultra-lightweight, fast-absorbing sunscreen formulated to provide broad-spectrum protection against UVA and UVB rays while delivering deep hydration and a non-greasy, water-light feel suitable for daily use. This advanced aqua sunscreen gel is powered by key ingredients such as Hyaluronic Acid to deeply hydrate and maintain skin moisture, Homosalate and Octyl Methoxy Cinnamate to provide effective UVB protection, Tinosorb M for broad-spectrum UVA and UVB defense, Zinc PCA to help balance oil and support skin clarity, Vitamin E for antioxidant protection, Kakadu Plum Extract to support skin radiance and environmental defense, Silk Protein Extract for a smooth and soft skin finish, Aristoflex AVC for lightweight gel texture, Allantoin to soothe and calm the skin, and Melanin to enhance photoprotection. Designed for all skin types, this sunscreen spreads effortlessly, absorbs quickly without white cast, and helps protect skin from sun damage, premature ageing, and dehydration when applied regularly as directed.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    specs: { "Volume": "50gm", "Protection": "SPF 50 / PA++++", "Cruelty-Free": "Yes", "Non-Comedogenic": "Yes" }
  },
  {
    _id: "p4",
    sku: "SK-BENZOTREE-FW",
    name: "Benzotree Face Wash with Benzoyl Peroxide & Tea Tree Oil | Acne & Breakout Control Face Wash",
    category: "Cleanser",
    price: 885.00,
    stock: 45,
    images: ["/benzotree_face_wash.png"],
    description: "The best solution for acne-prone skin — Benzotree Face Wash. Specially formulated to target breakouts, excess oil, and clogged pores.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    specs: { "Volume": "100ml", "Active Ingredients": "Benzoyl Peroxide 1%, Tea Tree Oil", "Cruelty-Free": "Yes" }
  },
  {
    _id: "p5",
    sku: "SK-CPEPTIDE-SRM",
    name: "C-Peptide Face Serum",
    category: "Serum",
    price: 1299.00,
    stock: 90,
    images: ["/c_peptide_serum.png"],
    description: "Skinimage C-Peptide Super Face Serum is an advanced anti-ageing and skin-repair formulation designed to lock in moisture, strengthen the skin barrier, and visibly reduce fine lines and wrinkles for smoother, firmer, and youthful-looking skin. This high-performance serum is powered by a multi-peptide complex including Acetyl Hexapeptide-8 and Copper Tripeptide-1 to help boost collagen production, improve skin elasticity, and minimize the appearance of expression lines, supported by Niacinamide to refine skin texture and strengthen the barrier, and Hyaluronic Acid to deeply hydrate and plump the skin. It is further enriched with Adenosine to help reduce wrinkles, Allantoin to soothe and calm the skin, Sodium PCA and Betaine to maintain optimal moisture balance, and Amino Acids to support skin repair and resilience. Lightweight and fast-absorbing, this serum works effectively as the first step of skincare to enhance skin smoothness, firmness, and overall radiance with consistent use.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    specs: { "Volume": "30ml", "Active Ingredients": "6-Peptide Complex", "Cruelty-Free": "Yes" }
  },
  {
    _id: "p6",
    sku: "SK-PDRN-SRM",
    name: "PDRN Regenerating Serum with Peptides & Growth Factors | Advanced Skin Repair & Anti-Aging Serum",
    category: "Serum",
    price: 1440.00,
    stock: 110,
    images: ["/pdrn_regenerating_serum.jpg"],
    description: "Give your skin the tools to repair and renew itself with PDRN Regenerating Serum — an advanced formula built on DNA repair technology and clinically studied peptides. Designed for anyone looking to restore firmness, improve elasticity, and support long-term skin recovery.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    specs: { "Volume": "30ml", "Active Ingredients": "0.5% PDRN, Peptides, EGF", "Cruelty-Free": "Yes" }
  },
  {
    _id: "p7",
    sku: "SK-CENTELLA-SOOTH",
    name: "Gluta Foaming Facewash",
    category: "Cleanser",
    price: 599.00,
    stock: 75,
    images: ["/Gluta_foming.png"],
    description: "Skinimage Gluta Foaming Facewash is a gentle yet effective daily cleanser formulated to purify the skin, remove impurities, and enhance natural brightness while maintaining skin hydration and balance. This foaming facewash is enriched with key skin-beneficial ingredients such as Vitamin C to help brighten the complexion and support an even skin tone, Vitamin E to provide antioxidant protection and nourish the skin, Glutathione to support skin clarity and radiance, and Aloe Vera Extract to soothe, hydrate, and calm the skin during cleansing. Its mild foaming action helps lift dirt, excess oil, and pollutants without stripping moisture, making it suitable for regular use to achieve refreshed, clean, and visibly brighter skin. With consistent use, Skinimage Gluta Foaming Facewash helps promote clearer-looking skin, improved glow, and a smooth, healthy appearance.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    specs: { "Volume": "100ml", "Cruelty-Free": "Yes", "Fragrance-Free": "Yes", "Hypoallergenic": "Yes" }
  },
  {
    _id: "p8",
    sku: "SK-SPF50-SUN",
    name: "AHA BHA Face Wash",
    category: "Cleanser",
    price: 799.00,
    stock: 150,
    images: ["https://res.cloudinary.com/qm72f5jf/image/upload/v1785754356/Untitled_design_1_zln5if.png"],
    description: "Meet your new daily essential — AHA BHA Face Wash, formulated to tackle uneven skin tone, acne, and excess oil all in one step, without stripping your skin.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    specs: { "Volume": "100ml", "pH Range": "5.5 - 6.0", "Cruelty-Free": "Yes", "Fragrance-Free": "Yes" }
  },
  {
    _id: "p9",
    sku: "SK-SQUALANE-OIL",
    name: "Milk Barrier Repair Hydrating Toner",
    category: "Toner",
    price: 1099.00,
    discountPrice: 939.00,
    stock: 60,
    images: ["/milk_barrier_repair_toner.png"],
    description: "Skinimage Milk Barrier Repair Hydrating Toner (Ceramide NP + Hyaluronic Acid + Snow Mushroom + Squalane + Meadowfoam Seed Oil) is an ultra-nourishing, milky-hydrating toner. It instantly replenishes skin moisture loss after cleansing, reduces transepidermal water loss (TEWL), and rebuilds the skin's natural protective barrier. If you are looking for an effective ceramide toner for skin barrier repair to treat a damaged barrier, irritation, or dehydration, this advanced milky formula is the ultimate hydrating base for your skincare routine.\n\nThis toner features a scientific blend of rich emollient oils, peptides, and hydrating active ingredients: Ceramide NP for skin barrier strengthening, Hyaluronic Acid & Tremella Fuciformis (Snow Mushroom) Extract for multi-layer deep hydration, Squalane & Meadowfoam Seed Oil to restore the skin's lipid barrier, Acetyl Tetrapeptide-11 to smooth fine lines and improve elasticity, and Green Tea & Camellia Japonica Flower Extracts for powerful antioxidant protection. Being completely fragrance-free and alcohol-free, it stands out as the best hydrating toner for dry skin, sensitive skin, and post-dermatological procedure care.",
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    specs: { "Volume": "100ml", "pH Range": "5.5", "Cruelty-Free": "Yes", "Fragrance-Free": "Yes", "Alcohol-Free": "Yes" }
  }
];
