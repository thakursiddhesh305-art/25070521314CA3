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
        return <CreditCard className="w-4 h-4 text-sky-400" />;
      case 'Debit Card':
        return <Wallet className="w-4 h-4 text-emerald-400" />;
      case 'Bank Wire':
        return <Landmark className="w-4 h-4 text-indigo-400" />;
      case 'UPI / Instant Transfer':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Crypto / Digital Wallet':
        return <Bitcoin className="w-4 h-4 text-orange-400" />;
      default:
        return <Banknote className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Settlement Channels</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            Payment Methods
          </h3>
        </div>
      </div>

      <div className="space-y-3 my-1">
        {methods.map((pm) => (
          <div key={pm.method} className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  {getIcon(pm.method)}
                </div>
                <div>
                  <span className="font-semibold text-slate-200 block">{pm.method}</span>
                  <span className="text-[11px] text-slate-400">{pm.count} transactions</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-white block text-sm">
                  {formatCurrency(pm.amount, currencySymbol)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{pm.percentage}% of total</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${pm.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
