import React, { useState } from 'react';
import { IMonthlyTrend } from '../../types';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';

interface MonthlyTrendChartProps {
  trends: IMonthlyTrend[];
  currencySymbol?: string;
  monthlyBudget: number;
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({
  trends,
  currencySymbol = '$',
  monthlyBudget,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!trends || trends.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-6 flex items-center justify-center min-h-[280px] text-slate-400 text-xs">
        No monthly trend history
      </div>
    );
  }

  const maxSpend = Math.max(...trends.map((t) => t.total), monthlyBudget * 1.15, 100);

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trajectory</span>
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
            6-Month Velocity
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-indigo-600 to-cyan-500" />
            <span>Monthly Outflow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-t-2 border-dashed border-rose-500" />
            <span>Budget Cap ({formatCompactNumber(monthlyBudget, currencySymbol)})</span>
          </div>
        </div>
      </div>

      {/* Bars Container */}
      <div className="relative pt-6 pb-2">
        {/* Budget Limit line */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-rose-400/70 z-10 pointer-events-none flex items-center justify-end pr-1"
          style={{
            bottom: `${Math.min(100, (monthlyBudget / maxSpend) * 100)}%`,
          }}
        >
          <span className="text-[10px] font-mono font-bold text-rose-600 bg-white/90 px-1.5 py-0.5 rounded-md border border-rose-100 shadow-xs -translate-y-2.5">
            Budget Cap
          </span>
        </div>

        {/* Bars */}
        <div className="flex items-end justify-between gap-3 h-[160px] w-full pt-4">
          {trends.map((item, index) => {
            const barHeightPercent = Math.min(100, Math.max(5, (item.total / maxSpend) * 100));
            const isOverBudget = item.total > monthlyBudget;
            const isHovered = hoveredIdx === index;

            return (
              <div
                key={item.monthKey}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Floating Bright Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-white border border-slate-200/90 px-2.5 py-1.5 rounded-xl shadow-xl text-center whitespace-nowrap pointer-events-none animate-enter">
                    <p className="text-[10px] text-slate-400 font-semibold">{item.label}</p>
                    <p className="text-xs font-bold font-mono text-slate-900 tabular-nums">
                      {formatCurrency(item.total, currencySymbol)}
                    </p>
                  </div>
                )}

                {/* Amount on hover */}
                <span className="text-[10px] font-mono text-slate-500 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  {formatCompactNumber(item.total, currencySymbol)}
                </span>

                {/* Bar */}
                <div className="w-full max-w-[38px] bg-slate-100/90 rounded-t-xl overflow-hidden flex flex-col justify-end p-0.5 shadow-inner">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ease-out ${
                      isOverBudget
                        ? 'bg-gradient-to-t from-rose-500 to-amber-500 shadow-md shadow-rose-500/20'
                        : 'bg-gradient-to-t from-indigo-600 to-cyan-500 group-hover:brightness-105 shadow-md shadow-indigo-500/15'
                    }`}
                    style={{ height: `${barHeightPercent}%` }}
                  />
                </div>

                {/* Month Label */}
                <span className="text-[11px] font-bold text-slate-500 mt-2 tracking-tight">
                  {item.label.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
