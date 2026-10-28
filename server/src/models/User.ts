import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    role: { type: String, default: 'Account Owner' },
    occupation: { type: String, default: 'Professional' },
    monthlyIncome: { type: Number, required: true, default: 5000, min: 0 },
    monthlyBudgetLimit: { type: Number, required: true, default: 3000, min: 0 },
    savingsGoal: { type: Number, default: 20000, min: 0 },
    savingsCurrent: { type: Number, default: 8500, min: 0 },
    currency: { type: String, default: 'USD' },
    currencySymbol: { type: String, default: '$' },
    spendingPersona: { type: String, default: 'Balanced Planner' },
    bio: { type: String, default: 'Managing personal finances & tracking daily burn rate.' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
