import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { DEFAULT_CURRENCY } from '../utils/formatCurrency';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('finance_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('finance_token'));
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('finance_theme') === 'dark' ||
      (!('finance_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Single unified source of truth for currency (Default: 'INR')
  const [currency, setCurrencyState] = useState(() => {
    const saved = localStorage.getItem('finance_currency');
    if (saved && saved !== 'DEFAULT') return saved;
    const defaultSaved = localStorage.getItem('finance_default_currency');
    if (defaultSaved && defaultSaved !== 'DEFAULT') return defaultSaved;
    if (user?.currency && user.currency !== 'DEFAULT') return user.currency;
    return DEFAULT_CURRENCY || 'INR';
  });

  // Update selected currency globally and sync with backend & localStorage
  const changeCurrency = async (newCurrency) => {
    if (!newCurrency || newCurrency === 'DEFAULT') return;
    const clean = newCurrency.trim().toUpperCase();
    setCurrencyState(clean);
    localStorage.setItem('finance_currency', clean);
    localStorage.setItem('finance_default_currency', clean);

    if (user) {
      const updatedUser = { ...user, currency: clean };
      setUser(updatedUser);
      localStorage.setItem('finance_user', JSON.stringify(updatedUser));

      try {
        await api.put('/auth/currency', { currency: clean });
      } catch (err) {
        console.warn('Backend currency sync note:', err.message);
      }
    }

    toast.success(`Currency set to ${clean}`);
  };

  // Apply dark class to documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('finance_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('finance_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Validate token with backend on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('finance_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('finance_user', JSON.stringify(res.data.user));
            // Only adopt user currency if local preference not already set
            const existingPref = localStorage.getItem('finance_currency');
            if (res.data.user?.currency && !existingPref) {
              setCurrencyState(res.data.user.currency);
              localStorage.setItem('finance_currency', res.data.user.currency);
            }
          }
        } catch (error) {
          console.warn('Session expired or invalid token');
          logout(false);
        }
      }
      setLoading(false);
    };

    verifyAuth();

    // Listen to unauthorized event from axios interceptor
    const handleUnauthorized = () => {
      logout(false);
      toast.error('Session expired. Please log in again.');
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('finance_token', newToken);
        localStorage.setItem('finance_user', JSON.stringify(userData));
        if (userData.currency && !localStorage.getItem('finance_currency')) {
          setCurrencyState(userData.currency);
          localStorage.setItem('finance_currency', userData.currency);
        }
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, initialCurrency = DEFAULT_CURRENCY) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, currency: initialCurrency });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('finance_token', newToken);
        localStorage.setItem('finance_user', JSON.stringify(userData));
        if (userData.currency) {
          setCurrencyState(userData.currency);
          localStorage.setItem('finance_currency', userData.currency);
        }
        toast.success(`Account created! Welcome, ${userData.name}!`);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const demoLogin = async () => {
    try {
      const res = await api.post('/auth/demo-login');
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('finance_token', newToken);
        localStorage.setItem('finance_user', JSON.stringify(userData));
        if (userData.currency) {
          setCurrencyState(userData.currency);
          localStorage.setItem('finance_currency', userData.currency);
        }
        toast.success('Welcome to FinanceFlow Demo! Fresh data loaded.');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Demo session initialization failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = (showToast = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('finance_token');
    localStorage.removeItem('finance_user');
    if (showToast) {
      toast.success('Logged out safely.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        darkMode,
        toggleDarkMode,
        currency,
        defaultCurrency: currency, // always identical to single source of truth
        activeCurrency: currency,  // always identical to single source of truth
        setDefaultCurrency: changeCurrency,
        changeCurrency,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
