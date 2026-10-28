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
  Sparkles,
  Layers,
  ArrowUpRight,
  Sliders,
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
    <header className="sticky top-0 z-40 bg-[#08090d]/80 backdrop-blur-2xl border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0d0f17] rounded-[11px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" strokeWidth={2} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
              Spend<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Pulse</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-white/[0.05] text-zinc-400 border border-white/[0.06]">
              Mongo
            </span>
          </div>
        </div>

        {/* Minimalist Sliding Period Selector (Center) */}
        <div className="hidden md:flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] shadow-inner">
          {periods.map((item) => {
            const isActive = period === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  onPeriodChange(item.id);
                }}
                className={`relative px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/[0.12] shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* User Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                sounds.playClick();
                setUserDropdownOpen(!userDropdownOpen);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all text-xs font-medium group"
              title="Switch Profile"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
                />
              ) : (
                <User className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
              )}
              <span className="hidden sm:inline text-zinc-200 text-xs font-medium group-hover:text-white truncate max-w-[110px]">
                {currentUser?.name || 'User'}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-transform" />
            </button>

            {/* Raycast-style Dropdown */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-[#10121a]/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-2xl p-1.5 z-50 animate-enter">
                <div className="px-3 py-2 text-[10px] uppercase font-semibold tracking-wider text-zinc-500 border-b border-white/[0.06]">
                  Select Persona
                </div>

                <div className="py-1 space-y-0.5 max-h-56 overflow-y-auto">
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
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                            : 'hover:bg-white/[0.06] text-zinc-300 hover:text-white border border-transparent'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                        />
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-semibold truncate leading-tight">{u.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{u.occupation}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1.5 border-t border-white/[0.06]">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setUserDropdownOpen(false);
                      onOpenCreateUser();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Create User</span>
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
            title={soundEnabled ? 'Mute Sounds' : 'Enable Audio Feedback'}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-white transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" strokeWidth={1.75} />
            )}
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onResetSeed}
            disabled={isResetting}
            title="Reset MongoDB demo dataset"
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-indigo-400' : 'text-zinc-400'}`} strokeWidth={1.75} />
            <span className="hidden lg:inline">{isResetting ? 'Seeding...' : 'Reset'}</span>
          </button>

          {/* Add Expense Primary CTA */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAddExpense();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-md active:scale-95 duration-150"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
};
