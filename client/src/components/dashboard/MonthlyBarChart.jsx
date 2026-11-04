import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const CustomBarTooltip = ({ active, payload, label, currency = 'USD' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs py-2.5 px-3.5 rounded-2xl shadow-2xl border border-slate-700/60 badge-3d">
        <p className="font-bold text-slate-300 mb-1.5 border-b border-slate-700/60 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`tooltip-bar-${index}`}
            className="flex items-center justify-between gap-5 font-mono text-xs py-0.5"
            style={{ color: entry.color }}
          >
            <span>{entry.name}:</span>
            <span className="font-bold">{formatCurrency(entry.value, currency)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MonthlyBarChart = ({ data = [], currency = 'USD' }) => {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="p-6 rounded-3xl glass-panel card-3d flex flex-col h-full relative overflow-hidden">
      {/* 3D ambient glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center badge-3d">
              <BarChart3 className="w-4 h-4" />
            </span>
            Monthly Cashflow Trends
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Income vs. Expenses comparison ({currency})
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
          Live Metrics
        </span>
      </div>

      <div className="flex-1 min-h-[260px] flex items-center justify-center">
        {!hasData ? (
          <div className="text-center text-slate-400 dark:text-slate-500 p-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400 badge-3d">
              <BarChart3 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold">No trend data yet</p>
            <p className="text-xs mt-1">Records will appear as you log transactions across months.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="income3DGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="expense3DGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${Number(val).toLocaleString()}`}
              />
              <Tooltip content={<CustomBarTooltip currency={currency} />} />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar
                name="Income"
                dataKey="income"
                fill="url(#income3DGrad)"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                name="Expense"
                dataKey="expense"
                fill="url(#expense3DGrad)"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlyBarChart;
