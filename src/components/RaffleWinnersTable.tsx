import React, { useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TableSortLabel,
} from "@mui/material";
import { useRaffleWinners } from "../hooks/useRaffleWinners";
import RaffleWinnerTableRow from "./RaffleWinnerTableRow";
import RaffleWinnersResetButton from "./RaffleWinnersResetButton";
import RaffleWinnersTableSearch, {
  StatusFilter,
} from "./RaffleWinnersTableSearch";
import { getUnclaimedPrizes } from "../utilities/raffle";

type SortField = "id" | "name" | "prizeCount" | "status";
type SortOrder = "asc" | "desc";

const RaffleWinnersTable: React.FC = () => {
  const { winners } = useRaffleWinners();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedWinners = useMemo(() => {
    if (!winners) return [];

    // First filter the data
    const filtered = winners.filter((winner) => {
      // Filter by search term
      const nameMatch = winner.name
        ? winner.name.toLowerCase().includes(searchTerm.toLowerCase())
        : searchTerm === "";

      // Filter by status
      const hasUnclaimedPrizes = getUnclaimedPrizes(winner).length > 0;
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "unclaimed" && hasUnclaimedPrizes) ||
        (statusFilter === "claimed" && !hasUnclaimedPrizes);

      return nameMatch && statusMatch;
    });

    // Then sort the data
    return filtered.sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;

      switch (sortBy) {
        case "id":
          return multiplier * a.id.localeCompare(b.id);
        case "name": {
          const nameA = a.name || "";
          const nameB = b.name || "";
          return multiplier * nameA.localeCompare(nameB);
        }
        case "prizeCount":
          return multiplier * (a.prizes.length - b.prizes.length);
        case "status": {
          const aUnclaimed = getUnclaimedPrizes(a).length > 0;
          const bUnclaimed = getUnclaimedPrizes(b).length > 0;
          return (
            multiplier * (aUnclaimed === bUnclaimed ? 0 : aUnclaimed ? -1 : 1)
          );
        }
        default:
          return 0;
      }
    });
  }, [winners, searchTerm, statusFilter, sortBy, sortOrder]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <RaffleWinnersResetButton />
      </Box>

      <RaffleWinnersTableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <TableSortLabel
                  active={sortBy === "id"}
                  direction={sortBy === "id" ? sortOrder : "asc"}
                  onClick={() => handleSort("id")}
                >
                  Winner ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sortOrder : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "prizeCount"}
                  direction={sortBy === "prizeCount" ? sortOrder : "asc"}
                  onClick={() => handleSort("prizeCount")}
                >
                  Prizes Count
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "status"}
                  direction={sortBy === "status" ? sortOrder : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedWinners.length > 0 ? (
              filteredAndSortedWinners.map((winner) => (
                <RaffleWinnerTableRow key={winner.id} winner={winner} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {winners && winners.length > 0
                    ? "No matching winners found"
                    : "No winners recorded yet"}
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
