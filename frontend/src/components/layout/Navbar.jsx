import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  Typography, 
  Box  // Add this import
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

import { useThemeContext } from '../../contexts/ThemeContext'; 

export default function Navbar() {
  const { user, logout } = useAuth();

  const { darkMode } = useThemeContext(); 

  return (
    <AppBar 
      position="static" 
      sx={{ 
        transition: 'background-color 0.3s ease',
        mb: 4,
        bgcolor: darkMode ? '#121212' : '#1976d2', // Conditional background color based on darkMode
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: darkMode ? 'white' : 'inherit', // Adjust text color based on darkMode
              textDecoration: 'none',
              flexGrow: { xs: 1, sm: 0 }
            }}
          >
            Expense Tracker
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, ml: 3 }}>
            {user && (
              <Button
                component={Link}
                to="/dashboard"
                sx={{ my: 2, color: darkMode ? 'white' : 'inherit', display: 'block' }} // Adjust text color
              >
                Dashboard
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            {user ? (
              <Button 
                color="inherit" 
                onClick={logout}
                sx={{ fontWeight: 600 }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  sx={{ fontWeight: 600 }}
                >
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/register"
                  sx={{ fontWeight: 600 }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}