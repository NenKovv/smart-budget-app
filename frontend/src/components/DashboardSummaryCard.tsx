import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface DashboardSummaryCardProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

const DashboardSummaryCard: React.FC<DashboardSummaryCardProps> = ({
  totalIncome,
  totalExpenses,
  netBalance,
}) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Monthly Summary
        </Typography>

        <Grid container spacing={2}>
          {/* Income */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Income
              </Typography>
            </Box>
            <Typography variant="h5" color="success.main" fontWeight="bold">
              €{Number(totalIncome).toFixed(2)}
            </Typography>
          </Grid>

          {/* Expenses */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingDownIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Expenses
              </Typography>
            </Box>
            <Typography variant="h5" color="error.main" fontWeight="bold">
              €{Number(totalExpenses).toFixed(2)}
            </Typography>
          </Grid>

          {/* Net Balance */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Net Balance
              </Typography>
            </Box>
            <Typography
              variant="h5"
              color={netBalance >= 0 ? 'success.main' : 'error.main'}
              fontWeight="bold"
            >
              €{Number(netBalance).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DashboardSummaryCard;
