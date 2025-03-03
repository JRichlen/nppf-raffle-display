import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { RaffleContext } from '../../contexts/RaffleContext';
import { getTotalPrizes, getTotalClaims, getTotalUnclaimed, getUniqueWinnersCount } from '../../utilities/raffle';

interface MetricCardProps {
  title: string;
  value: number;
}

const MetricCard = ({ title, value }: MetricCardProps) => (
  <Card sx={{ height: '100%' }} data-cy={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
    <CardContent>
      <Typography color="textSecondary" gutterBottom variant="h6" component="div" data-cy="metric-title">
        {title}
      </Typography>
      <Typography variant="h3" component="div" data-cy="metric-value">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export const MetricsCounters = () => {
  const context = useContext(RaffleContext);
  
  /* istanbul ignore if */
  if (!context) {
    return null;
  }

  const { winners } = context;

  const metrics = [
    { title: 'Total Prizes', value: getTotalPrizes(winners) },
    { title: 'Total Claims', value: getTotalClaims(winners) },
    { title: 'Unclaimed Prizes', value: getTotalUnclaimed(winners) },
    { title: 'Unique Winners', value: getUniqueWinnersCount(winners) },
  ];

  return (
    <Box sx={{ mb: 4 }} data-cy="metrics-counters">
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid key={metric.title} item xs={12} sm={6} md={3}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};