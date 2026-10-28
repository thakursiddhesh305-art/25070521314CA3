import React, { useState } from 'react';
import { IMonthlyTrend } from '../../types';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import { BarChart3, TrendingUp } from 'lucide-react';

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
      <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex items-center justify-center min-h-[300px] text-slate-500">
        No monthly trend data available
      </div>
    );
  }

  // Calculate scaling
  const maxSpend = Math.max(...trends.map((t) => t.total), monthlyBudget * 1.15, 100);
  const chartHeight = 160;

  return (
    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Historical Trajectory</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            6-Month Expense Velocity
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-blue-600 to-cyan-400" />
            <span>Monthly Spend</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-0.5 border-t border-dashed border-rose-400" />
            <span>Budget Ceiling ({formatCompactNumber(monthlyBudget, currencySymbol)})</span>
          </div>
        </div>
      </div>

      {/* SVG / Flex Bar Chart */}
      <div className="relative pt-6 pb-2">
        {/* Budget Limit line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-rose-500/50 z-10 pointer-events-none flex items-center justify-end pr-2"
          style={{
            bottom: `${Math.min(100, (monthlyBudget / maxSpend) * 100)}%`,
          }}
        >
          <span className="text-[10px] font-mono font-medium text-rose-400 bg-[#121929]/90 px-1 rounded -translate-y-2.5">
            Budget Cap
          </span>
        </div>

        {/* Bars Container */}
        <div className="flex items-end justify-between gap-3 h-[180px] w-full pt-4">
          {trends.map((item, index) => {
            const barHeightPercent = Math.min(100, Math.max(4, (item.total / maxSpend) * 100));
            const isOverBudget = item.total > monthlyBudget;
            const isHovered = hoveredIdx === index;

            return (
              <div
                key={item.monthKey}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg shadow-2xl text-center whitespace-nowrap pointer-events-none">
                    <p className="text-[11px] text-slate-400">{item.label}</p>
                    <p className="text-xs font-bold font-mono text-white">
                      {formatCurrency(item.total, currencySymbol)}
                    </p>
                    <p className="text-[10px] text-slate-400">{item.count} transactions</p>
                  </div>
                )}

                {/* Amount label above bar on hover */}
                <span className="text-[11px] font-mono text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatCompactNumber(item.total, currencySymbol)}
                </span>

                {/* The Bar */}
                <div className="w-full max-w-[42px] bg-slate-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5">
                  <div
                    className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                      isOverBudget
                        ? 'bg-gradient-to-t from-rose-600 via-rose-500 to-amber-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : 'bg-gradient-to-t from-blue-600 via-sky-500 to-cyan-400 group-hover:brightness-110'
                    }`}
                    style={{ height: `${barHeightPercent}%` }}
                  />
                </div>

                {/* Month Label */}
                <span className="text-xs font-medium text-slate-400 mt-2.5 tracking-tight">
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
