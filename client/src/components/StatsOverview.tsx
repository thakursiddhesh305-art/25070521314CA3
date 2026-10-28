import React from 'react';
import { IOverviewStats } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { SpendingGauge } from './Charts/SpendingGauge';
import { CategoryDonutChart } from './Charts/CategoryDonutChart';
import { MonthlyTrendChart } from './Charts/MonthlyTrendChart';
import { PaymentMethodChart } from './Charts/PaymentMethodChart';
import {
  DollarSign,
  Receipt,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
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
    weekendSpend,
    weekdaySpend,
    recurringSpend,
    oneOffSpend,
  } = stats;

  const getTierPill = () => {
    switch (burnTier.color) {
      case 'rose':
      case 'red':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'amber':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'yellow':
        return 'text-amber-700 bg-amber-50/80 border-amber-200';
      case 'teal':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  const getTierIcon = () => {
    if (burnTier.id === 'critical' || burnTier.id === 'high-risk') {
      return <Flame className="w-4 h-4 text-rose-500 animate-pulse" strokeWidth={2.2} />;
    }
    if (burnTier.id === 'caution' || burnTier.id === 'moderate') {
      return <AlertTriangle className="w-4 h-4 text-amber-500" strokeWidth={2.2} />;
    }
    return <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={2.2} />;
  };

  return (
    <div className="space-y-6">
      {/* 1. BRIGHT GLASS DYNAMIC BURN CAPSULE */}
      <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${getTierPill()}`}>
                {getTierIcon()}
                <span>{burnTier.badge}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono font-medium">
                {budgetConsumedPercent.toFixed(1)}% of planned budget allocated
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {burnTier.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
              {burnTier.description}
            </p>
          </div>

          <div className="bg-white/70 border border-slate-200/70 rounded-2xl p-4 w-full lg:w-80 flex-shrink-0 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="uppercase text-[10px] tracking-wider text-slate-400">Automated Advisor</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              {burnTier.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 4 BRIGHT GLASS METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Expenses */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Outflow</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <DollarSign className="w-4 h-4" strokeWidth={2} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
            {formatCurrency(totalExpenses, currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 text-slate-500 font-medium">
            <span>Volume: <strong className="text-slate-800 font-mono">{expenseCount}</strong> tx</span>
            <span className="text-emerald-600 text-[11px] font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Active</span>
          </div>
        </div>

        {/* Avg Transaction */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Transaction</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
              <Receipt className="w-4 h-4" strokeWidth={2} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
            {formatCurrency(averageExpense, currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 text-slate-500 font-medium">
            <span>Per purchase</span>
            <span className="text-slate-700 font-mono text-[11px] font-semibold">
              ~{(averageExpense / (budgetLimit || 1) * 100).toFixed(1)}% budget
            </span>
          </div>
        </div>

        {/* Daily Velocity */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Daily Velocity</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Zap className="w-4 h-4" strokeWidth={2} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
            {formatCurrency(dailyVelocity, currencySymbol)}
            <span className="text-xs text-slate-400 font-sans font-medium ml-1">/day</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 text-slate-500 font-medium">
            <span>Projected month:</span>
            <span className="text-amber-700 font-mono font-bold text-[11px]">
              {formatCurrency(projectedMonthEnd, currencySymbol)}
            </span>
          </div>
        </div>

        {/* Remaining Buffer */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Remaining Buffer</span>
            <div className={`p-2 rounded-xl border ${budgetRemaining > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
              <ShieldCheck className="w-4 h-4" strokeWidth={2} />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight tabular-nums ${budgetRemaining > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(budgetRemaining, currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 text-slate-500 font-medium">
            <span>Budget Cap:</span>
            <span className="text-slate-800 font-mono text-[11px] font-bold">
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
          <div className="flex items-center gap-1.5 text-rose-600 text-xs font-bold mb-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> Highest Purchase
          </div>
          {highestExpense ? (
            <div>
              <p className="text-sm font-bold text-slate-800 truncate">{highestExpense.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-rose-600 font-mono font-extrabold text-sm">
                  {formatCurrency(highestExpense.amount, currencySymbol)}
                </span>
                <span className="text-slate-400 text-[11px] font-medium">{formatDate(highestExpense.date)}</span>
              </div>
              <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                {highestExpense.merchant}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium">None</p>
          )}
        </div>

        {/* Lowest Purchase */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4">
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-1.5">
            <ArrowDownRight className="w-3.5 h-3.5" /> Lowest Purchase
          </div>
          {lowestExpense ? (
            <div>
              <p className="text-sm font-bold text-slate-800 truncate">{lowestExpense.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-emerald-600 font-mono font-extrabold text-sm">
                  {formatCurrency(lowestExpense.amount, currencySymbol)}
                </span>
                <span className="text-slate-400 text-[11px] font-medium">{formatDate(lowestExpense.date)}</span>
              </div>
              <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                {lowestExpense.merchant}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium">None</p>
          )}
        </div>

        {/* Weekend vs Weekday */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
            Weekend vs Weekday
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Weekdays</span>
              <span className="font-mono font-bold text-slate-800">{formatCurrency(weekdaySpend, currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Weekends</span>
              <span className="font-mono font-bold text-indigo-600">{formatCurrency(weekendSpend, currencySymbol)}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex mt-1">
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
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
            Recurring vs One-Off
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Recurring</span>
              <span className="font-mono font-bold text-slate-800">{formatCurrency(recurringSpend, currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Discretionary</span>
              <span className="font-mono font-bold text-cyan-600">{formatCurrency(oneOffSpend, currencySymbol)}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex mt-1">
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
