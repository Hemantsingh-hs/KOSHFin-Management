import React, { useState } from 'react';
import { X, MapPin, Star, Check, Wifi, Wind, ShieldCheck, Utensils, Calendar, Phone, Mail, ArrowRight } from 'lucide-react';

export default function PropertyDetailModal({ property, onClose }) {
  const [selectedRoom, setSelectedRoom] = useState(property?.roomTypes?.[0] || null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Hemant Singh',
    phone: '+91 98765 43210',
    visitDate: '2026-10-25',
    timeSlot: '11:00 AM',
    notes: 'Looking to move in early next month.',
  });

  if (!property) return null;

  const handleBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          
          <div className="absolute left-6 bottom-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#5243C2] text-xs font-bold text-white shadow-sm">
                {property.type}
              </span>
              {property.food && (
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-xs font-bold text-white shadow-sm">
                  Food Included
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
                Verified Listing
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold">{property.name}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-200 mt-1">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{property.address || property.location}</span>
              <span>·</span>
              <span>{property.distance} away</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-18rem)] overflow-y-auto">
          {bookingSuccess ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-emerald-900">Visit Scheduled Successfully!</h3>
              <p className="text-sm text-emerald-700 mt-2">
                We have notified the property owner. You will receive an SMS and WhatsApp confirmation with the exact location pin.
              </p>
            </div>
          ) : (
            <>
              {/* Overview & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Starting From</p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-extrabold text-[#5243C2]">
                      ₹{property.price?.toLocaleString('en-IN') || '7,500'}
                    </span>
                    <span className="text-sm font-medium text-slate-500">/ month</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-100">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <div>
                    <span className="font-extrabold text-amber-900 text-base">{property.rating || '4.8'}</span>
                    <span className="text-xs text-amber-700 ml-1">({property.reviews || '124'} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">About this Property</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {property.description ||
                    'Modern living space equipped with all conveniences. Well-connected to tech parks, metro stations, and local markets.'}
                </p>
              </div>

              {/* Room Configurations */}
              {property.roomTypes && property.roomTypes.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Available Room Options</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {property.roomTypes.map((room, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedRoom?.type === room.type
                            ? 'border-[#5243C2] bg-indigo-50/50 shadow-sm ring-1 ring-[#5243C2]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-800">{room.type}</p>
                        <p className="text-lg font-extrabold text-[#5243C2] mt-1">
                          ₹{room.rent?.toLocaleString('en-IN')}
                          <span className="text-xs font-normal text-slate-500">/mo</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">Deposit: ₹{room.deposit?.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">Amenities Included</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(property.amenities || ['WiFi', 'Food', 'AC', 'Housekeeping', 'Power Backup']).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              {property.rules && property.rules.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">House Rules</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {property.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5243C2]" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Schedule a Visit Form */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#5243C2]" />
                  <span>Schedule a Free In-Person Visit</span>
                </h4>
                <form onSubmit={handleBooking} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Visit Date</label>
                    <input
                      type="date"
                      value={formData.visitDate}
                      onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Preferred Time Slot</label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2] bg-white"
                    >
                      <option>10:00 AM - 12:00 PM</option>
                      <option>12:00 PM - 02:00 PM</option>
                      <option>04:00 PM - 06:00 PM</option>
                      <option>06:00 PM - 08:00 PM</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 mt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#5243C2] hover:bg-[#4335a9] text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Confirm Visit Appointment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
