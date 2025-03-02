import React from "react";
import { Box, Typography } from "@mui/material";
import { MetricsCounters } from "./metrics/MetricsCounters";

const MetricsSection: React.FC = () => {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Raffle Metrics Dashboard
      </Typography>
      <MetricsCounters />
    </Box>
  );
};

export default MetricsSection;