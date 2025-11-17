import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
    },
    success: {
      main: '#4caf50', // Green for income/positive
    },
    error: {
      main: '#f44336', // Red for expenses/alerts
    },
    warning: {
      main: '#ff9800', // Orange for budget warnings
    },
    info: {
      main: '#2196f3', // Blue for neutral info
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16, // Minimum for mobile (no zoom)
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '44px', // Touch target
          minWidth: '44px',
          textTransform: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: '44px',
          minWidth: '44px',
        },
      },
    },
  },
});
