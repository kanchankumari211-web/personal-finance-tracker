import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Coins, X, Check } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../../utils/formatCurrency';

const CurrencyModal = ({ isOpen, onClose, selectedCurrency = 'INR', onSelectCurrency }) => {
  const selectedItemRef = useRef(null);

  // Lock background scrolling while modal is open & listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Scroll active currency smoothly into view upon opening
  useEffect(() => {
    if (isOpen && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="currency-modal-title"
    >
      <div
        className="w-[92%] max-w-md max-h-[80vh] flex flex-col rounded-3xl glass-panel bg-white/95 dark:bg-slate-900/95 shadow-2xl border border-slate-200 dark:border-slate-800 card-3d overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Fixed and always visible */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 id="currency-modal-title" className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                Select Currency
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Choose your preferred display currency
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency List - Scrollable while first item (INR) is completely visible */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
          {SUPPORTED_CURRENCIES.map((c) => {
            const isSelected = c.code === selectedCurrency;
            return (
              <button
                key={c.code}
                ref={isSelected ? selectedItemRef : null}
                type="button"
                onClick={() => {
                  onSelectCurrency(c.code);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold border transition-all text-left ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/25 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {c.symbol}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm">{c.code}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <span className={`block text-[11px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {c.name}
                    </span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Footer - Fixed and always visible */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 bg-white/80 dark:bg-slate-900/80">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CurrencyModal;

