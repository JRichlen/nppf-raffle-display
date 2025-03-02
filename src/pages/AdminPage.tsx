import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  ViewQuilt as DisplayIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useRaffleWinners } from "../hooks/useRaffleWinners";
import { Winner } from "../types/winner";
import { getUnclaimedPrizes } from "../utilities/raffle";
import { ClaimSource } from "../types/claim";

// Row component for expandable content
const WinnerRow: React.FC<{ winner: Winner }> = ({ winner }) => {
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
                              onClick={() => recordSingleClaim(winner.id, prize.id, ClaimSource.ADMIN)}
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

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { winners } = useRaffleWinners();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Raffle Management
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DisplayIcon />}
            onClick={() => navigate("/display")}
          >
            Go to Display View
          </Button>
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
                  <WinnerRow key={winner.id} winner={winner} />
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
      </Box>
    </Container>
  );
};

export default AdminPage;
