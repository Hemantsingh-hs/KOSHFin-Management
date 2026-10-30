import React from 'react';
import { Download, BarChart2, TrendingUp, DollarSign, Users, Building } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Reports() {
  const { summary, properties, transactions } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial & Property Reports
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Comprehensive audit analytics, occupancy rates, and cash flow trends.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-[#5243C2] hover:bg-[#4335a9] text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-200 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Audit</span>
        </button>
      </div>

      {/* High-Level Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Collection</p>
          <p className="text-2xl font-black text-slate-900 mt-1">₹{summary.monthlyIncome.toLocaleString('en-IN')}</p>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
            {summary.monthlyIncome + summary.pendingRentTotal > 0
              ? `${Math.round((summary.monthlyIncome / (summary.monthlyIncome + summary.pendingRentTotal)) * 100)}% collection rate`
              : '0% collection rate'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Operating Costs</p>
          <p className="text-2xl font-black text-rose-600 mt-1">₹{summary.monthlyExpenses.toLocaleString('en-IN')}</p>
          <span className="text-[11px] font-bold text-slate-400 mt-1 block">
            {summary.monthlyIncome > 0
              ? `${Math.round((summary.monthlyExpenses / summary.monthlyIncome) * 100)}% of total inflow`
              : '0% of total inflow'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Operating Income</p>
          <p className="text-2xl font-black text-[#5243C2] mt-1">₹{summary.monthlySavings.toLocaleString('en-IN')}</p>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
            {summary.monthlyIncome > 0
              ? `${Math.round((summary.monthlySavings / summary.monthlyIncome) * 100)}% net savings`
              : '0% net savings'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Portfolio Occupancy</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{summary.occupancyRate}%</p>
          <span className="text-[11px] font-bold text-slate-400 mt-1 block">
            {summary.occupiedRooms} of {summary.totalRooms} rooms occupied
          </span>
        </div>
      </div>

      {/* Property-wise Revenue Performance */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Property Profitability Breakdown</h3>

        <div className="space-y-4">
          {properties.map((p) => {
            const occ = Number(p.occupancyRate || 0);
            return (
              <div key={p.id || p._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                  <p className="text-xs text-slate-400">{p.address || p.location || 'Address not set'} · {p.totalRooms || 0} Rooms</p>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Monthly Inflow</p>
                    <p className="text-sm font-black text-slate-800">₹{Number(p.monthlyRent || 0).toLocaleString('en-IN')}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Occupancy</p>
                    <p className="text-sm font-black text-[#5243C2]">{occ}%</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Status</p>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      {p.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {properties.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              No properties in database yet to report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
