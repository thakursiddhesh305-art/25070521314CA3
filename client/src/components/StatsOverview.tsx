import React from 'react';
import { IOverviewStats } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { SpendingGauge } from './Charts/SpendingGauge';
import { CategoryDonutChart } from './Charts/CategoryDonutChart';
import { MonthlyTrendChart } from './Charts/MonthlyTrendChart';
import { PaymentMethodChart } from './Charts/PaymentMethodChart';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart,
} from 'lucide-react';

interface StatsOverviewProps {
  stats: IOverviewStats;
  currencySymbol?: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, currencySymbol = '$' }) => {
  const {
    totalExpenses,
    expenseCount,
    averageExpense,
    dailyVelocity,
    projectedMonthEnd,
    budgetLimit,
    budgetRemaining,
    budgetConsumedPercent,
    burnTier,
    highestExpense,
    lowestExpense,
    categoryBreakdown,
    paymentMethodBreakdown,
    monthlyTrends,
    dayOfWeekStats,
    weekendSpend,
    weekdaySpend,
    recurringSpend,
    oneOffSpend,
  } = stats;

  const getTierPill = () => {
    switch (burnTier.color) {
      case 'rose':
      case 'red':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/25';
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
      case 'yellow':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25';
      case 'teal':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/25';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
    }
  };

  const getTierIcon = () => {
    if (burnTier.id === 'critical' || burnTier.id === 'high-risk') {
      return <Flame className="w-4 h-4 text-rose-400 animate-pulse" strokeWidth={2} />;
    }
    if (burnTier.id === 'caution' || burnTier.id === 'moderate') {
      return <AlertTriangle className="w-4 h-4 text-amber-400" strokeWidth={2} />;
    }
    return <ShieldCheck className="w-4 h-4 text-emerald-400" strokeWidth={2} />;
  };

  return (
    <div className="space-y-6">
      {/* 1. MINIMAL DYNAMIC BURN STATUS CAPSULE (Stats driven by totalExpenses) */}
      <div className="glass-panel glass-panel-hover rounded-3xl p-5 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getTierPill()}`}>
                {getTierIcon()}
                <span>{burnTier.badge}</span>
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {budgetConsumedPercent.toFixed(1)}% of planned budget allocated
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {burnTier.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
              {burnTier.description}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 w-full lg:w-80 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold uppercase text-[10px] tracking-wider text-zinc-500">Advisory Insight</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              {burnTier.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* 2. MINIMAL 4 METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Expenses */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Total Outflow</span>
            <div className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-400">
              <DollarSign className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight tabular-nums">
            {formatCurrency(totalExpenses, currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/[0.05] text-zinc-400">
            <span>Volume: <strong className="text-zinc-200 font-mono">{expenseCount}</strong> tx</span>
            <span className="text-emerald-400 text-[11px] font-medium">Active</span>
          </div>
        </div>

        {/* Avg Transaction */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Avg Transaction</span>
            <div className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-400">
              <Receipt className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight tabular-nums">
            {formatCurrency(averageExpense, currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/[0.05] text-zinc-400">
            <span>Per-purchase</span>
            <span className="text-zinc-300 font-mono text-[11px]">
              ~{(averageExpense / (budgetLimit || 1) * 100).toFixed(1)}% budget
            </span>
          </div>
        </div>

        {/* Daily Velocity */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Daily Velocity</span>
            <div className="p-1.5 rounded-lg bg-white/[0.04] text-amber-400">
              <Zap className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight tabular-nums">
            {formatCurrency(dailyVelocity, currencySymbol)}
            <span className="text-xs text-zinc-500 font-sans font-normal ml-1">/day</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/[0.05] text-zinc-400">
            <span>Projected month:</span>
            <span className="text-amber-300 font-mono font-medium text-[11px]">
              {formatCurrency(projectedMonthEnd, currencySymbol)}
            </span>
          </div>
        </div>

        {/* Remaining Budget Buffer */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Remaining Buffer</span>
            <div className={`p-1.5 rounded-lg ${budgetRemaining > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums ${budgetRemaining > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(budgetRemaining, currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-white/[0.05] text-zinc-400">
            <span>Cap:</span>
            <span className="text-zinc-300 font-mono text-[11px]">
              {formatCurrency(budgetLimit, currencySymbol)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW: Dynamic Gauge + Donut Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingGauge
          totalExpenses={totalExpenses}
          budgetLimit={budgetLimit}
          budgetConsumedPercent={budgetConsumedPercent}
          burnTier={burnTier}
          dailyVelocity={dailyVelocity}
          currencySymbol={currencySymbol}
        />

        <CategoryDonutChart
          categories={categoryBreakdown}
          totalExpenses={totalExpenses}
          currencySymbol={currencySymbol}
        />
      </div>

      {/* 4. HISTORICAL TRAJECTORY & SETTLEMENT CHANNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyTrendChart
            trends={monthlyTrends}
            currencySymbol={currencySymbol}
            monthlyBudget={budgetLimit}
          />
        </div>

        <div className="lg:col-span-1">
          <PaymentMethodChart
            methods={paymentMethodBreakdown}
            totalExpenses={totalExpenses}
            currencySymbol={currencySymbol}
          />
        </div>
      </div>

      {/* 5. EXTREMES & BEHAVIORAL SPLITS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Highest Purchase */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4">
          <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold mb-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> Highest Purchase
          </div>
          {highestExpense ? (
            <div>
              <p className="text-sm font-semibold text-white truncate">{highestExpense.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-rose-400 font-mono font-bold text-sm">
                  {formatCurrency(highestExpense.amount, currencySymbol)}
                </span>
                <span className="text-zinc-500 text-[11px]">{formatDate(highestExpense.date)}</span>
              </div>
              <span className="text-[11px] text-zinc-500 truncate block mt-0.5">
                {highestExpense.merchant}
              </span>
            </div>
          ) : (
            <p className="text-xs text-zinc-500">None</p>
          )}
        </div>

        {/* Lowest Purchase */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1.5">
            <ArrowDownRight className="w-3.5 h-3.5" /> Lowest Purchase
          </div>
          {lowestExpense ? (
            <div>
              <p className="text-sm font-semibold text-white truncate">{lowestExpense.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {formatCurrency(lowestExpense.amount, currencySymbol)}
                </span>
                <span className="text-zinc-500 text-[11px]">{formatDate(lowestExpense.date)}</span>
              </div>
              <span className="text-[11px] text-zinc-500 truncate block mt-0.5">
                {lowestExpense.merchant}
              </span>
            </div>
          ) : (
            <p className="text-xs text-zinc-500">None</p>
          )}
        </div>

        {/* Weekend vs Weekday */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase text-zinc-500 block mb-2">
            Weekend vs Weekday
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Weekdays</span>
              <span className="font-mono font-semibold text-zinc-200">{formatCurrency(weekdaySpend, currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Weekends</span>
              <span className="font-mono font-semibold text-indigo-400">{formatCurrency(weekendSpend, currencySymbol)}</span>
            </div>
            <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden flex mt-1">
              <div
                className="bg-cyan-500 h-full"
                style={{ width: `${totalExpenses > 0 ? (weekdaySpend / totalExpenses) * 100 : 50}%` }}
              />
              <div
                className="bg-indigo-500 h-full"
                style={{ width: `${totalExpenses > 0 ? (weekendSpend / totalExpenses) * 100 : 50}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recurring vs Discretionary */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase text-zinc-500 block mb-2">
            Recurring vs One-Off
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Recurring</span>
              <span className="font-mono font-semibold text-zinc-200">{formatCurrency(recurringSpend, currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Discretionary</span>
              <span className="font-mono font-semibold text-cyan-400">{formatCurrency(oneOffSpend, currencySymbol)}</span>
            </div>
            <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden flex mt-1">
              <div
                className="bg-indigo-500 h-full"
                style={{ width: `${totalExpenses > 0 ? (recurringSpend / totalExpenses) * 100 : 50}%` }}
              />
              <div
                className="bg-cyan-400 h-full"
                style={{ width: `${totalExpenses > 0 ? (oneOffSpend / totalExpenses) * 100 : 50}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
