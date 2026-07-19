const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dbHelper = require('./dbHelper');

// Configure Multer for temp image storage
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'temp-selfie-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only JPG, JPEG, PNG, and WEBP files are allowed.'));
  }
}).single('selfie');

// Helper to prepare image for Gemini Vision API
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType
    },
  };
}

// Score Calculation Logic
function calculateSkinScore(metrics) {
  let score = 0;

  // 1. Hydration (Max 20)
  const hydration = (metrics.hydration || '').toLowerCase();
  if (hydration === 'high') score += 20;
  else if (hydration === 'medium') score += 15;
  else score += 5; // Low or Unknown

  // 2. Acne (Max 20)
  const acne = (metrics.acne || '').toLowerCase();
  if (acne === 'none') score += 20;
  else if (acne === 'mild') score += 15;
  else if (acne === 'moderate') score += 10;
  else score += 0; // Severe

  // 3. Texture (Max 15)
  const texture = (metrics.texture || '').toLowerCase();
  if (texture === 'smooth') score += 15;
  else if (texture === 'average') score += 10;
  else score += 5; // Rough

  // 4. Pigmentation (Max 15)
  const pigmentation = (metrics.pigmentation || '').toLowerCase();
  if (pigmentation === 'none') score += 15;
  else if (pigmentation === 'low') score += 10;
  else if (pigmentation === 'medium') score += 5;
  else score += 0; // High

  // 5. Pores (Max 10)
  const pores = (metrics.pores || '').toLowerCase();
  if (pores === 'small') score += 10;
  else if (pores === 'medium') score += 7;
  else score += 3; // Large

  // 6. Redness (Max 10)
  const redness = (metrics.redness || '').toLowerCase();
  if (redness === 'none') score += 10;
  else if (redness === 'low') score += 7;
  else if (redness === 'medium') score += 4;
  else score += 0; // High

  // 7. Dark Circles (Max 10)
  const darkCircles = (metrics.dark_circles || '').toLowerCase();
  if (darkCircles === 'none') score += 10;
  else if (darkCircles === 'low') score += 7;
  else if (darkCircles === 'medium') score += 4;
  else score += 0; // High

  return Math.min(100, Math.max(0, score));
}

// Controller logic
const analyzeSkin = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No selfie file uploaded.' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    try {
      let aiResult;

      // Check if Gemini API key exists
      if (process.env.GEMINI_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use gemini-1.5-flash which supports image inputs
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
          You are an advanced cosmetic dermatology AI assistant.
          Analyze this front-facing face selfie for skin characteristics.
          Do not diagnose medical diseases or claim medical certainty. Focus only on visible cosmetic features.
          
          Always return ONLY valid JSON.
          Do not include markdown tags (\`\`\`json or similar).
          Do not include explanations or trailing comments.
          
          If the image is blurry, too dark, overexposed, or does not contain a clear face, set "image_quality" to "poor" and return only:
          {
            "image_quality": "poor",
            "summary": "Please upload a clearer front-facing selfie in a well-lit environment."
          }

          Otherwise, set "image_quality" to "good" and output this exact JSON structure:
          {
            "image_quality": "good",
            "skin_type": "Oily | Dry | Combination | Normal | Sensitive | Unknown",
            "hydration": "Low | Medium | High",
            "oiliness": "Low | Medium | High",
            "acne": "None | Mild | Moderate | Severe",
            "acne_confidence": 90,
            "pigmentation": "None | Low | Medium | High",
            "dark_circles": "None | Low | Medium | High",
            "redness": "None | Low | Medium | High",
            "pores": "Small | Medium | Large",
            "texture": "Smooth | Average | Rough",
            "wrinkles": "None | Mild | Moderate",
            "blackheads": "None | Mild | Moderate",
            "whiteheads": "None | Mild | Moderate",
            "overall_skin_health": 84,
            "summary": "Provide a simple cosmetic skin summary.",
            "confidence": 88,
            "recommendations": [
              "List 2-4 key skincare ingredients recommended for these concerns (e.g. Salicylic Acid, Niacinamide, Hyaluronic Acid, Vitamin C, Ceramide, Squalane, Centella)"
            ]
          }
        `;

        const imagePart = fileToGenerativePart(filePath, mimeType);
        const result = await model.generateContent([prompt, imagePart]);
        const textResponse = result.response.text().trim();

        // Safe JSON extraction
        try {
          // Clean possible markdown wrapper if Gemini ignored instructions
          const cleanedText = textResponse.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
          aiResult = JSON.parse(cleanedText);
        } catch (jsonErr) {
          console.error("AI response text was: ", textResponse);
          throw new Error('AI response invalid. Please try again.');
        }
      } else {
        // Mock fallback simulator for previewing without keys
        console.warn("GEMINI_API_KEY is not defined. Simulating analysis.");
        await new Promise(resolve => setTimeout(resolve, 2500)); // Delay to feel like real AI

        // Realistic random generator to simulate various conditions
        const skinTypes = ["Oily", "Dry", "Combination", "Sensitive"];
        const randomSkinType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
        
        aiResult = {
          image_quality: "good",
          skin_type: randomSkinType,
          hydration: randomSkinType === "Dry" ? "Low" : "Medium",
          oiliness: randomSkinType === "Oily" ? "High" : "Low",
          acne: randomSkinType === "Oily" ? "Moderate" : "None",
          acne_confidence: 85,
          pigmentation: "Low",
          dark_circles: "Medium",
          redness: randomSkinType === "Sensitive" ? "Medium" : "None",
          pores: randomSkinType === "Oily" ? "Large" : "Small",
          texture: randomSkinType === "Dry" ? "Rough" : "Smooth",
          wrinkles: "None",
          blackheads: randomSkinType === "Oily" ? "Moderate" : "None",
          whiteheads: "None",
          overall_skin_health: 78,
          summary: `Visible features indicate a ${randomSkinType.toLowerCase()} skin profile with standard hydration levels. Recommended to target sebum balance and mild texture recovery.`,
          confidence: 90,
          recommendations: randomSkinType === "Oily" 
            ? ["Salicylic Acid", "Niacinamide", "Centella"] 
            : ["Hyaluronic Acid", "Ceramide", "Squalane"]
        };
      }

      // Check Quality
      if (aiResult.image_quality === 'poor') {
        return res.status(422).json({
          message: aiResult.summary || 'Uploaded photo quality is poor. Please take a clear front-facing selfie.'
        });
      }

      // Backend Schema Validation
      const requiredFields = ['skin_type', 'hydration', 'oiliness', 'acne', 'pigmentation', 'pores', 'texture', 'recommendations'];
      for (const field of requiredFields) {
        if (!(field in aiResult)) {
          throw new Error('AI response structure invalid. Missing field: ' + field);
        }
      }

      // Calculate the final Skin Health Score on backend
      const computedScore = calculateSkinScore(aiResult);
      aiResult.overall_skin_health = computedScore;

      // Map recommended ingredients to actual catalog products
      const allProducts = await dbHelper.findProducts({});
      let matchedProducts = [];

      const recommendedIngredients = aiResult.recommendations || [];
      
      // Look up matching products based on ingredients
      allProducts.forEach(prod => {
        const prodName = prod.name.toLowerCase();
        const prodDesc = prod.description.toLowerCase();
        const prodIngs = (prod.ingredients || []).map(i => i.toLowerCase());

        const isMatch = recommendedIngredients.some(ing => {
          const ingLower = ing.toLowerCase();
          return prodName.includes(ingLower) || 
                 prodDesc.includes(ingLower) || 
                 prodIngs.some(pi => pi.includes(ingLower));
        });

        if (isMatch) {
          matchedProducts.push(prod);
        }
      });

      // If no dynamic matches found, add a fallback based on skin_type
      if (matchedProducts.length === 0) {
        if (aiResult.skin_type === 'Oily') {
          // Add Face Wash (p8) or Spot treatment (p9)
          matchedProducts = allProducts.filter(p => p.id === 'p8' || p.id === 'p9');
        } else {
          // Add Moisturizer (p7) or Sunscreen (p3)
          matchedProducts = allProducts.filter(p => p.id === 'p7' || p.id === 'p3');
        }
      }

      // Deduplicate matched products
      const matchedProductIds = [...new Set(matchedProducts.map(p => p.id || p._id.toString()))];

      // Save report to database
      const reportData = {
        userId: req.user ? (req.user._id || req.user.id) : null,
        guestEmail: req.body.email || null,
        skinScore: computedScore,
        skinType: aiResult.skin_type,
        hydration: aiResult.hydration,
        oiliness: aiResult.oiliness,
        acne: aiResult.acne,
        pigmentation: aiResult.pigmentation,
        darkCircles: aiResult.dark_circles || 'None',
        redness: aiResult.redness || 'None',
        pores: aiResult.pores,
        texture: aiResult.texture,
        wrinkles: aiResult.wrinkles || 'None',
        summary: aiResult.summary,
        rawResponse: aiResult,
        recommendations: matchedProductIds
      };

      const savedReport = await dbHelper.saveAnalysisReport(reportData);

      // Return processed response including populated product details
      res.json({
        reportId: savedReport.id || savedReport._id,
        skinScore: computedScore,
        skinType: aiResult.skin_type,
        hydration: aiResult.hydration,
        oiliness: aiResult.oiliness,
        acne: aiResult.acne,
        pigmentation: aiResult.pigmentation,
        darkCircles: aiResult.dark_circles || 'None',
        redness: aiResult.redness || 'None',
        pores: aiResult.pores,
        texture: aiResult.texture,
        wrinkles: aiResult.wrinkles || 'None',
        summary: aiResult.summary,
        confidence: aiResult.confidence || 85,
        ingredientsRecommended: recommendedIngredients,
        recommendedProducts: matchedProducts, // Send full product items to display on front
        createdAt: savedReport.createdAt
      });

    } catch (processError) {
      console.error("Error processing skin analysis: ", processError);
      res.status(500).json({ message: processError.message || 'Error occurred while analyzing. Please try again.' });
    } finally {
      // Always cleanup uploaded file
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanErr) {
        console.error("Failed to delete temporary selfie file: ", cleanErr);
      }
    }
  });
};

const getReports = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const reports = await dbHelper.findAnalysisReportsByUserId(userId);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  analyzeSkin,
  getReports
};
