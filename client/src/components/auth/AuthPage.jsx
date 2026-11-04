import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Wallet,
  Lock,
  Mail,
  User,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Sparkles,
  Coins,
  Sun,
  Moon,
  CreditCard,
  Wifi,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SUPPORTED_CURRENCIES, formatCurrency, getCurrencySymbol } from '../../utils/formatCurrency';

const AuthPage = () => {
  const {
    login,
    register,
    demoLogin,
    darkMode,
    toggleDarkMode,
    currency,
    defaultCurrency,
    activeCurrency,
    changeCurrency,
    setDefaultCurrency,
  } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Default selected display currency from AuthContext
  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'DEFAULT');

  // Synchronize when AuthContext currency changes
  useEffect(() => {
    if (currency) {
      setSelectedCurrency(currency);
    }
  }, [currency]);

  const handleCurrencyChange = (newCurr) => {
    setSelectedCurrency(newCurr);
    changeCurrency(newCurr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name.trim(), email, password, selectedCurrency);
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo user quick login with fresh sample data
  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await demoLogin();
    } finally {
      setLoading(false);
    }
  };

  const activeSymbol = getCurrencySymbol(selectedCurrency);

  return (
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden scroll-smooth flex flex-col justify-between bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50 text-slate-800 dark:text-slate-100 transition-colors relative selection:bg-indigo-500 selection:text-white">
      
      {/* Background Lighting & Ambient Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500/15 dark:bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between relative z-10">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white badge-3d shadow-xl shadow-indigo-500/30 group-hover:rotate-6 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              FinanceFlow
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Analytics
            </span>
          </div>
        </div>

        {/* Header Right Actions: Currency Selector & Theme Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Default Selected Currency Dropdown (Live Sync) */}
          <div className="relative flex items-center" title="Select default display currency">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-sm hover:border-indigo-500/50 transition-colors">
              <Coins className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <div className="flex flex-col text-left mr-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 leading-none">Currency</span>
                <select
                  id="header-currency-select"
                  value={selectedCurrency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="bg-transparent text-xs font-extrabold text-indigo-600 dark:text-indigo-400 focus:outline-none cursor-pointer appearance-none pr-3"
                >
                  <optgroup label="⭐ Default Section" className="font-bold text-indigo-600 dark:text-indigo-400">
                    <option value="DEFAULT" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold">
                      Default ({getCurrencySymbol(defaultCurrency)} {defaultCurrency})
                    </option>
                  </optgroup>
                  <optgroup label="🌐 All Currencies" className="font-bold text-slate-500">
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold">
                        {c.symbol} {c.code} — {c.name.split(' ')[0]}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <span className="pointer-events-none text-[10px] text-slate-400 -ml-2">▼</span>
            </div>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-white/80 dark:bg-slate-900/80 glass-panel shadow-sm hover:shadow-md transition-all badge-3d"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 flex items-center justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          
          {/* Left Column: Showcase Card & Interactive Visuals */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-violet-500/10 dark:from-indigo-950/70 dark:to-purple-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              Next-Gen Personal Finance
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Know where{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                every rupee
              </span>{' '}
              goes.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Record income and expenses, see clear charts of your spending, and watch your savings rate grow, all in one secure dashboard.
            </p>

            {/* FLOATING FINANCIAL CARD DEMO */}
            <div className="relative py-4 max-w-md mx-auto lg:mx-0">
              
              {/* Floating Income Pill (Top Right) */}
              <div className="absolute -top-1 -right-2 sm:-right-4 z-20 animate-float-3d" style={{ animationDelay: '0.8s' }}>
                <div className="px-3.5 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-xl shadow-emerald-500/30 flex items-center gap-2 border border-emerald-400/50 backdrop-blur-md badge-3d">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{formatCurrency(45000, selectedCurrency)} Income</span>
                </div>
              </div>

              {/* Floating Savings Pill (Bottom Left) */}
              <div className="absolute -bottom-2 -left-2 sm:-left-4 z-20 animate-float-3d" style={{ animationDelay: '1.5s' }}>
                <div className="px-3.5 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-xl shadow-indigo-500/30 flex items-center gap-2 border border-indigo-400/50 backdrop-blur-md badge-3d">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Savings Goal: 42% Achieved</span>
                </div>
              </div>

              {/* The Metallic Card Itself */}
              <div className="w-full h-52 sm:h-56 rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl shadow-indigo-950/40 border border-indigo-500/30 relative overflow-hidden card-3d animate-float-3d">
                {/* Metallic holographic sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <span className="font-mono text-xs font-bold tracking-widest text-indigo-300">
                      FINANCEFLOW
                    </span>
                  </div>
                  <Wifi className="w-5 h-5 text-slate-400 rotate-90" />
                </div>

                {/* EMV Chip */}
                <div className="flex items-center justify-between mt-5 relative z-10">
                  <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-md border border-amber-300/60 relative overflow-hidden flex items-center justify-center">
                    <div className="w-full h-0.5 bg-amber-600/40 my-0.5" />
                  </div>
                </div>

                {/* Balance Preview */}
                <div className="mt-4 relative z-10">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Live Balance
                  </p>
                  <p className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-0.5">
                    {formatCurrency(124500, selectedCurrency)}
                  </p>
                </div>

                {/* Cardholder name */}
                <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-slate-300 relative z-10">
                  <span>FINANCEFLOW MEMBER</span>
                </div>
              </div>

              {/* Sample preview label below card */}
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-2 text-center sm:text-left tracking-wide">
                Sample preview
              </p>

            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl glass-panel card-3d text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 badge-3d">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Live Analytics</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Monthly cashflow and category-wise charts that update instantly.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-panel card-3d text-left">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 badge-3d">
                  <PieChart className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Smart Categories</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Organise spending into Food, Rent, Travel and more, and see your savings rate.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-panel card-3d text-left">
                <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-2 badge-3d">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Secure by Design</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Passwords hashed with Bcrypt, sessions protected with JWT.
                </p>
              </div>
            </div>

            {/* Quick Demo CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 shadow-xl transition-all btn-3d"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Try Demo Account</span>
              </button>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Pre-loaded with sample transactions & charts
              </span>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl card-3d border border-slate-200/90 dark:border-slate-800 relative overflow-hidden">
              
              {/* Subtle top gloss bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              {/* Tab Selector */}
              <div className="flex p-1.5 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl mb-6 shadow-inner border border-slate-200/60 dark:border-slate-700/60">
                <button
                  type="button"
                  id="tab-sign-in"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                    isLogin
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md scale-100'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="tab-create-account"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                    !isLogin
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md scale-100'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isLogin ? 'Welcome back' : 'Create your free account'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isLogin
                    ? 'Sign in to view your finances.'
                    : `Get started with default display currency: ${selectedCurrency === 'DEFAULT' ? defaultCurrency : selectedCurrency}`}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name Field (Sign Up Only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        id="auth-name"
                        placeholder="e.g. Alex Johnson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 font-medium"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      id="auth-email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      id="auth-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 font-medium"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Preferred Currency Selector (Sign Up Only) */}
                {!isLogin && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Default Display Currency
                      </label>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        Selected: {activeSymbol} {selectedCurrency}
                      </span>
                    </div>
                    <div className="relative">
                      <Coins className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        id="auth-currency"
                        value={selectedCurrency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 text-xs font-semibold rounded-xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 appearance-none cursor-pointer"
                      >
                        <optgroup label="⭐ Default Section">
                          <option value="DEFAULT">
                            Default ({getCurrencySymbol(defaultCurrency)} {defaultCurrency})
                          </option>
                        </optgroup>
                        <optgroup label="🌐 Available Currencies">
                          {SUPPORTED_CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.symbol} {c.code} — {c.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        ▼
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  id="auth-submit-btn"
                  disabled={loading}
                  className="w-full mt-3 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition-all btn-3d flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Demo Shortcut */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Try Demo Account</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60 relative z-10">
        Personal Finance Tracker · Built with React, Tailwind CSS, Node.js & MongoDB · Selected Currency: <strong className="text-slate-600 dark:text-slate-400 font-mono">{selectedCurrency} ({activeSymbol})</strong>
      </footer>

    </div>
  );
};

export default AuthPage;
