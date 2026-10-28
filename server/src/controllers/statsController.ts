import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Expense from '../models/Expense';
import User from '../models/User';

export const getOverviewStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, period = 'month' } = req.query;

    let targetUser: any = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId as string)) {
      targetUser = await User.findById(userId);
    }
    if (!targetUser) {
      targetUser = await User.findOne().sort({ createdAt: 1 });
    }

    if (!targetUser) {
      res.json({
        success: true,
        data: null,
        message: 'No users or expenses found. Please seed initial demo data.',
      });
      return;
    }

    const uId = targetUser._id;

    // Determine Date Filter for the selected period
    const now = new Date();
    let startDate: Date;
    let daysInPeriod = 30;

    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysPassed = now.getDate();
      daysInPeriod = Math.max(1, daysPassed);
    } else if (period === '30days') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      daysInPeriod = 30;
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      daysInPeriod = Math.max(1, Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)));
    } else {
      // 'all'
      startDate = new Date(0);
      daysInPeriod = 90;
    }

    const periodFilter: any = {
      userId: uId,
      date: { $gte: startDate },
    };

    // 1. Fetch expenses for period
    const periodExpenses = await Expense.find(periodFilter).sort({ date: -1 });

    // 2. Fetch all-time expenses for lifetime stats
    const allExpenses = await Expense.find({ userId: uId });

    // 3. Compute Total Expenses for period
    const totalExpenses = periodExpenses.reduce((sum, item) => sum + item.amount, 0);
    const expenseCount = periodExpenses.length;
    const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

    // 4. Highest & Lowest single expense
    let highestExpense = null;
    let lowestExpense = null;
    if (expenseCount > 0) {
      const sortedByAmount = [...periodExpenses].sort((a, b) => b.amount - a.amount);
      highestExpense = sortedByAmount[0];
      lowestExpense = sortedByAmount[sortedByAmount.length - 1];
    }

    // 5. Dynamic Spending Tier & Burn Status (Strictly dependent on totalExpenses vs budget)
    const budgetLimit = targetUser.monthlyBudgetLimit || 3000;
    const budgetConsumedPercent = budgetLimit > 0 ? (totalExpenses / budgetLimit) * 100 : 0;
    const dailyVelocity = totalExpenses / Math.max(1, daysInPeriod);

    // Projected end-of-month spending
    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const projectedMonthEnd = period === 'month' ? dailyVelocity * daysInCurrentMonth : totalExpenses;

    let burnTier = {
      id: 'frugal',
      title: 'Frugal Haven',
      level: 'Optimal Green',
      color: 'emerald',
      badge: 'SAFE MARGIN',
      consumedPercent: Number(budgetConsumedPercent.toFixed(1)),
      description: 'Remarkable capital preservation. Daily burn velocity is well inside safe financial boundaries.',
      recommendation: 'You have excess budget liquidity. Consider routing surplus cash into automated high-yield investments.',
    };

    if (budgetConsumedPercent > 100) {
      burnTier = {
        id: 'critical',
        title: 'Critical Overdraft Deficit',
        level: 'Severe Red',
        color: 'rose',
        badge: 'OVER-BUDGET ALERT',
        consumedPercent: Number(budgetConsumedPercent.toFixed(1)),
        description: `Alert: Current expenses have exceeded budget by $${(totalExpenses - budgetLimit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!`,
        recommendation: 'Emergency protocol: Freeze non-essential entertainment and retail purchases immediately to prevent cashflow depletion.',
      };
    } else if (budgetConsumedPercent >= 90) {
      burnTier = {
        id: 'high-risk',
        title: 'Redline Threshold',
        level: 'High Risk',
        color: 'red',
        badge: 'NEAR LIMIT',
        consumedPercent: Number(budgetConsumedPercent.toFixed(1)),
        description: 'Under 10% of monthly budget remains. Discretionary spending velocity is critically high.',
        recommendation: 'Impose strict expense caps on dining, leisure, and impulsive online orders for the remainder of this cycle.',
      };
    } else if (budgetConsumedPercent >= 75) {
      burnTier = {
        id: 'caution',
        title: 'Elevated Velocity',
        level: 'Cautionary Orange',
        color: 'amber',
        badge: 'CAUTION ZONE',
        consumedPercent: Number(budgetConsumedPercent.toFixed(1)),
        description: 'You have consumed over 75% of your planned budget. Daily burn rate requires active oversight.',
        recommendation: 'Check upcoming bills and recurring commitments before authorizing discretionary outlays.',
      };
    } else if (budgetConsumedPercent >= 50) {
      burnTier = {
        id: 'moderate',
        title: 'Moderate Outflow',
        level: 'Balanced Yellow',
        color: 'yellow',
        badge: 'MODERATE BURN',
        consumedPercent: Number(budgetConsumedPercent.toFixed(1)),
        description: 'Halfway through the budget ceiling. Trajectory is moderate but steady.',
        recommendation: 'Maintain current cadence. Avoid major unplanned hardware or luxury purchases.',
      };
    } else if (budgetConsumedPercent >= 25) {
      burnTier = {
        id: 'disciplined',
        title: 'Disciplined Flow',
        level: 'Healthy Green',
        color: 'teal',
        badge: 'STABLE CADENCE',
        consumedPercent: Number(budgetConsumedPercent.toFixed(1)),
        description: 'Spending is disciplined and comfortably below warning thresholds.',
        recommendation: 'On track to meet or exceed monthly savings objectives.',
      };
    }

    // 6. Category Breakdown & Aggregations
    const categoryMap: Record<string, { amount: number; count: number }> = {};
    periodExpenses.forEach((exp) => {
      if (!categoryMap[exp.category]) {
        categoryMap[exp.category] = { amount: 0, count: 0 };
      }
      categoryMap[exp.category].amount += exp.amount;
      categoryMap[exp.category].count += 1;
    });

    const categoryBreakdown = Object.keys(categoryMap)
      .map((cat) => ({
        category: cat,
        amount: Number(categoryMap[cat].amount.toFixed(2)),
        count: categoryMap[cat].count,
        percentage: totalExpenses > 0 ? Number(((categoryMap[cat].amount / totalExpenses) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const dominantCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

    // 7. Payment Method Distribution
    const paymentMap: Record<string, { amount: number; count: number }> = {};
    periodExpenses.forEach((exp) => {
      const pm = exp.paymentMethod || 'Credit Card';
      if (!paymentMap[pm]) {
        paymentMap[pm] = { amount: 0, count: 0 };
      }
      paymentMap[pm].amount += exp.amount;
      paymentMap[pm].count += 1;
    });

    const paymentMethodBreakdown = Object.keys(paymentMap)
      .map((pm) => ({
        method: pm,
        amount: Number(paymentMap[pm].amount.toFixed(2)),
        count: paymentMap[pm].count,
        percentage: totalExpenses > 0 ? Number(((paymentMap[pm].amount / totalExpenses) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // 8. Day of Week Distribution
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];

    periodExpenses.forEach((exp) => {
      const dayIdx = new Date(exp.date).getDay();
      dayTotals[dayIdx] += exp.amount;
      dayCounts[dayIdx] += 1;
    });

    const dayOfWeekStats = dayNames.map((name, idx) => ({
      day: name,
      shortDay: name.substring(0, 3),
      total: Number(dayTotals[idx].toFixed(2)),
      count: dayCounts[idx],
    }));

    const weekendSpend = dayTotals[0] + dayTotals[6];
    const weekdaySpend = dayTotals[1] + dayTotals[2] + dayTotals[3] + dayTotals[4] + dayTotals[5];

    // 9. Monthly Trend (Past 6 Months)
    const monthlyHistoryMap: Record<string, { total: number; count: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Pre-populate last 6 calendar months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyHistoryMap[key] = { total: 0, count: 0 };
    }

    allExpenses.forEach((exp) => {
      const d = new Date(exp.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyHistoryMap[key]) {
        monthlyHistoryMap[key].total += exp.amount;
        monthlyHistoryMap[key].count += 1;
      }
    });

    const monthlyTrends = Object.keys(monthlyHistoryMap)
      .sort()
      .map((key) => {
        const [yearStr, monthStr] = key.split('-');
        const monthNum = parseInt(monthStr, 10) - 1;
        return {
          monthKey: key,
          label: `${monthNames[monthNum]} ${yearStr.slice(2)}`,
          total: Number(monthlyHistoryMap[key].total.toFixed(2)),
          count: monthlyHistoryMap[key].count,
          budget: budgetLimit,
        };
      });

    // 10. Top Merchants / Payees
    const merchantMap: Record<string, { amount: number; count: number }> = {};
    periodExpenses.forEach((exp) => {
      const m = exp.merchant || 'General Store';
      if (!merchantMap[m]) {
        merchantMap[m] = { amount: 0, count: 0 };
      }
      merchantMap[m].amount += exp.amount;
      merchantMap[m].count += 1;
    });

    const topMerchants = Object.keys(merchantMap)
      .map((m) => ({
        merchant: m,
        total: Number(merchantMap[m].amount.toFixed(2)),
        count: merchantMap[m].count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // 11. Recurring vs One-Off Ratio
    const recurringSpend = periodExpenses.filter((e) => e.isRecurring).reduce((s, e) => s + e.amount, 0);
    const oneOffSpend = totalExpenses - recurringSpend;

    // 12. Calculate USER STATS (User Demographics & Financial Behavior)
    const lifetimeSpend = allExpenses.reduce((sum, item) => sum + item.amount, 0);
    const lifetimeTransactions = allExpenses.length;
    const monthlyIncome = targetUser.monthlyIncome || 5000;
    const netMonthlySurplus = monthlyIncome - totalExpenses;
    const savingsRate = monthlyIncome > 0 ? Math.max(0, (netMonthlySurplus / monthlyIncome) * 100) : 0;
    const savingsGoal = targetUser.savingsGoal || 20000;
    const savingsCurrent = targetUser.savingsCurrent || 5000;
    const savingsGoalProgress = savingsGoal > 0 ? Math.min(100, (savingsCurrent / savingsGoal) * 100) : 0;

    // Compute User Financial Health Score (0 - 100)
    // - Budget adherence: 40 pts max (full score if spending <= 75% of budget, scales down linearly if exceeded)
    let budgetScore = 40;
    if (budgetConsumedPercent > 100) {
      budgetScore = Math.max(5, 40 - (budgetConsumedPercent - 100) * 0.7);
    } else if (budgetConsumedPercent > 75) {
      budgetScore = 40 - (budgetConsumedPercent - 75) * 0.8;
    }

    // - Savings Rate: 30 pts max (full score if savings rate >= 30%)
    const savingsScore = Math.min(30, (savingsRate / 30) * 30);

    // - Logging Activity / Consistency: 15 pts max
    const loggingScore = Math.min(15, (expenseCount / 10) * 15);

    // - Discretionary discipline: 15 pts max
    const essentialCategories = ['Housing & Rent', 'Food & Groceries', 'Utilities & Bills', 'Healthcare & Fitness', 'Transportation & Gas'];
    const essentialSpend = periodExpenses
      .filter((e) => essentialCategories.includes(e.category) || e.tags.includes('Essential'))
      .reduce((s, e) => s + e.amount, 0);
    const essentialRatio = totalExpenses > 0 ? (essentialSpend / totalExpenses) * 100 : 50;
    const disciplineScore = Math.min(15, (essentialRatio / 60) * 15);

    const totalHealthScore = Math.round(Math.min(100, Math.max(10, budgetScore + savingsScore + loggingScore + disciplineScore)));

    let scoreGrade = 'A';
    let scoreColor = 'emerald';
    if (totalHealthScore >= 90) {
      scoreGrade = 'A+';
      scoreColor = 'emerald';
    } else if (totalHealthScore >= 80) {
      scoreGrade = 'A';
      scoreColor = 'teal';
    } else if (totalHealthScore >= 70) {
      scoreGrade = 'B+';
      scoreColor = 'blue';
    } else if (totalHealthScore >= 60) {
      scoreGrade = 'B';
      scoreColor = 'amber';
    } else {
      scoreGrade = 'C';
      scoreColor = 'rose';
    }

    // Unique logging streak calculation
    const uniqueDates = Array.from(new Set(allExpenses.map((e) => new Date(e.date).toISOString().split('T')[0]))).sort().reverse();
    const activeLoggingDays = uniqueDates.length;

    const userStats = {
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        avatar: targetUser.avatar,
        role: targetUser.role,
        occupation: targetUser.occupation,
        currency: targetUser.currency,
        currencySymbol: targetUser.currencySymbol,
        bio: targetUser.bio,
        spendingPersona: targetUser.spendingPersona,
        joinedAt: targetUser.createdAt,
      },
      monthlyIncome: Number(monthlyIncome.toFixed(2)),
      monthlyBudgetLimit: Number(budgetLimit.toFixed(2)),
      netMonthlySurplus: Number(netMonthlySurplus.toFixed(2)),
      savingsRatePercent: Number(savingsRate.toFixed(1)),
      savingsGoal: Number(savingsGoal.toFixed(2)),
      savingsCurrent: Number(savingsCurrent.toFixed(2)),
      savingsGoalProgressPercent: Number(savingsGoalProgress.toFixed(1)),
      financialHealthScore: totalHealthScore,
      healthScoreGrade: scoreGrade,
      healthScoreColor: scoreColor,
      lifetimeTotalSpend: Number(lifetimeSpend.toFixed(2)),
      lifetimeTransactionCount: lifetimeTransactions,
      averageExpenseLifetime: lifetimeTransactions > 0 ? Number((lifetimeSpend / lifetimeTransactions).toFixed(2)) : 0,
      activeLoggingDays,
      dominantCategory: dominantCategory?.category || 'None',
      dominantCategoryShare: dominantCategory?.percentage || 0,
      topMerchant: topMerchants.length > 0 ? topMerchants[0].merchant : 'N/A',
      essentialSpend: Number(essentialSpend.toFixed(2)),
      discretionarySpend: Number((totalExpenses - essentialSpend).toFixed(2)),
      essentialSpendPercent: totalExpenses > 0 ? Number(((essentialSpend / totalExpenses) * 100).toFixed(1)) : 0,
    };

    res.json({
      success: true,
      data: {
        period,
        totalExpenses: Number(totalExpenses.toFixed(2)),
        expenseCount,
        averageExpense: Number(averageExpense.toFixed(2)),
        dailyVelocity: Number(dailyVelocity.toFixed(2)),
        projectedMonthEnd: Number(projectedMonthEnd.toFixed(2)),
        budgetLimit,
        budgetRemaining: Number(Math.max(0, budgetLimit - totalExpenses).toFixed(2)),
        budgetConsumedPercent: Number(budgetConsumedPercent.toFixed(1)),
        burnTier,
        highestExpense,
        lowestExpense,
        categoryBreakdown,
        dominantCategory,
        paymentMethodBreakdown,
        dayOfWeekStats,
        weekendSpend: Number(weekendSpend.toFixed(2)),
        weekdaySpend: Number(weekdaySpend.toFixed(2)),
        monthlyTrends,
        topMerchants,
        recurringSpend: Number(recurringSpend.toFixed(2)),
        oneOffSpend: Number(oneOffSpend.toFixed(2)),
        userStats,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to compute expense and user stats', error: error.message });
  }
};
