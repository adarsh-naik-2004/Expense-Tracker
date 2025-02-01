import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-expense" element={<AddExpense />} />
      <Route path="/edit-expense/:id" element={<EditExpense />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}