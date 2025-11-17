import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';

export interface Transaction {
  id: number;
  amount: number;
  category: string;
  note: string | null;
  date: string;
  created_at: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const getCategoryColor = (category: string): 'success' | 'error' | 'default' => {
    if (['Income', 'Salary'].includes(category)) {
      return 'success';
    }
    return 'error';
  };

  const formatAmount = (amount: number, category: string): string => {
    const prefix = ['Income', 'Salary'].includes(category) ? '+' : '-';
    return `${prefix}€${Number(amount).toFixed(2)}`;
  };

  if (transactions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No transactions found. Add your first transaction!
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {transactions.map((transaction) => (
        <ListItem
          key={transaction.id}
          secondaryAction={
            <Box>
              {onEdit && (
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEdit(transaction)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(transaction.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          }
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            mb: 1,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={transaction.category}
                  color={getCategoryColor(transaction.category)}
                  size="small"
                />
                <Typography variant="body1" fontWeight="bold">
                  {formatAmount(transaction.amount, transaction.category)}
                </Typography>
              </Box>
            }
            secondary={
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </Typography>
                {transaction.note && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {transaction.note}
                  </Typography>
                )}
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TransactionList;
