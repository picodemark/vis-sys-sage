import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GitHubButton from '../buttons/GitHubButton';

export default function NavBar() {
  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography component="div" variant="h5" fontWeight="bold" flexGrow={1}>
          Vis-Sys-Sage
        </Typography>
        <GitHubButton />
      </Toolbar>
    </AppBar>
  );
}
