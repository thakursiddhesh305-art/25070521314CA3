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
        return <CreditCard className="w-4 h-4 text-cyan-600" strokeWidth={2} />;
      case 'Debit Card':
        return <Wallet className="w-4 h-4 text-emerald-600" strokeWidth={2} />;
      case 'Bank Wire':
        return <Landmark className="w-4 h-4 text-indigo-600" strokeWidth={2} />;
      case 'UPI / Instant Transfer':
        return <Zap className="w-4 h-4 text-amber-600" strokeWidth={2} />;
      case 'Crypto / Digital Wallet':
        return <Bitcoin className="w-4 h-4 text-orange-600" strokeWidth={2} />;
      default:
        return <Banknote className="w-4 h-4 text-teal-600" strokeWidth={2} />;
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Channels</span>
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
            Settlement
          </h4>
        </div>
      </div>

      <div className="space-y-2.5 my-1">
        {methods.map((pm) => (
          <div key={pm.method} className="bg-white/70 p-3 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                  {getIcon(pm.method)}
                </div>
                <span className="font-bold text-slate-800">{pm.method}</span>
              </div>
              <div className="text-right flex items-center gap-2 font-mono text-xs">
                <span className="font-extrabold text-slate-900 tabular-nums">
                  {formatCurrency(pm.amount, currencySymbol)}
                </span>
                <span className="text-[10px] text-slate-400 font-sans font-semibold w-8 text-right">{pm.percentage}%</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500"
                style={{ width: `${pm.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
