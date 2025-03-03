import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
import RaffleWinner from './RaffleWinner';
import { getWinnersWithUnclaimedPrizes } from '../utilities/raffle';
import { useRaffleWinners } from '../hooks/useRaffleWinners';
import { ClaimSource } from '../types/claim';
import { useThemeContext } from '../contexts/ThemeContext';

interface WinnersGridProps {
  children?: never;
}

const RaffleWinnersGrid: React.FC<WinnersGridProps> = () => {
  const {winners, recordClaim} = useRaffleWinners();
  const { selectedTheme } = useThemeContext();
  const winnersWithUnclaimedPrizes = getWinnersWithUnclaimedPrizes(winners);

  // Calculate the grid sizing based on number of winners
  const getGridSize = useCallback(() => {
    const count = winners.length;
    if (count <= 3) return 12; // 1 per row for 1-3 winners
    if (count <= 6) return 6;  // 2 per row for 4-6 winners
    return 4; // 3 per row for 7+ winners (never allow 4 per row)
  }, [winners.length]);

  const gridSize = getGridSize();

  return (
    <Grid container spacing={3} sx={{ backgroundColor: selectedTheme.color + '11' }}>
      {winnersWithUnclaimedPrizes.map((winner) => (
        <Grid item xs={12} sm={6} md={gridSize} key={winner.id}>
          <RaffleWinner 
            winner={winner} 
            onClick={() => recordClaim(winner.id, ClaimSource.DISPLAY)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default RaffleWinnersGrid;
