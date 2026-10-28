import React, { useState, useRef, useEffect } from 'react';
import { IUser } from '../types';
import {
  Activity,
  User,
  ChevronDown,
  Plus,
  RefreshCw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  users: IUser[];
  currentUser: IUser | null;
  onSelectUser: (user: IUser) => void;
  onOpenCreateUser: () => void;
  period: 'month' | '30days' | 'year' | 'all';
  onPeriodChange: (p: 'month' | '30days' | 'year' | 'all') => void;
  onOpenAddExpense: () => void;
  onResetSeed: () => Promise<void>;
  isResetting: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  users,
  currentUser,
  onSelectUser,
  onOpenCreateUser,
  period,
  onPeriodChange,
  onOpenAddExpense,
  onResetSeed,
  isResetting,
  soundEnabled,
  onToggleSound,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const periods: { id: 'month' | '30days' | 'year' | 'all'; label: string }[] = [
    { id: 'month', label: 'This Month' },
    { id: '30days', label: '30 Days' },
    { id: 'year', label: 'Year' },
    { id: 'all', label: 'All' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-white/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1.5px] shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-indigo-600 animate-pulse" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
              Spend<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Pulse</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold">
              MongoDB
            </span>
          </div>
        </div>

        {/* Bright Glass Sliding Period Selector (Center) */}
        <div className="hidden md:flex items-center bg-slate-100/70 backdrop-blur-md p-1 rounded-2xl border border-slate-200/60 shadow-inner">
          {periods.map((item) => {
            const isActive = period === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  onPeriodChange(item.id);
                }}
                className={`relative px-3.5 py-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-600 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* User Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                sounds.playClick();
                setUserDropdownOpen(!userDropdownOpen);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 transition-all text-xs font-medium shadow-sm group"
              title="Switch Profile"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <User className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
              )}
              <span className="hidden sm:inline text-slate-800 text-xs font-semibold truncate max-w-[110px]">
                {currentUser?.name || 'User'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </button>

            {/* Bright Glass Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl border border-white/90 rounded-2xl shadow-2xl p-2 z-50 animate-enter ring-1 ring-slate-900/5">
                <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100">
                  Select User Account
                </div>

                <div className="py-1.5 space-y-1 max-h-56 overflow-y-auto">
                  {users.map((u) => {
                    const isSelected = u._id === currentUser?._id;
                    return (
                      <button
                        key={u._id}
                        onClick={() => {
                          sounds.playClick();
                          onSelectUser(u);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50/80 text-indigo-900 border border-indigo-200/60 shadow-sm'
                            : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-bold truncate leading-tight text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{u.occupation}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1.5 border-t border-slate-100">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setUserDropdownOpen(false);
                      onOpenCreateUser();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Create User Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) sounds.playSuccess();
            }}
            title={soundEnabled ? 'Mute Interface Sounds' : 'Enable Audio Feedback'}
            className="p-2 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 text-slate-600 hover:text-indigo-600 shadow-sm transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" strokeWidth={2} />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" strokeWidth={2} />
            )}
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onResetSeed}
            disabled={isResetting}
            title="Reset MongoDB demo records"
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 shadow-sm transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} strokeWidth={2} />
            <span className="hidden lg:inline">{isResetting ? 'Seeding...' : 'Reset Demo'}</span>
          </button>

          {/* Add Expense Primary CTA */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAddExpense();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
};
