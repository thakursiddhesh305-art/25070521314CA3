import { Request, Response } from 'express';
import Expense, { CATEGORIES, PAYMENT_METHODS } from '../models/Expense';
import User from '../models/User';
import mongoose from 'mongoose';

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId,
      category,
      paymentMethod,
      status,
      search,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sort = '-date',
      page = 1,
      limit = 100,
    } = req.query;

    const filter: any = {};

    if (userId && mongoose.Types.ObjectId.isValid(userId as string)) {
      filter.userId = new mongoose.Types.ObjectId(userId as string);
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (paymentMethod && paymentMethod !== 'All') {
      filter.paymentMethod = paymentMethod;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { title: searchRegex },
        { merchant: searchRegex },
        { notes: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(200, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum)
      .populate('userId', 'name email avatar');

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: expenses.length,
      data: expenses,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch expenses', error: error.message });
  }
};

export const getExpenseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id).populate('userId', 'name email avatar');
    if (!expense) {
      res.status(404).json({ success: false, message: 'Expense not found' });
      return;
    }
    res.json({ success: true, data: expense });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving expense', error: error.message });
  }
};

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, title, amount, category, paymentMethod, date, merchant, notes, tags, isRecurring, status, receiptUrl } = req.body;

    if (!userId || !title || amount === undefined) {
      res.status(400).json({ success: false, message: 'userId, title, and amount are required fields.' });
      return;
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      res.status(404).json({ success: false, message: 'Specified user does not exist.' });
      return;
    }

    const expense = await Expense.create({
      userId,
      title,
      amount: Number(amount),
      category: category || 'Food & Groceries',
      paymentMethod: paymentMethod || 'Credit Card',
      date: date ? new Date(date) : new Date(),
      merchant: merchant || 'Vendor',
      notes: notes || '',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      isRecurring: Boolean(isRecurring),
      status: status || 'settled',
      receiptUrl: receiptUrl || '',
    });

    const populated = await expense.populate('userId', 'name email avatar');

    res.status(201).json({ success: true, message: 'Expense recorded successfully', data: populated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Failed to create expense', error: error.message });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = { ...req.body };
    if (updateData.amount !== undefined) updateData.amount = Number(updateData.amount);
    if (updateData.date) updateData.date = new Date(updateData.date);
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const updated = await Expense.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('userId', 'name email avatar');

    if (!updated) {
      res.status(404).json({ success: false, message: 'Expense not found' });
      return;
    }

    res.json({ success: true, message: 'Expense updated successfully', data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Failed to update expense', error: error.message });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Expense not found' });
      return;
    }
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete expense', error: error.message });
  }
};

export const getExpenseMeta = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    categories: CATEGORIES,
    paymentMethods: PAYMENT_METHODS,
  });
};

