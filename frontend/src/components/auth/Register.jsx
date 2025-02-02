import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useThemeContext } from '../../contexts/ThemeContext';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const { darkMode } = useThemeContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box 
      sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3 }} 
      className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        className={`${darkMode ? 'text-white' : 'text-gray-800'}`}
      >
        Register
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ mt: 3 }}
        className="space-y-4"
      >
        <TextField
          label="First Name"
          fullWidth
          margin="normal"
          required
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          InputLabelProps={{
            className: `${darkMode ? 'text-gray-300' : 'text-gray-700'}`
          }}
          inputProps={{
            className: `${darkMode ? 'text-gray-100' : 'text-gray-800'}`
          }}
          className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        />
        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          required
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          InputLabelProps={{
            className: `${darkMode ? 'text-gray-300' : 'text-gray-700'}`
          }}
          inputProps={{
            className: `${darkMode ? 'text-gray-100' : 'text-gray-800'}`
          }}
          className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          InputLabelProps={{
            className: `${darkMode ? 'text-gray-300' : 'text-gray-700'}`
          }}
          inputProps={{
            className: `${darkMode ? 'text-gray-100' : 'text-gray-800'}`
          }}
          className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          InputLabelProps={{
            className: `${darkMode ? 'text-gray-300' : 'text-gray-700'}`
          }}
          inputProps={{
            className: `${darkMode ? 'text-gray-100' : 'text-gray-800'}`
          }}
          className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        />
        
        {error && <Typography color="error" sx={{ mt: 1 }} className="text-red-500">{error}</Typography>}
        
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          sx={{ mt: 3 }}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Create Account
        </Button>
        
        <Typography sx={{ mt: 2 }} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Already have an account? <Link href="/login" className="text-blue-500">Login here</Link>
        </Typography>
      </Box>
    </Box>
  );
}