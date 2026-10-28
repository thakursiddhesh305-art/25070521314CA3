export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  occupation: string;
  monthlyIncome: number;
  monthlyBudgetLimit: number;
  savingsGoal: number;
  savingsCurrent: number;
  currency: string;
  currencySymbol: string;
  spendingPersona: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface IExpense {
  _id: string;
  userId: string | { _id: string; name: string; email: string; avatar: string };
  title: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
  merchant: string;
  notes?: string;
  tags: string[];
  isRecurring: boolean;
  status: 'settled' | 'pending' | 'flagged';
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBurnTier {
  id: string;
  title: string;
  level: string;
  color: 'emerald' | 'teal' | 'yellow' | 'amber' | 'red' | 'rose';
  badge: string;
  consumedPercent: number;
  description: string;
  recommendation: string;
}

export interface ICategoryBreakdown {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface IPaymentMethodBreakdown {
  method: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface IDayOfWeekStat {
  day: string;
  shortDay: string;
  total: number;
  count: number;
}

export interface IMonthlyTrend {
  monthKey: string;
  label: string;
  total: number;
  count: number;
  budget: number;
}

export interface ITopMerchant {
  merchant: string;
  total: number;
  count: number;
}

export interface IUserDemographicsStats {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    occupation: string;
    currency: string;
    currencySymbol: string;
    bio: string;
    spendingPersona: string;
    joinedAt: string;
  };
  monthlyIncome: number;
  monthlyBudgetLimit: number;
  netMonthlySurplus: number;
  savingsRatePercent: number;
  savingsGoal: number;
  savingsCurrent: number;
  savingsGoalProgressPercent: number;
  financialHealthScore: number;
  healthScoreGrade: string;
  healthScoreColor: string;
  lifetimeTotalSpend: number;
  lifetimeTransactionCount: number;
  averageExpenseLifetime: number;
  activeLoggingDays: number;
  dominantCategory: string;
  dominantCategoryShare: number;
  topMerchant: string;
  essentialSpend: number;
  discretionarySpend: number;
  essentialSpendPercent: number;
}

export interface IOverviewStats {
  period: 'month' | '30days' | 'year' | 'all';
  totalExpenses: number;
  expenseCount: number;
  averageExpense: number;
  dailyVelocity: number;
  projectedMonthEnd: number;
  budgetLimit: number;
  budgetRemaining: number;
  budgetConsumedPercent: number;
  burnTier: IBurnTier;
  highestExpense: IExpense | null;
  lowestExpense: IExpense | null;
  categoryBreakdown: ICategoryBreakdown[];
  dominantCategory: ICategoryBreakdown | null;
  paymentMethodBreakdown: IPaymentMethodBreakdown[];
  dayOfWeekStats: IDayOfWeekStat[];
  weekendSpend: number;
  weekdaySpend: number;
  monthlyTrends: IMonthlyTrend[];
  topMerchants: ITopMerchant[];
  recurringSpend: number;
  oneOffSpend: number;
  userStats: IUserDemographicsStats;
}
