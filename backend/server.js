import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const allowedOrigins = [
  "https://expense-tracker-nhjd.vercel.app", // Main frontend URL
  "https://expense-tracker-nhjd-dfzfcxg62-adarsh-naik-2004s-projects.vercel.app" // Vercel preview deployment
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
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
