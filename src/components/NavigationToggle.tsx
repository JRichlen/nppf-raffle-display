import { useLocation, useNavigate } from 'react-router-dom';
import { Fab } from '@mui/material';
import { AdminPanelSettings as AdminPanelSettingsIcon, DisplaySettings as DisplaySettingsIcon } from '@mui/icons-material';

export const NavigationToggle = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const isAdminPage = location.pathname.includes('/admin');
    
    const toggleView = () => {
      if (isAdminPage) {
        navigate('/display');
      } else {
        navigate('/admin');
      }
    };
    
    return (
      <Fab 
        color={isAdminPage ? "secondary" : "primary"}
        aria-label="toggle view"
        onClick={toggleView}
        data-cy={isAdminPage ? "display-toggle" : "admin-toggle"}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        {isAdminPage ? <DisplaySettingsIcon /> : <AdminPanelSettingsIcon />}
      </Fab>
    );
  };