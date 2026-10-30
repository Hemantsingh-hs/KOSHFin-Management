import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Check, Bell, Shield, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Setting() {
  const { user, setUser, updateUserProfile } = useApp();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || 'Property Owner',
    displayName: user.displayName || user.name || 'Owner',
    email: user.email || 'owner@koshfin.com',
    phone: user.phone || '',
    upiId: user.upiId || '',
    autoReminders: user.autoReminders ?? true,
    reminderDaysBefore: user.reminderDaysBefore || 3,
    customMessage: user.customMessage || 'Dear {tenant}, friendly reminder that rent for {property} Room {room} of ₹{amount} is due.',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      await updateUserProfile(formData);
    } else {
      setUser((prev) => ({
        ...prev,
        ...formData,
      }));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings & Profile
        </h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Manage your owner account, payment UPI details, and automated notification preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-[#5243C2]" />
            <span>Personal Profile & Identity</span>
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#5243C2] text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-md">
              {user.initials || 'AR'}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">{user.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{user.role || 'Property Owner'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F8FAFC] text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Display First Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-3 bg-[#F8FAFC] text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#F8FAFC] text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#F8FAFC] text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
              />
            </div>
          </div>
        </div>

        {/* UPI & Payment Collection Setup */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <span>Payment Collection & UPI Details</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Primary UPI ID for QR Invoices</label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              className="w-full max-w-md px-4 py-3 bg-[#F8FAFC] text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
            />
            <p className="text-xs text-slate-400 mt-1">This UPI ID is embedded automatically in tenant payment links.</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#5243C2] hover:bg-[#4335a9] text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
