import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { api } from './services/api';
import { IUser, IExpense, IOverviewStats } from './types';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { UserStatsCard } from './components/UserStatsCard';
import { FilterToolbar } from './components/FilterToolbar';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseModal } from './components/ExpenseModal';
import { UserProfileModal } from './components/UserProfileModal';
import { sounds } from './utils/soundEffects';
import {
  BarChart3,
  Receipt,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const App: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [period, setPeriod] = useState<'month' | '30days' | 'year' | 'all'>('month');
  const [stats, setStats] = useState<IOverviewStats | null>(null);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');
  const [sortBy, setSortBy] = useState('-date');

  // UI State
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger'>('dashboard');

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<IExpense | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCreateUserMode, setIsCreateUserMode] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        setError(null);

        const meta = await api.getMeta().catch(() => ({ categories: [], paymentMethods: [] }));
        setCategories(meta.categories || []);
        setPaymentMethods(meta.paymentMethods || []);

        const fetchedUsers = await api.getUsers();
        setUsers(fetchedUsers);

        if (fetchedUsers.length > 0) {
          setCurrentUser(fetchedUsers[0]);
        }
      } catch (err: any) {
        console.error('Initial load failed:', err);
        setError('Failed to connect to backend server. Make sure MongoDB & Express are active on port 5050.');
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setError(null);
      const statsData = await api.getOverviewStats(currentUser._id, period);
      setStats(statsData);

      const filterParams: Record<string, any> = {
        userId: currentUser._id,
        sort: sortBy,
      };

      if (selectedCategory !== 'All') filterParams.category = selectedCategory;
      if (selectedPaymentMethod !== 'All') filterParams.paymentMethod = selectedPaymentMethod;
      if (searchQuery.trim()) filterParams.search = searchQuery.trim();

      const now = new Date();
      if (period === 'month') {
        filterParams.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      } else if (period === '30days') {
        filterParams.startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (period === 'year') {
        filterParams.startDate = new Date(now.getFullYear(), 0, 1).toISOString();
      }

      const expensesData = await api.getExpenses(filterParams);
      setExpenses(expensesData.data);
    } catch (err: any) {
      console.error('Data refresh failed:', err);
      setError(err.message || 'Error fetching records.');
    }
  }, [currentUser, period, selectedCategory, selectedPaymentMethod, searchQuery, sortBy]);

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser, period, selectedCategory, selectedPaymentMethod, searchQuery, sortBy, refreshData]);

  const handleSelectUser = (user: IUser) => {
    setCurrentUser(user);
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPaymentMethod('All');
  };

  const handleResetSeed = async () => {
    try {
      setIsResetting(true);
      await api.resetSeedData();
      sounds.playSuccess();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      });

      const refreshedUsers = await api.getUsers();
      setUsers(refreshedUsers);
      if (refreshedUsers.length > 0) {
        setCurrentUser(refreshedUsers[0]);
      }
    } catch (err: any) {
      setError('Failed to seed MongoDB demo records.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSaveExpense = async (data: Partial<IExpense>) => {
    if (editingExpense) {
      await api.updateExpense(editingExpense._id, data);
    } else {
      await api.createExpense(data);
      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.8 },
      });
    }
    await refreshData();
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Delete this expense record?')) {
      sounds.playWarning();
      await api.deleteExpense(id);
      await refreshData();
    }
  };

  const handleSaveUser = async (data: Partial<IUser>) => {
    if (isCreateUserMode) {
      const newUser = await api.createUser(data);
      const all = await api.getUsers();
      setUsers(all);
      setCurrentUser(newUser);
    } else if (currentUser) {
      const updated = await api.updateUser(currentUser._id, data);
      const all = await api.getUsers();
      setUsers(all);
      setCurrentUser(updated);
    }
    await refreshData();
  };

  const handleExportCSV = () => {
    sounds.playClick();
    if (expenses.length === 0) {
      alert('No expense records to export.');
      return;
    }

    const headers = ['Title', 'Amount', 'Currency', 'Category', 'Payment Method', 'Date', 'Merchant', 'Status', 'Tags', 'Notes'];
    const rows = expenses.map((e) => [
      `"${e.title.replace(/"/g, '""')}"`,
      e.amount.toFixed(2),
      'USD',
      `"${e.category}"`,
      `"${e.paymentMethod}"`,
      `"${new Date(e.date).toISOString().split('T')[0]}"`,
      `"${(e.merchant || '').replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${(e.tags || []).join(';')}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `spendpulse_${currentUser?.name.replace(/\s+/g, '_')}_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedPaymentMethod !== 'All';

  const handleResetFilters = () => {
    sounds.playClick();
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPaymentMethod('All');
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white relative">
      {/* Ambient background light spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),rgba(0,0,0,0))] pointer-events-none" />

      {/* Navbar */}
      <Navbar
        users={users}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onOpenCreateUser={() => {
          setIsCreateUserMode(true);
          setIsUserModalOpen(true);
        }}
        period={period}
        onPeriodChange={setPeriod}
        onOpenAddExpense={() => {
          setEditingExpense(null);
          setIsExpenseModalOpen(true);
        }}
        onResetSeed={handleResetSeed}
        isResetting={isResetting}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          sounds.enabled = !soundEnabled;
          setSoundEnabled(!soundEnabled);
        }}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7 relative z-10">
        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 flex items-center justify-between text-xs animate-enter">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Segmented Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-3.5">
          <div className="flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('dashboard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Analytics & Demographics</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('ledger');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'ledger'
                  ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Ledger ({expenses.length})</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span>MongoDB: <strong className="text-zinc-400">spendpulse_expense_db</strong></span>
          </div>
        </div>

        {/* Loading Shimmer */}
        {loading && (
          <div className="space-y-6">
            <div className="h-40 rounded-3xl border border-white/[0.05] shimmer-effect" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-24 rounded-2xl border border-white/[0.05] shimmer-effect" />
              <div className="h-24 rounded-2xl border border-white/[0.05] shimmer-effect" />
              <div className="h-24 rounded-2xl border border-white/[0.05] shimmer-effect" />
              <div className="h-24 rounded-2xl border border-white/[0.05] shimmer-effect" />
            </div>
            <div className="h-64 rounded-3xl border border-white/[0.05] shimmer-effect" />
          </div>
        )}

        {/* TAB 1: ANALYTICS & USER DEMOGRAPHICS */}
        {!loading && stats && activeTab === 'dashboard' && (
          <div className="space-y-7 animate-enter">
            {/* USER STATS (Requirement: "also show stats of the user too") */}
            <UserStatsCard
              userStats={stats.userStats}
              currencySymbol={currentUser?.currencySymbol || '$'}
              onEditProfile={() => {
                sounds.playClick();
                setIsCreateUserMode(false);
                setIsUserModalOpen(true);
              }}
            />

            {/* EXPENSE STATS (Requirement: "Which shows stats depending upon the total expenses") */}
            <StatsOverview
              stats={stats}
              currencySymbol={currentUser?.currencySymbol || '$'}
            />

            {/* Quick Link to Ledger */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-indigo-400" />
                  Detailed Ledger History
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Filter, search, inspect, or export all transactions for {currentUser?.name}.
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('ledger');
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition active:scale-95"
              >
                <span>View All Records</span>
                <ArrowRight className="w-3 h-3 text-zinc-400" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: LEDGER */}
        {!loading && activeTab === 'ledger' && (
          <div className="space-y-5 animate-enter">
            <FilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodChange={setSelectedPaymentMethod}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categories={categories}
              paymentMethods={paymentMethods}
              onOpenAddModal={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              onExportCSV={handleExportCSV}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
              totalFilteredCount={expenses.length}
            />

            <ExpenseList
              expenses={expenses}
              currencySymbol={currentUser?.currencySymbol || '$'}
              onEdit={(expense) => {
                sounds.playClick();
                setEditingExpense(expense);
                setIsExpenseModalOpen(true);
              }}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-white/[0.04] py-6 text-center text-[11px] text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            SpendPulse • Modern Expense Intelligence & User Demographics
          </p>
          <p className="font-mono text-zinc-600">
            Node.js • Express • MongoDB • React • TypeScript • Tailwind
          </p>
        </div>
      </footer>

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        initialData={editingExpense}
        currentUser={currentUser}
        categories={categories}
        paymentMethods={paymentMethods}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        user={currentUser}
        isCreateMode={isCreateUserMode}
      />
    </div>
  );
};
