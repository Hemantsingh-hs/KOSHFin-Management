import React, { useState } from 'react';
import { Search, Plus, Download, Upload, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Transactions() {
  const { transactions, deleteTransaction, setIsAddModalOpen, setAddModalType } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const netCashFlow = totalIncome - totalExpenses;

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      typeFilter === 'All' ||
      (typeFilter === 'Income' && tx.type === 'income') ||
      (typeFilter === 'Expense' && tx.type === 'expense');

    const matchesCategory =
      categoryFilter === 'All' || tx.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleExport = () => {
    const headers = ['Transaction', 'Type', 'Category', 'Date', 'Method', 'Amount', 'Status', 'Notes'];
    const rows = filteredTransactions.map((t) => [
      `"${t.title}"`,
      t.type,
      t.category,
      `"${t.date}"`,
      t.method,
      t.amount,
      t.status,
      `"${t.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinTracker_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-10 text-[#091E42]">
      {/* Top Header & Action Buttons (Jira Standard Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Financial Transactions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit ledger of rental collections, utility invoices, and operating expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => alert('Import format: CSV file with columns (Transaction, Type, Category, Date, Method, Amount)')}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => {
              setAddModalType('transaction');
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Entry</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Boxes (Jira Expense Tracker Metric Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Transactions */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Entries Count</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{transactions.length}</p>
          <span className="text-[11px] text-slate-400">Total ledger logs</span>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Income</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">₹{totalIncome.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Rent & remittances</span>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Outflow</p>
          <p className="text-xl font-bold text-[#DE350B] mt-0.5">₹{totalExpenses.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-rose-600 font-medium">Operational upkeep</span>
        </div>

        {/* Net Cash Flow */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Net Yield</p>
          <p className={`text-xl font-bold mt-0.5 ${netCashFlow >= 0 ? 'text-[#0052CC]' : 'text-rose-600'}`}>
            ₹{netCashFlow.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Net operating balance</span>
        </div>
      </div>

      {/* Filter and Search Bar (Compact Standard Jira Style) */}
      <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, notes, or category..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50/70 text-xs text-slate-800 rounded-md border border-slate-300 focus:outline-none focus:border-[#0052CC] focus:bg-white transition"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#0052CC]"
          >
            <option value="All">All Types</option>
            <option value="Income">Income (+)</option>
            <option value="Expense">Expense (-)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#0052CC]"
          >
            <option value="All">All Categories</option>
            <option value="Income">Income / Salary</option>
            <option value="Rent">Rent</option>
            <option value="Food">Food & Mess</option>
            <option value="Bills">Bills & Utilities</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <span className="text-xs text-slate-500 font-medium pl-1">
            {filteredTransactions.length} logs
          </span>
        </div>
      </div>

      {/* Transactions Table (Jira Standard Sizing) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">TRANSACTION</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">METHOD</th>
                <th className="py-2.5 px-3 text-right">AMOUNT</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
                <th className="py-2.5 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          tx.type === 'income'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {tx.type === 'income' ? (
                          <ArrowDownLeft className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight">{tx.title}</p>
                        {tx.notes && <p className="text-[10px] text-slate-400 mt-0.2">{tx.notes}</p>}
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {tx.category}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-[11px] font-medium text-slate-600 whitespace-nowrap">
                    {tx.date}
                  </td>

                  <td className="py-2.5 px-3 text-xs text-slate-700">
                    {tx.method}
                  </td>

                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <span
                      className={`font-bold text-xs ${
                        tx.type === 'income' ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'income' ? '+ ' : '- '}₹{Number(tx.amount).toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 text-center">
                    <button
                      title="Delete"
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No transactions match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
