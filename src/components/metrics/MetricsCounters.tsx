import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { RaffleContext } from '../../contexts/RaffleContext';
import { 
  getTotalPrizes, 
  getTotalClaims, 
  getTotalUnclaimed, 
  getUniqueWinnersCount,
  getAverageTimeToClaim,
  getMedianTimeToClaim,
  getClaimRate,
  getFastestClaimTime,
  getSlowestClaimTime,
  getClaimsBySource
} from '../../utilities/raffle';
import { ClaimSource } from '../../types/claim';

interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
}

const MetricCard = ({ title, value, subtitle }: MetricCardProps) => (
  <Card sx={{ height: '100%' }} data-cy={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
    <CardContent>
      <Typography color="textSecondary" gutterBottom variant="h6" component="div" data-cy="metric-title">
        {title}
      </Typography>
      <Typography variant="h3" component="div" data-cy="metric-value">
        {value}
      </Typography>
      {subtitle && (
        <Typography color="textSecondary" variant="body2" data-cy="metric-subtitle">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

// Helper function to format time in minutes to a human-readable string
const formatMinutes = (minutes: number | null): string => {
  if (minutes === null) return 'N/A';
  
  if (minutes < 1) {
    return `${Math.round(minutes * 60)} seconds`;
  } else if (minutes < 60) {
    return `${Math.round(minutes)} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  }
};

export const MetricsCounters = () => {
  const context = useContext(RaffleContext);
  
  /* istanbul ignore if */
  if (!context) {
    return null;
  }

  const { winners } = context;

  // Basic metrics
  const basicMetrics = [
    { title: 'Total Prizes', value: getTotalPrizes(winners) },
    { title: 'Total Claims', value: getTotalClaims(winners) },
    { title: 'Unclaimed Prizes', value: getTotalUnclaimed(winners) },
    { title: 'Unique Winners', value: getUniqueWinnersCount(winners) },
  ];

  // Time to claim metrics
  const avgTimeToClaim = getAverageTimeToClaim(winners);
  const medianTimeToClaim = getMedianTimeToClaim(winners);
  const fastestClaim = getFastestClaimTime(winners);
  const slowestClaim = getSlowestClaimTime(winners);
  
  // Claim rate metrics
  const claimRate = getClaimRate(winners);
  const claimsBySource = getClaimsBySource(winners);

  // Advanced metrics
  const advancedMetrics = [
    { 
      title: 'Avg Time to Claim', 
      value: formatMinutes(avgTimeToClaim)
    },
    { 
      title: 'Median Time to Claim', 
      value: formatMinutes(medianTimeToClaim)
    },
    { 
      title: 'Claim Rate', 
      value: `${Math.round(claimRate)}%`
    },
    { 
      title: 'Claims by Source', 
      value: `${claimsBySource[ClaimSource.DISPLAY]} / ${claimsBySource[ClaimSource.ADMIN]}`,
      subtitle: 'Display / Admin'
    },
    {
      title: 'Fastest Claim',
      value: formatMinutes(fastestClaim)
    },
    {
      title: 'Slowest Claim',
      value: formatMinutes(slowestClaim)
    }
  ];

  // Combine all metrics
  const allMetrics = [...basicMetrics, ...advancedMetrics];

  return (
    <Box sx={{ mb: 4 }} data-cy="metrics-counters">
      <Grid container spacing={3}>
        {allMetrics.map((metric) => (
          <Grid key={metric.title} item xs={12} sm={6} md={4} lg={3}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};