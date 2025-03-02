import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper,
  Stack
} from '@mui/material';
import { useRaffleWinners } from '../hooks/useRaffleWinners';

const RaffleWinnerInput: React.FC = () => {
  const [winnerName, setWinnerName] = useState('');
  const {recordWinner} = useRaffleWinners();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (winnerName.trim()) {
      recordWinner(winnerName);
      setWinnerName('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label=""
            hiddenLabel
            value={winnerName}
            onChange={(e) => setWinnerName(e.target.value)}
            variant="outlined"
            size="medium"
            placeholder="Enter winner's name"
            autoFocus
            sx={{ flexGrow: 1 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            disabled={!winnerName.trim()}
            sx={{ height: 56, minWidth: 'auto', px: 2, flexShrink: 0 }}
          >
            Enter
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default RaffleWinnerInput;
