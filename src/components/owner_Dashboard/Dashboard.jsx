import React from 'react';
import {
  Building2,
  DoorOpen,
  Users,
  CalendarClock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Dashboard({ setPage = () => {} }) {
  const {
    user,
    summary,
    properties,
    rooms,
    tenants,
    reminders,
    transactions,
    setIsAddModalOpen,
    setAddModalType,
  } = useApp();

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  const summaryCards = [
    {
      title: 'Total Properties',
      value: String(properties.length).padStart(2, '0'),
      subtitle: 'Managed properties',
      icon: Building2,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Total Rooms',
      value: String(summary.totalRooms || rooms.length || 0).padStart(2, '0'),
      subtitle: 'Across all properties',
      icon: DoorOpen,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Tenants',
      value: String(tenants.length).padStart(2, '0'),
      subtitle: 'Active tenants in DB',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Pending Rent',
      value: formatCurrency(summary.pendingRentTotal),
      subtitle: 'Awaiting collection',
      icon: CalendarClock,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  const pendingReminders = reminders.filter((r) => r.status !== 'Paid');
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-6 pb-8">
      {/* Welcome Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-extrabold tracking-wider text-indigo-600 uppercase">
            LIVE DATABASE OVERVIEW
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {user?.displayName || user?.name || 'Owner'}!
          </h1>

          <p className="mt-1 text-xs text-slate-500 font-medium">
            Here is your live real-time overview connected directly to MongoDB.
          </p>
        </div>

        <button
          onClick={() => {
            setAddModalType('property');
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5243C2] hover:bg-[#4335a9] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Property</span>
        </button>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>

                <div className={`rounded-xl p-2.5 ${card.color}`}>
                  <Icon size={19} />
                </div>
              </div>

              <h2 className="mt-3 text-2xl font-black text-slate-900">
                {card.value}
              </h2>

              <p className="mt-1 text-xs text-slate-400 font-medium">
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </section>

      {/* Rent Overview and Occupancy */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Rent Collection */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 xl:col-span-2">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Rent & Collections Overview
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Aggregated financial performance for {summary.balanceMonth || 'Current Month'}
              </p>
            </div>

            <span className="w-fit rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-100">
              Database Synced
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <TrendingUp size={16} />
                <span>Monthly Rent Inflow</span>
              </div>

              <p className="mt-2 text-2xl font-black text-emerald-900">
                {formatCurrency(summary.monthlyIncome)}
              </p>

              <p className="mt-1 text-[11px] font-medium text-emerald-700">
                Total rent income logged in database
              </p>
            </div>

            <div className="rounded-2xl bg-rose-50/70 border border-rose-100 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                <TrendingDown size={16} />
                <span>Pending Rent Due</span>
              </div>

              <p className="mt-2 text-2xl font-black text-rose-900">
                {formatCurrency(summary.pendingRentTotal)}
              </p>

              <p className="mt-1 text-[11px] font-medium text-rose-600">
                Unpaid rent from active reminders
              </p>
            </div>
          </div>

          {/* Simple collection performance bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Collection Rate</span>
              <span className="text-indigo-600">
                {summary.monthlyIncome + summary.pendingRentTotal > 0
                  ? Math.round(
                      (summary.monthlyIncome / (summary.monthlyIncome + summary.pendingRentTotal)) * 100
                    )
                  : 0}
                %
              </span>
            </div>

            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    summary.monthlyIncome + summary.pendingRentTotal > 0
                      ? Math.round(
                          (summary.monthlyIncome / (summary.monthlyIncome + summary.pendingRentTotal)) * 100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Room Occupancy */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Room Occupancy
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              Live capacity from MongoDB
            </p>

            <div className="my-6 flex items-center justify-center">
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-[10px] border-emerald-100 bg-emerald-50/30">
                <span className="text-2xl font-black text-slate-900">
                  {summary.occupancyRate}%
                </span>
                <span className="text-[11px] font-bold text-slate-400 mt-0.5">
                  Occupied
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Occupied Rooms
                </span>
                <span className="font-bold text-slate-900">
                  {summary.occupiedRooms} rooms
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  Vacant Rooms
                </span>
                <span className="font-bold text-slate-900">
                  {summary.vacantRooms} rooms
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPage('Rooms')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50 cursor-pointer"
          >
            <span>Manage Rooms</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Upcoming Rent and Recent Activities from Database */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Upcoming Payments from Reminders Collection */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Pending Rent & Reminders
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Active reminders from database
              </p>
            </div>

            <button
              onClick={() => setPage('Rent Management')}
              className="flex shrink-0 items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {pendingReminders.slice(0, 4).map((reminder) => (
              <div
                key={reminder.id || reminder._id}
                className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Users size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-800">
                      {reminder.tenantName}
                    </p>

                    <p className="truncate text-[11px] text-slate-400 mt-0.5">
                      {reminder.property} · Room {reminder.room}
                    </p>

                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                      <Clock size={11} />
                      {reminder.dueDate || 'Pending'}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-xs font-black text-slate-900">
                  {formatCurrency(reminder.amount)}
                </p>
              </div>
            ))}

            {pendingReminders.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No pending rent reminders in database.
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions from Transactions Collection */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Recent Transactions
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Income and expenses logged in database
              </p>
            </div>

            <button
              onClick={() => setPage('Expenses')}
              className="flex shrink-0 items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id || tx._id}
                className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {tx.type === 'income' ? <CheckCircle2 size={16} /> : <Wallet size={16} />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-800">
                    {tx.title}
                  </p>

                  <p className="truncate text-[11px] text-slate-400 mt-0.5">
                    {tx.category} · {tx.method}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={`text-xs font-black ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                  </p>

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {tx.date}
                  </p>
                </div>
              </div>
            ))}

            {recentTransactions.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No transactions recorded in database yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
