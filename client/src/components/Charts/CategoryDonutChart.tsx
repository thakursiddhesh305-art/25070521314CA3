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
      <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[360px] text-slate-500">
        <PieChart className="w-12 h-12 mb-2 stroke-1 text-slate-600" />
        <p className="text-sm">No expenses recorded for this period</p>
      </div>
    );
  }

  // Pre-compute angles for SVG Donut slices
  let cumulativeAngle = 0;
  const radius = 64;
  const strokeWidth = 26;
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
    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Capital Allocation</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            Category Breakdown
          </h3>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          {categories.length} Categories
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        {/* SVG Donut Circle */}
        <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
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
                className="transition-all duration-300 cursor-pointer hover:opacity-80"
                style={{
                  filter: activeCategory?.category === slice.category ? 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' : 'none',
                }}
                onMouseEnter={() => setActiveCategory(slice)}
              />
            ))}
          </svg>

          {/* Center Donut Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span className="text-xs font-medium text-slate-400 truncate max-w-[100px]">
              {displayItem.category.split(' ')[0]}
            </span>
            <span className="text-base font-extrabold text-white font-mono leading-tight">
              {formatCurrency(displayItem.amount, currencySymbol)}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">
              {displayItem.percentage}%
            </span>
          </div>
        </div>

        {/* Top Categories Progress Bars */}
        <div className="w-full space-y-2.5 flex-1 max-h-[220px] overflow-y-auto pr-1">
          {categories.slice(0, 5).map((cat) => {
            const color = getCategoryColor(cat.category);
            const isHovered = activeCategory?.category === cat.category;
            return (
              <div
                key={cat.category}
                onMouseEnter={() => setActiveCategory(cat)}
                className={`p-2 rounded-xl transition-all cursor-pointer border ${
                  isHovered ? 'bg-slate-800/80 border-slate-700 shadow' : 'bg-slate-900/40 border-transparent hover:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.hex }} />
                    <span className="font-semibold text-slate-200">{cat.category}</span>
                    <span className="text-slate-500 text-[11px]">({cat.count} tx)</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white">{formatCurrency(cat.amount, currencySymbol)}</span>
                    <span className="text-slate-400 text-[11px] w-9 text-right font-sans">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
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
