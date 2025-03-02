import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RaffleDisplay from "./components/RaffleDisplay";
import AdminPage from "./pages/AdminPage";
import { RaffleContextProvider } from "./providers/RaffleContextProvider";
import { StorageProvider } from "./providers/StorageContextProvider";
import { WinnersList } from "./classes/winnersList";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#FF6700", // Blaze orange / hunter safety orange
    },
    secondary: {
      main: "#336633", // Complementary forest green color
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

function App() {
  const winnersList = new WinnersList();

  return (
    <StorageProvider>
      <RaffleContextProvider winnersList={winnersList}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter basename="/nppf-raffle-display">
            <Routes>
              <Route path="/" element={<Navigate to="/display" />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route
                path="/display"
                element={<RaffleDisplay title="General Raffle Winners" />}
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </RaffleContextProvider>
    </StorageProvider>
  );
}

export default App;
