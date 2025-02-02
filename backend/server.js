import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config({ path: "./env" });

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,  // Allow only frontend URL
  credentials: true                // Allow cookies and authentication headers
}));

app.use(express.json());
app.use(cookieParser());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Error Handling
app.use(errorHandler);

export default app;
