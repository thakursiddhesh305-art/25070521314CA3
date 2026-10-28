import React from 'react';
import { IUserDemographicsStats } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  HeartPulse,
  Wallet,
  PiggyBank,
  CheckCircle2,
  Compass,
  Edit3,
  Sparkles,
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
    essentialSpendPercent,
  } = userStats;

  const getScoreBadge = () => {
    switch (healthScoreColor) {
      case 'emerald':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'teal':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'blue':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'amber':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 relative overflow-hidden group">
      {/* Ambient pastel aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-200/30 via-pink-100/20 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-105 transition-transform duration-700" />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{user.occupation}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50/60 px-2 py-0.5 rounded-md border border-indigo-100">
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                {user.spendingPersona}
              </span>
              <span>•</span>
              <span className="text-slate-400">Joined {formatDate(user.joinedAt)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white/80 hover:bg-white border border-slate-200/80 shadow-sm transition-all self-stretch sm:self-auto justify-center active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>Edit Financial Profile</span>
        </button>
      </div>

      {/* Grid of 3 Demographics Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
        {/* 1. FINANCIAL HEALTH SCORE */}
        <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:bg-white/80 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" strokeWidth={2.2} />
                Health Score
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-xs ${getScoreBadge()}`}>
                Grade {healthScoreGrade}
              </span>
            </div>

            <div className="flex items-center gap-4 my-2.5">
              <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      healthScoreGrade.startsWith('A')
                        ? 'text-emerald-500'
                        : healthScoreGrade.startsWith('B')
                        ? 'text-indigo-600'
                        : 'text-amber-500'
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
                  <span className="text-xl font-extrabold font-mono text-slate-900 tracking-tight">{financialHealthScore}</span>
                  <span className="text-[10px] text-slate-400 font-mono -mt-1 font-bold">/100</span>
                </div>
              </div>

              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-slate-800">
                  {financialHealthScore >= 80 ? 'Optimal Capital Control' : financialHealthScore >= 65 ? 'Stable Balance' : 'Needs Optimization'}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Evaluated across budget adherence, savings velocity, and essential ratio.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
            <span>Essential Ratio: <strong className="text-slate-800 font-mono">{essentialSpendPercent}%</strong></span>
            <span>Active Logging: <strong className="text-slate-800 font-mono">{activeLoggingDays} days</strong></span>
          </div>
        </div>

        {/* 2. CASH FLOW & SAVINGS RATE */}
        <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:bg-white/80 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.2} />
                Monthly Cashflow
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {savingsRatePercent}% Saved
              </span>
            </div>

            <div className="space-y-1.5 text-xs mt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Monthly Income</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(monthlyIncome, currencySymbol)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Net Monthly Surplus</span>
                <span className={`font-mono font-bold ${netMonthlySurplus >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(netMonthlySurplus, currencySymbol)}
                </span>
              </div>
            </div>
          </div>

          {/* Savings Progress */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                <PiggyBank className="w-3.5 h-3.5 text-indigo-500" /> Target: {formatCurrency(savingsGoal, currencySymbol)}
              </span>
              <span className="text-slate-900 font-mono text-[11px] font-bold">{savingsGoalProgressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, savingsGoalProgressPercent)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1 font-medium">
              Reserve: <strong className="text-slate-700 font-mono">{formatCurrency(savingsCurrent, currencySymbol)}</strong>
            </span>
          </div>
        </div>

        {/* 3. LIFETIME HABITS & DEMOGRAPHICS */}
        <div className="bg-white/60 p-5 rounded-2xl border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:bg-white/80 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" strokeWidth={2.2} />
                User Profile Stats
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">{lifetimeTransactionCount} records</span>
            </div>

            <div className="space-y-1.5 text-xs mt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">All-Time Outflow</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">
                  {formatCurrency(lifetimeTotalSpend, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Dominant Category</span>
                <span className="font-bold text-indigo-700 truncate max-w-[130px]">
                  {dominantCategory} ({dominantCategoryShare}%)
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Top Payee</span>
                <span className="font-semibold text-slate-800 truncate max-w-[130px]">
                  {topMerchant}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span className="truncate">Monthly budget capped at {formatCurrency(monthlyBudgetLimit, currencySymbol)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
