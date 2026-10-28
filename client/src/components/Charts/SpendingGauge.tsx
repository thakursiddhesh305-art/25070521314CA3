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
  const radius = 75;
  const circumference = Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, budgetConsumedPercent));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  const getTierIcon = () => {
    if (burnTier.id === 'critical' || burnTier.id === 'high-risk') {
      return <Flame className="w-3.5 h-3.5 text-rose-400" />;
    }
    if (burnTier.id === 'caution' || burnTier.id === 'moderate') {
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
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
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
      {/* Background ambient glow */}
      <div
        className={`absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700 ${
          burnTier.id === 'critical' ? 'bg-rose-500' : burnTier.id === 'caution' ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
      />

      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Burn Trajectory</span>
          <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
            Depletion Velocity
          </h4>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-zinc-300">
          {getTierIcon()}
          <span>{burnTier.badge}</span>
        </div>
      </div>

      {/* Semi-circular Gauge Graphic */}
      <div className="relative flex flex-col items-center justify-center my-3">
        <svg viewBox="0 0 180 98" className="w-56 max-w-full overflow-visible">
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
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d="M 15 90 A 75 75 0 0 1 165 90"
            fill="none"
            stroke={getStrokeGradient()}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute bottom-1 text-center">
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight flex items-baseline justify-center tabular-nums">
            {budgetConsumedPercent.toFixed(1)}
            <span className="text-sm font-sans font-medium text-zinc-500 ml-0.5">%</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-medium">Budget Consumed</span>
        </div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-white/[0.06] text-xs">
        <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
          <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Remaining</span>
          <span className={`font-mono font-bold text-sm tabular-nums ${remaining === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {formatCurrency(remaining, currencySymbol)}
          </span>
        </div>
        <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
          <span className="text-zinc-500 text-[10px] uppercase font-semibold block flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-cyan-400" /> Daily Burn
          </span>
          <span className="font-mono font-bold text-sm text-cyan-300 tabular-nums">
            {formatCurrency(dailyVelocity, currencySymbol)}
          </span>
        </div>
      </div>
    </div>
  );
};
