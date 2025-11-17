import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

interface SpendingBreakdownChartProps {
  data: CategoryBreakdown[];
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const SpendingBreakdownChart: React.FC<SpendingBreakdownChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Spending Breakdown
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No expense data for this month
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
    percentage: item.percentage,
  }));

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Spending Breakdown
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Category List */}
        <Box sx={{ mt: 2 }}>
          {data.map((item, index) => (
            <Box
              key={item.category}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: COLORS[index % COLORS.length],
                    mr: 1,
                  }}
                />
                <Typography variant="body2">{item.category}</Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold">
                €{item.total.toFixed(2)} ({item.percentage.toFixed(1)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SpendingBreakdownChart;
