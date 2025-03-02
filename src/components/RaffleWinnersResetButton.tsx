import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useRaffleWinners } from "../hooks/useRaffleWinners";

interface RaffleWinnersResetButtonProps {
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
}

const RaffleWinnersResetButton: React.FC<RaffleWinnersResetButtonProps> = ({
  variant = "contained",
  size = "medium",
}) => {
  const { clearWinners } = useRaffleWinners();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleResetOpen = () => {
    setResetDialogOpen(true);
  };

  const handleResetClose = () => {
    setResetDialogOpen(false);
  };

  const handleResetConfirm = () => {
    clearWinners();
    setResetDialogOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        color="error"
        size={size}
        startIcon={<DeleteIcon />}
        onClick={handleResetOpen}
      >
        Reset Raffle
      </Button>

      <Dialog
        open={resetDialogOpen}
        onClose={handleResetClose}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">
          {"Reset Raffle Data?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            This action will permanently delete all winners and their prizes.
            This action cannot be undone. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleResetConfirm} 
            color="error" 
            autoFocus
            data-testid="confirm-reset-button"
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RaffleWinnersResetButton;
