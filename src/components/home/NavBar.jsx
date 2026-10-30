import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutGrid } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo (Matches Figma K KOSH) */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#5243C2] text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">
            K
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            KOSH<span className="text-[#5243C2]">Fin</span>
          </span>
        </Link>

        {/* Navigation Anchor Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#nearby-section"
            className="text-sm font-semibold text-slate-600 hover:text-[#5243C2] transition"
          >
            Discover
          </a>
          <a
            href="#reviews"
            className="text-sm font-semibold text-slate-600 hover:text-[#5243C2] transition"
          >
            Reviews
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-semibold text-slate-600 hover:text-[#5243C2] transition"
          >
            How it works
          </a>
        </div>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-bold text-slate-700 hover:text-[#5243C2] transition hidden sm:block"
          >
            Sign in
          </Link>

          <Link
            to="/dashboard"
            className="text-xs font-bold text-[#5243C2] bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition hidden lg:flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/register"
            className="bg-[#5243C2] hover:bg-[#4335a9] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-md shadow-indigo-200 flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;