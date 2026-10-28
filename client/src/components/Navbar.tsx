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
  Database,
  Compass,
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-400 animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Spend<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Pulse</span>
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 font-mono">
                MongoDB v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Expense Intelligence & Dynamic Burn Demographics
            </p>
          </div>
        </div>

        {/* Period Selector Tabs (Center) */}
        <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'month', label: 'This Month' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'year', label: 'This Year' },
            { id: 'all', label: 'All-Time' },
          ].map((item) => {
            const isActive = period === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  onPeriodChange(item.id as any);
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Action Cluster: User Selector, Seed Reset, Sound & Add Expense */}
        <div className="flex items-center gap-3">
          {/* User Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                sounds.playClick();
                setUserDropdownOpen(!userDropdownOpen);
              }}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-200 transition shadow-sm"
              title="Switch Active User Profile"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-blue-500/40"
                />
              ) : (
                <User className="w-5 h-5 text-blue-400" />
              )}
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white block leading-tight">
                  {currentUser?.name || 'Select User'}
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  {currentUser?.occupation || 'Account'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#121929] border border-slate-700/90 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-800 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Switch Profile
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Calculates stats based on selected user
                  </p>
                </div>

                <div className="py-1 max-h-56 overflow-y-auto space-y-1">
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
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition ${
                          isSelected
                            ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold truncate text-white">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{u.occupation}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setUserDropdownOpen(false);
                      onOpenCreateUser();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-400" />
                    <span>Create New User Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) sounds.playSuccess();
            }}
            title={soundEnabled ? 'Mute Interface Sounds' : 'Enable Audio Feedback'}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Seed Reset */}
          <button
            onClick={onResetSeed}
            disabled={isResetting}
            title="Reset MongoDB to rich initial demo dataset"
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition text-xs font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">{isResetting ? 'Seeding...' : 'Reset Demo'}</span>
          </button>

          {/* Add Expense Primary Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAddExpense();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Add Expense</span>
          </button>
        </div>
      </div>

      {/* Mobile Period Selector Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-1.5 bg-slate-950/60 text-xs">
        {[
          { id: 'month', label: 'This Month' },
          { id: '30days', label: '30 Days' },
          { id: 'year', label: 'This Year' },
          { id: 'all', label: 'All-Time' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              sounds.playClick();
              onPeriodChange(item.id as any);
            }}
            className={`px-3 py-1 rounded-md text-xs ${
              period === item.id
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
