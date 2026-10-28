import React from 'react';
import { IBurnTier } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { AlertTriangle, ShieldCheck, Flame, Zap } from 'lucide-react';

interface SpendingGaugeProps {
  totalExpenses: number;
  budgetLimit: number;
  budgetConsumedPercent: number;
  burnTier: IBurnTier;
  dailyVelocity: number;
  currencySymbol?: string;
}

export const SpendingGauge: React.FC<SpendingGaugeProps> = ({
  totalExpenses,
  budgetLimit,
  budgetConsumedPercent,
  burnTier,
  dailyVelocity,
  currencySymbol = '$',
}) => {
  // Semi-circle gauge calculation
  const radius = 75;
  const circumference = Math.PI * radius; // Half-circle
  const clampedPercent = Math.min(100, Math.max(0, budgetConsumedPercent));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  const getTierIcon = () => {
    if (burnTier.id === 'critical' || burnTier.id === 'high-risk') {
      return <Flame className="w-5 h-5 text-rose-400 animate-bounce" />;
    }
    if (burnTier.id === 'caution' || burnTier.id === 'moderate') {
      return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
    return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
  };

  const getStrokeGradient = () => {
    if (burnTier.id === 'critical' || burnTier.id === 'high-risk') {
      return 'url(#gauge-gradient-red)';
    }
    if (burnTier.id === 'caution' || burnTier.id === 'moderate') {
      return 'url(#gauge-gradient-amber)';
    }
    return 'url(#gauge-gradient-green)';
  };

  const remaining = Math.max(0, budgetLimit - totalExpenses);

  return (
    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
      {/* Background ambient glow */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 ${
          burnTier.id === 'critical' ? 'bg-rose-500' : burnTier.id === 'caution' ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Budget Depletion Velocity</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            Dynamic Burn Meter
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700/60 text-slate-300">
          {getTierIcon()}
          <span>{burnTier.badge}</span>
        </div>
      </div>

      {/* Semi-circular gauge graphic */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg viewBox="0 0 180 100" className="w-52 max-w-full overflow-visible">
          <defs>
            <linearGradient id="gauge-gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="gauge-gradient-amber" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="gauge-gradient-red" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 15 90 A 75 75 0 0 1 165 90"
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d="M 15 90 A 75 75 0 0 1 165 90"
            fill="none"
            stroke={getStrokeGradient()}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute bottom-1 text-center">
          <div className="text-3xl font-extrabold text-white tracking-tight flex items-baseline justify-center">
            {budgetConsumedPercent.toFixed(1)}
            <span className="text-sm font-semibold text-slate-400 ml-0.5">%</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Budget Consumed</span>
        </div>
      </div>

      {/* Burn status details & daily pace */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-sm">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-slate-400 text-xs block">Remaining Liquidity</span>
          <span className={`font-mono font-bold text-base ${remaining === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {formatCurrency(remaining, currencySymbol)}
          </span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-slate-400 text-xs block flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" /> Daily Burn Rate
          </span>
          <span className="font-mono font-bold text-base text-cyan-300">
            {formatCurrency(dailyVelocity, currencySymbol)}<span className="text-xs text-slate-500 font-normal">/day</span>
          </span>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40 leading-relaxed">
        <span className="font-semibold text-slate-300">Analysis: </span>
        {burnTier.description}
      </div>
    </div>
  );
};
