import React, { useState } from 'react';
import {
  ArrowUp,
  Sparkles,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  CalendarClock,
  Building2,
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Dashboard({ setPage = () => {} }) {
  const { summary, user, reminders, transactions, markRentPaid } = useApp();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Pending' | 'Paid'
  const [selectedReminderForPay, setSelectedReminderForPay] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleOpenPayModal = (rem) => {
    setSelectedReminderForPay(rem);
    setPaymentAmount(rem.amount || '');
    setPaymentMethod('UPI');
    setPaymentNotes('');
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!selectedReminderForPay) return;
    setIsSubmittingPay(true);
    try {
      await markRentPaid(selectedReminderForPay.id || selectedReminderForPay._id, paymentMethod, {
        amount: Number(paymentAmount) || selectedReminderForPay.amount,
        notes: paymentNotes || `${selectedReminderForPay.property || 'PG'} · Room ${selectedReminderForPay.room || ''}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      });
      showToast(
        `✅ Payment of ₹${Number(paymentAmount || selectedReminderForPay.amount).toLocaleString('en-IN')} confirmed for ${selectedReminderForPay.tenantName}! Dashboard balance updated.`
      );
      setSelectedReminderForPay(null);
    } catch (err) {
      showToast(`❌ Error confirming payment: ${err.message}`);
    } finally {
      setIsSubmittingPay(false);
    }
  };

  const pendingReminders = reminders.filter((r) => r.status !== 'Paid');
  const paidReminders = reminders.filter((r) => r.status === 'Paid');

  // Live Due Amount & Collection Status Calculations
  const totalDueAmount = pendingReminders.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
  const totalCollectedAmount = paidReminders.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
  const totalExpectedRent = totalDueAmount + totalCollectedAmount;
  const collectionRate = totalExpectedRent > 0 ? Math.round((totalCollectedAmount / totalExpectedRent) * 100) : 0;

  const displayedReminders = (
    activeTab === 'Pending'
      ? pendingReminders
      : activeTab === 'Paid'
      ? paidReminders
      : reminders
  ).slice(0, 6);

  return (
    <div className="space-y-4 pb-10 text-[#091E42]">
      {/* Greetings & Time Period (Jira Standard Header) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Financial Dashboard · {user.displayName || user.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time cash flow overview, rent collection cycles, and budget tracking for {summary.balanceMonth}.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-[#0052CC] border border-blue-200">
            {summary.balanceMonth}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            +₹{summary.balanceChange.toLocaleString('en-IN')}
          </span>
          {totalDueAmount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>₹{totalDueAmount.toLocaleString('en-IN')} Due</span>
            </span>
          )}
        </div>
      </div>

      {/* 5 Executive Metric Summary Cards (Available, Income, DUE AMOUNT, Expenses, Savings) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Available Balance */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Available Balance</span>
            <Wallet className="w-4 h-4 text-[#0052CC]" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              ₹{summary.availableBalance.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <span>● Live Ledger Balance</span>
            </p>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-emerald-600">
              ₹{summary.monthlyIncome.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Rent & deposits collected
            </p>
          </div>
        </div>

        {/* Outstanding Rent Due Card */}
        <div className="bg-white rounded-lg p-3.5 border border-amber-200 shadow-xs flex flex-col justify-between bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rent Due</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-amber-700">
              ₹{totalDueAmount.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5 flex items-center gap-1">
              <span>{pendingReminders.length} pending collection(s)</span>
            </p>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-rose-600">
              ₹{summary.monthlyExpenses.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Operations & utilities
            </p>
          </div>
        </div>

        {/* Savings Card */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Net Savings</span>
            <PiggyBank className="w-4 h-4 text-[#5243C2]" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-[#5243C2]">
              ₹{summary.monthlySavings.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Cash flow surplus
            </p>
          </div>
        </div>
      </div>

      {/* Rent Collection & Due Status Progress Bar */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Monthly Rent Collection & Due Status
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                ₹{totalDueAmount.toLocaleString('en-IN')} Outstanding Due
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              ₹{totalCollectedAmount.toLocaleString('en-IN')} collected ({collectionRate}%) · ₹{totalDueAmount.toLocaleString('en-IN')} pending from {pendingReminders.length} tenant(s)
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1 shrink-0">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600">
            <span className="text-emerald-700">Collected: {collectionRate}%</span>
            <span className="text-amber-700">Due: {100 - collectionRate}%</span>
          </div>
          <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${collectionRate}%` }}
              title={`Collected: ₹${totalCollectedAmount.toLocaleString('en-IN')}`}
            />
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${100 - collectionRate}%` }}
              title={`Due: ₹${totalDueAmount.toLocaleString('en-IN')}`}
            />
          </div>
        </div>
      </div>

      {/* Income vs Expenses Chart Card (Jira Standard Style) */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-xs">
        {/* Header & Legends */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Income vs Expenses Analysis</h3>
            <p className="text-[11px] text-slate-500">Cash velocity curve over the current billing cycle</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0052CC]" />
              <span className="text-slate-600 text-[11px]">Income Flow</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
              <span className="text-slate-600 text-[11px]">Expense Outflow</span>
            </div>
          </div>
        </div>

        {/* Chart SVG */}
        <div className="relative w-full h-44 pt-1">
          {/* Y-Axis Value Labels */}
          <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[10px] text-slate-400 font-medium select-none pointer-events-none">
            <span>₹60k</span>
            <span>₹40k</span>
            <span>₹20k</span>
            <span>₹0</span>
          </div>

          {/* Spline Area Curves */}
          <div className="ml-10 h-full">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 700 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0052CC" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#0052CC" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F87171" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#F87171" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal Guide Lines */}
              <line x1="0" y1="10" x2="700" y2="10" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="55" x2="700" y2="55" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="145" x2="700" y2="145" stroke="#F1F5F9" strokeWidth="1" />

              {/* Income Curved Line & Fill */}
              <path
                d="M 0 45 Q 140 25, 280 50 T 560 20 T 700 35 L 700 150 L 0 150 Z"
                fill="url(#incomeGradient)"
              />
              <path
                d="M 0 45 Q 140 25, 280 50 T 560 20 T 700 35"
                fill="none"
                stroke="#0052CC"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Expense Curved Line & Fill */}
              <path
                d="M 0 75 Q 140 65, 280 85 T 560 60 T 700 80 L 700 150 L 0 150 Z"
                fill="url(#expenseGradient)"
              />
              <path
                d="M 0 75 Q 140 65, 280 85 T 560 60 T 700 80"
                fill="none"
                stroke="#F87171"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Two-Column Section (Jira Standard Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Rent Payments */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarClock className="w-4 h-4 text-[#0052CC]" />
                <span>Upcoming Rent Collections</span>
              </h3>
              {totalDueAmount > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  ₹{totalDueAmount.toLocaleString('en-IN')} Due ({pendingReminders.length})
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  All Collected ✓
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 bg-slate-100 rounded-md text-[11px] font-medium">
                {['All', 'Pending', 'Paid'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-0.5 rounded transition cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage('Rent & Reminders')}
                className="text-xs font-semibold text-[#0052CC] hover:underline whitespace-nowrap ml-1"
              >
                View all
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {displayedReminders.map((rem) => {
              const isPaid = rem.status === 'Paid';
              return (
                <div
                  key={rem.id || rem._id}
                  className={`flex items-center justify-between p-2.5 rounded-md border transition ${
                    isPaid
                      ? 'bg-emerald-50/40 border-emerald-200/60'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#0052CC]/10 text-[#0052CC]'
                      }`}
                    >
                      {rem.tenantName ? rem.tenantName[0].toUpperCase() : 'T'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{rem.tenantName}</span>
                        {isPaid && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Paid</span>
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {rem.property || 'PG'} · Room {rem.room || 'General'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-right">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        ₹{Number(rem.amount).toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`block text-[10px] font-semibold mt-0.5 ${
                          isPaid
                            ? 'text-emerald-600'
                            : rem.status === 'Overdue'
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {rem.dueDate || (isPaid ? 'Paid Today' : 'Due on 1st of month')}
                      </span>
                    </div>

                    {!isPaid ? (
                      <button
                        onClick={() => handleOpenPayModal(rem)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1 transition cursor-pointer shrink-0"
                        title="Confirm rent received & log to live ledger"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Confirm Payment</span>
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200 flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {displayedReminders.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                {activeTab === 'Pending'
                  ? 'No pending rent collections found.'
                  : activeTab === 'Paid'
                  ? 'No paid rent collections recorded yet.'
                  : 'No upcoming rent reminders scheduled in database.'}
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Transactions</h3>
            <button
              onClick={() => setPage('Transactions')}
              className="text-xs font-semibold text-[#0052CC] hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id || tx._id}
                className="flex items-center justify-between p-2.5 rounded-md bg-slate-50/70 border border-slate-200 hover:bg-slate-100/60 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${
                      tx.type === 'income'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {tx.type === 'income' ? '↓' : '↑'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tx.title}</h4>
                    <p className="text-[11px] text-slate-400">{tx.date} · {tx.method}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-slate-400 capitalize">{tx.category}</span>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No transactions recorded yet in database.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Rent Payment Modal */}
      {selectedReminderForPay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Confirm Rent Payment</h3>
                  <p className="text-[11px] text-slate-500">Record to update live ledger & dashboard balances</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReminderForPay(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmPayment} className="p-4 space-y-3.5">
              {/* Tenant info card */}
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{selectedReminderForPay.tenantName}</p>
                  <p className="text-[11px] text-slate-500">
                    {selectedReminderForPay.property || 'PG'} · Room {selectedReminderForPay.room || 'General'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">Due Amount</span>
                  <span className="text-sm font-extrabold text-[#0052CC]">
                    ₹{Number(selectedReminderForPay.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Received Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 focus:outline-none focus:border-[#0052CC]"
                  />
                </div>
              </div>

              {/* Payment Mode Selector */}
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
                    const isSel = paymentMethod === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
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

              {/* Notes / Reference */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Transaction Notes / Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google Pay / PhonePe ref ID or notes"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0052CC]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReminderForPay(null)}
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
                      ? 'Updating Ledger...'
                      : `Confirm & Record ₹${Number(paymentAmount || 0).toLocaleString('en-IN')}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-emerald-800 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs font-semibold border border-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Floating AI & Support Action Icons */}
      <div className="fixed bottom-5 right-5 flex flex-col space-y-2.5 z-30">
        <button
          onClick={() => setPage('AI Assistant')}
          title="AI Financial Assistant"
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="p-1 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </button>
        <button
          onClick={() => alert("KOSH Support: Call +91 98765 43210 or email support@koshfin.com")}
          title="Help & Support"
          className="w-10 h-10 rounded-full bg-[#091E42] text-white shadow-sm flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}