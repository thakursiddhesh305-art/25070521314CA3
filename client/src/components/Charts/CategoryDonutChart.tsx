import React, { useState } from 'react';
import { ICategoryBreakdown } from '../../types';
import { formatCurrency, getCategoryColor } from '../../utils/formatters';
import { PieChart, Layers } from 'lucide-react';

interface CategoryDonutChartProps {
  categories: ICategoryBreakdown[];
  totalExpenses: number;
  currencySymbol?: string;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categories,
  totalExpenses,
  currencySymbol = '$',
}) => {
  const [activeCategory, setActiveCategory] = useState<ICategoryBreakdown | null>(null);

  if (!categories || categories.length === 0 || totalExpenses === 0) {
    return (
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center min-h-[340px] text-slate-400">
        <PieChart className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
        <p className="text-xs font-medium">No records for this period</p>
      </div>
    );
  }

  let cumulativeAngle = 0;
  const radius = 64;
  const strokeWidth = 22;
  const center = 90;
  const circumference = 2 * Math.PI * radius;

  const slices = categories.map((cat) => {
    const sliceAngle = (cat.amount / totalExpenses) * 360;
    const strokeDasharray = `${(cat.amount / totalExpenses) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativeAngle / 360) * circumference);
    const colorInfo = getCategoryColor(cat.category);
    cumulativeAngle += sliceAngle;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
      color: colorInfo.hex,
      colorInfo,
    };
  });

  const displayItem = activeCategory || categories[0];

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Allocation</span>
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
            Category Breakdown
          </h4>
        </div>
        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {categories.length} Categories
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        {/* SVG Donut Circle */}
        <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90 transform">
            {slices.map((slice) => (
              <circle
                key={slice.category}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                className="transition-all duration-300 cursor-pointer hover:opacity-85"
                style={{
                  filter: activeCategory?.category === slice.category ? 'drop-shadow(0 0 6px rgba(0,0,0,0.15))' : 'none',
                }}
                onMouseEnter={() => setActiveCategory(slice)}
              />
            ))}
          </svg>

          {/* Center Donut Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
            <span className="text-[11px] font-bold text-slate-500 truncate max-w-[95px]">
              {displayItem.category.split(' ')[0]}
            </span>
            <span className="text-sm font-extrabold text-slate-900 font-mono leading-tight tabular-nums">
              {formatCurrency(displayItem.amount, currencySymbol)}
            </span>
            <span className="text-[10px] font-extrabold text-emerald-600 font-mono">
              {displayItem.percentage}%
            </span>
          </div>
        </div>

        {/* Top Categories Progress Bars */}
        <div className="w-full space-y-2 flex-1 max-h-[200px] overflow-y-auto pr-1">
          {categories.slice(0, 5).map((cat) => {
            const color = getCategoryColor(cat.category);
            const isHovered = activeCategory?.category === cat.category;
            return (
              <div
                key={cat.category}
                onMouseEnter={() => setActiveCategory(cat)}
                className={`p-2.5 rounded-2xl transition-all cursor-pointer border ${
                  isHovered ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-white/60 border-transparent hover:border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.hex }} />
                    <span className="font-semibold text-slate-800">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(cat.amount, currencySymbol)}</span>
                    <span className="text-slate-400 w-8 text-right font-sans font-semibold">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: color.hex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
