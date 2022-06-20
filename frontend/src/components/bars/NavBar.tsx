import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
            Vis-Sys-Sage
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
