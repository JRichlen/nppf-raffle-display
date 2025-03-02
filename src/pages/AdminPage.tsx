import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  styled,
} from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import WinnersSection from "../components/WinnersSection";
import MetricsSection from "../components/MetricsSection";
import SettingsSection from "../components/SettingsSection";

// Enum for navigation tabs
enum AdminView {
  WINNERS = "Winners",
  METRICS = "Metrics",
  SETTINGS = "Settings"
}

// Sidebar width
const drawerWidth = 240;

// Create styled component for the main content
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: drawerWidth,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const AdminPage: React.FC = () => {
  // State to track the active view
  const [activeView, setActiveView] = useState<AdminView>(AdminView.WINNERS);

  // Get the icon for each navigation item
  const getNavIcon = (view: AdminView) => {
    switch (view) {
      case AdminView.WINNERS:
        return <EmojiEventsIcon />;
      case AdminView.METRICS:
        return <BarChartIcon />;
      case AdminView.SETTINGS:
        return <SettingsIcon />;
    }
  };

  // Render the active content section
  const renderContent = () => {
    switch (activeView) {
      case AdminView.WINNERS:
        return <WinnersSection />;
      case AdminView.METRICS:
        return <MetricsSection />;
      case AdminView.SETTINGS:
        return <SettingsSection />;
      default:
        return <WinnersSection />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Persistent sidebar drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap component="div">
            Raffle Admin
          </Typography>
        </Box>
        <Divider />
        <List>
          {Object.values(AdminView).map((view) => (
            <ListItem key={view} disablePadding>
              <ListItemButton 
                selected={activeView === view}
                onClick={() => setActiveView(view)}
                data-cy={`nav-${view}`}
              >
                <ListItemIcon>
                  {getNavIcon(view)}
                </ListItemIcon>
                <ListItemText primary={view} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
        <Container>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Raffle Management
            </Typography>
            <Box sx={{ overflow: 'auto' }}>
              {renderContent()}
            </Box>
          </Box>
        </Container>
    </Box>
  );
};

export default AdminPage;
