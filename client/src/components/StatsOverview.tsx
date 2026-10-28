import React from 'react';
import { IOverviewStats } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { SpendingGauge } from './Charts/SpendingGauge';
import { CategoryDonutChart } from './Charts/CategoryDonutChart';
import { MonthlyTrendChart } from './Charts/MonthlyTrendChart';
import { PaymentMethodChart } from './Charts/PaymentMethodChart';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Zap,
  Calendar,
  AlertTriangle,
  ShieldCheck,
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

  const getTierBannerStyle = () => {
    switch (burnTier.color) {
      case 'rose':
      case 'red':
        return 'from-rose-950/80 via-red-900/40 to-slate-900/90 border-rose-500/40 text-rose-200';
      case 'amber':
        return 'from-amber-950/80 via-orange-900/40 to-slate-900/90 border-amber-500/40 text-amber-200';
      case 'yellow':
        return 'from-yellow-950/80 via-amber-900/40 to-slate-900/90 border-yellow-500/40 text-yellow-200';
      case 'teal':
        return 'from-teal-950/80 via-cyan-900/40 to-slate-900/90 border-teal-500/40 text-teal-200';
      default:
        return 'from-emerald-950/80 via-teal-900/40 to-slate-900/90 border-emerald-500/40 text-emerald-200';
    }
  };

  const getTierIcon = () => {
    if (burnTier.id === 'critical' || burnTier.id === 'high-risk') {
      return <Flame className="w-6 h-6 text-rose-400 animate-pulse flex-shrink-0" />;
    }
    if (burnTier.id === 'caution' || burnTier.id === 'moderate') {
      return <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />;
    }
    return <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />;
  };

  return (
    <div className="space-y-6">
      {/* 1. DYNAMIC BURN STATUS BANNER (Strictly driven by totalExpenses) */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 bg-gradient-to-r shadow-2xl backdrop-blur-xl ${getTierBannerStyle()}`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-white/10 shadow-inner">
              {getTierIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15">
                  {burnTier.badge}
                </span>
                <span className="text-xs font-mono font-medium opacity-80">
                  {budgetConsumedPercent.toFixed(1)}% of Budget Allocated
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">
                {burnTier.title}
              </h2>
              <p className="text-sm opacity-90 mt-1 max-w-2xl leading-relaxed">
                {burnTier.description}
              </p>
            </div>
          </div>

          <div className="md:text-right bg-slate-950/40 px-4 py-3 rounded-xl border border-white/10 w-full md:w-auto">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              Automated Advisor
            </span>
            <p className="text-xs text-slate-200 mt-1 max-w-sm font-medium">
              {burnTier.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* 2. CORE METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Expenses */}
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(totalExpenses, currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-800/80 text-slate-400">
            <span>Volume: <strong className="text-slate-200">{expenseCount}</strong> records</span>
            <span className="text-emerald-400 font-medium flex items-center">
              Active ledger
            </span>
          </div>
        </div>

        {/* Average Transaction Size */}
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Transaction</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(averageExpense, currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-800/80 text-slate-400">
            <span>Per purchase average</span>
            <span className="text-slate-300 font-mono">
              ~{(averageExpense / (budgetLimit || 1) * 100).toFixed(1)}% budget/tx
            </span>
          </div>
        </div>

        {/* Daily Velocity & Projection */}
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Velocity</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(dailyVelocity, currencySymbol)}
            <span className="text-xs text-slate-400 font-normal font-sans ml-1">/day</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-800/80 text-slate-400">
            <span>Projected month:</span>
            <span className="text-amber-300 font-mono font-semibold">
              {formatCurrency(projectedMonthEnd, currencySymbol)}
            </span>
          </div>
        </div>

        {/* Remaining Budget vs Limit */}
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Remaining Buffer</span>
            <div className={`p-2 rounded-xl border ${budgetRemaining > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
              {budgetRemaining > 0 ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
          </div>
          <div className={`text-2xl lg:text-3xl font-extrabold font-mono tracking-tight ${budgetRemaining > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(budgetRemaining, currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-800/80 text-slate-400">
            <span>Budget Ceiling:</span>
            <span className="text-slate-200 font-mono font-medium">
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

      {/* 4. HISTORICAL TRAJECTORY & PAYMENT BREAKDOWN */}
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
        {/* Highest Single Expense */}
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase mb-1">
            <ArrowUpRight className="w-4 h-4" /> Highest Purchase
          </div>
          {highestExpense ? (
            <div>
              <p className="text-lg font-bold text-white truncate">{highestExpense.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-rose-400 font-mono font-extrabold text-base">
                  {formatCurrency(highestExpense.amount, currencySymbol)}
                </span>
                <span className="text-slate-500 text-xs">{formatDate(highestExpense.date)}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block truncate">
                at {highestExpense.merchant}
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-500">None recorded</p>
          )}
        </div>

        {/* Lowest Single Expense */}
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase mb-1">
            <ArrowDownRight className="w-4 h-4" /> Lowest Purchase
          </div>
          {lowestExpense ? (
            <div>
              <p className="text-lg font-bold text-white truncate">{lowestExpense.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-emerald-400 font-mono font-extrabold text-base">
                  {formatCurrency(lowestExpense.amount, currencySymbol)}
                </span>
                <span className="text-slate-500 text-xs">{formatDate(lowestExpense.date)}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block truncate">
                at {lowestExpense.merchant}
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-500">None recorded</p>
          )}
        </div>

        {/* Weekend vs Weekday Spend */}
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Weekend vs Weekday Split
          </span>
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Weekdays (Mon-Fri)</span>
              <span className="font-mono font-bold text-slate-200">{formatCurrency(weekdaySpend, currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Weekends (Sat-Sun)</span>
              <span className="font-mono font-bold text-purple-400">{formatCurrency(weekendSpend, currencySymbol)}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex mt-1">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${totalExpenses > 0 ? (weekdaySpend / totalExpenses) * 100 : 50}%` }}
              />
              <div
                className="bg-purple-500 h-full"
                style={{ width: `${totalExpenses > 0 ? (weekendSpend / totalExpenses) * 100 : 50}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recurring vs Discretionary */}
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Recurring vs One-Off Spend
          </span>
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Fixed Recurring</span>
              <span className="font-mono font-bold text-slate-200">{formatCurrency(recurringSpend, currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">One-Off Discretionary</span>
              <span className="font-mono font-bold text-cyan-400">{formatCurrency(oneOffSpend, currencySymbol)}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex mt-1">
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
