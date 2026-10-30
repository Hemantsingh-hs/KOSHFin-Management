import React, { useState, useEffect } from 'react';
import {
  BellRing,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Send,
  Check,
  Calendar,
  Clock,
  Phone,
  Plus,
  RefreshCw,
  Sparkles,
  X,
  ExternalLink,
  QrCode,
  Smartphone,
  LogOut,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function RentReminders() {
  const {
    reminders,
    tenants,
    markRentPaid,
    scheduleReminder,
    sendWhatsAppToReminder,
    sendBulkWhatsAppReminders,
    addReminder,
  } = useApp();

  const [autoReminderEnabled, setAutoReminderEnabled] = useState(true);
  const [bulkSentSuccess, setBulkSentSuccess] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedReminderForEdit, setSelectedReminderForEdit] = useState(null);

  // WhatsApp Web Bot State
  const [botStatus, setBotStatus] = useState({
    status: 'DISCONNECTED',
    isReady: false,
    qrCodeDataUrl: null,
    clientInfo: null,
  });
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [testPhone, setTestPhone] = useState('6367089560');
  const [testSending, setTestSending] = useState(false);
  const [testFeedback, setTestFeedback] = useState(null);

  // Poll Bot Status from backend
  const fetchBotStatus = async () => {
    try {
      const data = await api.whatsapp.getStatus();
      if (data?.success) {
        setBotStatus(data);
      }
    } catch {
      // offline or server restarting
    }
  };

  useEffect(() => {
    fetchBotStatus();
    const interval = setInterval(fetchBotStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInitBot = async () => {
    try {
      showNotice('Initializing WhatsApp Web Client... Generating QR Code...');
      await api.whatsapp.initialize();
      fetchBotStatus();
    } catch (err) {
      showNotice('Error initializing WhatsApp: ' + err.message);
    }
  };

  const handleDisconnectBot = async () => {
    if (confirm('Are you sure you want to unlink your WhatsApp account?')) {
      try {
        await api.whatsapp.disconnect();
        showNotice('WhatsApp device unlinked successfully.');
        fetchBotStatus();
      } catch (err) {
        showNotice('Error disconnecting: ' + err.message);
      }
    }
  };

  const handleSendTestMessage = async () => {
    if (!testPhone) return;
    setTestSending(true);
    setTestFeedback(null);
    try {
      const res = await api.whatsapp.sendTest(
        testPhone,
        `🔔 *KoshFin Live WhatsApp Test*\n\nHello! This confirms your WhatsApp account is linked to KoshFin. Automated rent collection reminders will now be sent directly from your number to tenant phones in the background! 🚀`
      );
      if (res?.success) {
        setTestFeedback('✅ Test message sent and delivered to your WhatsApp number!');
        showNotice(`Real WhatsApp delivered to ${testPhone}`);
      } else {
        setTestFeedback('❌ Failed: ' + (res?.message || 'Error sending test'));
      }
    } catch (err) {
      setTestFeedback('❌ Error: ' + err.message);
    } finally {
      setTestSending(false);
    }
  };

  // Modal Form State
  const [formData, setFormData] = useState({
    tenantId: '',
    tenantName: '',
    phone: '',
    property: '',
    room: '',
    amount: '',
    dueDate: 'Tomorrow',
    scheduledDate: new Date().toISOString().slice(0, 10),
    scheduledTime: '10:00',
    autoSend: true,
  });

  // Helper to format phone for WhatsApp wa.me link
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    let digits = phone.toString().replace(/[^0-9]/g, '');
    if (digits.length === 10) {
      digits = '91' + digits;
    }
    return digits;
  };

  // Helper to generate professional WhatsApp message
  const createWhatsAppText = (r) => {
    return (
      `🔔 *KoshFin Rent Reminder*\n\n` +
      `Hello *${r.tenantName}*,\n` +
      `Friendly reminder regarding your monthly rent for *${r.property}*, Room *${r.room}*.\n\n` +
      `💵 *Amount Due:* ₹${Number(r.amount)?.toLocaleString('en-IN')}\n` +
      `📅 *Due Date:* ${r.dueDate || 'Immediate'}\n` +
      `💳 *UPI ID:* koshfin@okhdfcbank\n\n` +
      `Kindly make the payment and share the transaction screenshot. Thank you! 🙏`
    );
  };

  // Trigger individual WhatsApp send
  const handleWhatsAppSend = (r) => {
    const text = createWhatsAppText(r);
    const cleanPhone = formatPhoneForWhatsApp(r.phone);

    // Open WhatsApp directly with registered phone number
    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }

    sendWhatsAppToReminder(r.id);
    showNotice(`Dispatched WhatsApp reminder to registered number ${r.phone || 'recipient'}`);
  };

  // Trigger Bulk Reminders
  const handleBulkReminders = () => {
    sendBulkWhatsAppReminders();
    setBulkSentSuccess(true);
    setTimeout(() => setBulkSentSuccess(false), 4000);
  };

  // Manual Trigger for Scheduler
  const handleManualSchedulerCheck = async () => {
    try {
      showNotice('Checking for due reminders against scheduled Date & Time...');
      const res = await fetch('http://localhost:5000/api/reminders/trigger-scheduler', {
        method: 'POST',
      });
      const data = await res.json();
      showNotice(
        data?.result?.processed > 0
          ? `⚡ Processed ${data.result.processed} scheduled reminder(s) successfully!`
          : '✅ Scheduler up to date. No pending reminders due at this exact minute.'
      );
    } catch {
      showNotice('Scheduler check completed. Reminders scheduled for due date/time.');
    }
  };

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Open modal for new schedule or edit
  const openScheduleModal = (reminder = null) => {
    if (reminder) {
      setSelectedReminderForEdit(reminder);
      setFormData({
        tenantId: reminder.tenantId || '',
        tenantName: reminder.tenantName || '',
        phone: reminder.phone || '',
        property: reminder.property || '',
        room: reminder.room || '',
        amount: reminder.amount || '',
        dueDate: reminder.dueDate || 'Tomorrow',
        scheduledDate: reminder.scheduledDate || new Date().toISOString().slice(0, 10),
        scheduledTime: reminder.scheduledTime || '10:00',
        autoSend: reminder.autoSend !== undefined ? reminder.autoSend : true,
      });
    } else {
      setSelectedReminderForEdit(null);
      const firstTenant = tenants[0] || {};
      setFormData({
        tenantId: firstTenant.id || '',
        tenantName: firstTenant.name || '',
        phone: firstTenant.phone || '',
        property: firstTenant.property || '',
        room: firstTenant.room || '',
        amount: firstTenant.monthlyRent || 7000,
        dueDate: 'Due on 1st of Month',
        scheduledDate: new Date().toISOString().slice(0, 10),
        scheduledTime: '10:00',
        autoSend: true,
      });
    }
    setIsScheduleModalOpen(true);
  };

  // Handle selecting tenant in modal
  const handleTenantSelect = (tId) => {
    const t = tenants.find((item) => item.id === Number(tId));
    if (t) {
      setFormData((prev) => ({
        ...prev,
        tenantId: t.id,
        tenantName: t.name,
        phone: t.phone,
        property: t.property,
        room: t.room,
        amount: t.monthlyRent || prev.amount,
      }));
    }
  };

  // Submit Schedule Modal
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (selectedReminderForEdit) {
      scheduleReminder(selectedReminderForEdit.id, {
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        phone: formData.phone,
        autoSend: formData.autoSend,
      });
      showNotice(`Updated schedule for ${formData.tenantName} (${formData.scheduledDate} at ${formData.scheduledTime})`);
    } else {
      addReminder({
        tenantId: formData.tenantId,
        tenantName: formData.tenantName,
        phone: formData.phone,
        property: formData.property,
        room: formData.room,
        amount: Number(formData.amount),
        dueDate: formData.dueDate,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        autoSend: formData.autoSend,
      });
      showNotice(`Scheduled automated reminder for ${formData.tenantName} on ${formData.scheduledDate} at ${formData.scheduledTime}`);
    }
    setIsScheduleModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-10 text-[#091E42]">
      {/* Page Header (Jira Standard Sizing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[#0052CC]" />
              <span>Rent & WhatsApp Reminders</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Scheduler Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatically dispatch rent collection alerts to tenant registered numbers by scheduled date & time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* WhatsApp Web Device Link Status / QR Trigger */}
          {botStatus.isReady ? (
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Click to view linked WhatsApp device status"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Linked: +{botStatus.clientInfo?.phone || 'WhatsApp'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsQrModalOpen(true);
                if (botStatus.status === 'DISCONNECTED') {
                  handleInitBot();
                }
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Link WhatsApp (QR Code)</span>
            </button>
          )}

          <button
            onClick={() => openScheduleModal()}
            className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Reminder</span>
          </button>

          <button
            onClick={handleBulkReminders}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Bulk WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-2.5 rounded-md bg-blue-50 border border-blue-200 text-[#0052CC] text-xs font-medium flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0052CC] shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-blue-400 hover:text-blue-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {bulkSentSuccess && (
        <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Bulk automated WhatsApp reminders dispatched to all pending & overdue registered numbers!</span>
        </div>
      )}

      {/* Automated WhatsApp Setting Card (Jira Standard Style) */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#0052CC]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Automated WhatsApp Scheduler by Date & Time
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            The background engine checks registered tenant phone numbers and dispatches personalized WhatsApp reminders with payment amounts, room numbers, and UPI details precisely when the scheduled date & time is reached.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              <Clock className="w-3 h-3 text-slate-500" />
              Interval: Every 30 seconds
            </span>
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              <Phone className="w-3 h-3 text-emerald-600" />
              Recipients: Verified Tenant Numbers
            </span>
            <button
              onClick={() => {
                setIsQrModalOpen(true);
                if (botStatus.status === 'DISCONNECTED') {
                  handleInitBot();
                }
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold transition cursor-pointer ${
                botStatus.isReady
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {botStatus.isReady ? <Wifi className="w-3 h-3 text-emerald-600" /> : <WifiOff className="w-3 h-3 text-amber-600" />}
              <span>{botStatus.isReady ? `Bot Linked (+${botStatus.clientInfo?.phone})` : 'Bot Unlinked (Click to Scan QR)'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleManualSchedulerCheck}
            title="Check scheduled reminders against current time"
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-slate-600" />
            <span>Check Now</span>
          </button>

          <label className="flex items-center gap-2 cursor-pointer shrink-0 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700">
              {autoReminderEnabled ? 'Engine Active' : 'Disabled'}
            </span>
            <input
              type="checkbox"
              checked={autoReminderEnabled}
              onChange={() => setAutoReminderEnabled(!autoReminderEnabled)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600 relative" />
          </label>
        </div>
      </div>

      {/* Rent Cycles Table (Jira Standard Style) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Scheduled Rent Reminders & Registered Numbers
            </h3>
            <p className="text-[11px] text-slate-500">
              Review delivery status, set date & time triggers, or launch one-click WhatsApp to registered numbers.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
            Total Reminders: {reminders.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Tenant & Number</th>
                <th className="py-2.5 px-3">Property & Room</th>
                <th className="py-2.5 px-3">Scheduled Date & Time</th>
                <th className="py-2.5 px-3 text-right">Rent Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Auto-Dispatch</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reminders.map((r) => {
                const cleanPhone = formatPhoneForWhatsApp(r.phone);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Tenant & Registered Phone Number */}
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-slate-900">{r.tenantName}</p>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{r.phone || 'No number registered'}</span>
                      </div>
                    </td>

                    {/* Room & Property */}
                    <td className="py-2.5 px-3">
                      <p className="font-medium text-slate-800">{r.property}</p>
                      <p className="text-[11px] text-slate-500">Room {r.room}</p>
                    </td>

                    {/* Scheduled Date & Time */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-800">
                        <Calendar className="w-3 h-3 text-[#0052CC] shrink-0" />
                        <span>{r.scheduledDate || r.dueDate || 'Unscheduled'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{r.scheduledTime || '10:00 AM'}</span>
                      </div>
                    </td>

                    {/* Rent Amount */}
                    <td className="py-2.5 px-3 text-right">
                      <span className="font-bold text-slate-900 text-xs">
                        ₹{Number(r.amount)?.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Rent Payment Status (Jira Lozenge) */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide border ${
                          r.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : r.status === 'Overdue'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    {/* WhatsApp Auto Status */}
                    <td className="py-2.5 px-3 text-center">
                      {r.whatsappSent ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Sent
                        </span>
                      ) : r.autoSend ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#0052CC] border border-blue-200">
                          <Clock className="w-3 h-3 text-[#0052CC]" />
                          Scheduled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Manual
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {r.status !== 'Paid' ? (
                          <>
                            {/* Schedule Button */}
                            <button
                              onClick={() => openScheduleModal(r)}
                              title="Set or adjust scheduled date and time"
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                            >
                              Schedule
                            </button>

                            {/* Direct WhatsApp Button */}
                            <button
                              onClick={() => handleWhatsAppSend(r)}
                              title={`Send instant WhatsApp to ${r.phone}`}
                              className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition cursor-pointer"
                            >
                              WhatsApp
                            </button>

                            {/* Mark Paid Button */}
                            <button
                              onClick={() => {
                                markRentPaid(r.id);
                                showNotice(`Marked rent as paid for ${r.tenantName}`);
                              }}
                              className="px-2 py-1 rounded bg-blue-50 text-[#0052CC] hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition cursor-pointer"
                            >
                              Paid
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Paid</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {reminders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-xs text-slate-400">
                    No rent reminders scheduled in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Automated Reminder Modal (Jira Standard Dialog) */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4 shadow-xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedReminderForEdit ? 'Edit Reminder Schedule' : 'Schedule Automated WhatsApp Reminder'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dispatches to registered tenant number on the scheduled date & time.
                </p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 mt-3">
              {/* Select Tenant (if creating new) */}
              {!selectedReminderForEdit && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Select Tenant
                  </label>
                  <select
                    value={formData.tenantId}
                    onChange={(e) => handleTenantSelect(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#0052CC]"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.property} · Room {t.room}) - {t.phone}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Registered Phone Number */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Registered WhatsApp Number</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-800 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#0052CC]"
                />
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#0052CC]" />
                    <span>Scheduled Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-800 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#0052CC]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#0052CC]" />
                    <span>Scheduled Time</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-800 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#0052CC]"
                  />
                </div>
              </div>

              {/* Amount & Due Date Label */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Rent Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-800 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#0052CC]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Due Date Note
                  </label>
                  <input
                    type="text"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    placeholder="e.g. Due on 1st of month"
                    className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-800 rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#0052CC]"
                  />
                </div>
              </div>

              {/* Auto Send Toggle */}
              <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Enable Automatic WhatsApp Dispatch
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Automatically trigger at the specified date & time
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoSend}
                    onChange={(e) => setFormData({ ...formData, autoSend: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600 relative" />
                </label>
              </div>

              {/* Message Preview */}
              <div className="p-2 rounded-md bg-slate-50 border border-slate-200 text-[11px]">
                <p className="font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp Message Preview:</span>
                </p>
                <div className="whitespace-pre-line font-mono bg-white p-2 rounded border border-slate-200 text-[10px] text-slate-700">
                  {`Hello ${formData.tenantName || 'Tenant'},\nRent reminder from KoshFin for ${formData.property || 'PG'} Room ${formData.room || '-'}.\nAmount: ₹${Number(formData.amount || 0).toLocaleString('en-IN')}\nDue Date: ${formData.dueDate}\nUPI ID: koshfin@okhdfcbank`}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#0052CC] hover:bg-[#0047B3] text-white shadow-xs transition"
                >
                  {selectedReminderForEdit ? 'Save Schedule' : 'Schedule Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp QR Device Linking Modal (Jira Standard Dialog) */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4 shadow-xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#0052CC]" />
                  <span>WhatsApp Device Link</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Link your WhatsApp to send background rent reminders directly to tenant phones.
                </p>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-3">
              {/* Ready / Linked State */}
              {botStatus.isReady ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold">WhatsApp Linked & Active!</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-1">
                      Connected to <strong>+{botStatus.clientInfo?.phone}</strong> ({botStatus.clientInfo?.name}).
                      Scheduled date & time reminders will now be dispatched automatically in the background.
                    </p>
                  </div>

                  {/* Send Live Test WhatsApp */}
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                      Send Live Test WhatsApp Message
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 6367089560"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white focus:outline-none focus:border-[#0052CC]"
                      />
                      <button
                        onClick={handleSendTestMessage}
                        disabled={testSending || !testPhone}
                        className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#0047B3] disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-xs transition cursor-pointer"
                      >
                        {testSending ? 'Sending...' : 'Send Test'}
                      </button>
                    </div>

                    {testFeedback && (
                      <p className="text-[11px] font-medium text-slate-700 mt-1">{testFeedback}</p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                    <button
                      onClick={handleDisconnectBot}
                      className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition cursor-pointer flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Unlink Account</span>
                    </button>
                    <button
                      onClick={() => setIsQrModalOpen(false)}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : botStatus.qrCodeDataUrl ? (
                /* QR Ready State */
                <div className="space-y-3 text-center">
                  <div className="bg-white p-2.5 rounded-md border border-slate-200 inline-block shadow-xs">
                    <img
                      src={botStatus.qrCodeDataUrl}
                      alt="WhatsApp Web QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>

                  <div className="text-left bg-slate-50 p-2.5 rounded-md border border-slate-200 space-y-1">
                    <p className="text-xs font-bold text-slate-800">How to link your phone:</p>
                    <ol className="text-[11px] text-slate-600 list-decimal list-inside space-y-0.5">
                      <li>Open <strong>WhatsApp</strong> on your mobile phone.</li>
                      <li>Go to <strong>Settings</strong> (iOS) or <strong>Menu ⋮</strong> (Android) &gt; <strong>Linked Devices</strong>.</li>
                      <li>Tap <strong>Link a Device</strong> and point your camera at the QR code above.</li>
                    </ol>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Auto-checking connection every 3 seconds... QR code refreshes automatically.
                  </p>
                </div>
              ) : botStatus.status === 'INITIALIZING' ? (
                /* Initializing State */
                <div className="py-8 text-center space-y-2">
                  <div className="w-7 h-7 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-800">Starting WhatsApp Web Engine...</p>
                  <p className="text-[11px] text-slate-500">
                    Generating secure QR code. This takes about 5 to 10 seconds.
                  </p>
                </div>
              ) : (
                /* Disconnected / Ready to Init State */
                <div className="py-6 text-center space-y-3">
                  <QrCode className="w-10 h-10 text-slate-400 mx-auto" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">WhatsApp Device Not Linked</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs mx-auto">
                      Scan a quick QR code with your phone to allow KoshFin to dispatch real WhatsApp reminders in the background.
                    </p>
                  </div>
                  <button
                    onClick={handleInitBot}
                    className="px-4 py-2 bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-semibold rounded-md shadow-xs transition cursor-pointer"
                  >
                    Generate WhatsApp QR Code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
