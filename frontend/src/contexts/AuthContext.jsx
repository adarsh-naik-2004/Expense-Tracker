import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials, navigate) => { // Add navigate as a parameter
    try {
      const { data } = await api.post('/auth/login', credentials);
      setUser(data.user);
      navigate('/dashboard'); // Use the passed navigate function
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (navigate) => { // Add navigate as a parameter
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/login'); // Use the passed navigate function
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);