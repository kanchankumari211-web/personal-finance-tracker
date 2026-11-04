import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Download,
  Calendar,
  Tag,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const TransactionTable = ({
  transactions = [],
  categories = [],
  currency = 'USD',
  onDeleteTransaction,
  isDeletingId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter transactions locally
  const filtered = transactions.filter((txn) => {
    const matchesSearch =
      !searchTerm ||
      txn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (txn.notes && txn.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      selectedType === 'all' || txn.type === selectedType;

    const matchesCategory =
      selectedCategory === 'all' || txn.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Export to CSV feature (Bonus Use Case 9)
  const exportToCSV = () => {
    if (filtered.length === 0) return;

    const headers = ['Date', 'Title', 'Type', 'Category', 'Amount', 'Notes'];
    const rows = filtered.map((t) => [
      new Date(t.date).toISOString().split('T')[0],
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      `"${t.category}"`,
      t.amount,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `transactions_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-3xl glass-panel card-3d shadow-sm overflow-hidden border border-slate-200/80 dark:border-slate-800">
      
      {/* Header & Filter Controls Bar */}
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Transaction History
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filtered.length} of {transactions.length} records
            </p>
          </div>

          {/* Export to CSV CTA */}
          <button
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-fit"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-transactions"
              placeholder="Search description or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-0.5 text-xs">
            {['all', 'income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`flex-1 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  selectedType === t
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-800 dark:text-slate-100 appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Filter className="w-5 h-5" />
            </div>
            <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No transactions found
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {transactions.length === 0
                ? "You haven't logged any transactions yet. Click 'Add Transaction' to get started."
                : 'Try adjusting your search query or filter options above.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                <th className="py-3 px-4">Transaction</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filtered.map((txn) => {
                const isIncome = txn.type === 'income';
                return (
                  <tr
                    key={txn._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Title & icon */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isIncome
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {txn.title}
                          </p>
                          {txn.notes && (
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">
                              {txn.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category pill */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {txn.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-4">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(txn.date)}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-semibold">
                      <span
                        className={
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(txn.amount, currency)}
                      </span>
                    </td>

                    {/* Action: Delete */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onDeleteTransaction(txn._id)}
                        disabled={isDeletingId === txn._id}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                        title="Delete transaction"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default TransactionTable;
