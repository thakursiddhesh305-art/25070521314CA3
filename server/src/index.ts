import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';
import expenseRoutes from './routes/expenseRoutes';
import statsRoutes from './routes/statsRoutes';
import { seedDatabase } from './seed/seedData';
import User from './models/User';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SpendPulse Expense Intelligence Engine',
    version: '1.0.0',
  });
});

// Seed endpoint for manual or UI triggered resets
app.all('/api/seed', async (_req: Request, res: Response) => {
  try {
    const result = await seedDatabase();
    res.json({
      success: true,
      message: 'SpendPulse demo dataset successfully loaded into MongoDB!',
      details: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Database seeding failed', error: error.message });
  }
});

// Root welcome
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 40px auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #0f172a; color: #f8fafc; line-height: 1.6;">
      <h1 style="color: #38bdf8; margin-top: 0;">⚡ SpendPulse API Server</h1>
      <p>Expense Intelligence & User Demographics Engine is running on port <strong>${PORT}</strong>.</p>
      <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #a5b4fc;">Key Endpoints:</p>
        <ul style="margin: 0; padding-left: 20px; color: #94a3b8;">
          <li><code style="color: #34d399;">GET /api/stats/overview?period=month</code> — Stats depending on total expenses & user demographics</li>
          <li><code style="color: #34d399;">GET /api/expenses</code> — Full expense records with category & range filtering</li>
          <li><code style="color: #34d399;">GET /api/users</code> — User profile listings & accounts</li>
          <li><code style="color: #34d399;">POST /api/seed</code> — Reset database to demo dataset</li>
        </ul>
      </div>
      <p style="color: #64748b; font-size: 13px;">Built with MongoDB, Express, TypeScript.</p>
    </div>
  `);
});

// Server Initialization
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is completely empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Empty database detected. Auto-seeding rich initial demo dataset...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 SpendPulse Server actively listening on http://localhost:${PORT}`);
      console.log(`📊 Statistics Endpoint: http://localhost:${PORT}/api/stats/overview`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
