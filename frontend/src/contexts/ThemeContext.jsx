import { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: darkMode ? '#90caf9' : '#1976d2',
        },
        secondary: {
          main: darkMode ? '#f48fb1' : '#9c27b0',
        },
        background: {
          default: darkMode ? '#121212' : '#f5f5f5',
          paper: darkMode ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: darkMode ? '#ffffff' : '#000000',
          secondary: darkMode ? '#b3b3b3' : '#4a4a4a',
        },
      },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? '#272727' : '#1976d2',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              transition: 'background-color 0.3s ease',
            },
          },
        },
      },
      typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
      },
    }), 
    [darkMode]
  );

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};