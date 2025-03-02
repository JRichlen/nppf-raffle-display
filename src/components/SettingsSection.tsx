import React from "react";
import { Box, Typography } from "@mui/material";

const SettingsSection: React.FC = () => {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Raffle Settings
      </Typography>
      <Typography variant="body1">
        Settings configuration options will be displayed here.
      </Typography>
    </Box>
  );
};

export default SettingsSection;