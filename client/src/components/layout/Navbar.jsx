import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet, Plus, LogOut, Sun, Moon, Coins, Settings } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../../utils/formatCurrency';
import CurrencyModal from '../common/CurrencyModal';

const Navbar = ({ onOpenAddModal }) => {
  const {
    user,
    logout,
    darkMode,
    toggleDarkMode,
    currency,
    changeCurrency,
  } = useAuth();

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand with Pop Effect */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white badge-3d shadow-lg shadow-indigo-500/30 group-hover:rotate-6 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                  FinanceFlow
                </span>
                <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Analytics
                </span>
              </div>
            </div>

            {/* Action buttons & User profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Currency Selector Pill */}
              <div className="relative flex items-center gap-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-inner">
                  <Coins className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <select
                    id="navbar-currency-select"
                    value={currency || 'INR'}
                    onChange={(e) => changeCurrency(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer appearance-none pr-3"
                    title={`Active Currency: ${currency}`}
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium">
                        {c.symbol} {c.code}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none text-[10px] text-slate-400 -ml-2">▼</span>
                </div>

                {/* Manage Currency Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setShowCurrencyModal(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Select Currency"
                  aria-label="Select Currency"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Add Button with Emboss */}
              <button
                id="add-transaction-btn"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 btn-3d"
                title="Add new transaction"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Transaction</span>
              </button>

              {/* Dark / Light Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Profile Pill & Logout */}
              <div className="flex items-center pl-2 border-l border-slate-200 dark:border-slate-800 gap-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">Welcome,</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {user?.name || 'User'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs badge-3d">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <button
                  id="logout-btn"
                  onClick={() => logout(true)}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Currency Selection Modal - Portaled to document.body outside Navbar stacking context */}
      <CurrencyModal
        isOpen={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        selectedCurrency={currency}
        onSelectCurrency={changeCurrency}
      />
    </>
  );
};

export default Navbar;
