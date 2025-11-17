import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { format } from 'date-fns';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface TransactionFormData {
  amount: string;
  category: string;
  note: string;
  date: string;
}

const CATEGORIES = [
  'Income',
  'Salary',
  'Rent',
  'Transport',
  'Groceries',
  'Others',
];

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      amount: '',
      category: 'Groceries',
      note: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  const onSubmit = async (data: TransactionFormData) => {
    setError('');
    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/transactions`, {
        amount: parseFloat(data.amount),
        category: data.category,
        note: data.note || null,
        date: data.date,
      });

      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Transaction</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ mt: 1 }}>
          <Controller
            name="amount"
            control={control}
            rules={{
              required: 'Amount is required',
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: 'Invalid amount format (e.g., 25.50)',
              },
              validate: (value) =>
                parseFloat(value) > 0 || 'Amount must be greater than 0',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Amount (€)"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                autoFocus
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                select
                label="Category"
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Note (optional)"
                multiline
                rows={2}
              />
            )}
          />

          <Controller
            name="date"
            control={control}
            rules={{ required: 'Date is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionModal;
