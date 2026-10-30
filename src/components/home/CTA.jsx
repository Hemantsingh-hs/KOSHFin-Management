import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-gradient-to-r from-[#5243C2] to-[#3B2EA6] px-6 py-10 sm:px-10 lg:p-14 shadow-2xl">
        {/* Background dots pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          {/* Text */}
          <div className="max-w-xl text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-200 mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free to start · Instant setup</span>
            </div>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl text-white">
              Start Managing <br />
              Your Finances & Properties
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-indigo-100 sm:text-base">
              Join students, working professionals, and PG owners who trust KOSH to find their place, automate rent cycles, and track expenses effortlessly.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row shrink-0">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-extrabold text-[#5243C2] shadow-xl transition-all hover:bg-slate-50 hover:shadow-2xl hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <span>Explore Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;