import React from 'react';
import { Search, Filter, Download, Plus, X } from 'lucide-react';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  selectedPaymentMethod: string;
  onPaymentMethodChange: (pm: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
  categories: string[];
  paymentMethods: string[];
  onOpenAddModal: () => void;
  onExportCSV: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPaymentMethod,
  onPaymentMethodChange,
  sortBy,
  onSortChange,
  categories,
  paymentMethods,
  onOpenAddModal,
  onExportCSV,
  onResetFilters,
  hasActiveFilters,
  totalFilteredCount,
}) => {
  return (
    <div className="glass-panel rounded-3xl p-5 shadow-sm space-y-4">
      {/* Top search & quick actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search by title, merchant, notes, or #tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 glass-input rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            title="Download CSV report"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-xs transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-500/20 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 mr-1 font-semibold">
          <Filter className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
          <span className="text-[11px] uppercase tracking-wider">Filter:</span>
        </div>

        {/* Category select */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Category"
          className="bg-white/80 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-xs"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Payment Method select */}
        <select
          value={selectedPaymentMethod}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
          aria-label="Payment Method"
          className="bg-white/80 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-xs"
        >
          <option value="All">All Channels</option>
          {paymentMethods.map((pm) => (
            <option key={pm} value={pm}>{pm}</option>
          ))}
        </select>

        {/* Sort select */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort"
          className="bg-white/80 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-xs ml-auto"
        >
          <option value="-date">Newest First</option>
          <option value="date">Oldest First</option>
          <option value="-amount">Highest Amount</option>
          <option value="amount">Lowest Amount</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition text-[11px] font-bold shadow-xs"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}

        <span className="text-slate-400 text-[11px] ml-1 font-mono font-semibold">
          {totalFilteredCount} transactions
        </span>
      </div>
    </div>
  );
};
