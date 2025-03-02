import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

export type StatusFilter = "all" | "claimed" | "unclaimed";

interface RaffleWinnersTableSearchProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
}

const RaffleWinnersTableSearch: React.FC<RaffleWinnersTableSearchProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const handleStatusChange = (event: SelectChangeEvent) => {
    onStatusFilterChange(event.target.value as StatusFilter);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      <TextField
        label="Search by name"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flexGrow: 1 }}
      />
      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          value={statusFilter}
          label="Status"
          onChange={handleStatusChange}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="claimed">All Claimed</MenuItem>
          <MenuItem value="unclaimed">Has Unclaimed</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default RaffleWinnersTableSearch;
