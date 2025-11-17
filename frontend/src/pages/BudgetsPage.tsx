import React from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../components/Layout';

const BudgetsPage: React.FC = () => {
  // TODO: Fetch budget data from API

  return (
    <Layout title="Budgets">
      <Box>
        <Typography variant="h4" gutterBottom>
          Budget Management
        </Typography>
        {/* TODO: Add budget limits configuration */}
        {/* TODO: Add budget alerts */}
      </Box>
    </Layout>
  );
};

export default BudgetsPage;
