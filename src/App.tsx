import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RaffleDisplay from "./components/RaffleDisplay";
import AdminPage from "./pages/AdminPage";
import { RaffleContextProvider } from "./providers/RaffleContextProvider";
import { StorageProvider } from "./providers/StorageContextProvider";
import { WinnersList } from "./classes/winnersList";
import { theme } from "./theme";
import { NavigationToggle } from "./components/NavigationToggle";

function App() {
  const winnersList = new WinnersList();

  return (
    <StorageProvider>
      <RaffleContextProvider winnersList={winnersList}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter basename="/nppf-raffle-display">
            <Box sx={{ position: 'relative' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/display" />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route
                  path="/display"
                  element={<RaffleDisplay title="General Raffle Winners" />}
                />
              </Routes>
              <NavigationToggle />
            </Box>
          </BrowserRouter>
        </ThemeProvider>
      </RaffleContextProvider>
    </StorageProvider>
  );
}

export default App;
