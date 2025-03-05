import { useContext } from 'react';
import { PieChart } from '@mui/x-charts';
import { Card, CardContent, Typography } from '@mui/material';
import { RaffleContext } from '../../contexts/RaffleContext';
import { getClaimsBySource } from '../../utilities/raffle';
import { ClaimSource } from '../../types/claim';

export const ClaimsBySourceChart = () => {
  const context = useContext(RaffleContext);
  
  /* istanbul ignore if */
  if (!context) {
    return null;
  }

  const { winners } = context;
  const claimsBySource = getClaimsBySource(winners);
  
  const totalClaims = Object.values(claimsBySource).reduce((sum, count) => sum + count, 0);
  
  if (totalClaims === 0) {
    return (
      <Card data-cy="claims-by-source-chart">
        <CardContent>
          <Typography>No claim data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const data = [
    { id: 0, value: claimsBySource[ClaimSource.DISPLAY], label: 'Display', color: '#2196f3' },
    { id: 1, value: claimsBySource[ClaimSource.ADMIN], label: 'Admin', color: '#f44336' },
  ];

  return (
    <Card sx={{ mb: 4 }} data-cy="claims-by-source-chart">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Claims by Source
        </Typography>
        <PieChart
          series={[
            {
              data,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={300}
        />
      </CardContent>
    </Card>
  );
};