import React, { useState } from 'react';
import { Dot, Heart, Star, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PropertyCard = ({ property }) => {
  const { setSelectedProperty } = useApp();
  const [isLiked, setIsLiked] = useState(false);

  return (
    <article
      onClick={() => setSelectedProperty(property)}
      className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        <img
          src={property.image}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-[#5243C2] shadow-sm">
            {property.type}
          </span>
          {property.food && (
            <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm flex items-center gap-1">
              <span>🍽️ Food</span>
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur-md shadow-sm transition-all hover:scale-110 ${
            isLiked ? "text-rose-500 fill-rose-500" : "text-slate-400 hover:text-rose-500"
          }`}
        >
          <Heart size={18} className={isLiked ? "fill-rose-500" : ""} />
        </button>

        {/* Price Tag Overlay (Figma style) */}
        <div className="absolute bottom-3 left-4 text-white drop-shadow-md">
          <p className="text-2xl font-extrabold leading-none">
            ₹{typeof property.price === 'number' ? property.price.toLocaleString('en-IN') : property.price}
          </p>
          <p className="text-xs font-medium text-slate-100 mt-0.5">per month</p>
        </div>

        {/* Availability Badge */}
        <span
          className={`absolute bottom-3 right-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm ${
            property.status === 'Full' ? 'bg-slate-600' : 'bg-emerald-500'
          }`}
        >
          {property.status === 'Full' ? 'Full' : '✓ Available'}
        </span>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#5243C2] transition-colors leading-snug">
            {property.name}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={14} className="text-[#5243C2] shrink-0" />
            <span className="truncate">{property.location || property.address}</span>
            <span>·</span>
            <span className="shrink-0">{property.distance}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Rating */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-800">{property.rating}</span>
            <span className="text-[11px] text-slate-400">({property.reviews})</span>
          </div>

          {/* Amenities Badges */}
          <div className="flex flex-wrap justify-end gap-1.5 overflow-hidden max-h-6">
            {(property.amenities || []).slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;