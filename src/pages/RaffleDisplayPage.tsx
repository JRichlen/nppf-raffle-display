import React from 'react';
import { Typography, Box } from '@mui/material';
import RaffleWinnersGrid from '../components/RaffleWinnersGrid';
import RaffleWinnerInput from '../components/RaffleWinnerInput';

interface RaffleDisplayProps {
  title?: string;
}

const RaffleDisplayPage: React.FC<RaffleDisplayProps> = ({
  title = "Raffle Winners",
}) => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 4, 
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1">
          {title}
        </Typography>
      </Box>

      {/* Winners Grid */}
      <Box sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
        <RaffleWinnersGrid/>
      </Box>

      {/* Optional Footer */}
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: 'primary.dark',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <RaffleWinnerInput/>
      </Box>
    </Box>
  );
};

export default RaffleDisplayPage;
