import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import { useRaffleWinners } from "../hooks/useRaffleWinners";
import RaffleWinnerTableRow from "./RaffleWinnerTableRow";
import RaffleWinnersResetButton from "./RaffleWinnersResetButton";

const RaffleWinnersTable: React.FC = () => {
  const { winners } = useRaffleWinners();

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <RaffleWinnersResetButton />
      </Box>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Winners List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Winner ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Prizes Count</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {winners && winners.length > 0 ? (
              winners.map((winner) => (
                <RaffleWinnerTableRow key={winner.id} winner={winner} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No winners recorded yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RaffleWinnersTable;
