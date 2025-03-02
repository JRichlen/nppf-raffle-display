import React from "react";
import {
  Box,
  Typography,
  Container,
} from "@mui/material";
import RaffleWinnersTable from "../components/RaffleWinnersTable";

const AdminPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Raffle Management
        </Typography>

        <RaffleWinnersTable />
      </Box>
    </Container>
  );
};

export default AdminPage;
