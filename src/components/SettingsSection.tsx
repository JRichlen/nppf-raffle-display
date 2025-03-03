import React, { useState, useRef } from "react";
import { 
  Box, 
  Typography, 
  Divider, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Alert
} from "@mui/material";
import { 
  UploadFile as UploadIcon, 
  Download as DownloadIcon, 
  CloudUpload as CloudUploadIcon, 
  FormatListNumbered as FormatListNumberedIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import RaffleWinnersResetButton from "./RaffleWinnersResetButton";
import { useThemeContext } from "../contexts/ThemeContext";
import { useRaffleWinners } from "../hooks/useRaffleWinners";
import sampleData from "../data/sampleData.json";
import { WinnersList } from "../classes/winnersList";

const SettingsSection: React.FC = () => {
  const { selectedTheme, setSelectedTheme, themeOptions } = useThemeContext();
  const { winners, setWinners } = useRaffleWinners();
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'file' | 'sample';
    data?: any;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadData = () => {
    // Create a blob with the winners data
    const data = JSON.stringify(winners, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `raffle-winners-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenLoadDialog = () => {
    setLoadDialogOpen(true);
  };

  const handleCloseLoadDialog = () => {
    setLoadDialogOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (hasExistingWinners()) {
            setPendingAction({ type: 'file', data });
            setConfirmDialogOpen(true);
            setLoadDialogOpen(false);
          } else {
            setWinners(new WinnersList(data));
            handleCloseLoadDialog();
          }
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          alert("Invalid JSON file. Please select a valid winners data file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSampleData = () => {
    if (hasExistingWinners()) {
      setPendingAction({ type: 'sample' });
      setConfirmDialogOpen(true);
      setLoadDialogOpen(false);
    } else {
      setWinners(new WinnersList(sampleData));
      handleCloseLoadDialog();
    }
  };

  const hasExistingWinners = (): boolean => {
    // Check if there are existing winners
    return winners.length > 0;
  };

  const handleConfirmLoad = () => {
    if (pendingAction) {
      if (pendingAction.type === 'file' && pendingAction.data) {
        setWinners(new WinnersList(pendingAction.data));
      } else if (pendingAction.type === 'sample') {
        setWinners(new WinnersList(sampleData));
      }
      setConfirmDialogOpen(false);
      setPendingAction(null);
    }
  };

  const handleCancelLoad = () => {
    setConfirmDialogOpen(false);
    setPendingAction(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Raffle Settings
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Preferences
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="card-color-label">Winner Card Color</InputLabel>
          <Select
            labelId="card-color-label"
            id="card-color-select"
            value={selectedTheme.value}
            label="Winner Card Color"
            onChange={(e) => {
              const theme = themeOptions.find(t => t.value === e.target.value);
              if (theme) setSelectedTheme(theme);
            }}
            data-testid="card-color-select"
          >
            {themeOptions.map((option) => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: 1,
                    backgroundColor: option.color
                  }}
                />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" component="h3" gutterBottom color="error">
        Advanced
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <RaffleWinnersResetButton variant="outlined" />
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={handleOpenLoadDialog}
          data-testid="load-data-button"
        >
          Load Data
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadData}
          data-testid="download-data-button"
        >
          Download Data
        </Button>
      </Box>

      {/* Hidden file input for file uploads */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileUpload}
      />

      {/* Load Data Dialog */}
      <Dialog
        open={loadDialogOpen}
        onClose={handleCloseLoadDialog}
        aria-labelledby="load-data-dialog-title"
        maxWidth="md"
      >
        <DialogTitle id="load-data-dialog-title" sx={{ m: 0, p: 2 }}>
          Load Raffle Data
          <IconButton
            aria-label="close"
            onClick={handleCloseLoadDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose one of the following options to load raffle winners data:
          </DialogContentText>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Card 
                variant="outlined" 
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardActionArea 
                  onClick={triggerFileInput}
                  sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    p: 3
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                      Upload JSON File
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Upload a JSON file containing raffle winners data
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card 
                variant="outlined" 
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardActionArea 
                  onClick={handleLoadSampleData}
                  sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    p: 3
                  }}
                >
                  <FormatListNumberedIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                      Load Sample Data
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Load pre-generated sample data for demonstration
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLoadDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Reset Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelLoad}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Reset Current Data?
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will replace all current raffle data!
          </Alert>
          <DialogContentText>
            You currently have {winners.length} winners with existing data. 
            Loading new data will replace all current raffle winners and claims.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLoad} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmLoad} 
            color="error" 
            variant="contained"
            data-testid="confirm-reset-button"
          >
            Reset and Load Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsSection;