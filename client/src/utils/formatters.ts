export const formatCurrency = (amount: number, symbol: string = '$'): string => {
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatCompactNumber = (num: number, symbol: string = '$'): string => {
  if (Math.abs(num) >= 1_000_000) {
    return `${symbol}${(num / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(num) >= 1_000) {
    return `${symbol}${(num / 1_000).toFixed(1)}k`;
  }
  return `${symbol}${num.toFixed(0)}`;
};

export const formatDate = (dateString: string | Date): string => {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (dateString: string | Date): string => {
  const d = new Date(dateString);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getCategoryColor = (category: string): { bg: string; text: string; border: string; hex: string } => {
  switch (category) {
    case 'Housing & Rent':
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', hex: '#6366f1' };
    case 'Food & Groceries':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', hex: '#10b981' };
    case 'Dining & Cafes':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', hex: '#f59e0b' };
    case 'Transportation & Gas':
      return { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', hex: '#0284c7' };
    case 'Gadgets & Tech':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', hex: '#06b6d4' };
    case 'Utilities & Bills':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', hex: '#3b82f6' };
    case 'Healthcare & Fitness':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', hex: '#f43f5e' };
    case 'Entertainment & Subscriptions':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', hex: '#a855f7' };
    case 'Shopping & Lifestyle':
      return { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', hex: '#ec4899' };
    case 'Travel & Vacation':
      return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', hex: '#14b8a6' };
    case 'Education & Courses':
      return { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', hex: '#8b5cf6' };
    case 'Investments & Savings':
      return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', hex: '#22c55e' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', hex: '#64748b' };
  }
};

