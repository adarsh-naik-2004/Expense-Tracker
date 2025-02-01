import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ExpenseForm from '../components/expenses/ExpenseForm';

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Edit Expense</Typography>
      <ExpenseForm expenseId={id} onSuccess={() => navigate('/dashboard')} />
    </Box>
  );
}