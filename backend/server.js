import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
    
dotenv.config();

app.use(cors({
  origin: [process.env.CLIENT_URL, "http://localhost:5173"], // Allow frontend URLs
  credentials: true, // Allow cookies
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));


app.options("*", cors());

const app = express();
const PORT = process.env.PORT || 5000;

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