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
    { name: 'Our Story', href: '/#brand-story' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
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
                src="/skin_image_logo.svg"
                alt="Skin Image Logo"
                className="h-12 w-auto object-contain"
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

      {/* Mobile Navigation Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-stone-50 pb-12 shadow-xl animate-slide-in">
            <div className="flex px-4 pb-2 pt-5 justify-between items-center border-b border-stone-200">
              <span className="font-serif text-xl tracking-widest font-semibold text-stone-950">NEXTSKIN</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-md p-2 text-stone-500 hover:text-stone-900 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Links */}
            <div className="space-y-6 px-4 py-6">
              {navLinks.map((link) => (
                <div key={link.name} className="flow-root">
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2 block p-2 font-medium text-stone-900 hover:text-emerald-700 transition"
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 px-4 py-6 space-y-6">
              {user ? (
                <>
                  <div className="flow-root">
                    <Link
                      href={user.role === 'admin' ? '/admin' : '/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-m-2 block p-2 font-medium text-stone-900 hover:text-emerald-700 transition"
                    >
                      Dashboard ({user.name})
                    </Link>
                  </div>
                  {user.role === 'admin' && (
                    <div className="flow-root">
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-m-2 flex items-center p-2 font-medium text-amber-700 hover:text-emerald-700 transition"
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" /> Admin Panel
                      </Link>
                    </div>
                  )}
                  <div className="flow-root">
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="-m-2 w-full text-left block p-2 font-medium text-stone-600 hover:text-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flow-root">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2 block p-2 font-medium text-stone-900 hover:text-emerald-700 transition"
                  >
                    Sign In / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
