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
      <div className="glass-panel rounded-3xl p-6 flex items-center justify-center min-h-[280px] text-zinc-500 text-xs">
        No monthly trend history
      </div>
    );
  }

  const maxSpend = Math.max(...trends.map((t) => t.total), monthlyBudget * 1.15, 100);

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Trajectory</span>
          <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
            6-Month Velocity
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-indigo-500 to-cyan-400" />
            <span>Monthly Outflow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-t border-dashed border-rose-400" />
            <span>Budget Cap ({formatCompactNumber(monthlyBudget, currencySymbol)})</span>
          </div>
        </div>
      </div>

      {/* Bars Container */}
      <div className="relative pt-6 pb-2">
        {/* Budget Limit line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-rose-500/40 z-10 pointer-events-none flex items-center justify-end pr-1"
          style={{
            bottom: `${Math.min(100, (monthlyBudget / maxSpend) * 100)}%`,
          }}
        >
          <span className="text-[9px] font-mono font-medium text-rose-400 bg-[#12141d] px-1 rounded -translate-y-2">
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
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-[#141724] border border-white/[0.12] px-2.5 py-1.5 rounded-xl shadow-2xl text-center whitespace-nowrap pointer-events-none animate-enter">
                    <p className="text-[10px] text-zinc-400">{item.label}</p>
                    <p className="text-xs font-bold font-mono text-white tabular-nums">
                      {formatCurrency(item.total, currencySymbol)}
                    </p>
                  </div>
                )}

                {/* Amount on hover */}
                <span className="text-[10px] font-mono text-zinc-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  {formatCompactNumber(item.total, currencySymbol)}
                </span>

                {/* Bar */}
                <div className="w-full max-w-[38px] bg-white/[0.03] rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5">
                  <div
                    className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                      isOverBudget
                        ? 'bg-gradient-to-t from-rose-600 to-amber-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                        : 'bg-gradient-to-t from-indigo-500 to-cyan-400 group-hover:brightness-110'
                    }`}
                    style={{ height: `${barHeightPercent}%` }}
                  />
                </div>

                {/* Month Label */}
                <span className="text-[11px] font-medium text-zinc-400 mt-2 tracking-tight">
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
