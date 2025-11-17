import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Layout from '../components/Layout';

const DashboardPage: React.FC = () => {
  // TODO: Fetch dashboard data from API

  return (
    <Layout title="Dashboard">
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome to SmartBudget
        </Typography>

        <Grid container spacing={3}>
          {/* Monthly Summary Card */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="h6">Monthly Summary</Typography>
              <Typography variant="body2" color="text.secondary">
                Income | Expenses
              </Typography>
              {/* TODO: Add summary data */}
            </Box>
          </Grid>

          {/* Spending Breakdown Card */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="h6">Spending Breakdown</Typography>
              {/* TODO: Add pie chart */}
            </Box>
          </Grid>

          {/* Recent Transactions Card */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="h6">Recent Transactions</Typography>
              {/* TODO: Add transaction list */}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default DashboardPage;
