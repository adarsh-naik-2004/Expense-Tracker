import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useThemeContext();

  return (
    <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
      <IconButton onClick={toggleTheme} color="inherit">
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;