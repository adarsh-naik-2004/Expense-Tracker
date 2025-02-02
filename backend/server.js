import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './api/routes/authRoutes.js';
import expenseRoutes from './api/routes/expenseRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
    
dotenv.config({
  path: "./env"
});

const app = express();

app.use(cors());

const PORT = process.env.PORT;

console.log(process.env.CLIENT_URL);


app.use(express.json());
app.use(cookieParser());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);