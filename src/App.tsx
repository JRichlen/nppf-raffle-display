import { CssBaseline, ThemeProvider as MuiThemeProvider, Box } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RaffleDisplayPage from "./pages/RaffleDisplayPage";
import AdminPage from "./pages/AdminPage";
import { RaffleContextProvider } from "./providers/RaffleContextProvider";
import { StorageContextProvider } from "./providers/StorageContextProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { WinnersList } from "./classes/winnersList";
import { theme } from "./theme";
import { NavigationToggle } from "./components/NavigationToggle";

function App() {
  const winnersList = new WinnersList();

  return (
    <StorageContextProvider>
      <RaffleContextProvider winnersList={winnersList}>
        <ThemeProvider>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter basename="/nppf-raffle-display">
              <Box sx={{ position: 'relative' }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/display" />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route
                    path="/display"
                    element={<RaffleDisplayPage title="General Raffle Winners" />}
                  />
                </Routes>
                <NavigationToggle />
              </Box>
            </BrowserRouter>
          </MuiThemeProvider>
        </ThemeProvider>
      </RaffleContextProvider>
    </StorageContextProvider>
  );
}

export default App;
