import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  Container
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import InsightsChart from '../components/charts/InsightsChart';
import ExpenseTable from '../components/expenses/ExpenseTable';
import api from '../services/api';

export default function Dashboard() {
  const [expenses, setExpenses] = useState({ data: [], total: 0 });
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [refreshKey, setRefreshKey] = useState(0);

  const location = useLocation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page + 1,
        limit: pagination.pageSize
      };

      const [expensesRes, insightsRes] = await Promise.all([
        api.get('/expenses', { params }),
        api.get('/expenses/insights')
      ]);
      
      const validatedExpenses = Array.isArray(expensesRes.data?.expenses)
        ? expensesRes.data.expenses
        : [];

      const validatedInsights = Array.isArray(insightsRes.data)
        ? insightsRes.data
        : [];

      setExpenses({
        data: expensesRes.data.expenses || [],
        total: expensesRes.data.total || 0
      });
      
      setInsights(insightsRes.data || []);
      setRefreshKey(prev => prev + 1);

    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Refresh when navigation state indicates update
    if (location.state?.refresh) {
      fetchData();
    }
  }, [location.state]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.pageSize]);

// console.log("data for graph",expenses)
  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        my: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
          Expense Dashboard
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/add-expense"
          size="large"
        >
          Add Expense
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={80} />
        </Box>
      ) : (
        <>
          <Box sx={{ 
            mb: 6,
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 3
          }}>
            <InsightsChart data={expenses.data} refreshKey={refreshKey} />
          </Box>

          <Box sx={{ 
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 3
          }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Recent Transactions
            </Typography>
            <ExpenseTable
              expenses={expenses.data}
              total={expenses.total}
              pagination={pagination}
              setPagination={setPagination}
              refreshData={fetchData}
            />
          </Box>
        </>
      )}
    </Container>
  );
}
