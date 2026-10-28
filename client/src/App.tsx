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
  User,
  Activity,
  Layers,
  Calendar,
  Sparkles,
  AlertCircle,
  Database,
  ArrowRight,
} from 'lucide-react';

export const App: React.FC = () => {
  // Core Application State
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [period, setPeriod] = useState<'month' | '30days' | 'year' | 'all'>('month');
  const [stats, setStats] = useState<IOverviewStats | null>(null);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  // Filtering & Pagination
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

  // 1. Initial Load of Users & Meta
  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch meta
        const meta = await api.getMeta().catch(() => ({ categories: [], paymentMethods: [] }));
        setCategories(meta.categories || []);
        setPaymentMethods(meta.paymentMethods || []);

        // Fetch users
        const fetchedUsers = await api.getUsers();
        setUsers(fetchedUsers);

        if (fetchedUsers.length > 0) {
          setCurrentUser(fetchedUsers[0]);
        }
      } catch (err: any) {
        console.error('Initial load failed:', err);
        setError('Failed to connect to backend or MongoDB. Ensure the server is running on port 5050.');
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  // 2. Fetch Stats & Expenses whenever currentUser or period or filters change
  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setError(null);
      // Fetch comprehensive overview stats (total expenses + user stats)
      const statsData = await api.getOverviewStats(currentUser._id, period);
      setStats(statsData);

      // Fetch expenses with active filter
      const filterParams: Record<string, any> = {
        userId: currentUser._id,
        sort: sortBy,
      };

      if (selectedCategory !== 'All') filterParams.category = selectedCategory;
      if (selectedPaymentMethod !== 'All') filterParams.paymentMethod = selectedPaymentMethod;
      if (searchQuery.trim()) filterParams.search = searchQuery.trim();

      // For period date range filtering in the ledger
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

  // Handle Switch User
  const handleSelectUser = (user: IUser) => {
    setCurrentUser(user);
    // Reset filters
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPaymentMethod('All');
  };

  // Handle Seed Reset
  const handleResetSeed = async () => {
    try {
      setIsResetting(true);
      await api.resetSeedData();
      sounds.playSuccess();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      });

      // Reload users & data
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

  // Handle Save Expense (Create or Update)
  const handleSaveExpense = async (data: Partial<IExpense>) => {
    if (editingExpense) {
      await api.updateExpense(editingExpense._id, data);
    } else {
      await api.createExpense(data);
      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.8 },
      });
    }
    await refreshData();
  };

  // Handle Delete Expense
  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      sounds.playWarning();
      await api.deleteExpense(id);
      await refreshData();
    }
  };

  // Handle Save User Profile
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

  // Export CSV
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
    link.setAttribute('download', `spendpulse_expenses_${currentUser?.name.replace(/\s+/g, '_')}_${period}.csv`);
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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Alert if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between text-sm shadow-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs uppercase font-bold px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Toggle Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('dashboard');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & Demographics</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('ledger');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'ledger'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Expense Ledger ({expenses.length})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>MongoDB Connected: <strong className="text-slate-200">spendpulse_expense_db</strong></span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-44 bg-slate-900/80 rounded-2xl border border-slate-800" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
              <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
              <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
              <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
            </div>
            <div className="h-72 bg-slate-900/80 rounded-2xl border border-slate-800" />
          </div>
        )}

        {/* TAB 1: DASHBOARD & USER DEMOGRAPHICS */}
        {!loading && stats && activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* USER STATS SECTION (Requirement: "also show stats of the user too") */}
            <UserStatsCard
              userStats={stats.userStats}
              currencySymbol={currentUser?.currencySymbol || '$'}
              onEditProfile={() => {
                sounds.playClick();
                setIsCreateUserMode(false);
                setIsUserModalOpen(true);
              }}
            />

            {/* EXPENSE STATS SECTION (Requirement: "Which shows stats depending upon the total expenses") */}
            <StatsOverview
              stats={stats}
              currencySymbol={currentUser?.currencySymbol || '$'}
            />

            {/* Quick Link to Ledger */}
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border border-blue-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-cyan-400" />
                  Detailed Transaction Records
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  View, filter, edit, or export individual expense rows recorded in MongoDB for {currentUser?.name}.
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('ledger');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <span>Open Full Ledger</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: EXPENSE LEDGER */}
        {!loading && activeTab === 'ledger' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter Toolbar */}
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

            {/* Expense List Table */}
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b14] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            ⚡ <strong>SpendPulse</strong> — Enterprise Expense Intelligence & User Financial Demographics Platform
          </p>
          <p className="font-mono text-[11px] text-slate-600">
            Node.js • Express • MongoDB Mongoose • React • TypeScript • Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Expense Modal (Add / Edit) */}
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

      {/* User Profile Modal (Edit / Create) */}
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
