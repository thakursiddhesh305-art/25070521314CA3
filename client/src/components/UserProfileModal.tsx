import React, { useState, useEffect } from 'react';
import { IUser } from '../types';
import { X, Check } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<IUser>) => Promise<void>;
  user: IUser | null;
  isCreateMode?: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  isCreateMode = false,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [role, setRole] = useState('Account Owner');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [savingsCurrent, setSavingsCurrent] = useState('');
  const [spendingPersona, setSpendingPersona] = useState('Balanced Planner');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isCreateMode) {
      setName(user.name);
      setEmail(user.email);
      setOccupation(user.occupation || '');
      setRole(user.role || 'Account Owner');
      setMonthlyIncome(String(user.monthlyIncome || 5000));
      setMonthlyBudgetLimit(String(user.monthlyBudgetLimit || 3000));
      setSavingsGoal(String(user.savingsGoal || 20000));
      setSavingsCurrent(String(user.savingsCurrent || 5000));
      setSpendingPersona(user.spendingPersona || 'Balanced Planner');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    } else {
      setName('');
      setEmail('');
      setOccupation('');
      setRole('Standard User');
      setMonthlyIncome('5000');
      setMonthlyBudgetLimit('3000');
      setSavingsGoal('20000');
      setSavingsCurrent('5000');
      setSpendingPersona('Balanced Planner');
      setBio('');
      setAvatar('');
    }
    setError(null);
  }, [user, isOpen, isCreateMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onSave({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        occupation: occupation.trim() || 'Professional',
        role: role.trim() || 'Account Owner',
        monthlyIncome: parseFloat(monthlyIncome) || 5000,
        monthlyBudgetLimit: parseFloat(monthlyBudgetLimit) || 3000,
        savingsGoal: parseFloat(savingsGoal) || 20000,
        savingsCurrent: parseFloat(savingsCurrent) || 5000,
        spendingPersona,
        bio: bio.trim(),
        avatar: avatar.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      });

      sounds.playSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      sounds.playWarning();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-enter">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {isCreateMode ? 'Create User Profile' : 'Financial Profile Settings'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Calibrates budget ceilings, savings goals, and algorithm weights.
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

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Sarah Chen"
                className="w-full px-3 py-2 glass-input rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. sarah@example.com"
                className="w-full px-3 py-2 glass-input rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Occupation & Persona */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Occupation / Role</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Lead Software Architect"
                className="w-full px-3 py-2 glass-input rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Spending Persona</label>
              <select
                value={spendingPersona}
                onChange={(e) => setSpendingPersona(e.target.value)}
                className="w-full px-3 py-2 glass-input rounded-xl text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="Pragmatic Tech Enthusiast">Pragmatic Tech Enthusiast</option>
                <option value="Balanced Planner">Balanced Planner</option>
                <option value="Frugal Optimizer">Frugal Optimizer</option>
                <option value="Urban Lifestyle Spender">Urban Lifestyle Spender</option>
                <option value="Growth Investor">Growth Investor</option>
              </select>
            </div>
          </div>

          {/* Income & Monthly Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Monthly Net Income ($) *</label>
              <input
                type="number"
                step="100"
                min="0"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
                className="w-full px-3 py-2 glass-input rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500 tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Monthly Budget Ceiling ($) *</label>
              <input
                type="number"
                step="50"
                min="100"
                value={monthlyBudgetLimit}
                onChange={(e) => setMonthlyBudgetLimit(e.target.value)}
                required
                className="w-full px-3 py-2 glass-input rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500 tabular-nums"
              />
            </div>
          </div>

          {/* Current Savings & Savings Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Current Savings Reserve ($)</label>
              <input
                type="number"
                step="100"
                min="0"
                value={savingsCurrent}
                onChange={(e) => setSavingsCurrent(e.target.value)}
                className="w-full px-3 py-2 glass-input rounded-xl font-mono text-slate-900 focus:outline-none focus:border-indigo-500 tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Savings Target ($)</label>
              <input
                type="number"
                step="500"
                min="0"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                className="w-full px-3 py-2 glass-input rounded-xl font-mono text-slate-900 focus:outline-none focus:border-indigo-500 tabular-nums"
              />
            </div>
          </div>

          {/* Avatar URL */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Avatar URL (optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-3 py-2 glass-input rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
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
              {isSubmitting ? 'Saving...' : isCreateMode ? 'Create Profile' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
