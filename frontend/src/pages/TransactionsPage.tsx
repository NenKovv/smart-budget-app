import React from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../components/Layout';

const TransactionsPage: React.FC = () => {
  // TODO: Fetch transactions from API

  return (
    <Layout title="Transactions">
      <Box>
        <Typography variant="h4" gutterBottom>
          All Transactions
        </Typography>
        {/* TODO: Add transaction list with filters */}
        {/* TODO: Add "Add Transaction" button */}
      </Box>
    </Layout>
  );
};

export default TransactionsPage;
