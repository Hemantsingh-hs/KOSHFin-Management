import React, { useState } from 'react';
import { Plus, TrendingUp, ArrowDownLeft, Calendar, Filter, PieChart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Income() {
  const { transactions, setIsAddModalOpen, setAddModalType } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('August 2026');

  // Income transactions
  const incomeList = transactions.filter((t) => t.type === 'income');
  const totalIncome = incomeList.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Group by category
  const categories = {};
  incomeList.forEach((item) => {
    categories[item.category] = (categories[item.category] || 0) + Number(item.amount);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Income Streams
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Track PG rents, salaries, freelance and investment inflows.
          </p>
        </div>

        <button
          onClick={() => {
            setAddModalType('transaction');
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-200 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Income Record</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inflow (Month)</p>
          <p className="text-3xl font-black text-[#059669] mt-2">₹{totalIncome.toLocaleString('en-IN')}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Live income collections
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PG & Room Rentals</p>
          <p className="text-3xl font-black text-[#5243C2] mt-2">
            ₹{(categories['Rent'] || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs font-medium text-slate-400 mt-1">Tenant collections</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Salary & Other</p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            ₹{(categories['Income'] || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs font-medium text-slate-400 mt-1">Executive & consulting</p>
        </div>
      </div>

      {/* Income Records Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recorded Income Receipts</h3>
          <span className="text-xs font-bold text-slate-400">{incomeList.length} Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">SOURCE / TITLE</th>
                <th className="py-3.5 px-4">CATEGORY</th>
                <th className="py-3.5 px-4">DATE</th>
                <th className="py-3.5 px-4">METHOD</th>
                <th className="py-3.5 px-6 text-right">AMOUNT RECEIVED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incomeList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ArrowDownLeft className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        {item.notes && <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-slate-500">{item.date}</td>
                  <td className="py-4 px-4 text-xs font-semibold text-slate-700">{item.method}</td>
                  <td className="py-4 px-6 text-right font-black text-sm text-[#059669]">
                    +₹{Number(item.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {incomeList.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-sm">
              No income receipts recorded in database yet. Click &quot;Add Income Record&quot; to log your first payment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
