import { useContext } from 'react';
import { LineChart } from '@mui/x-charts';
import { Card, CardContent, Typography } from '@mui/material';
import { RaffleContext } from '../../contexts/RaffleContext';
import { getCumulativeTimeSeriesData } from '../../utilities/raffle';
import { format, addMinutes } from 'date-fns';

export const TimeSeriesChart = () => {
  const context = useContext(RaffleContext);
  
  /* istanbul ignore if */
  if (!context) {
    return null;
  }

  const timeSeriesData = getCumulativeTimeSeriesData(context.winners);

  if (timeSeriesData.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography>No raffle data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const xAxisData = timeSeriesData.map(point => point.timestamp.getTime());
  const prizesSeries = timeSeriesData.map(point => point.prizes);
  const claimsSeries = timeSeriesData.map(point => point.claims);

  // Calculate tick values for every 30 minutes
  const startTime = Math.min(...xAxisData);
  const endTime = Math.max(...xAxisData);
  const tickValues: number[] = [];
  let currentTime = new Date(startTime);
  
  while (currentTime.getTime() <= endTime) {
    tickValues.push(currentTime.getTime());
    currentTime = addMinutes(currentTime, 30);
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Prizes and Claims Over Time
        </Typography>
        <LineChart
          height={400}
          series={[
            {
              data: prizesSeries,
              label: 'Total Prizes',
              color: '#2196f3',
              curve: "linear",
              showMark: false,
              valueFormatter: (value) => `Total Prizes: ${value}`,
            },
            {
              data: claimsSeries,
              label: 'Total Claims',
              color: '#4caf50',
              curve: "linear",
              showMark: false,
              valueFormatter: (value) => `Total Claims: ${value}`,
            },
          ]}
          xAxis={[
            {
              data: xAxisData,
              scaleType: 'time',
              tickMinStep: 30 * 60 * 1000, // 30 minutes in milliseconds
              valueFormatter: (value) => format(value, 'HH:mm'),
            },
          ]}
          sx={{
            '.MuiLineElement-root': {
              strokeWidth: 2,
            },
          }}
          slotProps={{
            legend: {
              hidden: false,
              position: {
                vertical: 'top',
                horizontal: 'right',
              },
            },
          }}
          tooltip={{
            trigger: 'axis',
          }}
        />
      </CardContent>
    </Card>
  );
};