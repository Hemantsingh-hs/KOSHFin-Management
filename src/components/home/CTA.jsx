import React from "react";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="w-full px-4 py-10 sm:px-6 md:py-12 lg:px-10">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] bg-indigo-700 px-4 py-7 sm:px-7 md:px-7 lg:px-10 lg:py-10">

        {/* Background dots */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">

          {/* Text */}
          <div className="max-w-xl text-white">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Start Managing
              <br />
              Your Finances
            </h2>

            <p className="mt-4 text-sm leading-6 text-indigo-100 sm:text-base sm:leading-7">
              Join students and young professionals who trust KOSH to find
              their place and keep their finances on track.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:px-7"
            >
              Get Started Free
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              View Demo
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;