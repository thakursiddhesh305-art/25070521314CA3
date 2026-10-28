import { IUser, IExpense, IOverviewStats } from '../types';

const BASE_URL = '/api';

export const api = {
  // Stats
  async getOverviewStats(userId?: string, period: string = 'month'): Promise<IOverviewStats> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (period) params.append('period', period);

    const res = await fetch(`${BASE_URL}/stats/overview?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    const json = await res.json();
    return json.data;
  },

  // Users
  async getUsers(): Promise<IUser[]> {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    const json = await res.json();
    return json.data;
  },

  async getUserById(id: string): Promise<IUser> {
    const res = await fetch(`${BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error('Failed to fetch user');
    const json = await res.json();
    return json.data;
  },

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create user');
    }
    const json = await res.json();
    return json.data;
  },

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser> {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update user');
    }
    const json = await res.json();
    return json.data;
  },

  async deleteUser(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete user');
  },

  // Expenses
  async getExpenses(params: Record<string, any> = {}): Promise<{ total: number; data: IExpense[] }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });

    const res = await fetch(`${BASE_URL}/expenses?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch expenses');
    const json = await res.json();
    return { total: json.total, data: json.data };
  },

  async createExpense(expenseData: Partial<IExpense>): Promise<IExpense> {
    const res = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to record expense');
    }
    const json = await res.json();
    return json.data;
  },

  async updateExpense(id: string, expenseData: Partial<IExpense>): Promise<IExpense> {
    const res = await fetch(`${BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update expense');
    }
    const json = await res.json();
    return json.data;
  },

  async deleteExpense(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/expenses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete expense');
  },

  async getMeta(): Promise<{ categories: string[]; paymentMethods: string[] }> {
    const res = await fetch(`${BASE_URL}/expenses/meta`);
    if (!res.ok) throw new Error('Failed to fetch meta');
    const json = await res.json();
    return { categories: json.categories, paymentMethods: json.paymentMethods };
  },

  // Seed
  async resetSeedData(): Promise<any> {
    const res = await fetch(`${BASE_URL}/seed`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed demo data');
    return await res.json();
  },
};
