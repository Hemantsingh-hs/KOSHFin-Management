import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext";
import PropertyCard from "./PropertyCard";

const propertyTypes = ["All", "PG", "Room", "Mess", "Hostel"];

const NearByPlaces = () => {
  const { properties } = useApp();
  const [activeType, setActiveType] = useState("All");
  const [budgetFilter, setBudgetFilter] = useState("Any");
  const [foodFilter, setFoodFilter] = useState("Any");
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter properties
  const filteredProperties = properties.filter((prop) => {
    // Type filter
    if (activeType !== "All" && prop.type !== activeType) return false;

    // Budget filter
    const priceNum = typeof prop.price === "number" ? prop.price : parseInt(String(prop.price).replace(/[^0-9]/g, ''));
    if (budgetFilter === "under6k" && priceNum >= 6000) return false;
    if (budgetFilter === "6kto10k" && (priceNum < 6000 || priceNum > 10000)) return false;
    if (budgetFilter === "above10k" && priceNum <= 10000) return false;

    // Food filter
    if (foodFilter === "foodOnly" && !prop.food) return false;
    if (foodFilter === "noFood" && prop.food) return false;

    return true;
  });

  return (
    <section id="nearby-section" className="w-full bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-8 rounded-3xl mt-8 mb-12 border border-slate-100">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#5243C2] uppercase">
              NEARBY
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Places Near You
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Updated live · Koramangala, Bangalore</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveType("All")}
            className="flex items-center gap-1.5 text-sm font-bold text-[#5243C2] hover:text-[#4335a9] transition group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Filter Bar (Figma style) */}
        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              FILTER:
            </span>

            {/* Budget filter */}
            <div className="relative">
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-[#5243C2] cursor-pointer"
              >
                <option value="Any">Budget: Any</option>
                <option value="under6k">Under ₹6,000</option>
                <option value="6kto10k">₹6,000 - ₹10,000</option>
                <option value="above10k">Above ₹10,000</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Food filter */}
            <div className="relative">
              <select
                value={foodFilter}
                onChange={(e) => setFoodFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-[#5243C2] cursor-pointer"
              >
                <option value="Any">Food: Any</option>
                <option value="foodOnly">Meals Included</option>
                <option value="noFood">Self-Cooking / Mess nearby</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Reset Filter Button */}
            {(budgetFilter !== "Any" || foodFilter !== "Any" || activeType !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setBudgetFilter("Any");
                  setFoodFilter("Any");
                  setActiveType("All");
                }}
                className="text-xs font-semibold text-rose-500 hover:underline px-2"
              >
                Reset
              </button>
            )}
          </div>

          {/* Type Pills */}
          <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
            {propertyTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeType === type
                    ? "bg-[#5243C2] text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Property Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.slice(0, visibleCount).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white py-16 text-center">
            <p className="text-lg font-bold text-slate-700">No properties match your filter</p>
            <p className="mt-2 text-sm text-slate-400">
              Try adjusting your budget or selecting "All" categories.
            </p>
            <button
              onClick={() => {
                setActiveType("All");
                setBudgetFilter("Any");
                setFoodFilter("Any");
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-[#5243C2] text-white text-xs font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* "View All 2,400+ Properties" Button (Figma style) */}
        {filteredProperties.length > 0 && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => (prev >= filteredProperties.length ? 6 : prev + 6))}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 text-sm font-bold shadow-sm hover:border-[#5243C2] hover:text-[#5243C2] hover:shadow-md transition-all cursor-pointer"
            >
              <span>{visibleCount >= filteredProperties.length ? "Showing All Results" : "View All 2,400+ Properties"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NearByPlaces;