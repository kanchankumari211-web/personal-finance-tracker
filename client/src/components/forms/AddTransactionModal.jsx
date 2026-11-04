import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Tag, FileText, Coins } from 'lucide-react';
import toast from 'react-hot-toast';
import { SUPPORTED_CURRENCIES, getCurrencySymbol, DEFAULT_CURRENCY } from '../../utils/formatCurrency';

const DEFAULT_EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Rent & Housing',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Travel',
  'Other',
];

const DEFAULT_INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Gifts',
  'Other',
];

const AddTransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  currency = 'INR',
  defaultCurrency = 'INR',
}) => {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('DEFAULT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute effective currency for this transaction
  const effectiveCurrency = selectedCurrency === 'DEFAULT'
    ? (defaultCurrency || currency || DEFAULT_CURRENCY)
    : selectedCurrency;

  // Auto-switch default category when type toggles
  useEffect(() => {
    if (type === 'income') {
      setCategory('Salary');
    } else {
      setCategory('Food & Dining');
    }
  }, [type]);

  // Reset selectedCurrency to DEFAULT when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCurrency('DEFAULT');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title or description.');
      return;
    }

    if (title.trim().length > 100) {
      toast.error('Title cannot exceed 100 characters.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0.');
      return;
    }

    if (parsedAmount > 100000000) {
      toast.error('Amount cannot exceed 100,000,000.');
      return;
    }

    if (notes.trim().length > 300) {
      toast.error('Notes cannot exceed 300 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        amount: parsedAmount,
        type,
        category,
        date,
        currency: effectiveCurrency,
        notes: notes.trim(),
      });
      // Reset form on success
      setTitle('');
      setAmount('');
      setNotes('');
      setSelectedCurrency('DEFAULT');
      setDate(new Date().toISOString().slice(0, 10));
      onClose();
    } catch (error) {
      // Error handled by parent or toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories =
    type === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-3xl glass-panel bg-white/95 dark:bg-slate-900/95 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden card-3d"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Add Transaction
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Record new income or expense with currency options
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Income vs Expense Pill Toggle */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Income
            </button>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Title / Description *
            </label>
            <input
              type="text"
              id="txn-title"
              required
              maxLength={100}
              placeholder={type === 'income' ? 'e.g. Monthly Salary' : 'e.g. Grocery Store'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Currency Selection Section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Currency Selection
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {selectedCurrency === 'DEFAULT' ? `Default (${effectiveCurrency})` : `${effectiveCurrency}`}
              </span>
            </div>
            <div className="relative">
              <Coins className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="txn-currency-select"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 appearance-none cursor-pointer"
              >
                {/* Default Section */}
                <optgroup label="⭐ Default Currency Section" className="font-bold text-indigo-600 dark:text-indigo-400">
                  <option value="DEFAULT">
                    Default Selection ({getCurrencySymbol(defaultCurrency || currency)} {defaultCurrency || currency})
                  </option>
                </optgroup>

                {/* All Supported Currencies */}
                <optgroup label="🌐 All Available Currencies" className="font-bold text-slate-500">
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code} — {c.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ▼
              </span>
            </div>
          </div>

          {/* Amount & Date side-by-side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Amount ({effectiveCurrency}) *
              </label>
              <div className="relative">
                <span className="w-5 h-5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-bold flex items-center justify-center font-mono">
                  {getCurrencySymbol(effectiveCurrency)}
                </span>
                <input
                  type="number"
                  id="txn-amount"
                  step="0.01"
                  min="0.01"
                  max="100000000"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  id="txn-date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Category *
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                id="txn-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 appearance-none"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <textarea
                id="txn-notes"
                rows="2"
                maxLength={300}
                placeholder="Optional notes or receipt references..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow-lg transition-all btn-3d disabled:opacity-50 ${
                type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Add Transaction'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
