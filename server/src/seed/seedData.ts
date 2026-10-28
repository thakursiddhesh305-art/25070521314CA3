import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';
import Expense from '../models/Expense';
import { connectDB } from '../config/db';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const seedDatabase = async (): Promise<{ success: boolean; usersCount: number; expensesCount: number }> => {
  console.log('🌱 Starting database seeding for SpendPulse...');

  // Ensure DB connection
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  // Clear existing records
  await Expense.deleteMany({});
  await User.deleteMany({});
  console.log('🧹 Purged existing Users and Expenses collections.');

  // 1. Create Users
  const user1 = await User.create({
    name: 'Sarah Chen',
    email: 'sarah.chen@techvanguard.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'Lead AI Engineer',
    occupation: 'Senior Machine Learning Architect',
    monthlyIncome: 9500,
    monthlyBudgetLimit: 4500,
    savingsGoal: 35000,
    savingsCurrent: 24800,
    currency: 'USD',
    currencySymbol: '$',
    spendingPersona: 'Pragmatic Tech Enthusiast',
    bio: 'Balancing cutting-edge tech investments with disciplined long-term capital preservation.',
  });

  const user2 = await User.create({
    name: 'Alex Rivera',
    email: 'alex.rivera@creativeflow.design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'Freelance Director',
    occupation: 'Digital Media & Brand Strategist',
    monthlyIncome: 5200,
    monthlyBudgetLimit: 3800,
    savingsGoal: 15000,
    savingsCurrent: 5200,
    currency: 'USD',
    currencySymbol: '$',
    spendingPersona: 'Urban Lifestyle Spender',
    bio: 'Navigating fluctuating freelance cashflows with dynamic monthly burn rate tracking.',
  });

  const user3 = await User.create({
    name: 'Priya Sharma',
    email: 'priya.sharma@researchgate.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    role: 'Graduate Researcher',
    occupation: 'Computational Biology Fellow',
    monthlyIncome: 3200,
    monthlyBudgetLimit: 1800,
    savingsGoal: 10000,
    savingsCurrent: 7100,
    currency: 'USD',
    currencySymbol: '$',
    spendingPersona: 'Frugal Optimizer',
    bio: 'Maximizing academic stipend efficiency through strict zero-waste budgeting.',
  });

  const users = [user1, user2, user3];
  console.log(`👤 Created ${users.length} unique user profiles.`);

  // 2. Generate Realistic Expenses across past 6 months
  const now = new Date(); // Oct 2026

  const expenseTemplates = [
    // Housing & Rent
    { title: 'Apartment Monthly Lease', amount: 1850, category: 'Housing & Rent', pm: 'Bank Wire', merchant: 'Avalon Luxury Residences', tags: ['Essential', 'Fixed'], recurring: true },
    { title: 'Homeowner Insurance & HOA', amount: 145, category: 'Housing & Rent', pm: 'Credit Card', merchant: 'StateFarm Mutual', tags: ['Essential'], recurring: true },
    // Utilities & Bills
    { title: 'Gigabit Fiber Internet', amount: 89.99, category: 'Utilities & Bills', pm: 'Credit Card', merchant: 'Sonic Fiber Optic', tags: ['Essential', 'Recurring'], recurring: true },
    { title: 'Municipal Electric & Clean Energy', amount: 134.50, category: 'Utilities & Bills', pm: 'Debit Card', merchant: 'City Power & Grid', tags: ['Essential'], recurring: true },
    { title: 'Mobile Carrier 5G Unlimited Plan', amount: 75.00, category: 'Utilities & Bills', pm: 'Credit Card', merchant: 'Verizon Wireless', tags: ['Essential'], recurring: true },
    // Food & Groceries
    { title: 'Weekly Organic Grocery Run', amount: 142.30, category: 'Food & Groceries', pm: 'Credit Card', merchant: 'Whole Foods Market', tags: ['Essential', 'Organic'] },
    { title: 'Fresh Produce & Pantry Restock', amount: 96.45, category: 'Food & Groceries', pm: 'Debit Card', merchant: 'Trader Joe\'s', tags: ['Essential'] },
    { title: 'Artisanal Sourdough & Specialty Cheeses', amount: 48.20, category: 'Food & Groceries', pm: 'Credit Card', merchant: 'Dean & DeLuca Gourmet', tags: ['Lifestyle'] },
    { title: 'Costco Wholesale Bulk Staples', amount: 215.75, category: 'Food & Groceries', pm: 'Credit Card', merchant: 'Costco Wholesale', tags: ['Essential', 'Bulk'] },
    // Dining & Cafes
    { title: 'Client Strategy Luncheon', amount: 84.50, category: 'Dining & Cafes', pm: 'Credit Card', merchant: 'Nobu Japanese Bistro', tags: ['Tax Deductible', 'Work'] },
    { title: 'Pour-Over Espresso & Pastries', amount: 14.75, category: 'Dining & Cafes', pm: 'Apple Pay / UPI', merchant: 'Blue Bottle Coffee', tags: ['Impulse'] },
    { title: 'Weekend Rooftop Tapas & Cocktails', amount: 112.00, category: 'Dining & Cafes', pm: 'Credit Card', merchant: 'Skyline Terrace Lounge', tags: ['Discretionary', 'Social'] },
    { title: 'DoorDash Friday Night Thai Feast', amount: 56.40, category: 'Dining & Cafes', pm: 'Credit Card', merchant: 'DoorDash / Lemongrass Thai', tags: ['Takeout'] },
    // Transportation & Gas
    { title: 'Metro Transit Monthly Pass', amount: 95.00, category: 'Transportation & Gas', pm: 'Debit Card', merchant: 'Metropolitan Transit Authority', tags: ['Essential', 'Commute'], recurring: true },
    { title: 'Premium Gas Refill & Car Wash', amount: 62.50, category: 'Transportation & Gas', pm: 'Credit Card', merchant: 'Chevron Express', tags: ['Commute'] },
    { title: 'Uber Comfort Ride to Airport', amount: 48.90, category: 'Transportation & Gas', pm: 'Credit Card', merchant: 'Uber Technologies', tags: ['Travel'] },
    // Gadgets & Tech
    { title: 'Dell UltraSharp 4K Monitor Arm', amount: 320.00, category: 'Gadgets & Tech', pm: 'Credit Card', merchant: 'B&H Photo Video', tags: ['Tax Deductible', 'Workspace'] },
    { title: 'Keychron Q1 Pro Mechanical Keyboard', amount: 199.00, category: 'Gadgets & Tech', pm: 'Credit Card', merchant: 'Keychron Official', tags: ['Hardware'] },
    { title: 'Anker Prime 100W GaN Fast Charger', amount: 79.99, category: 'Gadgets & Tech', pm: 'Credit Card', merchant: 'Amazon Prime', tags: ['Tech Accessories'] },
    // Healthcare & Fitness
    { title: 'Equinox Fitness Club Membership', amount: 260.00, category: 'Healthcare & Fitness', pm: 'Credit Card', merchant: 'Equinox Sports Club', tags: ['Health', 'Recurring'], recurring: true },
    { title: 'Dental Deep Cleaning & Oral Care', amount: 120.00, category: 'Healthcare & Fitness', pm: 'Credit Card', merchant: 'Beacon Dental Spa', tags: ['Essential', 'Health'] },
    { title: 'Organic Protein & Micronutrient Powder', amount: 68.00, category: 'Healthcare & Fitness', pm: 'Credit Card', merchant: 'Optimum Nutrition', tags: ['Fitness'] },
    // Entertainment & Subscriptions
    { title: 'Spotify Premium Family Tier', amount: 19.99, category: 'Entertainment & Subscriptions', pm: 'Credit Card', merchant: 'Spotify AB', tags: ['Recurring', 'Music'], recurring: true },
    { title: 'Netflix 4K Ultra HD & HBO Max Bundle', amount: 27.99, category: 'Entertainment & Subscriptions', pm: 'Credit Card', merchant: 'Streaming Media Corp', tags: ['Recurring'], recurring: true },
    { title: 'Symphony Hall Orchestra Tickets', amount: 140.00, category: 'Entertainment & Subscriptions', pm: 'Credit Card', merchant: 'Philharmonic Box Office', tags: ['Culture', 'Leisure'] },
    { title: 'Steam Autumn Indie Game Bundle', amount: 45.50, category: 'Entertainment & Subscriptions', pm: 'Debit Card', merchant: 'Valve Steam Store', tags: ['Gaming'] },
    // Shopping & Lifestyle
    { title: 'Italian Merino Wool Overcoat', amount: 380.00, category: 'Shopping & Lifestyle', pm: 'Credit Card', merchant: 'Nordstrom Heritage', tags: ['Apparel', 'Discretionary'] },
    { title: 'Ergonomic Desk Mat & Leather Organizer', amount: 55.00, category: 'Shopping & Lifestyle', pm: 'Credit Card', merchant: 'Grovemade Design', tags: ['Office'] },
    { title: 'Aesop Aromatique Hand Wash & Balm', amount: 42.00, category: 'Shopping & Lifestyle', pm: 'Credit Card', merchant: 'Aesop Botanicals', tags: ['Personal Care'] },
    // Travel & Vacation
    { title: 'Roundtrip Flight to Lake Tahoe', amount: 340.00, category: 'Travel & Vacation', pm: 'Credit Card', merchant: 'Delta Air Lines', tags: ['Vacation', 'Flight'] },
    { title: 'Alpine Pine Cabin Airbnb Booking', amount: 420.00, category: 'Travel & Vacation', pm: 'Credit Card', merchant: 'Airbnb Hospitality', tags: ['Lodging', 'Vacation'] },
    // Education & Courses
    { title: 'Distributed Systems Masterclass', amount: 150.00, category: 'Education & Courses', pm: 'Credit Card', merchant: 'Coursera Enterprise', tags: ['Education', 'Tax Deductible'] },
    { title: 'O\'Reilly Technical Books Library Subscription', amount: 49.00, category: 'Education & Courses', pm: 'Credit Card', merchant: 'O\'Reilly Media', tags: ['Learning', 'Recurring'], recurring: true },
    // Investments & Savings
    { title: 'Vanguard Total Stock Index Fund (VTI)', amount: 500.00, category: 'Investments & Savings', pm: 'Bank Wire', merchant: 'Vanguard Brokerage', tags: ['Wealth Building', 'Essential'], recurring: true },
    { title: 'Ethereum Cold Storage Staking Allocation', amount: 250.00, category: 'Investments & Savings', pm: 'Crypto / Digital Wallet', merchant: 'Ledger Vault', tags: ['Crypto', 'Savings'] },
  ];

  const expensesToInsert = [];

  // 1. For Sarah Chen (Primary user with 6 months rich history, balanced ~3,200/mo spend)
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const isCurrentMonth = monthOffset === 0;
    const maxDay = isCurrentMonth ? Math.min(27, now.getDate()) : 28;

    // Fixed recurring items for every month
    const fixedRent = {
      userId: user1._id,
      title: 'Apartment Monthly Lease',
      amount: 1850,
      category: 'Housing & Rent',
      paymentMethod: 'Bank Wire',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 1, 9, 30),
      merchant: 'Avalon Luxury Residences',
      notes: 'Monthly fixed apartment lease rent.',
      tags: ['Essential', 'Fixed'],
      isRecurring: true,
      status: 'settled',
    };
    expensesToInsert.push(fixedRent);

    const fixedWifi = {
      userId: user1._id,
      title: 'Gigabit Fiber Internet',
      amount: 89.99,
      category: 'Utilities & Bills',
      paymentMethod: 'Credit Card',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 3, 11, 15),
      merchant: 'Sonic Fiber Optic',
      notes: '1 Gbps synchronous business fiber.',
      tags: ['Essential', 'Recurring'],
      isRecurring: true,
      status: 'settled',
    };
    expensesToInsert.push(fixedWifi);

    const fixedInvestment = {
      userId: user1._id,
      title: 'Vanguard Total Stock Index Fund (VTI)',
      amount: 500,
      category: 'Investments & Savings',
      paymentMethod: 'Bank Wire',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 5, 8, 0),
      merchant: 'Vanguard Brokerage',
      notes: 'Automated monthly index fund wealth transfer.',
      tags: ['Wealth Building', 'Essential'],
      isRecurring: true,
      status: 'settled',
    };
    expensesToInsert.push(fixedInvestment);

    // Add 4-7 additional random items each month
    const numRandom = isCurrentMonth ? 8 : 7;
    for (let r = 0; r < numRandom; r++) {
      const template = expenseTemplates[Math.floor(Math.random() * (expenseTemplates.length - 2))];
      const day = Math.floor(Math.random() * maxDay) + 1;
      const hour = Math.floor(Math.random() * 12) + 9;
      const minute = Math.floor(Math.random() * 59);

      // Slight amount variance (+- 15%)
      const variance = (Math.random() * 0.3 - 0.15);
      const randomizedAmount = Number((template.amount * (1 + variance)).toFixed(2));

      expensesToInsert.push({
        userId: user1._id,
        title: template.title,
        amount: Math.max(5, randomizedAmount),
        category: template.category,
        paymentMethod: template.pm === 'Apple Pay / UPI' ? 'Credit Card' : template.pm,
        date: new Date(now.getFullYear(), now.getMonth() - monthOffset, day, hour, minute),
        merchant: template.merchant,
        notes: `Recorded expense at ${template.merchant}`,
        tags: template.tags,
        isRecurring: template.recurring || false,
        status: 'settled',
      });
    }
  }

  // 2. For Alex Rivera (High spend velocity, dining & lifestyle heavy, near budget limit)
  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    const isCurrent = monthOffset === 0;
    const maxDay = isCurrent ? Math.min(27, now.getDate()) : 28;

    expensesToInsert.push({
      userId: user2._id,
      title: 'Studio Co-Working Loft Desk',
      amount: 1400,
      category: 'Housing & Rent',
      paymentMethod: 'Credit Card',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 2, 10, 0),
      merchant: 'WeWork Downtown Creative Hub',
      notes: 'Dedicated desk & studio access.',
      tags: ['Essential', 'Workspace'],
      isRecurring: true,
      status: 'settled',
    });

    expensesToInsert.push({
      userId: user2._id,
      title: 'Adobe Creative Cloud All Apps',
      amount: 89.99,
      category: 'Gadgets & Tech',
      paymentMethod: 'Credit Card',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 7, 14, 0),
      merchant: 'Adobe Systems Inc',
      notes: 'Video & design suite licenses.',
      tags: ['Tax Deductible', 'Work'],
      isRecurring: true,
      status: 'settled',
    });

    expensesToInsert.push({
      userId: user2._id,
      title: 'Omakase Tasting Menu & Wine Pairing',
      amount: 285.50,
      category: 'Dining & Cafes',
      paymentMethod: 'Credit Card',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 12, 20, 30),
      merchant: 'Sushi Shin Luxury Omakase',
      notes: 'Weekend celebration dinner.',
      tags: ['Discretionary', 'Dining'],
      isRecurring: false,
      status: 'settled',
    });

    expensesToInsert.push({
      userId: user2._id,
      title: 'Sony Alpha FX3 Cinema Camera Lens',
      amount: 1198.00,
      category: 'Gadgets & Tech',
      paymentMethod: 'Credit Card',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 16, 15, 0),
      merchant: 'B&H Photo Video',
      notes: 'New production prime lens.',
      tags: ['Work', 'Hardware'],
      isRecurring: false,
      status: 'settled',
    });

    expensesToInsert.push({
      userId: user2._id,
      title: 'Uber Black Rides & Late Night Transit',
      amount: 142.30,
      category: 'Transportation & Gas',
      paymentMethod: 'Credit Card',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 20, 23, 10),
      merchant: 'Uber Technologies',
      notes: 'Transit between client shoots.',
      tags: ['Travel'],
      isRecurring: false,
      status: 'settled',
    });
  }

  // 3. For Priya Sharma (Frugal, tight disciplined budget, healthy savings)
  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    expensesToInsert.push({
      userId: user3._id,
      title: 'Campus Graduate Housing Co-op',
      amount: 750,
      category: 'Housing & Rent',
      paymentMethod: 'Bank Wire',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 1, 9, 0),
      merchant: 'University Student Housing',
      notes: 'Shared graduate cooperative residence.',
      tags: ['Essential', 'Fixed'],
      isRecurring: true,
      status: 'settled',
    });

    expensesToInsert.push({
      userId: user3._id,
      title: 'Trader Joe\'s Weekly Meal Prep',
      amount: 68.40,
      category: 'Food & Groceries',
      paymentMethod: 'Debit Card',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 6, 12, 0),
      merchant: 'Trader Joe\'s',
      notes: 'Vegetarian staples & grains.',
      tags: ['Essential'],
      isRecurring: false,
      status: 'settled',
    });

    expensesToInsert.push({
      userId: user3._id,
      title: 'Springer Bioinformatics Textbook',
      amount: 85.00,
      category: 'Education & Courses',
      paymentMethod: 'Credit Card',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 14, 16, 0),
      merchant: 'Springer Nature Academic',
      notes: 'Reference manual for PhD research.',
      tags: ['Education', 'Essential'],
      isRecurring: false,
      status: 'settled',
    });

    expensesToInsert.push({
      userId: user3._id,
      title: 'University Rec Center Pass',
      amount: 45.00,
      category: 'Healthcare & Fitness',
      paymentMethod: 'Debit Card',
      date: new Date(now.getFullYear(), now.getMonth() - monthOffset, 18, 10, 0),
      merchant: 'Campus Recreation Center',
      notes: 'Gym & lap swimming access.',
      tags: ['Health'],
      isRecurring: true,
      status: 'settled',
    });
  }

  await Expense.insertMany(expensesToInsert);
  console.log(`✅ Seeded ${expensesToInsert.length} realistic expense records across ${users.length} users!`);

  return {
    success: true,
    usersCount: users.length,
    expensesCount: expensesToInsert.length,
  };
};

// If run directly from CLI
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
