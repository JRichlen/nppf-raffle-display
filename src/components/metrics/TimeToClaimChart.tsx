import { useContext } from 'react';
import { BarChart } from '@mui/x-charts';
import { Card, CardContent, Typography } from '@mui/material';
import { RaffleContext } from '../../contexts/RaffleContext';

export const TimeToClaimChart = () => {
  const context = useContext(RaffleContext);
  
  /* istanbul ignore if */
  if (!context) {
    return null;
  }

  const { winners } = context;
  
  // Collect all claim times
  const claimTimes: number[] = [];
  
  winners.forEach(winner => {
    winner.claims.forEach(claim => {
      claim.prizeIds.forEach(prizeId => {
        const prize = winner.prizes.find(p => p.id === prizeId);
        if (prize) {
          const prizeTime = new Date(prize.timestamp).getTime();
          const claimTime = new Date(claim.timestamp).getTime();
          const timeDiffMinutes = (claimTime - prizeTime) / (1000 * 60);
          claimTimes.push(timeDiffMinutes);
        }
      });
    });
  });

  if (claimTimes.length === 0) {
    return (
      <Card data-cy="time-to-claim-chart">
        <CardContent>
          <Typography>No claim data available</Typography>
        </CardContent>
      </Card>
    );
  }

  // Create time buckets for histogram
  // Buckets: 0-5min, 5-15min, 15-30min, 30-60min, 1-2h, 2-4h, 4+h
  const buckets = [
    { label: '0-5min', min: 0, max: 5, count: 0 },
    { label: '5-15min', min: 5, max: 15, count: 0 },
    { label: '15-30min', min: 15, max: 30, count: 0 },
    { label: '30-60min', min: 30, max: 60, count: 0 },
    { label: '1-2h', min: 60, max: 120, count: 0 },
    { label: '2-4h', min: 120, max: 240, count: 0 },
    { label: '4h+', min: 240, max: Infinity, count: 0 },
  ];

  // Count claims in each bucket
  claimTimes.forEach(time => {
    for (const bucket of buckets) {
      if (time >= bucket.min && time < bucket.max) {
        bucket.count++;
        break;
      }
    }
  });

  const xLabels = buckets.map(b => b.label);
  const data = buckets.map(b => b.count);

  return (
    <Card sx={{ mb: 4 }} data-cy="time-to-claim-chart">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Time to Claim Distribution
        </Typography>
        <BarChart
          height={300}
          series={[{ data, color: '#ff9800' }]}
          xAxis={[{ data: xLabels, scaleType: 'band' }]}
          slotProps={{
            legend: { hidden: true }
          }}
        />
      </CardContent>
    </Card>
  );
};