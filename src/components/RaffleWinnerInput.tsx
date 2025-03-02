import React, { useState, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper,
  Stack,
  Autocomplete,
  Typography
} from '@mui/material';
import { useRaffleWinners } from '../hooks/useRaffleWinners';

const RaffleWinnerInput: React.FC = () => {
  const [winnerName, setWinnerName] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [hasSingleMatch, setHasSingleMatch] = useState(false);
  const { recordWinner, winners } = useRaffleWinners();
  const hint = useRef('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (winnerName.trim()) {
      recordWinner(winnerName);
      setWinnerName('');
      hint.current = '';
      setHasSingleMatch(false);
    }
  };

  const updateMatchesAndHint = (input: string) => {
    if (input.trim()) {
      const matchingWinners = winners.matchPartialName(input);
      
      if (matchingWinners.length === 1) {
        // Single match case
        setOptions([]); // Hide dropdown for single match
        setHasSingleMatch(true);
        
        // Set hint if the single match isn't exactly the input
        if (matchingWinners[0].name.toLowerCase() !== input.toLowerCase()) {
          hint.current = matchingWinners[0].name;
        } else {
          hint.current = '';
        }
      } else if (matchingWinners.length > 1) {
        // Multiple matches case
        setOptions(matchingWinners.map(winner => winner.name));
        setHasSingleMatch(false);
        
        // Check for shared first name prefix
        const firstNames = matchingWinners.map(winner => winner.name.split(' ')[0]);
        const uniqueFirstNames = [...new Set(firstNames)];
        
        // If all share the same first name and it's not the exact input, show first name hint
        if (uniqueFirstNames.length === 1 && 
            uniqueFirstNames[0].toLowerCase() !== input.toLowerCase() &&
            uniqueFirstNames[0].toLowerCase().startsWith(input.toLowerCase())) {
          hint.current = uniqueFirstNames[0];
        } else {
          hint.current = '';
        }
      } else {
        setOptions([]);
        setHasSingleMatch(false);
        hint.current = '';
      }
    } else {
      setOptions([]);
      setHasSingleMatch(false);
      hint.current = '';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <Autocomplete
            fullWidth
            freeSolo
            value={winnerName}
            onChange={(_event, newValue) => {
              setWinnerName(newValue || '');
            }}
            inputValue={winnerName}
            onInputChange={(_event, newInputValue) => {
              setWinnerName(newInputValue);
              updateMatchesAndHint(newInputValue);
            }}
            options={options}
            open={options.length > 0 && !hasSingleMatch}
            onKeyDown={(event) => {
              if (event.key === 'Tab') {
                if (hint.current) {
                  setWinnerName(hint.current);
                  event.preventDefault();
                }
              }
            }}
            onClose={() => {
              hint.current = '';
            }}
            renderInput={(params) => (
              <Box sx={{ position: 'relative' }}>
                <Typography
                  sx={{
                    position: 'absolute',
                    opacity: 0.5,
                    left: 14, // Adjust this value
                    top: 15, // Adjust this slightly
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    width: 'calc(100% - 75px)',
                    pointerEvents: 'none',
                    fontFamily: 'inherit', // Match input font
                    fontSize: 'inherit', // Match input font size
                    textAlign: 'left', // Ensure left alignment
                    paddingLeft: '0px',
                  }}
                >
                  {hint.current}
                </Typography>
                <TextField
                  {...params}
                  label=""
                  hiddenLabel
                  variant="outlined"
                  size="medium"
                  placeholder="Enter winner's name"
                  autoFocus
                  onChange={(event) => {
                    const newValue = event.target.value;
                    params.inputProps.onChange?.(event as React.ChangeEvent<HTMLInputElement>);
                    updateMatchesAndHint(newValue);
                  }}
                />
              </Box>
            )}
            sx={{ flexGrow: 1 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            disabled={!winnerName.trim()}
            sx={{ height: 56, minWidth: 'auto', px: 2, flexShrink: 0 }}
          >
            Enter
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default RaffleWinnerInput;
