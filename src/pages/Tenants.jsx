import React, { useState } from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  Phone,
  Mail,
  Building,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  X,
  Sparkles,
  Send,
  Check,
  ExternalLink,
  Users,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Tenants() {
  const {
    tenants,
    setTenants,
    properties,
    reminders,
    scheduleReminder,
    addReminder,
    deleteTenant,
    sendWhatsAppToReminder,
    confirmTenantPayment,
    setIsAddModalOpen,
    setAddModalType,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Tenant Reminder Schedule Modal State
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [toastNotice, setToastNotice] = useState(null);

  const [reminderForm, setReminderForm] = useState({
    reminderId: null,
    scheduledDate: '',
    scheduledTime: '10:00',
    autoSend: true,
    phone: '',
    amount: '',
    dueDate: 'Due on 1st of month',
    lastSent: 'Not sent yet',
    whatsappSent: false,
  });

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4000);
  };

  // Payment Confirmation Modal State
  const [payTenant, setPayTenant] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI');
  const [payNotes, setPayNotes] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  const handleOpenPayModal = (tenant) => {
    setPayTenant(tenant);
    setPayAmount(tenant.monthlyRent || '');
    setPayMethod('UPI');
    setPayNotes('');
  };

  const handleConfirmTenantPayment = async (e) => {
    e.preventDefault();
    if (!payTenant) return;
    setIsSubmittingPay(true);
    try {
      await confirmTenantPayment(payTenant, {
        amount: Number(payAmount) || payTenant.monthlyRent,
        method: payMethod,
        notes: payNotes,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      });
      showToast(`✅ Payment of ₹${Number(payAmount || payTenant.monthlyRent).toLocaleString('en-IN')} confirmed for ${payTenant.name}!`);
      setPayTenant(null);
    } catch (err) {
      showToast(`❌ Failed to record payment: ${err.message}`);
    } finally {
      setIsSubmittingPay(false);
    }
  };

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.room.includes(searchQuery);

    const matchesProp =
      propertyFilter === 'All' || tenant.property === propertyFilter;

    const matchesStatus =
      statusFilter === 'All' || tenant.status === statusFilter;

    return matchesSearch && matchesProp && matchesStatus;
  });

  // Helper to format clean phone number for WhatsApp
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    let digits = phone.toString().replace(/[^0-9]/g, '');
    if (digits.length === 10) {
      digits = '91' + digits;
    }
    return digits;
  };

  // Find existing reminder linked to a tenant
  const getTenantReminder = (tenant) => {
    if (!tenant) return null;
    return (
      reminders.find(
        (r) =>
          r.tenantId === tenant.id ||
          (r.tenantName && r.tenantName.trim().toLowerCase() === tenant.name.trim().toLowerCase())
      ) || null
    );
  };

  // Click on "Remind" button: Opens interactive reminder schedule & auto-send update modal
  const handleOpenRemindModal = (tenant) => {
    setSelectedTenant(tenant);
    const existing = getTenantReminder(tenant);

    const today = new Date().toISOString().slice(0, 10);

    if (existing) {
      setReminderForm({
        reminderId: existing.id,
        scheduledDate: existing.scheduledDate || today,
        scheduledTime: existing.scheduledTime || '10:00',
        autoSend: existing.autoSend !== undefined ? existing.autoSend : true,
        phone: existing.phone || tenant.phone || '',
        amount: existing.amount || tenant.monthlyRent || 0,
        dueDate: existing.dueDate || 'Due on 1st of month',
        lastSent: existing.lastSent || 'Not sent yet',
        whatsappSent: existing.whatsappSent || false,
      });
    } else {
      setReminderForm({
        reminderId: null,
        scheduledDate: today,
        scheduledTime: '10:00',
        autoSend: true,
        phone: tenant.phone || '',
        amount: tenant.monthlyRent || 0,
        dueDate: 'Due on 1st of month',
        lastSent: 'Not scheduled yet',
        whatsappSent: false,
      });
    }

    setIsReminderModalOpen(true);
  };

  // Build formatted WhatsApp message
  const createWhatsAppText = (tenant, amount, dueDate) => {
    return (
      `🔔 *KoshFin Rent Reminder*\n\n` +
      `Hello *${tenant?.name || 'Tenant'}*,\n` +
      `Friendly reminder regarding your monthly rent of *₹${Number(amount || 0).toLocaleString('en-IN')}* for Room *${tenant?.room || '-'}* (${tenant?.property || 'Hostel/PG'}).\n\n` +
      `📅 *Due Date:* ${dueDate || 'Immediate'}\n` +
      `💳 *UPI Payment ID:* \`koshfin@okhdfcbank\`\n\n` +
      `Please let us know once paid and share the transaction screenshot. Thank you! 🙏`
    );
  };

  // Handle direct WhatsApp launch
  const handleSendWhatsAppNow = () => {
    if (!selectedTenant) return;
    const cleanPhone = formatPhoneForWhatsApp(reminderForm.phone || selectedTenant.phone);
    const message = createWhatsAppText(selectedTenant, reminderForm.amount, reminderForm.dueDate);
    const encoded = encodeURIComponent(message);

    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }

    if (reminderForm.reminderId) {
      sendWhatsAppToReminder(reminderForm.reminderId);
    }

    showToast(`WhatsApp opened for registered number ${reminderForm.phone || selectedTenant.phone}`);
    setIsReminderModalOpen(false);
  };

  // Save / Update Scheduled Date & Time and Auto-Send setting
  const handleSaveReminderSchedule = (e) => {
    e.preventDefault();
    if (!selectedTenant) return;

    if (reminderForm.reminderId) {
      // Update existing reminder
      scheduleReminder(reminderForm.reminderId, {
        scheduledDate: reminderForm.scheduledDate,
        scheduledTime: reminderForm.scheduledTime,
        phone: reminderForm.phone,
        autoSend: reminderForm.autoSend,
      });
      showToast(
        `Updated reminder for ${selectedTenant.name}: ${reminderForm.scheduledDate} at ${reminderForm.scheduledTime} (Auto: ${
          reminderForm.autoSend ? 'ON' : 'OFF'
        })`
      );
    } else {
      // Create new scheduled reminder
      addReminder({
        tenantId: selectedTenant.id,
        tenantName: selectedTenant.name,
        phone: reminderForm.phone || selectedTenant.phone,
        property: selectedTenant.property,
        room: selectedTenant.room,
        amount: Number(reminderForm.amount || selectedTenant.monthlyRent),
        dueDate: reminderForm.dueDate,
        scheduledDate: reminderForm.scheduledDate,
        scheduledTime: reminderForm.scheduledTime,
        autoSend: reminderForm.autoSend,
      });
      showToast(
        `Scheduled auto-reminder for ${selectedTenant.name} on ${reminderForm.scheduledDate} at ${reminderForm.scheduledTime}`
      );
    }

    setIsReminderModalOpen(false);
  };

  const removeTenant = async (id) => {
    if (confirm('Are you sure you want to remove this tenant?')) {
      await deleteTenant(id);
      showToast('Tenant removed from database successfully.');
    }
  };

  return (
    <div className="space-y-4 pb-10 text-[#091E42]">
      {/* Header (Jira Standard Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0052CC]" />
            <span>Tenants Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active resident records, unit allocations, and automated WhatsApp reminder schedules.
          </p>
        </div>

        {/* Tenant Allocation Notice: Add tenant is inside the Room section */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#0052CC] text-xs font-medium rounded-md border border-blue-200">
            <span>ℹ️ Tenants are assigned directly inside</span>
            <span className="font-bold underline">Rooms</span>
          </span>
        </div>
      </div>

      {/* Toast Notice */}
      {toastNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium rounded-md flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastNotice}</span>
          </div>
          <button onClick={() => setToastNotice(null)} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar (Compact Jira Style) */}
      <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenant by name, phone, or room..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50/70 text-xs text-slate-800 rounded-md border border-slate-300 focus:outline-none focus:border-[#0052CC] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#0052CC]"
          >
            <option value="All">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#0052CC]"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          <span className="text-xs text-slate-500 font-medium pl-1">
            {filteredTenants.length} tenants
          </span>
        </div>
      </div>

      {/* Tenants Table (Jira Standard Data Table) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">TENANT</th>
                <th className="py-2.5 px-3">UNIT / PROPERTY</th>
                <th className="py-2.5 px-3">LEASE DATES</th>
                <th className="py-2.5 px-3 text-right">MONTHLY RENT</th>
                <th className="py-2.5 px-3 text-center">RENT STATUS</th>
                <th className="py-2.5 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.map((t) => {
                const rem = getTenantReminder(t);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Tenant Profile */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0052CC] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {t.name ? t.name[0].toUpperCase() : 'T'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{t.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {t.phone} {t.email ? `· ${t.email}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Room & Property */}
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-800">Room {t.room}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[140px]">{t.property}</p>
                    </td>

                    {/* Lease */}
                    <td className="py-2.5 px-3 text-[11px] font-medium text-slate-600 whitespace-nowrap">
                      <div>{t.moveInDate || 'Active'}</div>
                      {t.leaseEnd && <div className="text-slate-400">{t.leaseEnd}</div>}
                    </td>

                    {/* Rent */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span className="font-bold text-xs text-slate-900">
                        ₹{Number(t.monthlyRent || 0).toLocaleString('en-IN')}
                      </span>
                      {t.deposit > 0 && (
                        <p className="text-[10px] text-slate-400">
                          Deposit: ₹{Number(t.deposit).toLocaleString('en-IN')}
                        </p>
                      )}
                    </td>

                    {/* Status Badge (Jira Lozenges) */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          t.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : t.status === 'Overdue'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            t.status === 'Paid'
                              ? 'bg-emerald-500'
                              : t.status === 'Overdue'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        {t.status}
                      </span>
                    </td>

                    {/* Actions: Remind Button & Schedule Pill */}
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            title={`Confirm rent payment received from ${t.name}`}
                            onClick={() => handleOpenPayModal(t)}
                            className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-[#0052CC] border border-blue-200 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#0052CC]" />
                            <span>Paid</span>
                          </button>

                          <button
                            title="Click to view & update reminder date, time and auto-send on WhatsApp"
                            onClick={() => handleOpenRemindModal(t)}
                            className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            <span>Remind</span>
                          </button>

                          <button
                            title="Remove Tenant"
                            onClick={() => removeTenant(t.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Schedule Status Sub-Badge */}
                        {rem && rem.autoSend && (
                          <span
                            onClick={() => handleOpenRemindModal(t)}
                            title="Click to update scheduled date/time"
                            className="text-[10px] font-medium text-[#0052CC] bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded flex items-center gap-0.5 cursor-pointer border border-blue-200 transition"
                          >
                            <Clock className="w-2.5 h-2.5 text-blue-500" />
                            <span>Auto: {rem.scheduledDate || 'Set'} {rem.scheduledTime}</span>
                          </span>
                        )}

                        {rem && rem.whatsappSent && !rem.autoSend && (
                          <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-emerald-200">
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Sent Recently</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTenants.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs space-y-1.5">
              <Users className="w-7 h-7 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700 text-xs">No tenants registered yet</p>
              <p className="max-w-xs mx-auto text-slate-400 text-[11px]">
                To assign a tenant to a unit, navigate to the <strong>Rooms</strong> section and click &quot;+ Assign Tenant&quot; on any available room.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tenant Reminder & Auto-Schedule Update Modal (Jira Dialog Sizing) */}
      {isReminderModalOpen && selectedTenant && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-xl border border-slate-200 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100/70 text-emerald-800">
                  <MessageSquare className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Tenant Rent Reminder & Auto-Scheduler
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update scheduled reminder date, time & automated WhatsApp dispatch.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsReminderModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tenant Overview Card */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTenant.avatar}
                  alt={selectedTenant.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{selectedTenant.name}</h4>
                  <p className="text-xs text-slate-500">
                    {selectedTenant.property} · Room {selectedTenant.room}
                  </p>
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>Registered: {selectedTenant.phone}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Rent Due</span>
                <p className="text-base font-black text-[#5243C2]">
                  ₹{Number(reminderForm.amount || selectedTenant.monthlyRent).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Current Schedule Status Pill */}
            <div className="mt-3 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs font-semibold text-indigo-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#5243C2]" />
                <span>
                  Current Status:{' '}
                  {reminderForm.autoSend
                    ? `Auto-Scheduled for ${reminderForm.scheduledDate || 'Today'} at ${reminderForm.scheduledTime}`
                    : 'Manual WhatsApp Only (Auto-Send Disabled)'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#5243C2] border border-indigo-100">
                {reminderForm.autoSend ? 'Auto Active' : 'Off'}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveReminderSchedule} className="space-y-4 mt-4">
              {/* Registered Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tenant's Registered WhatsApp Number</span>
                </label>
                <input
                  type="text"
                  required
                  value={reminderForm.phone}
                  onChange={(e) => setReminderForm({ ...reminderForm, phone: e.target.value })}
                  placeholder="e.g. 9461196469 or +91 94611 96469"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#5243C2]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  WhatsApp reminder message will be addressed directly to this contact number.
                </p>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Reminder Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={reminderForm.scheduledDate}
                    onChange={(e) => setReminderForm({ ...reminderForm, scheduledDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#5243C2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Reminder Time</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={reminderForm.scheduledTime}
                    onChange={(e) => setReminderForm({ ...reminderForm, scheduledTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#5243C2]"
                  />
                </div>
              </div>

              {/* Amount & Due Date Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Rent Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={reminderForm.amount}
                    onChange={(e) => setReminderForm({ ...reminderForm, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#5243C2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Due Date Tag
                  </label>
                  <input
                    type="text"
                    value={reminderForm.dueDate}
                    onChange={(e) => setReminderForm({ ...reminderForm, dueDate: e.target.value })}
                    placeholder="e.g. Due on 1st of next month"
                    className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#5243C2]"
                  />
                </div>
              </div>

              {/* Auto Send Toggle */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-950">
                    Automatically Send on WhatsApp (Based on Date & Time)
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Background engine will trigger dispatch when this date & time arrives.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                  <input
                    type="checkbox"
                    checked={reminderForm.autoSend}
                    onChange={(e) => setReminderForm({ ...reminderForm, autoSend: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* Message Live Preview */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px]">
                <p className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Message Preview:</span>
                </p>
                <div className="whitespace-pre-line font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                  {`Hello ${selectedTenant.name},\nRent reminder from KoshFin for ${selectedTenant.property} Room ${selectedTenant.room}.\nAmount: ₹${Number(reminderForm.amount || selectedTenant.monthlyRent).toLocaleString('en-IN')}\nDue Date: ${reminderForm.dueDate}\nUPI ID: koshfin@okhdfcbank`}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSendWhatsAppNow}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Now</span>
                </button>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsReminderModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#5243C2] hover:bg-[#4335a9] text-white shadow-md shadow-indigo-200 transition cursor-pointer"
                  >
                    Update & Save Schedule
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Tenant Rent Payment Modal */}
      {payTenant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Record Rent Payment</h3>
                  <p className="text-[11px] text-slate-500">Collect rent and update live ledger balances</p>
                </div>
              </div>
              <button
                onClick={() => setPayTenant(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmTenantPayment} className="p-4 space-y-3.5">
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{payTenant.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {payTenant.property || 'PG'} · Room {payTenant.room || 'General'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Monthly Rent</span>
                  <span className="text-sm font-extrabold text-[#0052CC]">
                    ₹{Number(payTenant.monthlyRent || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Received Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 focus:outline-none focus:border-[#0052CC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR Code', icon: Smartphone },
                    { id: 'Cash', label: 'Cash', icon: Banknote },
                    { id: 'Bank Transfer', label: 'Bank / IMPS', icon: CreditCard },
                    { id: 'Cheque', label: 'Cheque / Other', icon: Check },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSel = payMethod === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPayMethod(m.id)}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                          isSel
                            ? 'border-[#0052CC] bg-blue-50/60 text-[#0052CC] font-bold shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSel ? 'text-[#0052CC]' : 'text-slate-500'}`} />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Transaction Notes / Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google Pay / PhonePe ref ID or cash receipt"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0052CC]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayTenant(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPay}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {isSubmittingPay
                      ? 'Recording...'
                      : `Confirm & Record ₹${Number(payAmount || 0).toLocaleString('en-IN')}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
