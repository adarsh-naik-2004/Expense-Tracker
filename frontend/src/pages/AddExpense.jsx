import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ExpenseForm from '../components/expenses/ExpenseForm';

export default function AddExpense() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard', {
      state: { refresh: true },
      replace: true
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Add New Expense</Typography>
      <ExpenseForm 
        onSuccess={() => {
          // Force refresh dashboard data
          navigate('/dashboard', { state: { shouldRefresh: true } });
        }}
      />
    </Box>
  );  
}