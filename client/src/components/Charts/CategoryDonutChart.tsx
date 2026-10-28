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
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center min-h-[340px] text-zinc-500">
        <PieChart className="w-10 h-10 mb-2 stroke-1 text-zinc-600" />
        <p className="text-xs">No records for this period</p>
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
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Allocation</span>
          <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
            Category Breakdown
          </h4>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
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
                  filter: activeCategory?.category === slice.category ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none',
                }}
                onMouseEnter={() => setActiveCategory(slice)}
              />
            ))}
          </svg>

          {/* Center Donut Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
            <span className="text-[11px] font-medium text-zinc-400 truncate max-w-[95px]">
              {displayItem.category.split(' ')[0]}
            </span>
            <span className="text-sm font-bold text-white font-mono leading-tight tabular-nums">
              {formatCurrency(displayItem.amount, currencySymbol)}
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 font-mono">
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
                className={`p-2 rounded-xl transition-all cursor-pointer border ${
                  isHovered ? 'bg-white/[0.06] border-white/[0.12]' : 'bg-white/[0.02] border-transparent hover:border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.hex }} />
                    <span className="font-medium text-zinc-200">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-semibold text-white tabular-nums">{formatCurrency(cat.amount, currencySymbol)}</span>
                    <span className="text-zinc-500 w-8 text-right font-sans">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
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
