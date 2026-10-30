import React, { useState } from 'react';
import { MapPin, Locate, Search, ShieldCheck, Star, Users, Building, ArrowUp, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const popularLocations = [
  "Koramangala",
  "HSR Layout",
  "Indiranagar",
  "BTM Layout",
  "Whitefield",
  "Jayanagar"
];

export default function Hero() {
  const { setSelectedProperty, properties } = useApp();
  const [activeTab, setActiveTab] = useState("PG");
  const [location, setLocation] = useState("Koramangala, Bangalore");

  const tabs = ["PG", "Room", "Mess", "Hostel"];

  const handleSearch = (e) => {
    e?.preventDefault();
    const elem = document.getElementById('nearby-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNearMe = () => {
    setLocation("Koramangala 4th Block, Bangalore");
  };

  return (
    <section className="relative pt-6 pb-14">
      {/* Hero Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Heading & Search Box */}
        <div className="lg:col-span-7 space-y-6">
          {/* Verified Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-xs font-semibold text-[#5243C2] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#5243C2] animate-pulse" />
            <span>2,400+ verified places · Bangalore</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Manage Your Money. <br />
            <span className="text-[#5243C2]">Find Your Place.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            KOSH is the only app where you discover verified PGs, rooms, mess and hostels nearby — and manage your finances, rent and budget — all in one place.
          </p>

          {/* Search Card Container */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.06)] overflow-hidden max-w-xl">
            {/* Tabs */}
            <div className="grid grid-cols-4 border-b border-slate-100 text-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-3.5 text-sm font-semibold transition-all relative ${
                    activeTab === tab
                      ? "text-[#5243C2] bg-indigo-50/50"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-1/4 right-1/4 h-[2.5px] bg-[#5243C2] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Input & Buttons */}
            <div className="p-4 sm:p-5 space-y-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
                <div className="flex-1 flex items-center gap-2.5 px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl focus-within:border-[#5243C2] focus-within:bg-white transition-all">
                  <MapPin className="w-5 h-5 text-[#5243C2] shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city, locality or landmark"
                    className="w-full bg-transparent text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNearMe}
                  className="px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer"
                >
                  <Locate className="w-3.5 h-3.5 text-slate-500" />
                  <span>Near me</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#5243C2] hover:bg-[#4335a9] text-white text-sm font-semibold flex items-center justify-center gap-2 transition shadow-md shadow-indigo-200 shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>

              {/* Popular tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-medium mr-1">Popular:</span>
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc + ", Bangalore")}
                    className="px-3 py-1 rounded-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-[#5243C2] transition-colors cursor-pointer"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Graphic Mockup (Matches Figma Illustration) */}
        <div className="lg:col-span-5 relative flex justify-center">
          {/* Background Aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/60 via-purple-50/40 to-blue-50/30 rounded-3xl -z-10 blur-2xl transform scale-105" />

          {/* Main Visual Board */}
          <div className="w-full max-w-md bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] p-6 rounded-3xl border border-indigo-100 shadow-xl relative space-y-4">
            {/* Top Properties Occupancy Card */}
            <div className="bg-[#111827] text-white p-5 rounded-2xl shadow-lg border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
                <span>PROPERTIES</span>
                <span>OCCUPANCY</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5 text-xs">
                  {properties.length > 0 ? (
                    properties.slice(0, 4).map((p, idx) => {
                      const colors = ['bg-emerald-400', 'bg-indigo-400', 'bg-amber-400', 'bg-rose-400'];
                      return (
                        <div key={p.id || p._id || idx} className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                          <span className="font-semibold text-slate-200 truncate max-w-[90px]">{p.name}</span>
                          <span className="text-slate-400 text-[11px]">₹{Number(p.price || p.monthlyRent || 0).toLocaleString('en-IN')}/mo</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-slate-400 text-xs py-2">
                      Database Ready · Add your properties
                    </div>
                  )}
                </div>

                {/* Donut graphic */}
                {(() => {
                  const liveOccupancy = properties.length > 0
                    ? Math.round(properties.reduce((acc, p) => acc + (Number(p.occupancyRate) || 0), 0) / properties.length)
                    : 0;
                  return (
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#374151"
                          strokeWidth="3.8"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#5243C2"
                          strokeDasharray={`${liveOccupancy}, 100`}
                          strokeWidth="3.8"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-extrabold text-white">{liveOccupancy}%</span>
                        <span className="text-[9px] text-slate-400">Occupied</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Middle Row: Rent Due & AI Assistant Card */}
            <div className="grid grid-cols-2 gap-3">
              {/* Rent Due */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Rent Due</p>
                  <p className="text-[11px] font-medium text-emerald-600 mt-0.5">✓ Reminder sent</p>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-[#5243C2] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">AI Assistant</p>
                  <p className="text-[11px] font-medium text-[#5243C2] mt-0.5">Save ₹2k/month</p>
                </div>
              </div>
            </div>

            {/* Monthly Savings Chart Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Monthly Savings</span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3" />
                  +18% this month
                </span>
              </div>
              <div className="flex items-end gap-2.5 h-14 pt-2">
                <div className="flex-1 bg-indigo-100 rounded-t-md h-7" />
                <div className="flex-1 bg-indigo-200 rounded-t-md h-9" />
                <div className="flex-1 bg-indigo-300 rounded-t-md h-11" />
                <div className="flex-1 bg-indigo-400 rounded-t-md h-8" />
                <div className="flex-1 bg-indigo-500 rounded-t-md h-12" />
                <div className="flex-1 bg-[#5243C2] rounded-t-md h-14 shadow-sm" />
              </div>
            </div>

            {/* Bottom Proof Badges */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-indigo-100/60 text-center">
                <span className="text-base font-extrabold text-[#5243C2]">2,400+</span>
                <p className="text-[10px] text-slate-500 font-medium">Verified Properties</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-indigo-100/60 text-center">
                <span className="text-base font-extrabold text-[#5243C2]">1,200+</span>
                <p className="text-[10px] text-slate-500 font-medium">Tenants Found</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Bar (Matches Figma: 2,400+ Verified properties, 4.8/5 rating, 100% Free) */}
      <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#5243C2] flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">2,400+ Properties</h4>
            <p className="text-xs text-slate-500">Verified owners & genuine photos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">4.8 / 5 Rating</h4>
            <p className="text-xs text-slate-500">Loved by students & professionals</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">100% Free to Use</h4>
            <p className="text-xs text-slate-500">No brokerage, zero hidden fees</p>
          </div>
        </div>
      </div>
    </section>
  );
}