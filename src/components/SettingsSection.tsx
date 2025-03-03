import React from "react";
import { Box, Typography, Divider, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { UploadFile as UploadIcon } from "@mui/icons-material";
import RaffleWinnersResetButton from "./RaffleWinnersResetButton";
import { useThemeContext } from "../contexts/ThemeContext";

const SettingsSection: React.FC = () => {
  const { selectedTheme, setSelectedTheme, themeOptions } = useThemeContext();

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
          data-testid="load-data-button"
        >
          Load Data
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsSection;