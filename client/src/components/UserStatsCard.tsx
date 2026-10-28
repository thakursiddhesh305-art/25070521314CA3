import React from 'react';
import { IUserDemographicsStats } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  User,
  HeartPulse,
  TrendingUp,
  Award,
  Wallet,
  PiggyBank,
  CheckCircle2,
  Calendar,
  Layers,
  Store,
  Compass,
  Edit3,
  Shield,
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
    essentialSpend,
    discretionarySpend,
    essentialSpendPercent,
  } = userStats;

  const getScoreColorClass = () => {
    switch (healthScoreColor) {
      case 'emerald':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'teal':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      case 'blue':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: User Identity & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/30 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#121929] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.occupation}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-cyan-300 border border-slate-700/50 flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                Persona: {user.spendingPersona}
              </span>
              <span className="text-[11px] text-slate-500">
                Member since {formatDate(user.joinedAt)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm self-stretch sm:self-auto justify-center"
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
          Edit Financial Profile
        </button>
      </div>

      {/* Grid of User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* COLUMN 1: FINANCIAL HEALTH SCORE & BEHAVIOR */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-400" /> Financial Health Score
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreColorClass()}`}>
                Grade {healthScoreGrade}
              </span>
            </div>

            {/* Score Radial / Display */}
            <div className="flex items-center gap-4 my-2">
              <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
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
                        ? 'text-blue-400'
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
                  <span className="text-xl font-black text-white">{financialHealthScore}</span>
                  <span className="text-[9px] text-slate-400 -mt-1">/100</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <p className="font-semibold text-slate-100">
                  {financialHealthScore >= 80 ? 'Excellent Discipline' : financialHealthScore >= 65 ? 'Stable Cashflow' : 'Needs Optimization'}
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Evaluated across budget adherence, savings velocity, and essential spend ratios.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Essential Ratio: <strong className="text-slate-200">{essentialSpendPercent}%</strong></span>
            <span>Logging Days: <strong className="text-slate-200">{activeLoggingDays} days</strong></span>
          </div>
        </div>

        {/* COLUMN 2: MONTHLY CASH FLOW & SAVINGS RATE */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" /> Monthly Cashflow
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {savingsRatePercent}% Savings Rate
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                <span className="text-slate-400">Reported Monthly Income</span>
                <span className="font-mono font-bold text-white">{formatCurrency(monthlyIncome, currencySymbol)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                <span className="text-slate-400">Current Net Surplus</span>
                <span className={`font-mono font-bold ${netMonthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(netMonthlySurplus, currencySymbol)}
                </span>
              </div>
            </div>
          </div>

          {/* Savings Progress Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <PiggyBank className="w-3.5 h-3.5 text-blue-400" /> Goal: {formatCurrency(savingsGoal, currencySymbol)}
              </span>
              <span className="text-white font-mono font-semibold">{savingsGoalProgressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, savingsGoalProgressPercent)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Current Reserve: <strong className="text-slate-200 font-mono">{formatCurrency(savingsCurrent, currencySymbol)}</strong>
            </span>
          </div>
        </div>

        {/* COLUMN 3: USER LIFETIME DEMOGRAPHICS & HABITS */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" /> Lifetime Demographics
              </span>
              <span className="text-xs text-slate-400">{lifetimeTransactionCount} Total Records</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">All-Time Expenditure</span>
                <span className="font-mono font-extrabold text-white text-sm">
                  {formatCurrency(lifetimeTotalSpend, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Lifetime Avg / Tx</span>
                <span className="font-mono text-slate-200">
                  {formatCurrency(averageExpenseLifetime, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-cyan-400" /> Dominant Category
                </span>
                <span className="font-semibold text-cyan-300">
                  {dominantCategory} ({dominantCategoryShare}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1">
                  <Store className="w-3 h-3 text-amber-400" /> Frequent Merchant
                </span>
                <span className="font-semibold text-amber-300 truncate max-w-[140px]">
                  {topMerchant}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Monthly budget capped at {formatCurrency(monthlyBudgetLimit, currencySymbol)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
