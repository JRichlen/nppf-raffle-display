import React from "react";
import { Box, Typography } from "@mui/material";
import RaffleWinnersTable from "./RaffleWinnersTable";

const WinnersSection: React.FC = () => {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Raffle Winners
      </Typography>
      <RaffleWinnersTable />
    </Box>
  );
};

export default WinnersSection;