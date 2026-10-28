import { Request, Response } from 'express';
import User from '../models/User';
import Expense from '../models/Expense';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error finding user', error: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, occupation, monthlyIncome, monthlyBudgetLimit, savingsGoal, savingsCurrent, spendingPersona, bio, avatar } = req.body;
    
    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'A user with this email already exists.' });
      return;
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      occupation: occupation || 'Professional',
      monthlyIncome: Number(monthlyIncome) || 5000,
      monthlyBudgetLimit: Number(monthlyBudgetLimit) || 3000,
      savingsGoal: Number(savingsGoal) || 20000,
      savingsCurrent: Number(savingsCurrent) || 5000,
      spendingPersona: spendingPersona || 'Balanced Planner',
      bio: bio || 'Tracking expenses and budget.',
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });

    res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Failed to create user', error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'User updated successfully', data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Failed to update user', error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    // Also remove associated expenses
    await Expense.deleteMany({ userId: user._id });
    res.json({ success: true, message: 'User and all associated expenses deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};
