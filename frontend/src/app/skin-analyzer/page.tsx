'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import {
  Sparkles,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  Activity,
  Droplets,
  Flame,
  User,
  Eye,
  Smile,
  Zap,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

import { API_URL } from '@/config';

export default function SkinAnalyzerPage() {
  const { token } = useAuth();
  const { addToCart } = useCart();
  
  // UI States
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate and handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Only JPG, JPEG, PNG, and WEBP formats are supported.');
      return;
    }

    // Check size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Selfie image must be smaller than 10 MB.');
      return;
    }

    // Read and validate resolution
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 720 || img.height < 720) {
          setErrorMsg(`Image resolution too low (${img.width}x${img.height}). Minimum required is 720x720 pixels for accurate analysis.`);
          setSelectedFile(null);
          setImagePreview(null);
          return;
        }

        // Resolution is good, compress and set
        compressAndSetImage(file);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Compress image client side using Canvas
  const compressAndSetImage = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            setSelectedFile(compressedFile);
            setImagePreview(canvas.toDataURL('image/jpeg', 0.85));
          }
        }, 'image/jpeg', 0.85);
      };
    };
  };

  // Submit to Backend
  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please upload a selfie first.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('selfie', selectedFile);
    if (guestEmail) {
      formData.append('email', guestEmail);
    }

    try {
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/skin-analyzer/analyze`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'An error occurred during skin analysis.');
      }

      setReport(data);
      toast.success('Skin analysis complete!');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Server connection error. Please try again.');
      toast.error(err.message || 'Analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500';
    if (score >= 75) return 'text-purple-500 border-purple-500';
    if (score >= 60) return 'text-amber-500 border-amber-500';
    return 'text-rose-500 border-rose-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Care';
  };

  // Reset Analyzer
  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setReport(null);
    setErrorMsg(null);
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 pb-20 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-10 mt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            AI Skincare Technology
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Skin AI Analyzer
          </h1>
          <p className="text-stone-500 mt-2 text-sm">
            Analyze your facial skin health in real-time, get an objective skin health score, and discover mapped ingredient products.
          </p>
        </div>

        {/* 1. DISCLAIMER STEP */}
        {!acceptedDisclaimer && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-amber-600">
              <ShieldAlert className="h-8 w-8 shrink-0" />
              <h2 className="text-xl font-bold text-stone-900">Safety & Cosmetic Disclaimer</h2>
            </div>
            
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              This AI Skin Analyzer is designed for informational, educational, and cosmetic routine planning guidance only. 
              It evaluates superficial skin characteristics (like hydration, visible oiliness, open pores, and surface texture) 
              from your selfie. 
            </p>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg text-xs sm:text-sm text-stone-700 font-medium">
              &quot;This AI analysis is for informational and cosmetic guidance only. It is not a medical diagnosis. If you have persistent skin concerns, please consult a qualified dermatologist.&quot;
            </div>

            <p className="text-stone-500 text-xs leading-relaxed">
              By clicking Accept, you agree that this scanner does not replace professional medical advice, diagnosis, or treatment. 
              Your photo is uploaded securely, analyzed dynamically, and deleted immediately from backend storage after analysis.
            </p>

            <button
              onClick={() => setAcceptedDisclaimer(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-sm text-sm"
            >
              I Accept & Wish to Continue
            </button>
          </div>
        )}

        {/* 2. UPLOAD & ANALYZE STEP */}
        {acceptedDisclaimer && !report && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Upload Area */}
            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-purple-500 rounded-2xl p-8 text-center cursor-pointer transition bg-stone-50/50 hover:bg-purple-50/10 flex flex-col items-center justify-center gap-4"
              >
                <div className="p-4 bg-white rounded-full shadow-sm border border-stone-100 text-stone-400 group-hover:text-purple-600">
                  <Camera className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">Upload front-facing selfie</p>
                  <p className="text-xs text-stone-400 mt-1">Tap to browse files. Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-md">
                  <Info className="h-3.5 w-3.5" />
                  <span>Ensure your face is well-lit and clear</span>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 aspect-square max-w-sm mx-auto flex items-center justify-center">
                <img src={imagePreview} alt="Selfie preview" className="object-cover w-full h-full max-h-[380px]" />
                
                {/* Horizontal Neon Scan line during analysis */}
                {analyzing && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500 shadow-[0_0_10px_#A855F7] animate-scan-line z-20"></div>
                )}
                
                {analyzing && (
                  <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white p-4 text-center z-10">
                    <RefreshCw className="h-8 w-8 animate-spin text-purple-400 mb-3" />
                    <span className="font-semibold text-sm tracking-wide">AI Skin Scanning In Progress...</span>
                    <span className="text-[10px] text-stone-300 mt-1">Comparing cosmetic parameters using Gemini Vision</span>
                  </div>
                )}

                {!analyzing && (
                  <button 
                    onClick={handleReset}
                    className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 text-xs transition"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {errorMsg && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-100">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {imagePreview && !analyzing && (
              <div className="space-y-4">
                {!token && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-stone-600">
                      Email Address (Optional — to save report):
                    </label>
                    <input 
                      type="email"
                      placeholder="e.g. name@domain.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>
                )}
                
                <button
                  onClick={handleAnalyze}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-sm text-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4.5 w-4.5" />
                  <span>Start Skin AI Analysis</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. DETAILED REPORT DASHBOARD */}
        {report && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Summary Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              
              {/* Radial Dial Score */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-8 border-purple-50 flex flex-col items-center justify-center bg-white shadow-inner">
                  <span className="text-4xl font-extrabold text-stone-900 leading-none">
                    {report.skinScore}
                  </span>
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mt-1">
                    Skin Score
                  </span>
                </div>
                <div className="mt-3.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {getScoreLabel(report.skinScore)}
                </div>
              </div>

              {/* Summary Description text */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-xl font-bold text-stone-900">Analysis Completed</h2>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed font-light">
                  {report.summary}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-semibold text-stone-500 pt-1">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-purple-400" />
                    <span>Type: <strong className="text-stone-800">{report.skinType}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <span>AI Confidence: <strong className="text-stone-800">{report.confidence}%</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div>
              <h3 className="text-lg font-bold text-stone-950 mb-4 font-serif">Skin Metrics Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Hydration', value: report.hydration, icon: <Droplets className="h-4 w-4 text-blue-500" />, desc: 'Skin moisture' },
                  { title: 'Oiliness', value: report.oiliness, icon: <Flame className="h-4 w-4 text-amber-500" />, desc: 'Sebum level' },
                  { title: 'Acne', value: report.acne, icon: <AlertCircle className="h-4 w-4 text-rose-500" />, desc: 'Active breakouts' },
                  { title: 'Pores', value: report.pores, icon: <Zap className="h-4 w-4 text-violet-500" />, desc: 'Pore sizes' },
                  { title: 'Redness', value: report.redness, icon: <AlertCircle className="h-4 w-4 text-rose-400" />, desc: 'Inflammation' },
                  { title: 'Dark Circles', value: report.darkCircles || 'None', icon: <Eye className="h-4 w-4 text-indigo-500" />, desc: 'Under-eye tone' },
                  { title: 'Texture', value: report.texture, icon: <Smile className="h-4 w-4 text-green-500" />, desc: 'Smoothness' },
                  { title: 'Wrinkles', value: report.wrinkles || 'None', icon: <User className="h-4 w-4 text-stone-500" />, desc: 'Aging indicators' }
                ].map((m, idx) => (
                  <div key={idx} className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold">
                      {m.icon}
                      <span>{m.title}</span>
                    </div>
                    <p className="text-stone-900 font-bold text-sm">{m.value}</p>
                    <p className="text-[10px] text-stone-400 font-light">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Skincare Ingredients & Routine */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-purple-950 text-lg font-bold font-serif flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 fill-current" />
                <span>Recommended Routine Ingredients</span>
              </h3>
              <p className="text-xs text-purple-900 leading-relaxed font-light">
                The Gemini AI mapped the following core active ingredients targeting your specific metrics:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {(report.ingredientsRecommended || []).map((ing: string, idx: number) => (
                  <span key={idx} className="bg-white border border-purple-200 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Configured Recommended Products catalog mapping */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-stone-950 font-serif">Recommended Products for You</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(report.recommendedProducts || []).map((prod: any) => (
                  <div key={prod.id || prod._id} className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition duration-200">
                    <div className="space-y-3">
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-50 flex items-center justify-center p-4 border border-stone-100">
                        <img 
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400'} 
                          alt={prod.name} 
                          className="object-contain max-h-[85%] max-w-[85%]" 
                        />
                      </div>
                      
                      <div>
                        <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">
                          {prod.category}
                        </span>
                        <h4 className="font-bold text-stone-900 text-xs sm:text-sm mt-0.5 truncate leading-tight">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[#EAB308] text-xs">★</span>
                          <span className="text-[11px] font-semibold text-stone-700">{prod.rating || 4.8}</span>
                          <span className="text-[10px] text-stone-400">({prod.reviewsCount || 10})</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                      <div>
                        {prod.discountPrice ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-stone-400 line-through text-xs">₹{prod.price}</span>
                            <span className="text-stone-900 font-bold text-sm">₹{prod.discountPrice}</span>
                          </div>
                        ) : (
                          <span className="text-stone-900 font-bold text-sm">₹{prod.price}</span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => {
                          addToCart({
                            productId: prod.id || prod._id,
                            name: prod.name,
                            price: prod.price,
                            discountPrice: prod.discountPrice,
                            quantity: 1,
                            image: prod.images?.[0] || ''
                          });
                          toast.success(`${prod.name} added to cart!`);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4 flex justify-between gap-4">
              <button
                onClick={handleReset}
                className="border border-stone-300 hover:bg-stone-100 font-bold text-xs py-2 px-5 rounded-xl transition flex items-center gap-1 bg-white text-stone-700"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Analyze New Selfie</span>
              </button>
              <Link
                href="/shop"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition flex items-center gap-1 shadow-sm"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
