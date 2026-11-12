import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import api from './api/axiosInstance';
import AuthPage from './components/auth/AuthPage';
import Navbar from './components/layout/Navbar';
import StatCards from './components/dashboard/StatCards';
import CategoryPieChart from './components/dashboard/CategoryPieChart';
import MonthlyBarChart from './components/dashboard/MonthlyBarChart';
import TransactionTable from './components/dashboard/TransactionTable';
import AddTransactionModal from './components/forms/AddTransactionModal';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, RefreshCw, Calendar, Sparkles } from 'lucide-react';

// Sample fallback dataset for zero-configuration preview
const DEMO_TRANSACTIONS = [
  {
    _id: 'demo-1',
    title: 'Monthly Salary',
    amount: 5000,
    type: 'income',
    category: 'Salary',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Direct deposit payroll',
  },
  {
    _id: 'demo-2',
    title: 'Apartment Rent',
    amount: 1450,
    type: 'expense',
    category: 'Rent & Housing',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    notes: 'Monthly lease payment',
  },
  {
    _id: 'demo-3',
    title: 'Whole Foods Market',
    amount: 165.40,
    type: 'expense',
    category: 'Food & Dining',
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    notes: 'Groceries & organic produce',
  },
  {
    _id: 'demo-4',
    title: 'Freelance Design Project',
    amount: 850,
    type: 'income',
    category: 'Freelance',
    date: new Date(Date.now() - 86400000 * 6).toISOString(),
    notes: 'Mobile app UI redesign',
  },
  {
    _id: 'demo-5',
    title: 'Electric & Internet Bill',
    amount: 142.80,
    type: 'expense',
    category: 'Utilities',
    date: new Date(Date.now() - 86400000 * 8).toISOString(),
    notes: 'High-speed fiber & power',
  },
  {
    _id: 'demo-6',
    title: 'Gas & Transit Pass',
    amount: 75.00,
    type: 'expense',
    category: 'Transportation',
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    notes: 'Subway & fuel recharge',
  },
];

function App() {
  const { user, isAuthenticated, loading: authLoading, currency, changeCurrency } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Helper to recompute stats from local list (used in fallback/optimistic mode)
  const computeLocalSummary = (txns) => {
    let income = 0;
    let expense = 0;
    const catMap = {};
    const monthMap = {};

    txns.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === 'income') {
        income += amt;
      } else {
        expense += amt;
        catMap[t.category] = (catMap[t.category] || 0) + amt;
      }

      const d = new Date(t.date);
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mName = `${d.toLocaleString('default', { month: 'short' })} '${String(d.getFullYear()).slice(-2)}`;
      if (!monthMap[mKey]) {
        monthMap[mKey] = { month: mName, income: 0, expense: 0 };
      }
      if (t.type === 'income') monthMap[mKey].income += amt;
      else monthMap[mKey].expense += amt;
    });

    const breakdown = Object.keys(catMap).map((k) => ({
      name: k,
      value: Number(catMap[k].toFixed(2)),
    }));

    const trends = Object.keys(monthMap)
      .sort()
      .slice(-6)
      .map((k) => ({
        month: monthMap[k].month,
        income: Number(monthMap[k].income.toFixed(2)),
        expense: Number(monthMap[k].expense.toFixed(2)),
      }));

    setSummary({
      totalIncome: Number(income.toFixed(2)),
      totalExpense: Number(expense.toFixed(2)),
      balance: Number((income - expense).toFixed(2)),
      transactionCount: txns.length,
    });
    setCategoryBreakdown(breakdown);
    setMonthlyTrends(trends);
  };

  // Fetch Dashboard Data from Backend API
  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingData(true);

    try {
      // 1. Fetch Categories
      try {
        const catRes = await api.get('/transactions/categories');
        if (catRes.data?.categories) {
          setCategories(catRes.data.categories);
        }
      } catch (e) {
        // Fallback default categories
        setCategories([
          'Salary',
          'Freelance',
          'Investments',
          'Food & Dining',
          'Rent & Housing',
          'Utilities',
          'Transportation',
          'Entertainment',
          'Healthcare',
          'Shopping',
          'Other',
        ]);
      }

      // 2. Fetch Transactions & Summary
      const [txnsRes, summaryRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/transactions/summary'),
      ]);

      if (txnsRes.data?.data) {
        setTransactions(txnsRes.data.data);
      }

      if (summaryRes.data) {
        setSummary(summaryRes.data.summary || {});
        setCategoryBreakdown(summaryRes.data.categoryBreakdown || []);
        setMonthlyTrends(summaryRes.data.monthlyTrends || []);
      }
      setIsDemoMode(false);
    } catch (error) {
      console.warn('Backend API currently unreachable or MongoDB starting; engaging demo state:', error.message);
      setIsDemoMode(true);
      setTransactions((prev) => (prev.length > 0 ? prev : DEMO_TRANSACTIONS));
      computeLocalSummary(DEMO_TRANSACTIONS);
    } finally {
      setIsLoadingData(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  // Handle Create Transaction
  const handleAddTransaction = async (formData) => {
    try {
      if (!isDemoMode) {
        const res = await api.post('/transactions', formData);
        if (res.data?.success) {
          toast.success('Transaction added successfully!');
          fetchDashboardData();
          return;
        }
      }

      // Offline / Demo optimistic update
      const newTxn = {
        _id: 'local-' + Date.now(),
        ...formData,
        amount: Number(formData.amount),
        date: formData.date || new Date().toISOString(),
      };
      const updated = [newTxn, ...transactions];
      setTransactions(updated);
      computeLocalSummary(updated);
      toast.success('Transaction added to dashboard!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save transaction.';
      toast.error(msg);
      throw error;
    }
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction record?')) {
      return;
    }

    setIsDeletingId(id);
    try {
      if (!isDemoMode && !id.startsWith('local-') && !id.startsWith('demo-')) {
        await api.delete(`/transactions/${id}`);
        toast.success('Transaction removed.');
        fetchDashboardData();
        return;
      }

      // Offline / Demo local delete
      const updated = transactions.filter((t) => t._id !== id);
      setTransactions(updated);
      computeLocalSummary(updated);
      toast.success('Transaction removed.');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete transaction.';
      toast.error(msg);
    } finally {
      setIsDeletingId(null);
    }
  };

  // Auth loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Initializing FinanceFlow...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated: Show Auth Landing Screen
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <AuthPage />
      </>
    );
  }

  const effectiveCurrency = currency || 'INR';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors flex flex-col justify-between overflow-x-hidden w-full">
      <Toaster position="top-right" />

      {/* Navigation */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1 space-y-6 sm:space-y-8">
        
        {/* Banner if in local demo / disconnected state */}
        {isDemoMode && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 card-3d">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>
                <strong>Demo Mode Active:</strong> Operating in interactive preview mode with live state calculation. Connect MongoDB Atlas to sync to persistent cloud storage.
              </span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-2.5 py-1 text-[11px] font-semibold bg-amber-200 dark:bg-amber-900/60 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1 self-end sm:self-auto flex-shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              Retry API
            </button>
          </div>
        )}

        {/* Dashboard Welcome Header (Stacked on mobile, row on desktop) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Financial Overview
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 sm:mt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm">
                Active: {effectiveCurrency}
              </span>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={fetchDashboardData}
              disabled={isLoadingData}
              className="p-2.5 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all flex items-center justify-center flex-shrink-0"
              title="Refresh dashboard data"
              aria-label="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            <button
              id="top-add-transaction-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 btn-3d w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* 1. Stat Summary Cards (Day 10) with 3D elevation */}
        <section aria-label="Financial Summary Cards" className="w-full">
          <StatCards summary={summary} currency={effectiveCurrency} />
        </section>

        {/* 2. Visual Charts Row (Day 8-9) with 3D elevation */}
        <section aria-label="Visual Analytics Charts" className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="w-full min-h-[350px] sm:h-[390px]">
            <CategoryPieChart data={categoryBreakdown} currency={effectiveCurrency} />
          </div>
          <div className="w-full min-h-[350px] sm:h-[390px]">
            <MonthlyBarChart data={monthlyTrends} currency={effectiveCurrency} />
          </div>
        </section>

        {/* 3. Transaction Table with Filters & CSV Export */}
        <section aria-label="Transaction Records" className="w-full">
          <TransactionTable
            transactions={transactions}
            categories={categories}
            currency={effectiveCurrency}
            onDeleteTransaction={handleDeleteTransaction}
            isDeletingId={isDeletingId}
          />
        </section>

      </main>

      {/* Modal Dialog */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTransaction}
        categories={categories}
        currency={effectiveCurrency}
        defaultCurrency={effectiveCurrency}
      />

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Personal Finance Tracker — All calculations done securely.</span>
          <span className="font-mono text-[11px]">API: {isDemoMode ? 'Demo / Local' : 'Connected'}</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
