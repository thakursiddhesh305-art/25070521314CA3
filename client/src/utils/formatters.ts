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
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', hex: '#6366f1' };
    case 'Food & Groceries':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', hex: '#10b981' };
    case 'Dining & Cafes':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hex: '#f59e0b' };
    case 'Transportation & Gas':
      return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', hex: '#0284c7' };
    case 'Gadgets & Tech':
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', hex: '#06b6d4' };
    case 'Utilities & Bills':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', hex: '#3b82f6' };
    case 'Healthcare & Fitness':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', hex: '#f43f5e' };
    case 'Entertainment & Subscriptions':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', hex: '#a855f7' };
    case 'Shopping & Lifestyle':
      return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', hex: '#ec4899' };
    case 'Travel & Vacation':
      return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', hex: '#14b8a6' };
    case 'Education & Courses':
      return { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', hex: '#8b5cf6' };
    case 'Investments & Savings':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', hex: '#22c55e' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', hex: '#64748b' };
  }
};
