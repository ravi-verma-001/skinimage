import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: "Our Blog | Skincare Insights & Science | Skinimage",
  description: "Explore the Skinimage Journal. Clinical guides, ingredient breakdowns, and dermatologist-recommended routines to help you achieve your healthiest skin.",
  keywords: ["skincare blog", "skincare tips", "how to layer serums", "skincare education", "active ingredients guide"],
};

export const BLOG_POSTS = [
  {
    slug: "pdrn-regenerating-serum-benefits",
    title: "PDRN Regenerating Serum: The Complete Guide to Skin Repair, Hydration & Healthy-Looking Skin",
    category: "Science",
    excerpt: "Modern skincare is focused on barrier repair. Learn how Skin Image PDRN Regenerating Serum with 0.5% PDRN, copper peptides, and ceramides supports hydrated, firmer-looking skin.",
    date: "July 26, 2026",
    readTime: "6 min read",
    image: "/PDRNIMAGE.png",
    author: "Dr. Ananya Verma, MD",
    content: `
      <p class="mb-4">Modern skincare is no longer just about moisturizing—it focuses on supporting the skin barrier, maintaining hydration, and improving the overall appearance of the skin. One ingredient gaining attention in advanced skincare is <strong>PDRN (Polydeoxyribonucleotide)</strong>, often combined with peptides, ceramides, niacinamide, and hyaluronic acid in premium skincare formulations.</p>
      <p class="mb-4"><strong>Skin Image PDRN Regenerating Serum</strong> is an advanced facial serum designed to support skin hydration, strengthen the skin barrier, and improve the appearance of fine lines, uneven texture, and dull-looking skin. Its lightweight formula combines multiple skin-conditioning ingredients that work together as part of a consistent skincare routine.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">What is PDRN?</h3>
      <p class="mb-4">PDRN (Polydeoxyribonucleotide) is an ingredient used in advanced cosmetic skincare formulations. It is commonly included in products designed to support the appearance of healthier-looking skin by complementing the skin's natural renewal process. When combined with peptides, ceramides, and hydrating ingredients, PDRN-based skincare products can help improve the overall appearance of the skin while supporting hydration and barrier care.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Key Ingredients & Their Benefits</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>0.5% PDRN:</strong> Supports the skin's natural renewal process, promoting smoother-looking skin.</li>
        <li><strong>Matrixyl® & Copper Peptides:</strong> Advanced peptide complexes that target skin elasticity, firmness, and overall skin texture.</li>
        <li><strong>5% Niacinamide:</strong> Multi-functional B3 vitamin that improves uneven skin tone, targets dark spots, and reduces visible pores.</li>
        <li><strong>2% Ceramide Complex:</strong> Mimics natural skin lipids to lock in moisture, reduce dryness, and strengthen the barrier.</li>
        <li><strong>Centella Asiatica & Ectoin:</strong> Calm dry skin, soothe inflammation, and maintain cellular hydration.</li>
        <li><strong>Hyaluronic & Polyglutamic Acids:</strong> Retain moisture within skin layers for a softer and plumper appearance.</li>
      </ul>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">How to Use PDRN Regenerating Serum</h3>
      <ol class="list-decimal pl-6 mb-6 space-y-3">
        <li>Cleanse your face using a gentle face wash.</li>
        <li>Apply 2–3 drops of the serum to the face and neck.</li>
        <li>Gently pat into the skin until absorbed.</li>
        <li>Follow with a moisturizer (morning and evening).</li>
        <li>During the daytime, always finish with a broad-spectrum sunscreen (SPF 30 or higher).</li>
      </ol>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Frequently Asked Questions (FAQs)</h3>
      <div class="space-y-4 mb-6">
        <div>
          <strong class="text-stone-900 text-sm">Can I use this serum every day?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Yes. It is designed for regular use as part of your daily skincare routine (both morning and night).</p>
        </div>
        <div>
          <strong class="text-stone-900 text-sm">Should sunscreen be used with this serum?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Yes. During the daytime, sunscreen should always be the final step in your routine to protect your skin barrier.</p>
        </div>
        <div>
          <strong class="text-stone-900 text-sm">Should I apply moisturizer after?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Yes, applying a moisturizer helps seal in the active peptides and lock in hydration.</p>
        </div>
      </div>
    `
  },
  {
    slug: "uv-aurora-hyaluronic-acid-aqua-sunscreen-spf50-benefits",
    title: "UV-Aurora 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++: Your Complete Guide to Daily Sun Protection",
    category: "Routines",
    excerpt: "Daily sunscreen is one of the most important steps in any skincare routine. Discover the benefits, ingredients, and how to use UV-Aurora Aqua Sunscreen Gel.",
    date: "July 26, 2026",
    readTime: "6 min read",
    image: "/uv_aurora_sunscreen.png",
    author: "Dr. Ananya Verma, MD",
    content: `
      <p class="mb-4">Daily sunscreen is one of the most important steps in any skincare routine. Whether you're indoors, outdoors, working, travelling, or simply running errands, your skin is exposed to ultraviolet (UV) rays that can contribute to sunburn, uneven skin tone, dark spots, and visible signs of premature skin ageing over time.</p>
      <p class="mb-4"><strong>Skin Image UV-Aurora The Lightest 1% Hyaluronic Acid Aqua Sunscreen Gel SPF 50 PA++++</strong> is designed to provide broad-spectrum UVA and UVB protection while delivering lightweight hydration with a fast-absorbing, non-greasy gel texture. Suitable for everyday use, it helps protect the skin while leaving it feeling fresh, comfortable, and moisturized.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">What is UV-Aurora Aqua Sunscreen Gel?</h3>
      <p class="mb-4">UV-Aurora Aqua Sunscreen Gel is a lightweight daily sunscreen formulated with modern UV filters and hydrating skincare ingredients. Its water-light gel texture spreads easily across the skin, absorbs quickly, and is designed to leave little to no visible white cast on most skin tones. The formula combines sun protection with hydration, making it a practical addition to your morning skincare routine.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Understanding SPF 50 PA++++</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>What is SPF 50?</strong> SPF measures protection against UVB rays (which cause sunburn). SPF 50 provides a high level of UVB protection.</li>
        <li><strong>What is PA++++?</strong> The PA rating measures UVA protection (which penetrates deeper to cause photoaging). PA++++ represents a very high level of UVA protection.</li>
      </ul>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Key Ingredients & Their Benefits</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>1% Hyaluronic Acid:</strong> Delivers deep hydration, improving skin comfort and softness.</li>
        <li><strong>Tinosorb M, Homosalate & Octyl Methoxy Cinnamate:</strong> Modern broad-spectrum UV filters that absorb and reflect UVA/UVB rays.</li>
        <li><strong>Zinc PCA & Vitamin E:</strong> Control excess sebum production while nourishing the skin barrier.</li>
        <li><strong>Kakadu Plum & Silk Protein Extracts:</strong> Rich in antioxidants to support bright, smooth, and soft skin.</li>
        <li><strong>Allantoin & Melanin:</strong> Soothe and calm the skin while enhancing photoprotection.</li>
      </ul>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">How to Use UV-Aurora Sunscreen Gel</h3>
      <ol class="list-decimal pl-6 mb-6 space-y-3">
        <li>Cleanse your face and pat it dry.</li>
        <li>Complete your skincare routine with serum and moisturizer.</li>
        <li>Apply <strong>two finger-lengths</strong> of sunscreen evenly to your face and neck.</li>
        <li>Massage gently until fully absorbed, about 20 minutes before sun exposure.</li>
        <li>Reapply every <strong>2–3 hours</strong>, especially after sweating, swimming, or towel drying.</li>
      </ol>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Frequently Asked Questions (FAQs)</h3>
      <div class="space-y-4 mb-6">
        <div>
          <strong class="text-stone-900 text-sm">Does this sunscreen leave a white cast?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">The lightweight aqua gel formula is designed to absorb quickly and minimize visible white cast on most skin tones.</p>
        </div>
        <div>
          <strong class="text-stone-900 text-sm">Is it suitable for oily skin?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Yes. Its lightweight, non-greasy gel texture is suitable for oily, combination, normal, and dry skin types.</p>
        </div>
        <div>
          <strong class="text-stone-900 text-sm">Can I wear makeup over it?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Yes. Allow the sunscreen to absorb fully for a couple of minutes before applying makeup.</p>
        </div>
      </div>
    `
  },
  {
    slug: "aha-bha-face-serum-benefits",
    title: "AHA & BHA Face Serum: Your Complete Guide to Smoother, Clearer & Brighter-Looking Skin",
    category: "Science",
    excerpt: "Healthy skin begins with proper exfoliation. Learn how Skin Image AHA & BHA Face Serum helps exfoliate dead skin cells, clear pores, and improve skin texture.",
    date: "July 26, 2026",
    readTime: "5 min read",
    image: "/aha_bha_serum.png",
    author: "Dr. Ananya Verma, MD",
    content: `
      <p class="mb-4">Healthy skin begins with proper cleansing, hydration, and gentle exfoliation. Over time, dead skin cells, excess oil, pollution, and everyday impurities can build up on the skin's surface, making it look dull and uneven. This is where an <strong>AHA & BHA Face Serum</strong> can become an important part of your skincare routine.</p>
      <p class="mb-4"><strong>Skin Image AHA & BHA Face Serum</strong> is formulated with a combination of exfoliating acids, brightening ingredients, hydrating agents, and botanical extracts to help improve the appearance of skin texture, clarity, and radiance. When used as directed, it supports smoother and healthier-looking skin while remaining lightweight and easy to absorb.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">What is an AHA & BHA Face Serum?</h3>
      <p class="mb-4">An AHA & BHA Face Serum is a chemical exfoliating skincare product designed to gently remove dead skin cells from the skin's surface while helping to keep pores clean. Unlike physical scrubs that exfoliate through friction, AHA (Alpha Hydroxy Acid) and BHA (Beta Hydroxy Acid) work by loosening the bonds between dead skin cells, allowing them to shed more evenly.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Understanding AHA & BHA</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>What is AHA?</strong> Alpha Hydroxy Acids (like Glycolic Acid) are water-soluble exfoliating acids that primarily work on the skin's surface to improve texture, dullness, and fine lines.</li>
        <li><strong>What is BHA?</strong> Beta Hydroxy Acids (like Betaine Salicylate / Salicylic Acid) are oil-soluble exfoliating ingredients that work inside pores to remove excess oil and clear congestion.</li>
      </ul>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Key Ingredients & Their Benefits</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Glycolic Acid:</strong> Exfoliates dead skin cells, refines texture, and boosts brightness.</li>
        <li><strong>Betaine Salicylate:</strong> Gentle BHA that cleanses deep within pores to reduce blemishes.</li>
        <li><strong>Alpha Arbutin & Niacinamide:</strong> Powerhouse blend that targets uneven tone, dark spots, and supports the barrier.</li>
        <li><strong>Ascorbyl Glucoside:</strong> Stable Vitamin C derivative providing antioxidant protection and boosting radiance.</li>
        <li><strong>Sodium Hyaluronate & Panthenol:</strong> Soothe, comfort, and restore deep hydration post-exfoliation.</li>
      </ul>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">How to Use AHA & BHA Face Serum</h3>
      <ol class="list-decimal pl-6 mb-6 space-y-3">
        <li>Cleanse your face using a gentle face wash (like Gluta Forming Face Wash).</li>
        <li>Pat your skin completely dry.</li>
        <li>Apply 2–3 drops of the serum evenly over your face, avoiding the immediate eye area.</li>
        <li>Massage gently until absorbed and follow with a moisturizer.</li>
        <li>The next morning, always apply a broad-spectrum sunscreen (SPF 30 or higher).</li>
      </ol>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Frequently Asked Questions (FAQs)</h3>
      <div class="space-y-4 mb-6">
        <div>
          <strong class="text-stone-900 text-sm">How often should I use it?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">We recommend starting 2–3 times per week in your evening routine. If your skin tolerates it well, you can increase frequency.</p>
        </div>
        <div>
          <strong class="text-stone-900 text-sm">Why is sunscreen important?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Exfoliating acids make your skin more sensitive to UV light. Daily sunscreen is crucial to protect your skin barrier.</p>
        </div>
        <div>
          <strong class="text-stone-900 text-sm">Should I apply moisturizer after?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Yes, applying a moisturizer helps restore hydration and skin comfort after chemical exfoliation.</p>
        </div>
      </div>
    `
  },
  {
    slug: "c-peptide-super-face-serum-benefits",
    title: "C-Peptide Super Face Serum: Everything You Need to Know for Healthier-Looking Skin",
    category: "Science",
    excerpt: "Discover the benefits of Skin Image C-Peptide Super Face Serum. Learn how peptides, niacinamide, hyaluronic acid, and copper peptides support hydrated, firmer, and healthy-looking skin.",
    date: "July 26, 2026",
    readTime: "6 min read",
    image: "/c_peptide_serum.png",
    author: "Dr. Ananya Verma, MD",
    content: `
      <p class="mb-4">Healthy, radiant skin starts with a skincare routine that focuses on hydration, skin barrier support, and consistent care. One product that has become increasingly popular in modern skincare routines is a <strong>peptide face serum</strong>.</p>
      <p class="mb-4"><strong>Skin Image C-Peptide Super Face Serum</strong> is formulated with a powerful blend of peptides, Niacinamide, Hyaluronic Acid, Copper Peptides, Amino Acids, and skin-conditioning ingredients that help improve the appearance of skin by supporting hydration, skin texture, and elasticity.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">What is C-Peptide Super Face Serum?</h3>
      <p class="mb-4">C-Peptide Super Face Serum is a lightweight, fast-absorbing facial serum designed to deliver hydration while supporting smoother, firmer, and healthier-looking skin. Its advanced formula combines multiple peptide technologies with hydrating and skin-conditioning ingredients that help improve the overall appearance of the skin when used consistently as part of a regular skincare routine.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Key Ingredients & Their Benefits</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Multi-Peptide Complex:</strong> Peptides are short chains of amino acids that play an important role in maintaining healthy-looking skin, supporting firmer texture and skin resilience.</li>
        <li><strong>Acetyl Hexapeptide-8:</strong> A cosmetic ingredient commonly used to improve the appearance of expression lines and fine lines.</li>
        <li><strong>Copper Tripeptide-1:</strong> Copper peptides support skin renewal, help improve skin elasticity, and promote a smoother-looking complexion.</li>
        <li><strong>Niacinamide (Vitamin B3):</strong> Improves uneven skin texture, supports the skin barrier, and minimizes enlarged pores.</li>
        <li><strong>Hyaluronic Acid:</strong> Renowned for its moisture-binding properties, keeping skin hydrated and plump.</li>
        <li><strong>Adenosine & Allantoin:</strong> Soothe, comfort, and refine overall skin texture.</li>
      </ul>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">How to Use C-Peptide Super Face Serum</h3>
      <ol class="list-decimal pl-6 mb-6 space-y-3">
        <li>Cleanse your face using a gentle face wash (like Gluta Forming Face Wash).</li>
        <li>Pat your skin dry with a clean towel.</li>
        <li>Apply 2–3 pumps (or a few drops) of the serum evenly over your face and neck.</li>
        <li>Massage gently until fully absorbed.</li>
        <li>Follow with a moisturizer to seal in hydration.</li>
        <li>During the daytime, always finish with a broad-spectrum sunscreen.</li>
      </ol>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Frequently Asked Questions (FAQs)</h3>
      <div class="space-y-4 mb-6">
        <div>
          <strong class="text-stone-900 text-sm">Can I use this serum every day?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Yes. It is suitable for regular use as part of your daily skincare routine (both morning and night).</p>
        </div>
        <div>
          <strong class="text-stone-900 text-sm">Is it suitable for oily skin?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Yes. The lightweight, fast-absorbing formula is suitable for oily, combination, normal, and dry skin types.</p>
        </div>
        <div>
          <strong class="text-stone-900 text-sm">Can I use sunscreen after applying this serum?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Absolutely. Sunscreen should always be the final step in your morning skincare routine.</p>
        </div>
      </div>
    `
  },
  {
    slug: "gluta-forming-face-wash-benefits",
    title: "Gluta Forming Face Wash: Benefits, How to Use & Routine Guide",
    category: "Routines",
    excerpt: "Healthy and glowing skin starts with a proper cleansing routine. Learn everything about Gluta Forming Face Wash, including its benefits and how to use it.",
    date: "July 26, 2026",
    readTime: "5 min read",
    image: "/Gluta_foming.png",
    author: "Dr. Ananya Verma, MD",
    content: `
      <p class="mb-4">Healthy and glowing skin starts with a proper cleansing routine. A good face wash helps remove dirt, excess oil, pollution, makeup residue, and other impurities that build up on your skin throughout the day. If you're looking for a face wash that leaves your skin feeling fresh, clean, and radiant, <strong>Gluta Forming Face Wash</strong> can be a great addition to your daily skincare routine.</p>
      <p class="mb-4">In this guide, we'll explain what Gluta Forming Face Wash is, its benefits, how to use it correctly, and who can use it.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">What is Gluta Forming Face Wash?</h3>
      <p class="mb-4">Gluta Forming Face Wash is a foaming facial cleanser designed to gently cleanse the skin while helping maintain a fresh and healthy-looking complexion. Its rich foam effectively removes impurities without making the skin feel overly dry.</p>
      <p class="mb-4">Whether you have oily, combination, or normal skin, using a gentle foaming cleanser can help keep your skin clean and prepared for the next steps in your skincare routine.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Benefits of Gluta Forming Face Wash</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Deep Cleansing:</strong> The rich foam helps remove dirt, dust, sweat, excess oil, and everyday impurities from the skin.</li>
        <li><strong>Removes Excess Oil:</strong> It helps cleanse away excess sebum, making the skin feel fresh without leaving a greasy finish.</li>
        <li><strong>Refreshes the Skin:</strong> Daily cleansing helps your skin feel clean, revitalized, and comfortable after every wash.</li>
        <li><strong>Supports a Healthy Skincare Routine:</strong> Clean skin allows products like toner, serum, and moisturizer to be applied more effectively as part of your routine.</li>
        <li><strong>Gentle Daily Use:</strong> Suitable for everyday cleansing when used as directed.</li>
      </ul>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Who Can Use It?</h3>
      <p class="mb-4">This face wash is generally suitable for oily skin, combination skin, and normal skin for both men and women. If you have very sensitive skin, we recommend performing a patch test before regular use.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">How to Use Gluta Forming Face Wash</h3>
      <ol class="list-decimal pl-6 mb-6 space-y-3">
        <li>Wet your face with clean water.</li>
        <li>Pump a small amount of foam into your palm.</li>
        <li>Massage gently over your face using circular motions for 30–60 seconds.</li>
        <li>Avoid direct contact with your eyes.</li>
        <li>Rinse thoroughly with water and pat your face dry with a clean towel.</li>
        <li>Follow with a toner, serum, moisturizer, and sunscreen (during the daytime).</li>
      </ol>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Frequently Asked Questions (FAQs)</h3>
      <div class="space-y-4 mb-6">
        <div>
          <strong class="text-stone-900 text-sm">Is Gluta Forming Face Wash suitable for daily use?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Yes. It is designed for regular cleansing as part of your daily skincare routine.</p>
        </div>
        <div>
          <strong class="text-stone-900 text-sm">Can men use this face wash?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">Yes. It is suitable for both men and women.</p>
        </div>
        <div>
          <strong class="text-stone-900 text-sm">Does it remove excess oil?</strong>
          <p class="text-stone-500 text-xs sm:text-sm mt-0.5">It helps cleanse away excess oil, dirt, and impurities, leaving the skin feeling fresh.</p>
        </div>
      </div>
    `
  },
  {
    slug: "understanding-retinoids-vs-peptides",
    title: "Understanding Retinoids vs. Peptides: Which is right for you?",
    category: "Science",
    excerpt: "Both are powerful anti-aging actives, but they work in completely different ways. Here is how to choose the right one for your skin goals.",
    date: "July 24, 2026",
    readTime: "5 min read",
    image: "/c_peptide_serum.png",
    author: "Dr. Ananya Verma, MD",
    content: `
      <p class="mb-4">When it comes to targeting fine lines, wrinkles, and skin texture, two ingredients dominate the conversation: <strong>Retinoids</strong> and <strong>Peptides</strong>. While both offer impressive rejuvenating benefits, they operate through entirely different biological pathways.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">What are Retinoids?</h3>
      <p class="mb-4">Retinoids are derivatives of Vitamin A. They are widely regarded by dermatologists as the gold standard for anti-aging because they speed up cellular turnover and stimulate the production of collagen. By promoting faster shedding of old skin cells, retinoids also help clear acne and fade hyperpigmentation.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">What are Peptides?</h3>
      <p class="mb-4">Peptides are short chains of amino acids that serve as the building blocks for essential skin proteins, specifically collagen, elastin, and keratin. Unlike retinoids, which trigger cell renewal via receptors, peptides act as cellular messengers. They signal the skin to produce more collagen, mimicking the body's natural healing response.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Key Differences</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Irritation:</strong> Retinoids can cause dryness, peeling, and redness (especially during the first few weeks). Peptides are highly tolerated and generally have zero side effects.</li>
        <li><strong>Sun Sensitivity:</strong> Retinoids make your skin more sensitive to UV light (so they should only be used at night). Peptides can be used both day and night without increasing sun sensitivity.</li>
        <li><strong>Speed:</strong> Retinoids usually show faster, more dramatic results, whereas peptides offer gradual, cumulative improvements.</li>
      </ul>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Which one should you choose?</h3>
      <p class="mb-4">If your skin is resilient and you want to tackle deep wrinkles, uneven texture, or acne, a retinoid is your best bet. If your skin is sensitive, prone to redness, or if you are looking to build a gentle, hydrating routine, peptides are the perfect alternative.</p>
      <p class="mb-4">For the ultimate routine, you can use both! Apply your Peptide serum in the morning to support skin elasticity, and apply your Retinoid at night to stimulate cell turnover.</p>
    `
  },
  {
    slug: "how-to-layer-actives",
    title: "How to Layer Vitamin C, Niacinamide, and Hyaluronic Acid",
    category: "Routines",
    excerpt: "Layering active ingredients can be tricky. Learn the correct order and wait times to maximize efficacy and avoid irritation.",
    date: "July 20, 2026",
    readTime: "6 min read",
    image: "/skinimage-skincare-active-ingredients.jpg",
    author: "Dr. Ananya Verma, MD",
    content: `
      <p class="mb-4">A multi-step skincare routine can deliver incredible results, but only if you layer your products correctly. Applying active ingredients in the wrong order can render them ineffective, or worse, lead to skin irritation and redness.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">The Golden Rule: Thinnest to Thickest</h3>
      <p class="mb-4">As a general guideline, always apply your skincare products based on consistency. Start with water-based, lightweight serums and finish with rich oils or moisturizers. This ensures that lighter molecules can absorb into the skin without being blocked by heavier occlusive barriers.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Step-by-Step Morning Routine</h3>
      <ol class="list-decimal pl-6 mb-6 space-y-3">
        <li><strong>Cleanse:</strong> Start with a gentle pH-balanced cleanser to remove sebum accumulated overnight.</li>
        <li><strong>Vitamin C (Antioxidant):</strong> Apply Vitamin C onto dry skin. Because Vitamin C is highly active and works best at a lower pH, it should be the first serum after cleansing.</li>
        <li><strong>Hyaluronic Acid (Hydrator):</strong> Once Vitamin C is absorbed, apply Hyaluronic Acid to pull moisture deep into the skin layers.</li>
        <li><strong>Niacinamide (Brightening & Barrier):</strong> Niacinamide can be layered right after Hyaluronic Acid. It helps calm the skin and reduce redness.</li>
        <li><strong>Moisturizer & SPF:</strong> Always lock in your serums with a lightweight moisturizer, and finish with a broad-spectrum SPF 50 sunscreen.</li>
      </ol>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Common Layering Mistakes to Avoid</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Mixing Retinoids with AHAs/BHAs:</strong> Using chemical exfoliants and Vitamin A together in the same routine can strip your skin barrier. Use them on alternate nights instead.</li>
        <li><strong>Not waiting between steps:</strong> Give active serums at least 60 seconds to absorb before applying the next layer.</li>
      </ul>
    `
  },
  {
    slug: "skin-barrier-repair",
    title: "The Science of Skin Barrier Repair: What you need to know",
    category: "Education",
    excerpt: "A damaged skin barrier can lead to redness, irritation, and breakouts. Discover how to rebuild it with ceramides and soothing botanical gels.",
    date: "July 15, 2026",
    readTime: "4 min read",
    image: "/centella_soothing_gel.png",
    author: "Dr. Ananya Verma, MD",
    content: `
      <p class="mb-4">Your skin barrier (the stratum corneum) is the outermost layer of your skin. Often compared to a brick wall, it keeps moisture locked in and harmful external irritants out. When this barrier is compromised, your skin becomes vulnerable to dryness, redness, acne, and hypersensitivity.</p>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">Signs of a Damaged Skin Barrier</h3>
      <ul class="list-disc pl-6 mb-4 space-y-1">
        <li>Constant tightness or dryness even after moisturizing</li>
        <li>Burning sensation when applying basic skincare products</li>
        <li>Increased breakouts and rough, flaky patches</li>
        <li>Random redness and flushing</li>
      </ul>
      
      <h3 class="text-xl font-serif text-stone-900 mt-6 mb-3">How to Rebuild Your Barrier</h3>
      <p class="mb-4">Rebuilding a compromised skin barrier requires a "less is more" approach. Stop using active acids (AHAs/BHAs) and retinoids immediately, and focus on hydration and repair:</p>
      
      <ol class="list-decimal pl-6 mb-6 space-y-3">
        <li><strong>Switch to a Gentle Cleanser:</strong> Avoid foaming cleansers that strip natural oils. Opt for a soothing, non-stripping cleanser.</li>
        <li><strong>Integrate Ceramides & Centella:</strong> Ceramides act as the mortar between your skin cell bricks. Combine this with soothing botanicals like Centella Asiatica, which significantly reduces inflammation and promotes tissue healing.</li>
        <li><strong>Prioritize Occlusives:</strong> Use a rich, nourishing moisturizer at night to lock in water and prevent trans-epidermal water loss (TEWL).</li>
      </ol>
    `
  }
];

export default function BlogListPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Blog Hero Section */}
      <section className="relative py-20 bg-stone-50 border-b border-stone-200/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/30 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-800">
            The Journal
          </span>
          <h1 className="font-serif text-4.5xl sm:text-5.5xl font-normal text-stone-900 tracking-tight">
            Our <span className="italic font-light text-emerald-800">Blog.</span>
          </h1>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Explore science-backed advice, skincare ingredient guides, and tips from dermatologists to elevate your skin health.
          </p>
        </div>
      </section>

      {/* Blog Grid List */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article 
                key={post.slug}
                className="group flex flex-col bg-white border border-stone-200/60 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-350 hover:-translate-y-1"
              >
                {/* Post Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 border-b border-stone-200/40">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-semibold text-emerald-800 border border-emerald-800/10">
                    {post.category}
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-stone-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="pt-2">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-850 hover:text-emerald-700 transition-colors group/link"
                    >
                      Read Article 
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
