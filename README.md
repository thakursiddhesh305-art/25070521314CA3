# ⚡ SpendPulse — Expense Intelligence & User Financial Demographics

An enterprise-grade, full-stack **Expense Tracking & Intelligence Web Application** built with **MongoDB**, **Express**, **Node.js**, **React**, and **TypeScript**. 

Designed specifically for college submissions, laboratory evaluations, viva presentations, and production portfolios, **SpendPulse** dynamically computes financial burn metrics based on total expenditure and reveals comprehensive behavioral statistics about the user.

---

## 🌟 Key Highlights & Requirements

### 1. 📊 Statistics Depending Upon Total Expenses
- **Dynamic 6-Tier Burn Status Matrix**:
  The application automatically evaluates the total expenses logged against the user's monthly budget ceiling and dynamically shifts between six distinct operational tiers:
  - **Tier 1: Frugal Haven (< 25% of budget)** — Safe Green margin, optimal capital preservation.
  - **Tier 2: Disciplined Flow (25% – 50% of budget)** — Healthy pace, sustained reserves.
  - **Tier 3: Moderate Outflow (50% – 75% of budget)** — Amber alert, halfway through planned liquidity.
  - **Tier 4: Elevated Velocity (75% – 90% of budget)** — Orange warning, advises halting non-essentials.
  - **Tier 5: Redline Threshold (90% – 100% of budget)** — Near-exhaustion danger zone (< 10% reserve).
  - **Tier 6: Critical Overdraft (> 100% of budget)** — Severe red flashing alert showing exact overdraft deficit.
- **Dynamic Semi-Circular Burn Gauge**: Visual SVG gauge that updates in real-time as expenses are added, edited, or deleted.
- **Automated Financial Advisory**: Textual advice generated in real-time recommending actions (e.g. index fund sweeps vs discretionary freezes).
- **Daily Spend Velocity & Projected Month-End**: Computes daily outflow (`totalExpenses / daysPassed`) and extrapolates expected month-end spend.
- **Category Allocation**: Interactive SVG Donut chart and ranked progress bars breaking down spending by percentage and transaction count across 13 distinct categories.
- **Payment Method Distribution**: Breakdown of cash outlays by Credit Card, Debit Card, UPI, Bank Wire, Cash, and Crypto.
- **Historical 6-Month Trajectory**: Bar chart showing monthly spending trends compared against the dashed budget cap line.
- **Weekend vs Weekday Spending Analysis**: Unveils leisure weekend burn vs weekday commuter patterns.
- **Extreme Purchase Detection**: Instant visibility into the highest and lowest single expense.

---

### 2. 👤 Statistics of the User
- **Algorithmic Financial Health Score (0 – 100)**:
  Dynamically computed from four weighted vectors:
  1. *Budget Discipline (40 pts)*: Penalized if expenses approach or breach the monthly budget ceiling.
  2. *Savings Rate (30 pts)*: Scaled based on the percentage of monthly income retained.
  3. *Logging Activity & Consistency (15 pts)*: Rewards active, continuous tracking.
  4. *Discretionary Discipline (15 pts)*: Evaluates essential necessities vs impulse spending.
  - Generates letter grades: **A+**, **A**, **B+**, **B**, **C**.
- **Monthly Cashflow & Net Surplus**:
  Shows user's reported monthly income, period expense outflow, and net cash surplus.
- **Savings Rate Percentage**:
  Computes `((Monthly Income - Total Expenses) / Monthly Income) * 100`.
- **Long-Term Savings Target Tracker**:
  Visual progress bar showing current savings reserves vs target savings goal.
- **User Demographics & Lifetime Analytics**:
  - All-time lifetime expenditure and transaction count across MongoDB history.
  - Lifetime average expense per transaction.
  - User's **Dominant Category** and its percentage share.
  - User's **Most Frequented Merchant / Payee**.
  - Count of active distinct logging days.
  - Essential vs Discretionary spending breakdown.
- **Multi-User Profile Switching**:
  Quickly toggle between different user personas to observe how stats instantly recompute:
  - **Sarah Chen**: Lead AI Engineer ($9,500 income, $4,500 budget) — Balanced tech investor.
  - **Alex Rivera**: Creative Director ($5,200 income, $3,800 budget) — High-velocity urban lifestyle spender.
  - **Priya Sharma**: Graduate Fellow ($3,200 income, $1,800 budget) — Frugal optimizer with Grade A+ discipline.
- **Custom User Profile Management**: Create new profiles or edit income, budget ceiling, and savings targets anytime.

---

### 3. 💼 Complete Transactional Ledger & Features
- **Real-time Filter & Search**: Search by title, merchant, notes, or `#tags`.
- **Category & Payment Method Filtering**: Filter transactions instantly.
- **CSV Data Export**: One-click export of filtered expenses into RFC 4180 compliant CSV format for laboratory submissions or Excel analysis.
- **Live Modal Forms**: Add and edit expenses with live validation and quick-add preset tags (`#Essential`, `#Tax Deductible`, `#Recurring`, `#Work`, `#Impulse`).
- **Web Audio API Feedback**: Subtle auditory clicks, success chimes, and alert tones with a dedicated mute toggle.
- **Celebratory Particle Confetti**: Fires upon database re-seeding or logging expenses.
- **One-Click Demo Reset**: Reset MongoDB anytime using the "Reset Demo" button in the navigation bar.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express, TypeScript, Morgan logger, CORS, dotenv |
| **Database** | MongoDB (v6.0+), Mongoose ODM with Schema Validation and Compound Indexes |
| **Audio** | HTML5 Web Audio API (real-time synthesizer, zero external asset dependencies) |

---

## 🗄️ MongoDB Database Schema

### `User` Collection (`users`)
```typescript
{
  name: String,               // User's full name
  email: String,              // Unique email address
  avatar: String,             // Avatar image URL
  role: String,               // e.g. "Lead AI Engineer"
  occupation: String,         // Professional title
  monthlyIncome: Number,      // e.g. $9,500.00
  monthlyBudgetLimit: Number, // e.g. $4,500.00 (Governs burn tiers)
  savingsGoal: Number,        // Long term savings target
  savingsCurrent: Number,     // Current accrued savings
  currency: String,           // "USD"
  currencySymbol: String,     // "$"
  spendingPersona: String,    // "Pragmatic Tech Enthusiast"
  bio: String,                // Strategy bio
  createdAt: Date,
  updatedAt: Date
}
```

### `Expense` Collection (`expenses`)
```typescript
{
  userId: ObjectId,           // Ref: 'User' (Indexed)
  title: String,              // e.g. "Whole Foods Groceries"
  amount: Number,             // Positive float
  category: String,           // Enum: 13 supported categories
  paymentMethod: String,      // Enum: 'Credit Card', 'Debit Card', 'UPI', etc.
  date: Date,                 // Transaction timestamp (Indexed)
  merchant: String,           // Payee name (e.g. "Whole Foods")
  notes: String,              // Memo notes
  tags: [String],             // e.g. ['Essential', 'Fixed']
  isRecurring: Boolean,       // Recurring flag
  status: String,             // 'settled' | 'pending' | 'flagged'
  createdAt: Date,
  updatedAt: Date
}
// Compound Indexes: { userId: 1, date: -1 }, { userId: 1, category: 1 }
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher recommended)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI in `server/.env`)

### 1. Install Dependencies
From the project root directory:
```bash
npm run install:all
```
*(This installs root, backend, and frontend packages simultaneously).*

### 2. Seed Initial MongoDB Data
Load rich demo records (3 distinct users + 80+ realistic categorized transactions across 6 months):
```bash
npm run seed
```

### 3. Start Development Servers
Run both backend Express server and Vite frontend concurrently:
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5174`
- **Backend API**: `http://localhost:5050`
- **MongoDB Health & Stats**: `http://localhost:5050/api/stats/overview`

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stats/overview?userId=...&period=month` | **Core Endpoint**: Dynamic burn tier stats + user demographic statistics |
| `GET` | `/api/users` | List all user profiles with income and budget data |
| `GET` | `/api/users/:id` | Fetch specific user profile |
| `POST` | `/api/users` | Create a new user profile |
| `PUT` | `/api/users/:id` | Update user income, budget limit, or savings targets |
| `DELETE` | `/api/users/:id` | Delete user profile and cascade delete all associated expenses |
| `GET` | `/api/expenses` | Retrieve expense records with filtering, searching, and sorting |
| `POST` | `/api/expenses` | Record a new expense |
| `PUT` | `/api/expenses/:id` | Update an existing expense record |
| `DELETE` | `/api/expenses/:id` | Delete an expense record |
| `POST` | `/api/seed` | Reset MongoDB collections to default demo seed dataset |

---

## 🎓 Viva & Presentation Q&A Talking Points

1. **How do stats depend upon total expenses?**
   - The server dynamically calculates `budgetConsumedPercent = (totalExpenses / budgetLimit) * 100`. Based on this ratio, it assigns a dynamic **Burn Tier** (from *Frugal Haven* to *Critical Overdraft Deficit*), calculates daily spending velocity, projects month-end totals, and generates context-aware advisory recommendations.
2. **What user statistics are tracked?**
   - Beyond standard transaction summaries, the app computes a composite **Financial Health Score (0-100)** incorporating budget discipline, savings rate, consistency, and essential-to-discretionary spending ratio. It also tracks the user's lifetime burn, top merchant, dominant category, and savings goal milestones.
3. **How does MongoDB ensure high performance?**
   - Compound indexes (`{ userId: 1, date: -1 }` and `{ userId: 1, category: 1 }`) ensure sub-millisecond filtering and aggregation even across thousands of records.
4. **How are sound effects generated?**
   - Sound synthesis uses the native browser Web Audio API oscillator nodes, avoiding external audio asset loading delays and ensuring instant tactile feedback.

---

*Developed for College Laboratory Submissions and Modern Web Application Evaluations.*

