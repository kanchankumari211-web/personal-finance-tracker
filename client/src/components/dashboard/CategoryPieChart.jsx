import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon, Layers } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#84cc16', // Lime
];

const CustomTooltip = ({ active, payload, currency = 'USD' }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs py-2 px-3.5 rounded-2xl shadow-2xl border border-slate-700/60 badge-3d">
        <p className="font-bold text-slate-200">{data.name}</p>
        <p className="text-indigo-400 font-mono font-bold mt-0.5">
          {formatCurrency(data.value, currency)}
        </p>
      </div>
    );
  }
  return null;
};

const CategoryPieChart = ({ data = [], currency = 'USD' }) => {
  const hasData = Array.isArray(data) && data.length > 0 && data.some((d) => d.value > 0);

  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-panel card-3d flex flex-col h-full relative overflow-hidden w-full">
      {/* 3D ambient glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center badge-3d">
              <PieIcon className="w-4 h-4" />
            </span>
            Expenses by Category
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Spending breakdown ({currency})
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          <Layers className="w-3.5 h-3.5" />
          Donut View
        </span>
      </div>

      <div className="flex-1 min-h-[260px] flex items-center justify-center">
        {!hasData ? (
          <div className="text-center text-slate-400 dark:text-slate-500 p-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400 badge-3d">
              <PieIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold">No expense data to display</p>
            <p className="text-xs mt-1">Add expense transactions to see your category breakdown.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <defs>
                <filter id="shadow3D" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.25" />
                </filter>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                filter="url(#shadow3D)"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={1.5}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip currency={currency} />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Mini category badges legend with 3D elevation */}
      {hasData && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80 max-h-24 overflow-y-auto">
          {data.map((cat, idx) => (
            <div
              key={cat.name}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:scale-105 transition-transform"
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className="font-semibold truncate max-w-[100px]">{cat.name}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                {formatCurrency(cat.value, currency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPieChart;
