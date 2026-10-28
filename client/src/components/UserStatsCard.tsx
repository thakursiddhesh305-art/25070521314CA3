import React from 'react';
import { IUserDemographicsStats } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  HeartPulse,
  Wallet,
  PiggyBank,
  CheckCircle2,
  Layers,
  Store,
  Compass,
  Edit3,
  Sparkles,
  Calendar,
  Flame,
} from 'lucide-react';

interface UserStatsCardProps {
  userStats: IUserDemographicsStats;
  currencySymbol?: string;
  onEditProfile: () => void;
}

export const UserStatsCard: React.FC<UserStatsCardProps> = ({
  userStats,
  currencySymbol = '$',
  onEditProfile,
}) => {
  const {
    user,
    monthlyIncome,
    monthlyBudgetLimit,
    netMonthlySurplus,
    savingsRatePercent,
    savingsGoal,
    savingsCurrent,
    savingsGoalProgressPercent,
    financialHealthScore,
    healthScoreGrade,
    healthScoreColor,
    lifetimeTotalSpend,
    lifetimeTransactionCount,
    averageExpenseLifetime,
    activeLoggingDays,
    dominantCategory,
    dominantCategoryShare,
    topMerchant,
    essentialSpend,
    discretionarySpend,
    essentialSpendPercent,
  } = userStats;

  const getScoreBadge = () => {
    switch (healthScoreColor) {
      case 'emerald':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'teal':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
      case 'blue':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 relative overflow-hidden group">
      {/* Subtle ambient light gradient in top right corner */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-700" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-white/20 transition-all shadow-md"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0d0f17] rounded-full shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">{user.name}</h2>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{user.occupation}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-cyan-400/90 font-medium">
                <Compass className="w-3 h-3 text-cyan-400" />
                {user.spendingPersona}
              </span>
              <span>•</span>
              <span className="text-zinc-500">Member since {formatDate(user.joinedAt)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all self-stretch sm:self-auto justify-center active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
          <span>Edit Financial Plan</span>
        </button>
      </div>

      {/* Grid of 3 Metrics Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
        {/* 1. FINANCIAL HEALTH SCORE */}
        <div className="bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/[0.05] flex flex-col justify-between hover:border-white/[0.09] transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" strokeWidth={2} />
                Financial Health Score
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreBadge()}`}>
                Grade {healthScoreGrade}
              </span>
            </div>

            <div className="flex items-center gap-4 my-2.5">
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-white/[0.06]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      healthScoreGrade.startsWith('A')
                        ? 'text-emerald-400'
                        : healthScoreGrade.startsWith('B')
                        ? 'text-indigo-400'
                        : 'text-amber-400'
                    }
                    strokeDasharray={`${financialHealthScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold font-mono text-white tracking-tight">{financialHealthScore}</span>
                  <span className="text-[9px] text-zinc-500 font-mono -mt-1">/100</span>
                </div>
              </div>

              <div className="space-y-0.5 text-xs">
                <p className="font-semibold text-zinc-200">
                  {financialHealthScore >= 80 ? 'Optimal Capital Control' : financialHealthScore >= 65 ? 'Stable Balance' : 'Needs Optimization'}
                </p>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  Evaluated across budget adherence, savings velocity, and essential spend discipline.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.05] text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Essential Ratio: <strong className="text-zinc-200 font-mono">{essentialSpendPercent}%</strong></span>
            <span>Logging: <strong className="text-zinc-200 font-mono">{activeLoggingDays} days</strong></span>
          </div>
        </div>

        {/* 2. CASH FLOW & SAVINGS RATE */}
        <div className="bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/[0.05] flex flex-col justify-between hover:border-white/[0.09] transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
                Monthly Cashflow
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {savingsRatePercent}% Saved
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">Net Monthly Income</span>
                <span className="font-mono font-semibold text-white">{formatCurrency(monthlyIncome, currencySymbol)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-white/[0.04]">
                <span className="text-zinc-400">Net Monthly Surplus</span>
                <span className={`font-mono font-bold ${netMonthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(netMonthlySurplus, currencySymbol)}
                </span>
              </div>
            </div>
          </div>

          {/* Savings Progress */}
          <div className="pt-3 border-t border-white/[0.05]">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-zinc-400 text-[11px] flex items-center gap-1">
                <PiggyBank className="w-3 h-3 text-cyan-400" /> Goal: {formatCurrency(savingsGoal, currencySymbol)}
              </span>
              <span className="text-white font-mono text-[11px] font-semibold">{savingsGoalProgressPercent}%</span>
            </div>
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, savingsGoalProgressPercent)}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-500 block mt-1">
              Current Reserve: <strong className="text-zinc-300 font-mono">{formatCurrency(savingsCurrent, currencySymbol)}</strong>
            </span>
          </div>
        </div>

        {/* 3. LIFETIME HABITS & DEMOGRAPHICS */}
        <div className="bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/[0.05] flex flex-col justify-between hover:border-white/[0.09] transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" strokeWidth={2} />
                User Demographics
              </span>
              <span className="text-[11px] font-mono text-zinc-400">{lifetimeTransactionCount} records</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">Lifetime Outflow</span>
                <span className="font-mono font-bold text-white text-sm">
                  {formatCurrency(lifetimeTotalSpend, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-white/[0.04]">
                <span className="text-zinc-400">Dominant Category</span>
                <span className="font-medium text-cyan-300 truncate max-w-[130px]">
                  {dominantCategory} ({dominantCategoryShare}%)
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-white/[0.04]">
                <span className="text-zinc-400">Top Payee</span>
                <span className="font-medium text-zinc-200 truncate max-w-[130px]">
                  {topMerchant}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.05] text-[11px] text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Monthly budget capped at {formatCurrency(monthlyBudgetLimit, currencySymbol)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
