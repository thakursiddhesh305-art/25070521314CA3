import React from 'react';
import { Search, Filter, Download, Plus, RefreshCw, X, FileSpreadsheet } from 'lucide-react';

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
    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, merchant, notes, or #tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Buttons: Export & Add */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            title="Export filtered records to CSV"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by Category"
          className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Payment method filter */}
        <select
          value={selectedPaymentMethod}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
          aria-label="Filter by Payment Method"
          className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Payment Methods</option>
          {paymentMethods.map((pm) => (
            <option key={pm} value={pm}>{pm}</option>
          ))}
        </select>

        {/* Sort by */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort Expenses By"
          className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 ml-auto"
        >
          <option value="-date">Date: Newest First</option>
          <option value="date">Date: Oldest First</option>
          <option value="-amount">Amount: Highest First</option>
          <option value="amount">Amount: Lowest First</option>
        </select>

        {/* Clear filter button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}

        <span className="text-slate-500 text-[11px] ml-2">
          Showing <strong>{totalFilteredCount}</strong> transactions
        </span>
      </div>
    </div>
  );
};
