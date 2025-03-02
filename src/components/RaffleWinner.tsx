import React from "react";
import { Card, CardContent, Typography, Box, CardActionArea } from "@mui/material";
import { Redeem as PresentIcon } from "@mui/icons-material";
import { Winner } from "../types/winner";
import { getUnclaimedPrizes } from "../utilities/raffle";
import { Prize } from "../types/prize";

interface RaffleWinnerProps {
  winner: Winner;
  onClick: (winnerId: string) => void;
}

const RaffleWinnerPrizeIcon: React.FC = () => {
  return <PresentIcon fontSize="large" color="primary" sx={{ ml: 1 }} />;
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
  // Generate present icons based on the number of unclaimed prizes
  const unclaimedPrizes = getUnclaimedPrizes(winner);

  return (
    <Card
      sx={{
        minWidth: 550, // Doubled from ~275
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: 5, // Slightly increased shadow for larger card
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
            py: 4, // Increased padding on top and bottom
            px: 3, // Increased padding on sides
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
              variant="h2" // Increased from h4 to h2
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
