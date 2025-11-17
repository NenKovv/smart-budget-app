import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, CircularProgress, Alert, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Layout from '../components/Layout';
import DashboardSummaryCard from '../components/DashboardSummaryCard';
import SpendingBreakdownChart from '../components/SpendingBreakdownChart';
import TransactionList, { Transaction } from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';

interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

interface DashboardData {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    categoryBreakdown: CategoryBreakdown[];
  };
  recentTransactions: Transaction[];
  month: number;
  year: number;
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get<DashboardData>(
        `${process.env.REACT_APP_API_URL}/dashboard`
      );
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddSuccess = () => {
    fetchDashboardData(); // Refresh dashboard after adding transaction
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/transactions/${id}`);
      fetchDashboardData(); // Refresh after delete
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard">
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchDashboardData} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Dashboard">
        <Alert severity="info">No data available</Alert>
      </Layout>
    );
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <Layout title="Dashboard">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {monthNames[data.month - 1]} {data.year}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Monthly Summary Card */}
          <Grid item xs={12}>
            <DashboardSummaryCard
              totalIncome={data.summary.totalIncome}
              totalExpenses={data.summary.totalExpenses}
              netBalance={data.summary.netBalance}
            />
          </Grid>

          {/* Spending Breakdown Chart */}
          <Grid item xs={12} md={6}>
            <SpendingBreakdownChart data={data.summary.categoryBreakdown} />
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: 2,
                height: '100%',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <TransactionList
                transactions={data.recentTransactions}
                onDelete={handleDelete}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setModalOpen(true)}
        >
          <AddIcon />
        </Fab>

        {/* Add Transaction Modal */}
        <AddTransactionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleAddSuccess}
        />
      </Box>
    </Layout>
  );
};

export default DashboardPage;
