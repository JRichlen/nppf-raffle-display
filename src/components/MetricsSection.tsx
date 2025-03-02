import React from "react";
import { Box, Typography } from "@mui/material";

const MetricsSection: React.FC = () => {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Raffle Metrics Dashboard
      </Typography>
      <Typography variant="body1">
        Metrics dashboard content will be displayed here.
      </Typography>
    </Box>
  );
};

export default MetricsSection;