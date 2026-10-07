import React from "react";

const HowItWork = () => {
  const steps = [
    {
      id: "01",
      title: "Search nearby",
      description:
        "Enter your area and instantly find verified PGs, rooms, mess and hostels with real photos, prices and ratings.",
    },
    {
      id: "02",
      title: "Move in",
      description:
        "Compare properties side-by-side, check live availability, and connect directly with verified owners.",
    },
    {
      id: "03",
      title: "Manage finances",
      description:
        "Track rent payments, split shared expenses, set monthly budgets, and get AI-powered savings insights.",
    },
  ];

  return (
    <div className="w-full px-4 py-8 sm:px-6 md:px-8 lg:px-12">
      
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          How KoshFin Works
        </h2>
      </div>

      {/* Steps */}
      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        
        {steps.map((step) => (
          <div
            key={step.id}
            className="w-full rounded-2xl p-5 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <span className="text-lg font-bold text-indigo-700 sm:text-xl">
              {step.id}
            </span>

            <h2 className="py-2 text-lg font-bold sm:text-xl">
              {step.title}
            </h2>

            <p className="text-sm leading-6 text-gray-700 sm:text-base">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWork;