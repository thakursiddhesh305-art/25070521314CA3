import React from 'react';
import { IExpense } from '../types';
import { formatCurrency, formatDate, formatTime, getCategoryColor } from '../utils/formatters';
import {
  Repeat,
  Edit2,
  Trash2,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface ExpenseListProps {
  expenses: IExpense[];
  currencySymbol?: string;
  onEdit: (expense: IExpense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  currencySymbol = '$',
  onEdit,
  onDelete,
}) => {
  if (expenses.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center">
        <Receipt className="w-10 h-10 text-zinc-600 mx-auto mb-2.5 stroke-1" />
        <h4 className="text-sm font-semibold text-zinc-300">No matching records</h4>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
          Try adjusting your search criteria or switching the period filter.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'settled':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-2.5 h-2.5" /> Settled
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Clock className="w-2.5 h-2.5" /> Pending
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-2.5 h-2.5" /> Flagged
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel rounded-3xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span>Ledger History</span>
          <span className="text-xs font-mono font-normal text-zinc-500">({expenses.length} records)</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-white/[0.015] text-[10px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-white/[0.04]">
            <tr>
              <th className="px-5 py-3.5">Category & Title</th>
              <th className="px-4 py-3.5">Payee</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5">Channel</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Amount</th>
              <th className="px-4 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {expenses.map((expense) => {
              const catColor = getCategoryColor(expense.category);
              return (
                <tr
                  key={expense._id}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  {/* Category & Title */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: catColor.hex }}
                        title={expense.category}
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-zinc-100 group-hover:text-indigo-300 transition-colors">
                            {expense.title}
                          </span>
                          {expense.isRecurring && (
                            <span className="flex items-center gap-0.5 text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 rounded" title="Recurring">
                              <Repeat className="w-2 h-2" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${catColor.bg} ${catColor.text}`}>
                            {expense.category}
                          </span>
                          {expense.tags && expense.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              {expense.tags.slice(0, 2).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="text-[9px] text-zinc-500 bg-white/[0.02] px-1.5 py-0.2 rounded border border-white/[0.04]"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Payee / Merchant */}
                  <td className="px-4 py-3.5 text-zinc-300 font-medium">
                    {expense.merchant || 'General'}
                    {expense.notes && (
                      <span className="text-[10px] text-zinc-500 block truncate max-w-[140px] font-normal">
                        {expense.notes}
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-medium text-zinc-300">{formatDate(expense.date)}</div>
                    <div className="text-[10px] text-zinc-500">{formatTime(expense.date)}</div>
                  </td>

                  {/* Channel */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-zinc-400 font-medium text-[11px]">
                      {expense.paymentMethod}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getStatusBadge(expense.status)}
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <span className="font-mono font-bold text-sm text-white tabular-nums">
                      {formatCurrency(expense.amount, currencySymbol)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(expense)}
                        title="Edit"
                        className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white transition active:scale-95"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDelete(expense._id)}
                        title="Delete"
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition active:scale-95"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
