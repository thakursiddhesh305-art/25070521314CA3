import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: Date;
  merchant: string;
  notes?: string;
  tags: string[];
  isRecurring: boolean;
  status: 'settled' | 'pending' | 'flagged';
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CATEGORIES = [
  'Housing & Rent',
  'Food & Groceries',
  'Dining & Cafes',
  'Transportation & Gas',
  'Gadgets & Tech',
  'Utilities & Bills',
  'Healthcare & Fitness',
  'Entertainment & Subscriptions',
  'Shopping & Lifestyle',
  'Travel & Vacation',
  'Education & Courses',
  'Investments & Savings',
  'Miscellaneous',
] as const;

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'UPI / Instant Transfer',
  'Bank Wire',
  'Crypto / Digital Wallet',
] as const;

const ExpenseSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: [0.01, 'Amount must be greater than zero'] },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
      default: 'Food & Groceries',
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: PAYMENT_METHODS,
      default: 'Credit Card',
    },
    date: { type: Date, default: Date.now, index: true },
    merchant: { type: String, default: 'General Vendor', trim: true },
    notes: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    isRecurring: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['settled', 'pending', 'flagged'],
      default: 'settled',
    },
    receiptUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// Helpful compound indexes for fast query performance
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });
ExpenseSchema.index({ userId: 1, amount: -1 });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);

