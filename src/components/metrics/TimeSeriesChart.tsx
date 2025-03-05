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

  // Calculate tick values with safety limits
  const startTime = Math.min(...xAxisData);
  const endTime = Math.max(...xAxisData);
  
  // Calculate appropriate tick interval based on time range
  const timeRangeMinutes = (endTime - startTime) / (1000 * 60); // time range in minutes
  
  // Adjust interval based on time range to avoid too many ticks
  let tickIntervalMinutes = 30; // default is 30 minutes
  if (timeRangeMinutes > 720) { // more than 12 hours
    tickIntervalMinutes = 120; // 2 hours
  } else if (timeRangeMinutes > 360) { // more than 6 hours
    tickIntervalMinutes = 60; // 1 hour
  }
  
  // Generate limited number of tick values (max 20)
  const tickValues: number[] = [];
  let currentTime = new Date(startTime);
  let tickCount = 0;
  const MAX_TICKS = 20;
  
  while (currentTime.getTime() <= endTime && tickCount < MAX_TICKS) {
    tickValues.push(currentTime.getTime());
    currentTime = addMinutes(currentTime, tickIntervalMinutes);
    tickCount++;
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
              tickMinStep: tickIntervalMinutes * 60 * 1000, // Convert minutes to milliseconds
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