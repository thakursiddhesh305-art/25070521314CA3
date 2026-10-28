import React from 'react';
import { IExpense } from '../types';
import { formatCurrency, formatDate, formatTime, getCategoryColor } from '../utils/formatters';
import {
  CreditCard,
  Repeat,
  Tag,
  Edit2,
  Trash2,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
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
      <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-12 text-center shadow-xl">
        <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-200">No Expenses Match Your Criteria</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try clearing your search query or selecting a different category filter above.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'settled':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" /> Settled
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'flagged':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
            <AlertCircle className="w-3 h-3" /> Flagged
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Transactional Ledger</span>
          <span className="text-xs font-normal text-slate-400">({expenses.length} records)</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Category & Title</th>
              <th className="px-4 py-3.5">Merchant / Vendor</th>
              <th className="px-4 py-3.5">Date & Time</th>
              <th className="px-4 py-3.5">Payment Method</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Amount</th>
              <th className="px-4 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {expenses.map((expense) => {
              const catColor = getCategoryColor(expense.category);
              return (
                <tr
                  key={expense._id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Category & Title */}
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: catColor.hex }}
                        title={expense.category}
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {expense.title}
                          </span>
                          {expense.isRecurring && (
                            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded" title="Recurring Automated Expense">
                              <Repeat className="w-2.5 h-2.5" /> Recurring
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${catColor.bg} ${catColor.text}`}>
                            {expense.category}
                          </span>
                          {expense.tags && expense.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              {expense.tags.slice(0, 2).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="text-[10px] text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/40"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {expense.tags.length > 2 && (
                                <span className="text-[10px] text-slate-500">+{expense.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Merchant */}
                  <td className="px-4 py-4 text-slate-300 font-medium">
                    {expense.merchant || 'General Store'}
                    {expense.notes && (
                      <span className="text-[11px] text-slate-500 block truncate max-w-[160px] font-normal" title={expense.notes}>
                        {expense.notes}
                      </span>
                    )}
                  </td>

                  {/* Date & Time */}
                  <td className="px-4 py-4 text-xs whitespace-nowrap">
                    <div className="font-medium text-slate-200">{formatDate(expense.date)}</div>
                    <div className="text-[11px] text-slate-500">{formatTime(expense.date)}</div>
                  </td>

                  {/* Payment Method */}
                  <td className="px-4 py-4 text-xs whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300 font-medium inline-block">
                      {expense.paymentMethod}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(expense.status)}
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <span className="font-mono font-extrabold text-base text-white">
                      {formatCurrency(expense.amount, currencySymbol)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(expense)}
                        title="Edit expense"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(expense._id)}
                        title="Delete expense"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
