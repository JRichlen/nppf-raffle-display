import React from "react";
import { Box, Typography } from "@mui/material";
import { MetricsCounters } from "./metrics/MetricsCounters";
import { TimeSeriesChart } from "./metrics/TimeSeriesChart";

const MetricsSection: React.FC = () => {
  return (
    <Box sx={{ my: 4 }} data-cy="metrics-section">
      <Typography variant="h5" component="h2" gutterBottom data-cy="metrics-header">
        Raffle Metrics Dashboard
      </Typography>
      <MetricsCounters />
      <Box sx={{ mt: 4 }} data-cy="chart-container">
        <TimeSeriesChart />
      </Box>
    </Box>
  );
};

export default MetricsSection;