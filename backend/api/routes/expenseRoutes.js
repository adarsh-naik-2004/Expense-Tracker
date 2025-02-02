import express from 'express';
import { 
  createExpense, 
  getExpenses, 
  getInsights, 
  deleteExpense 
} from '../controllers/expenseController.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

router.post("/add-expense", createExpense);

// router.route('/')
//   .get(getExpenses);

router.get("/",getExpenses)

// router.route('/insights')
//   .get(getInsights);

router.get('/insights',getInsights)

router.route('/:id')
  .delete(deleteExpense);

export default router;