import React from 'react';
import { IPaymentMethodBreakdown } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { CreditCard, Wallet, Landmark, Zap, Bitcoin, Banknote } from 'lucide-react';

interface PaymentMethodChartProps {
  methods: IPaymentMethodBreakdown[];
  totalExpenses: number;
  currencySymbol?: string;
}

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({
  methods,
  totalExpenses,
  currencySymbol = '$',
}) => {
  const getIcon = (method: string) => {
    switch (method) {
      case 'Credit Card':
        return <CreditCard className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.75} />;
      case 'Debit Card':
        return <Wallet className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />;
      case 'Bank Wire':
        return <Landmark className="w-3.5 h-3.5 text-indigo-400" strokeWidth={1.75} />;
      case 'UPI / Instant Transfer':
        return <Zap className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.75} />;
      case 'Crypto / Digital Wallet':
        return <Bitcoin className="w-3.5 h-3.5 text-orange-400" strokeWidth={1.75} />;
      default:
        return <Banknote className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.75} />;
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Channels</span>
          <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
            Settlement
          </h4>
        </div>
      </div>

      <div className="space-y-2.5 my-1">
        {methods.map((pm) => (
          <div key={pm.method} className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-white/[0.04]">
                  {getIcon(pm.method)}
                </div>
                <span className="font-medium text-zinc-200">{pm.method}</span>
              </div>
              <div className="text-right flex items-center gap-2 font-mono text-xs">
                <span className="font-semibold text-white tabular-nums">
                  {formatCurrency(pm.amount, currencySymbol)}
                </span>
                <span className="text-[10px] text-zinc-500 font-sans w-8 text-right">{pm.percentage}%</span>
              </div>
            </div>

            <div className="w-full bg-white/[0.05] rounded-full h-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${pm.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
