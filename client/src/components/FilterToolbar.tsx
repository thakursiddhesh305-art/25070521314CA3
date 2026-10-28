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
    <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-xl space-y-3.5">
      {/* Top search & quick actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search by title, merchant, notes, or #tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.05] text-xs">
        <div className="flex items-center gap-1.5 text-zinc-500 mr-1">
          <Filter className="w-3 h-3" strokeWidth={1.75} />
          <span className="text-[11px]">Filter:</span>
        </div>

        {/* Category select */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Category"
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50"
        >
          <option value="All" className="bg-zinc-900">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c} className="bg-zinc-900">{c}</option>
          ))}
        </select>

        {/* Payment Method select */}
        <select
          value={selectedPaymentMethod}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
          aria-label="Payment Method"
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50"
        >
          <option value="All" className="bg-zinc-900">All Methods</option>
          {paymentMethods.map((pm) => (
            <option key={pm} value={pm} className="bg-zinc-900">{pm}</option>
          ))}
        </select>

        {/* Sort select */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort"
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50 ml-auto"
        >
          <option value="-date" className="bg-zinc-900">Newest</option>
          <option value="date" className="bg-zinc-900">Oldest</option>
          <option value="-amount" className="bg-zinc-900">Highest Amount</option>
          <option value="amount" className="bg-zinc-900">Lowest Amount</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition text-[11px]"
          >
            <X className="w-2.5 h-2.5" />
            Reset
          </button>
        )}

        <span className="text-zinc-500 text-[11px] ml-1 font-mono">
          {totalFilteredCount} records
        </span>
      </div>
    </div>
  );
};
