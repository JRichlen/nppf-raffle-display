import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActionArea,
} from "@mui/material";
import { Redeem as PresentIcon } from "@mui/icons-material";
import { Winner } from "../types/winner";
import { getUnclaimedPrizes } from "../utilities/raffle";
import { useThemeContext } from "../contexts/ThemeContext";
import { Prize } from "../types/prize";

// Calculate whether to use black or white text based on background color
const getTextColor = (bgColor: string) => {
  // Convert hex to RGB
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Use white text for dark backgrounds, black text for light backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

interface RaffleWinnerProps {
  winner: Winner;
  onClick: (winnerId: string) => void;
}

const RaffleWinnerPrizeIcon: React.FC = () => {
  return <PresentIcon fontSize="large" color="inherit" sx={{ ml: 1 }} />;
};

const RaffleWinnerPrizesIcons: React.FC<{ unclaimedPrizes: Array<Prize> }> = ({
  unclaimedPrizes,
}) => (
  <>
    {unclaimedPrizes.map((prize) => (
      <RaffleWinnerPrizeIcon key={prize.id} />
    ))}
  </>
);

const RaffleWinner: React.FC<RaffleWinnerProps> = ({ winner, onClick }) => {
  const { selectedTheme } = useThemeContext();
  const unclaimedPrizes = getUnclaimedPrizes(winner);
  const textColor = getTextColor(selectedTheme.color);
  const isWhiteTheme = selectedTheme.value === 'default';

  return (
    <Card
      sx={{
        minWidth: 550,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: 5,
        bgcolor: selectedTheme.color,
        color: textColor,
        border: isWhiteTheme ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
        '& .MuiCardActionArea-root:hover': {
          bgcolor: isWhiteTheme ? 'rgba(0, 0, 0, 0.04)' : `${selectedTheme.color}ee`
        }
      }}
    >
      <CardActionArea
        onClick={() => onClick(winner.id)}
        sx={{
          height: "100%",
          "&:hover": {
            backgroundColor: "action.selectedHover",
          },
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
            px: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "nowrap",
            }}
          >
            <Typography
              variant="h2"
              component="div"
              sx={{
                fontWeight: "bold",
                flexGrow: 1,
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: unclaimedPrizes.length > 0 ? "90%" : "100%",
              }}
            >
              {winner.name}
            </Typography>

            {unclaimedPrizes.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <RaffleWinnerPrizesIcons unclaimedPrizes={unclaimedPrizes} />
              </Box>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RaffleWinner;
