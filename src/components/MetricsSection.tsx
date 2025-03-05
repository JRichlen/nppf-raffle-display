import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { MetricsCounters } from "./metrics/MetricsCounters";
import { TimeSeriesChart } from "./metrics/TimeSeriesChart";
import { TimeToClaimChart } from "./metrics/TimeToClaimChart";
import { ClaimsBySourceChart } from "./metrics/ClaimsBySourceChart";

const MetricsSection: React.FC = () => {
  return (
    <Box sx={{ my: 4 }} data-cy="metrics-section">
      <Typography variant="h5" component="h2" gutterBottom data-cy="metrics-header">
        Raffle Metrics Dashboard
      </Typography>
      
      {/* Metrics counters */}
      <MetricsCounters />
      
      {/* Charts section */}
      <Box sx={{ mt: 4 }} data-cy="charts-container">
        {/* Time series chart */}
        <Box sx={{ mb: 4 }} data-cy="chart-container">
          <TimeSeriesChart />
        </Box>
        
        {/* Additional charts in a grid layout */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TimeToClaimChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <ClaimsBySourceChart />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MetricsSection;