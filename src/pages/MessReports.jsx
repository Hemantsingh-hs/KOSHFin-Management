import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Users,
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Download,
  CreditCard,
  Banknote,
  DollarSign,
  TrendingUp,
  X,
  Trash2,
  Phone,
  Check,
  ArrowUpRight,
  Coffee,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MessReports({ setPage = () => {} }) {
  const { properties, messMenu, updateMessAttendance, addTransaction } = useApp();

  // Find all mess properties
  const messProperties = useMemo(() => {
    return properties.filter((p) => p.type === 'Mess' || p.type === 'Mess & Tiffin');
  }, [properties]);

  const [selectedMess, setSelectedMess] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('All'); // 'All' | 'Monthly' | 'Daily'
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Paid' | 'Pending'

  // Diners / Subscribers Local State (initialized with realistic starting data, persistable in session)
  const [diners, setDiners] = useState([
    {
      id: 'd-1',
      name: 'Aman Sharma',
      phone: '+91 98765 43210',
      messName: messProperties[0]?.name || 'Standard Mess',
      planType: 'Monthly',
      rate: 3500,
      meals: 'All 3 Meals',
      diet: 'Veg',
      joinedDate: '01 Oct 2026',
      status: 'Paid',
    },
    {
      id: 'd-2',
      name: 'Pooja Verma',
      phone: '+91 98112 23344',
      messName: messProperties[0]?.name || 'Standard Mess',
      planType: 'Monthly',
      rate: 3500,
      meals: 'Lunch + Dinner',
      diet: 'Non-Veg',
      joinedDate: '05 Oct 2026',
      status: 'Paid',
    },
    {
      id: 'd-3',
      name: 'Rohan Mehra',
      phone: '+91 97234 56789',
      messName: messProperties[0]?.name || 'Standard Mess',
      planType: 'Daily',
      rate: 100,
      meals: 'Dinner Walk-in',
      diet: 'Veg',
      joinedDate: '27 Oct 2026',
      status: 'Paid',
    },
    {
      id: 'd-4',
      name: 'Vikas Kumar',
      phone: '+91 99887 76655',
      messName: messProperties[0]?.name || 'Standard Mess',
      planType: 'Monthly',
      rate: 3500,
      meals: 'All 3 Meals',
      diet: 'Veg',
      joinedDate: '10 Oct 2026',
      status: 'Pending',
    },
    {
      id: 'd-5',
      name: 'Sneha Patel',
      phone: '+91 98450 12345',
      messName: messProperties[0]?.name || 'Standard Mess',
      planType: 'Daily',
      rate: 120,
      meals: 'Lunch Special',
      diet: 'Non-Veg',
      joinedDate: '27 Oct 2026',
      status: 'Paid',
    },
  ]);

  // Modals
  const [isAddDinerModalOpen, setIsAddDinerModalOpen] = useState(false);
  const [newDiner, setNewDiner] = useState({
    name: '',
    phone: '',
    messName: messProperties[0]?.name || 'Standard Mess',
    planType: 'Monthly',
    rate: '3500',
    meals: 'All 3 Meals',
    diet: 'Veg',
    status: 'Paid',
  });

  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);
  const [walkinForm, setWalkinForm] = useState({
    name: 'Walk-in Diner',
    mealType: 'Lunch',
    quantity: 1,
    ratePerMeal: 100,
    paymentMethod: 'UPI',
    messName: messProperties[0]?.name || 'Standard Mess',
  });

  // Filtered Diners List
  const filteredDiners = useMemo(() => {
    return diners.filter((d) => {
      const matchSearch =
        !searchQuery ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.phone.includes(searchQuery);
      const matchMess = selectedMess === 'All' || d.messName === selectedMess;
      const matchPlan = filterPlan === 'All' || d.planType === filterPlan;
      const matchStatus = filterStatus === 'All' || d.status === filterStatus;
      return matchSearch && matchMess && matchPlan && matchStatus;
    });
  }, [diners, searchQuery, selectedMess, filterPlan, filterStatus]);

  // Metrics Calculation
  const monthlySubscribers = diners.filter((d) => d.planType === 'Monthly');
  const dailyDiners = diners.filter((d) => d.planType === 'Daily');

  const monthlyRevenue = monthlySubscribers
    .filter((d) => d.status === 'Paid')
    .reduce((sum, d) => sum + Number(d.rate || 0), 0);

  const pendingRevenue = monthlySubscribers
    .filter((d) => d.status === 'Pending')
    .reduce((sum, d) => sum + Number(d.rate || 0), 0);

  const dailyRevenue = dailyDiners
    .filter((d) => d.status === 'Paid')
    .reduce((sum, d) => sum + Number(d.rate || 0), 0);

  const totalMessRevenue = monthlyRevenue + dailyRevenue;

  const todayMealsTotal =
    Number(messMenu?.todayAttendance?.breakfast || 0) +
    Number(messMenu?.todayAttendance?.lunch || 0) +
    Number(messMenu?.todayAttendance?.snacks || 0) +
    Number(messMenu?.todayAttendance?.dinner || 0);

  // Add Diner Handler
  const handleAddDiner = (e) => {
    e.preventDefault();
    if (!newDiner.name.trim()) return;

    const created = {
      id: `d-${Date.now()}`,
      name: newDiner.name.trim(),
      phone: newDiner.phone.trim() || 'N/A',
      messName: newDiner.messName || messProperties[0]?.name || 'General Mess',
      planType: newDiner.planType,
      rate: Number(newDiner.rate) || (newDiner.planType === 'Monthly' ? 3500 : 100),
      meals: newDiner.meals,
      diet: newDiner.diet,
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: newDiner.status,
    };

    setDiners([created, ...diners]);
    setIsAddDinerModalOpen(false);
    setNewDiner({
      name: '',
      phone: '',
      messName: messProperties[0]?.name || 'Standard Mess',
      planType: 'Monthly',
      rate: '3500',
      meals: 'All 3 Meals',
      diet: 'Veg',
      status: 'Paid',
    });
  };

  // Log Walk-in Meal Handler
  const handleLogWalkin = (e) => {
    e.preventDefault();
    const qty = Number(walkinForm.quantity) || 1;
    const rate = Number(walkinForm.ratePerMeal) || 100;
    const totalAmount = qty * rate;

    const walkinRecord = {
      id: `d-${Date.now()}`,
      name: walkinForm.name.trim() || 'Walk-in Diner',
      phone: 'Walk-in',
      messName: walkinForm.messName,
      planType: 'Daily',
      rate: totalAmount,
      meals: `${walkinForm.mealType} (${qty} ${qty > 1 ? 'meals' : 'meal'})`,
      diet: 'Veg',
      joinedDate: 'Today',
      status: 'Paid',
    };

    setDiners([walkinRecord, ...diners]);

    // Also increment attendance for this meal
    const mealKey = walkinForm.mealType.toLowerCase();
    if (messMenu?.todayAttendance && mealKey in messMenu.todayAttendance) {
      updateMessAttendance({
        ...messMenu.todayAttendance,
        [mealKey]: (messMenu.todayAttendance[mealKey] || 0) + qty,
      });
    }

    // Record as transaction in financial tracker
    if (addTransaction) {
      addTransaction({
        title: `Mess Walk-in: ${walkinForm.mealType} x ${qty}`,
        amount: totalAmount,
        type: 'Income',
        category: 'Food',
        method: walkinForm.paymentMethod,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        notes: `Walk-in meal tokens issued at ${walkinForm.messName}`,
      });
    }

    setIsWalkinModalOpen(false);
  };

  // Toggle Payment Status
  const handleTogglePayment = (dinerId) => {
    setDiners((prev) =>
      prev.map((d) =>
        d.id === dinerId
          ? { ...d, status: d.status === 'Paid' ? 'Pending' : 'Paid' }
          : d
      )
    );
  };

  // Delete Diner
  const handleDeleteDiner = (dinerId) => {
    setDiners((prev) => prev.filter((d) => d.id !== dinerId));
  };

  // Quick Attendance Increment
  const handleQuickAttendance = (mealKey) => {
    if (!messMenu?.todayAttendance) return;
    updateMessAttendance({
      ...messMenu.todayAttendance,
      [mealKey]: (messMenu.todayAttendance[mealKey] || 0) + 1,
    });
  };

  return (
    <div className="space-y-6 pb-14 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-[#5243C2]" />
              <span>Mess & Dining Reports</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5243C2]/10 text-[#5243C2] border border-[#5243C2]/20">
              {monthlySubscribers.length} Monthly • {dailyDiners.length} Daily
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track subscribers on monthly food plans, daily walk-in meal sales, food collections, and meal attendance.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsWalkinModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>+ Log Walk-in Meal</span>
          </button>

          <button
            onClick={() => setIsAddDinerModalOpen(true)}
            className="px-3.5 py-2 bg-[#5243C2] hover:bg-[#4335A7] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Subscriber</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Monthly Subscribers */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Monthly Users
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{monthlySubscribers.length}</span>
            <Users className="w-4 h-4 text-[#5243C2]" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Recurring subscribers</p>
        </div>

        {/* Daily Diners */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Daily Walk-in Users
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-600">{dailyDiners.length}</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Pay-per-meal users</p>
        </div>

        {/* Total Inflow */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Mess Inflow
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#5243C2]">
              ₹{totalMessRevenue.toLocaleString('en-IN')}
            </span>
            <TrendingUp className="w-4 h-4 text-[#5243C2]" />
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            ₹{monthlyRevenue.toLocaleString('en-IN')} Monthly · ₹{dailyRevenue} Daily
          </p>
        </div>

        {/* Pending Collections */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Dues
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-amber-500">
              ₹{pendingRevenue.toLocaleString('en-IN')}
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {monthlySubscribers.filter((d) => d.status === 'Pending').length} unpaid subscribers
          </p>
        </div>

        {/* Today's Meals Served */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Today's Attendance
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{todayMealsTotal}</span>
            <UtensilsCrossed className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Meals served today</p>
        </div>
      </div>

      {/* Today's Live Attendance Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#5243C2]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Today's Live Meal Attendance
            </h3>
          </div>
          <button
            onClick={() => setPage('Mess Management')}
            className="text-xs font-bold text-[#5243C2] hover:underline cursor-pointer"
          >
            Weekly Menu & Details →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          {/* Breakfast */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                Breakfast
              </span>
              <p className="text-xl font-black text-slate-900 mt-0.5">
                {messMenu?.todayAttendance?.breakfast || 0}
              </p>
            </div>
            <button
              onClick={() => handleQuickAttendance('breakfast')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-[#5243C2] hover:text-white text-slate-700 transition cursor-pointer text-xs font-bold"
              title="Add breakfast diner"
            >
              +1
            </button>
          </div>

          {/* Lunch */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-emerald-500" />
                Lunch
              </span>
              <p className="text-xl font-black text-emerald-600 mt-0.5">
                {messMenu?.todayAttendance?.lunch || 0}
              </p>
            </div>
            <button
              onClick={() => handleQuickAttendance('lunch')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-emerald-600 hover:text-white text-slate-700 transition cursor-pointer text-xs font-bold"
              title="Add lunch diner"
            >
              +1
            </button>
          </div>

          {/* Snacks */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Snacks
              </span>
              <p className="text-xl font-black text-amber-600 mt-0.5">
                {messMenu?.todayAttendance?.snacks || 0}
              </p>
            </div>
            <button
              onClick={() => handleQuickAttendance('snacks')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-amber-600 hover:text-white text-slate-700 transition cursor-pointer text-xs font-bold"
              title="Add snacks diner"
            >
              +1
            </button>
          </div>

          {/* Dinner */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                Dinner
              </span>
              <p className="text-xl font-black text-indigo-600 mt-0.5">
                {messMenu?.todayAttendance?.dinner || 0}
              </p>
            </div>
            <button
              onClick={() => handleQuickAttendance('dinner')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-indigo-600 hover:text-white text-slate-700 transition cursor-pointer text-xs font-bold"
              title="Add dinner diner"
            >
              +1
            </button>
          </div>
        </div>
      </div>

      {/* Directory & Subscribers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-5">
        {/* Table Filters Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#5243C2]" />
            <h3 className="text-sm font-bold text-slate-900">
              Active Subscribers & Diners Directory
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
              {filteredDiners.length} People
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
              />
            </div>

            {/* Plan Filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold gap-0.5">
              {['All', 'Monthly', 'Daily'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPlan(p)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                    filterPlan === p
                      ? 'bg-white text-[#5243C2] font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold gap-0.5">
              {['All', 'Paid', 'Pending'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                    filterStatus === s
                      ? 'bg-white text-[#5243C2] font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3">DINER / MEMBER</th>
                <th className="pb-3 px-3">PLAN TYPE</th>
                <th className="pb-3 px-3">FACILITY</th>
                <th className="pb-3 px-3">RATE / FEE</th>
                <th className="pb-3 px-3">MEALS / DIET</th>
                <th className="pb-3 px-3">PAYMENT</th>
                <th className="pb-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDiners.map((diner) => (
                <tr key={diner.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#5243C2]/10 text-[#5243C2] font-bold flex items-center justify-center shrink-0 text-xs">
                        {diner.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{diner.name}</p>
                        <p className="text-[11px] text-slate-400">{diner.phone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        diner.planType === 'Monthly'
                          ? 'bg-indigo-50 text-[#5243C2] border border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {diner.planType} Plan
                    </span>
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-600">
                    {diner.messName}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-extrabold text-slate-900">
                      ₹{Number(diner.rate).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {diner.planType === 'Monthly' ? 'per month' : 'per meal'}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-700 font-medium">{diner.meals}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          diner.diet === 'Veg'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {diner.diet}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleTogglePayment(diner.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition ${
                        diner.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Click to toggle payment status"
                    >
                      {diner.status === 'Paid' ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Paid</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>Pending</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDeleteDiner(diner.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Remove diner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredDiners.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No subscribers match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Add New Diner / Subscriber Modal */}
      {/* ========================================================= */}
      {isAddDinerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#5243C2]" />
                <span>Add Mess Subscriber</span>
              </h3>
              <button
                onClick={() => setIsAddDinerModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDiner} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newDiner.name}
                  onChange={(e) => setNewDiner({ ...newDiner, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 98765 43210"
                    value={newDiner.phone}
                    onChange={(e) => setNewDiner({ ...newDiner, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Plan Type
                  </label>
                  <select
                    value={newDiner.planType}
                    onChange={(e) =>
                      setNewDiner({
                        ...newDiner,
                        planType: e.target.value,
                        rate: e.target.value === 'Monthly' ? '3500' : '100',
                      })
                    }
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  >
                    <option value="Monthly">Monthly Plan</option>
                    <option value="Daily">Daily Pay</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    {newDiner.planType === 'Monthly' ? 'Monthly Fee (₹)' : 'Daily Rate (₹)'}
                  </label>
                  <input
                    type="number"
                    value={newDiner.rate}
                    onChange={(e) => setNewDiner({ ...newDiner, rate: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Diet Preference
                  </label>
                  <select
                    value={newDiner.diet}
                    onChange={(e) => setNewDiner({ ...newDiner, diet: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  >
                    <option value="Veg">Pure Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Jain">Jain Food</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Meals Included
                </label>
                <select
                  value={newDiner.meals}
                  onChange={(e) => setNewDiner({ ...newDiner, meals: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                >
                  <option value="All 3 Meals">All 3 Meals (Breakfast, Lunch, Dinner)</option>
                  <option value="Lunch + Dinner">Lunch + Dinner</option>
                  <option value="Dinner only">Dinner only</option>
                  <option value="Lunch only">Lunch only</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Mess Facility
                  </label>
                  <input
                    type="text"
                    value={newDiner.messName}
                    onChange={(e) => setNewDiner({ ...newDiner, messName: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newDiner.status}
                    onChange={(e) => setNewDiner({ ...newDiner, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  >
                    <option value="Paid">Paid (Current Month)</option>
                    <option value="Pending">Pending / Unpaid</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDinerModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5243C2] hover:bg-[#4335A7] text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Add Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Log Walk-in Meal Modal */}
      {/* ========================================================= */}
      {isWalkinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Log Daily Walk-in Meal</span>
              </h3>
              <button
                onClick={() => setIsWalkinModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogWalkin} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Customer / Description
                </label>
                <input
                  type="text"
                  value={walkinForm.name}
                  onChange={(e) => setWalkinForm({ ...walkinForm, name: e.target.value })}
                  placeholder="e.g. Walk-in Guest, Student Walk-in"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Meal Type
                  </label>
                  <select
                    value={walkinForm.mealType}
                    onChange={(e) => setWalkinForm({ ...walkinForm, mealType: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Plates / Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={walkinForm.quantity}
                    onChange={(e) => setWalkinForm({ ...walkinForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Rate per Plate (₹)
                  </label>
                  <input
                    type="number"
                    value={walkinForm.ratePerMeal}
                    onChange={(e) => setWalkinForm({ ...walkinForm, ratePerMeal: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Payment Method
                  </label>
                  <select
                    value={walkinForm.paymentMethod}
                    onChange={(e) => setWalkinForm({ ...walkinForm, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  >
                    <option value="UPI">UPI (QR / PhonePe)</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] text-emerald-700 font-semibold">Total Collection Amount:</span>
                <p className="text-lg font-black text-emerald-800">
                  ₹{(Number(walkinForm.quantity || 1) * Number(walkinForm.ratePerMeal || 100)).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWalkinModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Record & Log Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
