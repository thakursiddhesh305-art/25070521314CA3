import React, { useState, useEffect } from 'react';
import { IUser } from '../types';
import { X, Check, User, DollarSign, Target, Shield, Compass, Sparkles } from 'lucide-react';
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
      setError(err.message || 'Failed to update user profile');
      sounds.playWarning();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121929] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isCreateMode ? 'Create New User Account' : 'Edit User Financial Profile'}
              </h3>
              <p className="text-xs text-slate-400">
                Calibrates user benchmarks, budget ceilings, and financial health algorithms.
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

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Sarah Chen"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. sarah@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Occupation & Persona */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Occupation / Role</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Lead Software Architect"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Spending Persona</label>
              <select
                value={spendingPersona}
                onChange={(e) => setSpendingPersona(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Pragmatic Tech Enthusiast">Pragmatic Tech Enthusiast</option>
                <option value="Balanced Planner">Balanced Planner</option>
                <option value="Frugal Optimizer">Frugal Optimizer</option>
                <option value="Urban Lifestyle Spender">Urban Lifestyle Spender</option>
                <option value="Growth Investor">Growth Investor</option>
              </select>
            </div>
          </div>

          {/* Income & Monthly Budget Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Monthly Net Income ($) *</label>
              <input
                type="number"
                step="100"
                min="0"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500">Used to compute savings rate and cashflow.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Monthly Budget Ceiling ($) *</label>
              <input
                type="number"
                step="50"
                min="100"
                value={monthlyBudgetLimit}
                onChange={(e) => setMonthlyBudgetLimit(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500">Governs dynamic burn tiers & alert status.</span>
            </div>
          </div>

          {/* Savings Current & Savings Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Current Savings Reserve ($)</label>
              <input
                type="number"
                step="100"
                min="0"
                value={savingsCurrent}
                onChange={(e) => setSavingsCurrent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Long-Term Savings Target ($)</label>
              <input
                type="number"
                step="500"
                min="0"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bio & Avatar */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Avatar Image URL (optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Financial Bio / Strategy</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Personal financial ethos or strategy..."
              className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
            />
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
              {isSubmitting ? 'Saving...' : isCreateMode ? 'Create Profile' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
