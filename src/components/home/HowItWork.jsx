import React from "react";
import { Search, Home, Wallet, ArrowRight } from "lucide-react";

const HowItWork = () => {
  const steps = [
    {
      id: "01",
      icon: Search,
      iconBg: "bg-blue-50 text-[#5243C2]",
      title: "Discover & Explore",
      description:
        "Enter your area and instantly find verified PGs, rooms, mess and hostels with real photos, transparent pricing, and genuine resident ratings.",
    },
    {
      id: "02",
      icon: Home,
      iconBg: "bg-amber-50 text-amber-600",
      title: "Move in & Sign Leases",
      description:
        "Compare properties side-by-side, schedule in-person visits, sign digital rental agreements, and securely record your security deposit.",
    },
    {
      id: "03",
      icon: Wallet,
      iconBg: "bg-emerald-50 text-emerald-600",
      title: "Manage Rent & Finances",
      description:
        "Track rent payments with automated WhatsApp reminders, log monthly expenses, split grocery bills, and unlock AI savings insights.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full px-4 py-16 sm:px-6 md:px-8">
      {/* Heading */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-xs font-bold tracking-widest text-[#5243C2] uppercase">
          SIMPLE AS 1-2-3
        </p>
        <h2 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          How KOSH works
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          From finding the right room to automating monthly rent and managing finances.
        </p>
      </div>

      {/* Steps */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="relative rounded-3xl p-7 bg-white border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.iconBg} shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">
                    {step.id}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWork;