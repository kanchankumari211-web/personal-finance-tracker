import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, getCurrencySymbol } from '../../utils/formatCurrency';

const StatCards = ({ summary = {}, currency = 'USD' }) => {
  const totalIncome = summary.totalIncome || 0;
  const totalExpense = summary.totalExpense || 0;
  const balance = summary.balance !== undefined ? summary.balance : totalIncome - totalExpense;
  const currencySymbol = getCurrencySymbol(currency);

  // Calculate savings rate
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      {/* 1. Net Balance with 3D Elevation */}
      <div className="p-6 rounded-3xl glass-panel card-3d relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Balance
          </span>
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center badge-3d ${
            balance >= 0 
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/25' 
              : 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-rose-500/25'
          }`}>
            <span className="text-lg font-bold">{currencySymbol}</span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className={`text-3xl font-extrabold tracking-tight font-mono ${
            balance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {formatCurrency(balance, currency)}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
              balance >= 0 
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300' 
                : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
            }`}>
              {balance >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {balance >= 0 ? 'Surplus' : 'Deficit'}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Live calculated</span>
          </div>
        </div>
      </div>

      {/* 2. Total Income with 3D Elevation */}
      <div className="p-6 rounded-3xl glass-panel card-3d relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Income
          </span>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white flex items-center justify-center badge-3d shadow-emerald-500/25">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
            +{formatCurrency(totalIncome, currency)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <span>Total earnings logged in {currency}</span>
          </p>
        </div>
      </div>

      {/* 3. Total Expenses with 3D Elevation */}
      <div className="p-6 rounded-3xl glass-panel card-3d relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Expenses
          </span>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-400 text-white flex items-center justify-center badge-3d shadow-rose-500/25">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400 font-mono">
            -{formatCurrency(totalExpense, currency)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <span>Total spending recorded in {currency}</span>
          </p>
        </div>
      </div>

      {/* 4. Savings Rate with 3D Elevation */}
      <div className="p-6 rounded-3xl glass-panel card-3d relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Savings Rate
          </span>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center badge-3d shadow-indigo-500/25">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">
              {savingsRate}%
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Target: 30%+</span>
          </div>
          <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 h-2 rounded-full mt-3 overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-indigo-600 to-violet-500 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default StatCards;
