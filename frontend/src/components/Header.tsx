'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Skin Analyzer', href: '/skin-analyzer' },
    { name: 'Our Story', href: '/#brand-story' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-stone-800 hover:text-emerald-700 transition"
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
              <Link href="/" className="transition hover:opacity-85 flex items-center">
                <img
                  src="/skinimagelogo.png"
                  alt="Skin Image Logo"
                  className="h-10 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex lg:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition duration-200 hover:text-emerald-700 ${
                    pathname === link.href ? 'text-emerald-700 font-semibold' : 'text-stone-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-stone-700 hover:text-emerald-700 transition relative p-1"
                aria-label="Search products"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Wishlist Link */}
              <Link
                href={user ? "/dashboard?tab=wishlist" : "/login"}
                className="text-stone-700 hover:text-emerald-700 transition relative p-1"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                {user && user.wishlist && user.wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-semibold text-white">
                    {user.wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                href="/cart"
                className="text-stone-700 hover:text-emerald-700 transition relative p-1"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-semibold text-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account Profile Icon / Dashboard or Login */}
              <div className="relative group">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link
                      href={user.role === 'admin' ? '/admin' : '/dashboard'}
                      className="flex items-center space-x-1 text-stone-700 hover:text-emerald-700 transition p-1"
                      aria-label="Dashboard"
                    >
                      <User className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="hidden md:inline text-xs font-medium max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                    </Link>
                    <button 
                      onClick={logout} 
                      className="hidden md:block text-stone-400 hover:text-red-600 transition p-1"
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-stone-700 hover:text-emerald-700 transition p-1"
                    aria-label="Login page"
                  >
                    <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Expanded Search Bar Overlay */}
      {searchOpen && (
        <div className="border-t border-stone-200 bg-stone-50 px-4 py-4 transition-all duration-300">
          <form onSubmit={handleSearchSubmit} className="mx-auto max-w-3xl flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search premium products (e.g., Vitamin C, Niacinamide)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-md bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-stone-400 hover:text-stone-600 transition p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </form>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-hidden flex items-center justify-center lg:hidden">
          <style>{`
            @keyframes scaleInCircle {
              0% { transform: translateY(-50%) scale(0); opacity: 0; transform-origin: top left; }
              100% { transform: translateY(-50%) scale(1); opacity: 1; transform-origin: top left; }
            }
            @keyframes fadeInLeftMenu {
              0% { transform: translateX(-30px); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
            }
            .animate-scale-circle {
              animation: scaleInCircle 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-fade-menu {
              animation: fadeInLeftMenu 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
              opacity: 0;
            }
          `}</style>

          {/* Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 z-20 flex items-center gap-2 text-stone-800 hover:text-[#7E3B9B] tracking-widest font-black text-xs uppercase transition duration-300"
          >
            <span>Close</span>
            <X className="h-5 w-5" />
          </button>

          {/* Left-Offset Purple Circle Overlay */}
          <div className="absolute -left-[45vw] sm:-left-[35vw] top-1/2 w-[115vw] h-[115vw] sm:w-[90vw] sm:h-[90vw] rounded-full bg-[#7E3B9B] flex items-center justify-center animate-scale-circle shadow-2xl z-0">
            {/* Rotating SVG Circular Text */}
            <div className="absolute w-[108%] h-[108%] flex items-center justify-center z-0 pointer-events-none">
              <svg viewBox="0 0 300 300" className="w-full h-full animate-[spin_25s_linear_infinite]">
                <path id="circlePath" d="M 150, 150 m -120, 0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0" fill="none" />
                <text className="text-[9.5px] font-black tracking-[0.25em] fill-stone-100/70 uppercase">
                  <textPath href="#circlePath" startOffset="0%">
                    SKINIMAGE • SKINIMAGE • SKINIMAGE • SKINIMAGE • SKINIMAGE • SKINIMAGE •
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          {/* Navigation Links inside Purple Circle */}
          <div className="absolute left-[8vw] sm:left-[15vw] top-1/2 -translate-y-1/2 flex flex-col space-y-4 text-left z-10 select-none animate-fade-menu w-fit">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg sm:text-xl font-serif font-black tracking-widest uppercase text-stone-100 hover:text-[#ffd500] transition duration-300"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg sm:text-xl font-serif font-black tracking-widest uppercase text-stone-100 hover:text-[#ffd500] transition duration-300"
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg sm:text-xl font-serif font-black tracking-widest uppercase text-amber-300 hover:text-[#ffd500] transition duration-300"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg sm:text-xl font-serif font-black tracking-widest uppercase text-stone-300 hover:text-red-400 transition duration-300 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg sm:text-xl font-serif font-black tracking-widest uppercase text-stone-100 hover:text-[#ffd500] transition duration-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};
