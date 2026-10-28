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
      <div className="glass-panel rounded-3xl p-12 text-center shadow-xs">
        <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2.5 stroke-1" />
        <h4 className="text-sm font-bold text-slate-800">No matching records</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-medium">
          Try adjusting your search criteria or switching the period filter.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'settled':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shadow-xs">
            <CheckCircle2 className="w-2.5 h-2.5" /> Settled
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shadow-xs">
            <Clock className="w-2.5 h-2.5" /> Pending
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shadow-xs">
            <AlertCircle className="w-2.5 h-2.5" /> Flagged
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel rounded-3xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Transactional Ledger</span>
          <span className="text-xs font-mono font-medium text-slate-400">({expenses.length} records)</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
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
          <tbody className="divide-y divide-slate-100/90">
            {expenses.map((expense) => {
              const catColor = getCategoryColor(expense.category);
              return (
                <tr
                  key={expense._id}
                  className="hover:bg-indigo-50/40 transition-colors group"
                >
                  {/* Category & Title */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-xs"
                        style={{ backgroundColor: catColor.hex }}
                        title={expense.category}
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {expense.title}
                          </span>
                          {expense.isRecurring && (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded" title="Recurring Monthly">
                              <Repeat className="w-2 h-2" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                            {expense.category}
                          </span>
                          {expense.tags && expense.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              {expense.tags.slice(0, 2).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/80"
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
                  <td className="px-4 py-3.5 text-slate-800 font-semibold">
                    {expense.merchant || 'General Store'}
                    {expense.notes && (
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px] font-normal">
                        {expense.notes}
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-semibold text-slate-700">{formatDate(expense.date)}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{formatTime(expense.date)}</div>
                  </td>

                  {/* Channel */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-slate-700 font-medium text-[11px]">
                      {expense.paymentMethod}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getStatusBadge(expense.status)}
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <span className="font-mono font-extrabold text-sm text-slate-900 tabular-nums">
                      {formatCurrency(expense.amount, currencySymbol)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(expense)}
                        title="Edit"
                        className="p-1.5 rounded-xl hover:bg-white text-slate-500 hover:text-indigo-600 border border-transparent hover:border-slate-200 shadow-xs transition active:scale-95"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(expense._id)}
                        title="Delete"
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-transparent hover:border-rose-200 shadow-xs transition active:scale-95"
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
