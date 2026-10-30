import React, { useState, useRef } from 'react';
import { X, ArrowRight, Plus, Upload, Image as ImageIcon, Sparkles, Check, Trash2, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PROPERTY_PRESET_IMAGES, processImageFile } from '../../utils/imageHelper';

export default function GlobalAddModal() {
  const { isAddModalOpen, setIsAddModalOpen, addModalType, setAddModalType, addTransaction, addProperty, addRoom, addTenant, properties } = useApp();

  // Transaction state
  const [txForm, setTxForm] = useState({
    title: '',
    type: 'income',
    amount: '',
    category: 'Rent',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    method: 'UPI',
    notes: '',
  });

  // Property state
  const [propForm, setPropForm] = useState({
    name: '',
    type: 'PG',
    address: '',
    totalRooms: 10,
    occupiedRooms: 0,
    price: '',
    food: true,
    monthlyUsers: 25,
    dailyUsers: 15,
    monthlyRate: 3500,
    dailyRate: 100,
    capacity: 60,
    image: PROPERTY_PRESET_IMAGES[0].url,
  });

  const [propImageMode, setPropImageMode] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Room state
  const [roomForm, setRoomForm] = useState({
    id: '',
    propertyId: properties[0]?.id || '',
    floor: '1st Floor',
    type: 'Double Sharing',
    rent: '',
    ac: true,
    attachedBath: true,
  });

  // Tenant state
  const [tenantForm, setTenantForm] = useState({
    name: '',
    phone: '',
    email: '',
    property: properties[0]?.name || '',
    room: '',
    moveInDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    leaseEnd: '',
    monthlyRent: '',
    deposit: '',
  });

  if (!isAddModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addModalType === 'transaction') {
      if (!txForm.title || !txForm.amount) return;
      addTransaction(txForm);
    } else if (addModalType === 'property') {
      if (!propForm.name) return;
      const isMess = propForm.type === 'Mess';
      const formatted = {
        ...propForm,
        totalRooms: isMess ? 0 : (Number(propForm.totalRooms) || 0),
        monthlyUsers: isMess ? (Number(propForm.monthlyUsers) || 0) : undefined,
        dailyUsers: isMess ? (Number(propForm.dailyUsers) || 0) : undefined,
        monthlyRate: isMess ? (Number(propForm.monthlyRate) || Number(propForm.price) || 0) : undefined,
        dailyRate: isMess ? (Number(propForm.dailyRate) || 100) : undefined,
        price: isMess ? (Number(propForm.monthlyRate) || Number(propForm.price) || 0) : (Number(propForm.price) || 0),
        food: isMess ? true : propForm.food,
      };
      addProperty(formatted);
    } else if (addModalType === 'room') {
      if (!roomForm.id) return;
      const selectedProp = properties.find((p) => p.id === Number(roomForm.propertyId));
      addRoom({
        ...roomForm,
        propertyName: selectedProp ? selectedProp.name : (properties[0]?.name || 'Default Property'),
      });
    } else if (addModalType === 'tenant') {
      if (!tenantForm.name) return;
      addTenant(tenantForm);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Add New Entry</h3>
            <p className="text-xs text-slate-500 mt-0.5">Quickly create records across FinTracker</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 p-2 bg-slate-50 border-b border-slate-100 gap-1">
          {[
            { id: 'transaction', label: 'Transaction' },
            { id: 'property', label: 'Property' },
            { id: 'room', label: 'Room' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAddModalType(tab.id)}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                addModalType === tab.id
                  ? 'bg-white text-[#5243C2] shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {addModalType === 'transaction' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Title / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Salary, Rent Collection, Electricity Bill"
                  value={txForm.title}
                  onChange={(e) => setTxForm({ ...txForm, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Type</label>
                  <select
                    value={txForm.type}
                    onChange={(e) => setTxForm({ ...txForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2] bg-white"
                  >
                    <option value="income">Income (+)</option>
                    <option value="expense">Expense (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 8500"
                    value={txForm.amount}
                    onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Category</label>
                  <select
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2] bg-white"
                  >
                    <option value="Income">Income / Salary</option>
                    <option value="Rent">Rent Collection</option>
                    <option value="Food">Food / Groceries</option>
                    <option value="Bills">Bills & Utilities</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Payment Method</label>
                  <select
                    value={txForm.method}
                    onChange={(e) => setTxForm({ ...txForm, method: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2] bg-white"
                  >
                    <option value="UPI">UPI (GPay / PhonePe)</option>
                    <option value="Bank Transfer">Bank Transfer / IMPS</option>
                    <option value="NEFT">NEFT</option>
                    <option value="Cash">Cash</option>
                    <option value="Auto-pay">Auto-pay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Optional reference notes"
                  value={txForm.notes}
                  onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                />
              </div>
            </>
          )}

          {addModalType === 'property' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Property Name</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Palm Residency"
                  value={propForm.name}
                  onChange={(e) => setPropForm({ ...propForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Property Type</label>
                  <select
                    value={propForm.type}
                    onChange={(e) => setPropForm({ ...propForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2] bg-white font-medium"
                  >
                    <option value="PG">PG (Paying Guest)</option>
                    <option value="Room">Apartment / Room</option>
                    <option value="Mess">Mess & Tiffin</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>

                {propForm.type === 'Mess' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Seating / Dining Capacity</label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={propForm.capacity || ''}
                      onChange={(e) => setPropForm({ ...propForm, capacity: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Total Rooms</label>
                    <input
                      type="number"
                      value={propForm.totalRooms}
                      onChange={(e) => setPropForm({ ...propForm, totalRooms: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Address / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Koramangala 4th Block, Bangalore"
                  value={propForm.address}
                  onChange={(e) => setPropForm({ ...propForm, address: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                />
              </div>

              {propForm.type === 'Mess' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Monthly Plan Fee (₹/mo)</label>
                      <input
                        type="number"
                        placeholder="e.g. 3500"
                        value={propForm.monthlyRate || ''}
                        onChange={(e) => setPropForm({ ...propForm, monthlyRate: e.target.value, price: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Daily / Walk-in Rate (₹/day)</label>
                      <input
                        type="number"
                        placeholder="e.g. 100"
                        value={propForm.dailyRate || ''}
                        onChange={(e) => setPropForm({ ...propForm, dailyRate: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Monthly Subscribers (Users)</label>
                      <input
                        type="number"
                        placeholder="e.g. 25"
                        value={propForm.monthlyUsers}
                        onChange={(e) => setPropForm({ ...propForm, monthlyUsers: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Daily Pay Users (Avg/Day)</label>
                      <input
                        type="number"
                        placeholder="e.g. 15"
                        value={propForm.dailyUsers}
                        onChange={(e) => setPropForm({ ...propForm, dailyUsers: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Base Price / Rent (₹)</label>
                    <input
                      type="number"
                      value={propForm.price}
                      onChange={(e) => setPropForm({ ...propForm, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={propForm.food}
                        onChange={(e) => setPropForm({ ...propForm, food: e.target.checked })}
                        className="rounded text-[#5243C2]"
                      />
                      <span>Food / Meals Included</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Property Background Image Selector */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#5243C2]" />
                    <span>Property Background Image</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Shows as card background</span>
                </div>

                {/* Sub-tabs: Upload | URL | Presets */}
                <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPropImageMode('upload')}
                    className={`py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      propImageMode === 'upload'
                        ? 'bg-white text-[#5243C2] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropImageMode('url')}
                    className={`py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      propImageMode === 'url'
                        ? 'bg-white text-[#5243C2] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropImageMode('presets')}
                    className={`py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      propImageMode === 'presets'
                        ? 'bg-white text-[#5243C2] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Presets</span>
                  </button>
                </div>

                {/* Mode 1: Upload File */}
                {propImageMode === 'upload' && (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsProcessingImage(true);
                        processImageFile(file, (optimizedUrl) => {
                          setPropForm((prev) => ({ ...prev, image: optimizedUrl }));
                          setIsProcessingImage(false);
                        });
                      }}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-[#5243C2] rounded-xl p-4 text-center cursor-pointer transition bg-slate-50/60 hover:bg-indigo-50/30 group"
                    >
                      <Upload className="w-6 h-6 mx-auto text-slate-400 group-hover:text-[#5243C2] transition mb-1.5" />
                      <p className="text-xs font-bold text-slate-700 group-hover:text-[#5243C2]">
                        {isProcessingImage ? 'Optimizing image...' : 'Click to upload property photo'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, or WebP from your computer</p>
                    </div>
                  </div>
                )}

                {/* Mode 2: Image URL */}
                {propImageMode === 'url' && (
                  <div className="space-y-1">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or any direct image link"
                      value={propForm.image || ''}
                      onChange={(e) => setPropForm({ ...propForm, image: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                    <p className="text-[10px] text-slate-400">Paste direct image URL from Unsplash, Imgur, or cloud host</p>
                  </div>
                )}

                {/* Mode 3: Curated Presets */}
                {propImageMode === 'presets' && (
                  <div className="grid grid-cols-3 gap-2">
                    {PROPERTY_PRESET_IMAGES.map((preset) => {
                      const isSelected = propForm.image === preset.url;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => setPropForm({ ...propForm, image: preset.url })}
                          className={`relative h-18 rounded-lg overflow-hidden border-2 cursor-pointer transition group ${
                            isSelected
                              ? 'border-[#5243C2] ring-2 ring-[#5243C2]/30 scale-[1.02]'
                              : 'border-transparent hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1">
                            <span className="text-[10px] font-bold text-white truncate drop-shadow-xs">
                              {preset.name}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-[#5243C2] text-white rounded-full p-0.5 shadow-sm">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Live Card Background Preview */}
                {propForm.image && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-sm min-h-[110px] flex flex-col justify-between p-3 group">
                    {/* Background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${propForm.image})` }}
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-950/40" />

                    {/* Preview Content */}
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-900/60 backdrop-blur-xs px-1.5 py-0.5 rounded border border-blue-400/30">
                          {propForm.type || 'PG'}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1 drop-shadow-xs">
                          {propForm.name || 'Sample Property Name'}
                        </h4>
                        <p className="text-[11px] text-slate-300 drop-shadow-xs">
                          {propForm.address || 'Address / Location preview'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPropForm({ ...propForm, image: '' })}
                        className="text-xs text-white/80 hover:text-white bg-black/40 hover:bg-rose-600/80 p-1.5 rounded-lg backdrop-blur-xs transition"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[11px] text-white/90 pt-2 border-t border-white/20">
                      <span>Live Component Preview</span>
                      <span className="font-semibold text-emerald-400">Card Background Enabled ✓</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {addModalType === 'room' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 104, 203"
                    value={roomForm.id}
                    onChange={(e) => setRoomForm({ ...roomForm, id: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Select Property</label>
                  <select
                    value={roomForm.propertyId}
                    onChange={(e) => setRoomForm({ ...roomForm, propertyId: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2] bg-white"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Floor</label>
                  <input
                    type="text"
                    placeholder="e.g. 1st Floor"
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Room Sharing Type</label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2] bg-white"
                  >
                    <option value="Single Room">Single Room</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                    <option value="Studio 1BHK">Studio 1BHK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Monthly Rent per Bed (₹)</label>
                <input
                  type="number"
                  value={roomForm.rent}
                  onChange={(e) => setRoomForm({ ...roomForm, rent: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                />
              </div>
            </>
          )}

          {addModalType === 'tenant' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tenant Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rohini Sharma"
                  value={tenantForm.name}
                  onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={tenantForm.phone}
                    onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="tenant@example.com"
                    value={tenantForm.email}
                    onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Assign Property</label>
                  <select
                    value={tenantForm.property}
                    onChange={(e) => setTenantForm({ ...tenantForm, property: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2] bg-white"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Room No</label>
                  <input
                    type="text"
                    placeholder="e.g. 101"
                    value={tenantForm.room}
                    onChange={(e) => setTenantForm({ ...tenantForm, room: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={tenantForm.monthlyRent}
                    onChange={(e) => setTenantForm({ ...tenantForm, monthlyRent: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={tenantForm.deposit}
                    onChange={(e) => setTenantForm({ ...tenantForm, deposit: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#5243C2] hover:bg-[#4335a9] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
