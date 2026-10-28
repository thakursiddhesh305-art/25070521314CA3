import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spendpulse_expense_db';

  mongoose.connection.on('connected', () => {
    console.log(`📊 [MongoDB Event] Connected successfully to: ${mongoose.connection.host}/${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ [MongoDB Event] Connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [MongoDB Event] Connection disconnected.');
  });

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🚀 [MongoDB] Database initialized on ${conn.connection.host}:${conn.connection.port || 27017}/${conn.connection.name}`);
  } catch (error: any) {
    console.error('❌ [MongoDB] Initial connection error:', error.message);
    console.warn('👉 Verify MONGODB_URI in server/.env (e.g. mongodb://127.0.0.1:27017/spendpulse_expense_db)');
  }
};
