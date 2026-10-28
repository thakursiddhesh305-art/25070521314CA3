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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121929] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'Edit Expense Record' : 'Record New Expense'}
              </h3>
              <p className="text-xs text-slate-400">
                Logging for <strong className="text-slate-200">{currentUser?.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Title & Amount Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Expense Title *</label>
              <input
                type="text"
                placeholder="e.g. Whole Foods Groceries, Flight Ticket"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Amount ($) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full pl-7 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {paymentMethods.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Merchant & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Merchant / Payee</label>
              <input
                type="text"
                placeholder="e.g. Whole Foods, Amazon, Uber"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Transaction Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tags & Quick Tag Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Essential, Tax Deductible, Impulse"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              <span className="text-[11px] text-slate-500">Quick add:</span>
              {['Essential', 'Tax Deductible', 'Work', 'Lifestyle', 'Impulse', 'Fixed'].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleQuickTag(tag)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Notes & Context</label>
            <textarea
              rows={2}
              placeholder="Optional notes or memo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Recurring & Status Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-indigo-400" /> Recurring Monthly Expense
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                aria-label="Expense Status"
                className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
              >
                <option value="settled">Settled</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : initialData ? 'Update Record' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
