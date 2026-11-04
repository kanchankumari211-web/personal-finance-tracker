export const DEFAULT_CURRENCY = 'INR';

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)', locale: 'en-GB' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)', locale: 'en-CA' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar (AU$)', locale: 'en-AU' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)', locale: 'ja-JP' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)', locale: 'ar-AE' },
];

export const resolveCurrency = (currencyCode, defaultCode = DEFAULT_CURRENCY) => {
  if (!currencyCode || currencyCode === 'DEFAULT') {
    return defaultCode || DEFAULT_CURRENCY;
  }
  return currencyCode;
};

export const formatCurrency = (amount, currencyCode = 'INR', defaultCode = DEFAULT_CURRENCY) => {
  const resolvedCode = resolveCurrency(currencyCode, defaultCode);
  const currencyObj = SUPPORTED_CURRENCIES.find((c) => c.code === resolvedCode) || SUPPORTED_CURRENCIES[0];
  const num = Number(amount) || 0;

  try {
    return new Intl.NumberFormat(currencyObj.locale, {
      style: 'currency',
      currency: currencyObj.code,
      maximumFractionDigits: currencyObj.code === 'JPY' ? 0 : 2,
      minimumFractionDigits: currencyObj.code === 'JPY' ? 0 : 2,
    }).format(num);
  } catch (error) {
    return `${currencyObj.symbol}${num.toFixed(2)}`;
  }
};

export const getCurrencySymbol = (currencyCode = 'INR', defaultCode = DEFAULT_CURRENCY) => {
  const resolvedCode = resolveCurrency(currencyCode, defaultCode);
  const currencyObj = SUPPORTED_CURRENCIES.find((c) => c.code === resolvedCode);
  return currencyObj ? currencyObj.symbol : '₹';
};
