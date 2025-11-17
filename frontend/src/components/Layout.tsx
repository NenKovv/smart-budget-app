import React, { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <IconButton color="inherit" onClick={() => navigate('/dashboard')} title="Dashboard">
            <DashboardIcon />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate('/transactions')} title="Transactions">
            <ListIcon />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate('/budgets')} title="Budgets">
            <AccountBalanceWalletIcon />
          </IconButton>

          <IconButton color="inherit" onClick={handleLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
