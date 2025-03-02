import React from 'react';
import { Grid } from '@mui/material';
import RaffleWinner from './RaffleWinner';
import { getWinnersWithUnclaimedPrizes } from '../utilities/raffle';
import { useRaffleWinners } from '../hooks/useRaffleWinners';
import { ClaimSource } from '../types/claim';

interface WinnersGridProps {
  children?: never;
}

const RaffleWinnersGrid: React.FC<WinnersGridProps> = () => {
  const {winners, recordClaim} = useRaffleWinners();
  const winnersWithUnclaimedPrizes = getWinnersWithUnclaimedPrizes(winners);

  // Calculate the grid sizing based on number of winners
  const getGridSize = () => {
    const count = winners.length;
    if (count <= 3) return 12; // 1 per row for 1-3 winners
    if (count <= 6) return 6;  // 2 per row for 4-6 winners
    if (count <= 12) return 4; // 3 per row for 7-12 winners
    return 3; // 4 per row for 13+ winners
  };

  const gridSize = getGridSize();

  return (
    <Grid container spacing={3}>
      {winnersWithUnclaimedPrizes.map((winner) => (
        <Grid item xs={12} sm={6} md={gridSize} key={winner.id}>
          <RaffleWinner winner={winner} onClick={() => {
            recordClaim(winner.id, ClaimSource.DISPLAY);
          }}/>
        </Grid>
      ))}
    </Grid>
  );
};

export default RaffleWinnersGrid;
