import React, { useState, useEffect } from 'react';
import { IExpense, IUser } from '../types';
import { X, Check, DollarSign, Calendar, Tag, Repeat, Receipt, Store } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<IExpense>) => Promise<void>;
  initialData?: IExpense | null;
  currentUser: IUser | null;
  categories: string[];
  paymentMethods: string[];
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currentUser,
  categories,
  paymentMethods,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Groceries');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [merchant, setMerchant] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [status, setStatus] = useState<'settled' | 'pending' | 'flagged'>('settled');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(String(initialData.amount));
      setCategory(initialData.category);
      setPaymentMethod(initialData.paymentMethod);
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
      setMerchant(initialData.merchant || '');
      setNotes(initialData.notes || '');
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
      setIsRecurring(Boolean(initialData.isRecurring));
      setStatus(initialData.status || 'settled');
    } else {
      setTitle('');
      setAmount('');
      setCategory(categories[0] || 'Food & Groceries');
      setPaymentMethod(paymentMethods[0] || 'Credit Card');
      setDate(new Date().toISOString().split('T')[0]);
      setMerchant('');
      setNotes('');
      setTagsInput('');
      setIsRecurring(false);
      setStatus('settled');
    }
    setError(null);
  }, [initialData, isOpen, categories, paymentMethods]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      await onSave({
        userId: (currentUser?._id || '') as any,
        title: title.trim(),
        amount: parsedAmount,
        category,
        paymentMethod,
        date: new Date(date).toISOString() as any,
        merchant: merchant.trim() || 'General Store',
        notes: notes.trim(),
        tags,
        isRecurring,
        status,
      });

      sounds.playSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save expense');
      sounds.playWarning();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickTag = (tag: string) => {
    sounds.playClick();
    const current = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (!current.includes(tag)) {
      setTagsInput(current.length > 0 ? `${tagsInput}, ${tag}` : tag);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-enter">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {initialData ? 'Edit Expense Record' : 'Record New Expense'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Logging for <strong className="text-slate-800">{currentUser?.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title & Amount Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">Expense Title *</label>
              <input
                type="text"
                placeholder="e.g. Whole Foods Groceries"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 glass-input rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-3 py-2 glass-input rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500 tabular-nums"
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 glass-input rounded-xl text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Payment Channel *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 glass-input rounded-xl text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
              >
                {paymentMethods.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payee & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Payee / Vendor</label>
              <input
                type="text"
                placeholder="e.g. Whole Foods, Uber"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full px-3 py-2 glass-input rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Transaction Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 glass-input rounded-xl text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Tags</label>
            <input
              type="text"
              placeholder="e.g. Essential, Work, Impulse"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 glass-input rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              {['Essential', 'Tax Deductible', 'Work', 'Lifestyle', 'Impulse'].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleQuickTag(tag)}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold border border-slate-200/80 transition"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Notes (optional)</label>
            <textarea
              rows={2}
              placeholder="Memo notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 glass-input rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-normal"
            />
          </div>

          {/* Recurring & Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-0"
              />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-indigo-600" /> Recurring Monthly
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                aria-label="Status"
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              >
                <option value="settled">Settled</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              {isSubmitting ? 'Saving...' : initialData ? 'Update Record' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
