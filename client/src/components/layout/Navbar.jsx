import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet, Plus, LogOut, Sun, Moon, Coins, Settings, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            
            {/* Logo & Brand with Pop Effect (Clean & responsive min-w-0) */}
            <div className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white badge-3d shadow-md sm:shadow-lg shadow-indigo-500/30 group-hover:rotate-6 transition-transform flex-shrink-0">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex items-center">
                <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent truncate">
                  FinanceFlow
                </span>
                <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Analytics
                </span>
              </div>
            </div>

            {/* DESKTOP ACTIONS (Screens >= 640px) */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-shrink-0">
              
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
                <span>Add Transaction</span>
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

            {/* MOBILE COMPACT ACTIONS (Screens < 640px) */}
            <div className="flex sm:hidden items-center gap-1.5 flex-shrink-0">
              
              {/* Compact Quick Add Transaction */}
              <button
                type="button"
                onClick={onOpenAddModal}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-transform active:scale-95"
                title="Add Transaction"
                aria-label="Add Transaction"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Hamburger Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="p-2 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
                title={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* MOBILE DROPDOWN DRAWER */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4 space-y-3 shadow-xl animate-fadeIn">
            
            {/* User Info Bar */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm badge-3d flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Signed in as</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>

            {/* Currency Selector Row */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Coins className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  Currency
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <select
                  id="mobile-currency-select"
                  value={currency || 'INR'}
                  onChange={(e) => changeCurrency(e.target.value)}
                  className="bg-white dark:bg-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setShowCurrencyModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="All Currencies Modal"
                  aria-label="Open All Currencies Modal"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                <span>Theme Mode</span>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                {darkMode ? 'Dark' : 'Light'}
              </span>
            </button>

            {/* Add Transaction Button in Mobile Menu */}
            <button
              type="button"
              onClick={() => {
                onOpenAddModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>

          </div>
        )}
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
