import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useThemeContext } from '../../contexts/ThemeContext';
import { 
  Box,
  TextField, 
  Button, 
  Typography, 
  Link,
  CircularProgress,
  Alert
} from '@mui/material';


export default function Login() {
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { darkMode } = useThemeContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('accessToken', data.accessToken);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box 
    sx={{ 
      maxWidth: 400, 
      mx: 'auto', 
      mt: 8, 
      p: 3, 
      boxShadow: 3, 
      borderRadius: 2, 
      backgroundColor: darkMode ? '#1e1e1e' : '#ffffff' 
    }}
  >
    <Typography 
      variant="h4" 
      gutterBottom 
      sx={{ textAlign: 'center', mb: 3, color: darkMode ? 'white' : 'inherit' }} 
    >
      Sign In
    </Typography>

    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}

    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label="Email Address"
        type="email"
        required
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        disabled={loading}
        sx={{ input: { color: darkMode ? 'white' : 'inherit' }, label: { color: darkMode ? 'white' : 'inherit' } }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        required
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        disabled={loading}
        sx={{ input: { color: darkMode ? 'white' : 'inherit' }, label: { color: darkMode ? 'white' : 'inherit' } }}
      />

      <Button
        fullWidth
        variant="contained"
        type="submit"
        sx={{ mt: 3, py: 1.5 }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Sign In'
        )}
      </Button>

      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: darkMode ? 'white' : 'inherit' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ textDecoration: 'none', color: darkMode ? 'white' : '#1976d2' }}>
          Create one
        </Link>
      </Typography>
    </Box>
  </Box>
  );
}