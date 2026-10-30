import React from 'react';
import { Plus, ArrowUpRight, TrendingDown, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Expenses() {
  const { transactions, setIsAddModalOpen, setAddModalType } = useApp();

  const expenseList = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenseList.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Group by category
  const categories = {};
  expenseList.forEach((item) => {
    categories[item.category] = (categories[item.category] || 0) + Number(item.amount);
  });

  const budgets = [
    { name: 'Bills & Utilities', spent: categories['Bills'] || 0, budget: 6000, color: 'bg-indigo-500' },
    { name: 'Property Maintenance', spent: categories['Maintenance'] || 0, budget: 5000, color: 'bg-amber-500' },
    { name: 'Food & Mess Grocery', spent: categories['Food'] || 0, budget: 12000, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Expense Tracking
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Monitor property upkeep, utilities, mess inventory, and recurring costs.
          </p>
        </div>

        <button
          onClick={() => {
            setAddModalType('transaction');
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#EF4444] hover:bg-[#dc2626] text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-200 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense Record</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Monthly Outflow</p>
          <p className="text-3xl font-black text-[#EF4444] mt-2">₹{totalExpense.toLocaleString('en-IN')}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            Live expenses logged
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Utility Bills</p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            ₹{(categories['Bills'] || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs font-medium text-slate-400 mt-1">Power, water, WiFi</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Maintenance & Upkeep</p>
          <p className="text-3xl font-black text-amber-600 mt-2">
            ₹{(categories['Maintenance'] || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs font-medium text-slate-400 mt-1">Plumbing, supplies, repairs</p>
        </div>
      </div>

      {/* Category Budgets vs Actuals */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <h3 className="text-base font-bold text-slate-900">Budget Limits & Utilization</h3>
        <div className="space-y-4">
          {budgets.map((b, idx) => {
            const pct = b.budget > 0 ? Math.min(100, Math.round((b.spent / b.budget) * 100)) : 0;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>{b.name}</span>
                  <span>
                    ₹{b.spent.toLocaleString('en-IN')} / ₹{b.budget.toLocaleString('en-IN')} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Records Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recorded Expenses</h3>
          <span className="text-xs font-bold text-slate-400">{expenseList.length} Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">EXPENSE ITEM</th>
                <th className="py-3.5 px-4">CATEGORY</th>
                <th className="py-3.5 px-4">DATE</th>
                <th className="py-3.5 px-4">PAYMENT MODE</th>
                <th className="py-3.5 px-6 text-right">AMOUNT SPENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenseList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        {item.notes && <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-slate-500">{item.date}</td>
                  <td className="py-4 px-4 text-xs font-semibold text-slate-700">{item.method}</td>
                  <td className="py-4 px-6 text-right font-black text-sm text-[#EF4444]">
                    -₹{Number(item.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {expenseList.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-sm">
              No expense records found in database yet. Click &quot;Add Expense Record&quot; to log your first expense.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
