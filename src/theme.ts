import { createTheme } from "@mui/material";

export const theme = createTheme({
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