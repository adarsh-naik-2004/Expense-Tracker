import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="First Name"
          fullWidth
          margin="normal"
          required
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          required
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Create Account
        </Button>
        
        <Typography sx={{ mt: 2 }}>
          Already have an account? <Link href="/login">Login here</Link>
        </Typography>
      </Box>
    </Box>
  );
}