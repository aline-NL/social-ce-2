import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Badge, Avatar } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar (to be implemented) */}
      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        {/* Sidebar content will go here */}
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Sistema de Atendimento Social
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <Button
                variant="outlined"
                color="inherit"
                onClick={logout}
              >
                Sair
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ mt: 3 }}>
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
};
