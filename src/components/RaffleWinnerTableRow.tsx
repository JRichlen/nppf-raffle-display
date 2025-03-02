import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Button,
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Winner } from "../types/winner";
import { getUnclaimedPrizes } from "../utilities/raffle";
import { ClaimSource } from "../types/claim";
import { useRaffleWinners } from "../hooks/useRaffleWinners";

interface RaffleWinnerTableRowProps {
  winner: Winner;
}

const RaffleWinnerTableRow: React.FC<RaffleWinnerTableRowProps> = ({ winner }) => {
  const [open, setOpen] = useState(false);
  const { recordClaim, recordSingleClaim } = useRaffleWinners();

  const hasUnclaimedPrizes =
    winner.prizes.length >
    (winner.claims.reduce((acc, claim) => acc + claim.prizeIds.length, 0) || 0);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{winner.id}</TableCell>
        <TableCell>{winner.name || "Not recorded"}</TableCell>
        <TableCell>{winner.prizes.length || 0}</TableCell>
        <TableCell>
          <Chip
            label={hasUnclaimedPrizes ? "Unclaimed" : "All Claimed"}
            color={hasUnclaimedPrizes ? "warning" : "success"}
            size="small"
          />
        </TableCell>
        <TableCell>
          {hasUnclaimedPrizes && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const unclaimedPrizes = getUnclaimedPrizes(winner);

                if (unclaimedPrizes.length > 0) {
                  recordClaim(winner.id, ClaimSource.ADMIN);
                }
              }}
            >
              Mark All Claimed
            </Button>
          )}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Prizes
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Prize ID</TableCell>
                    <TableCell>Date Won</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {winner.prizes.map((prize) => {
                    const isClaimed = winner.claims.some((claim) =>
                      claim.prizeIds.includes(prize.id)
                    );

                    return (
                      <TableRow key={prize.id}>
                        <TableCell>{prize.id}</TableCell>
                        <TableCell>
                          {prize.timestamp.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={isClaimed ? "Claimed" : "Unclaimed"}
                            color={isClaimed ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {!isClaimed && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                recordSingleClaim(
                                  winner.id,
                                  prize.id,
                                  ClaimSource.ADMIN
                                )
                              }
                            >
                              Mark Claimed
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {winner.claims.length > 0 && (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    sx={{ mt: 2 }}
                  >
                    Claims
                  </Typography>
                  <List>
                    {winner.claims.map((claim) => (
                      <React.Fragment key={claim.id}>
                        <ListItem>
                          <ListItemText
                            primary={`Claim #${claim.id}`}
                            secondary={`${claim.timestamp.toLocaleString()} - Prizes: ${claim.prizeIds.join(
                              ", "
                            )}`}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RaffleWinnerTableRow;
