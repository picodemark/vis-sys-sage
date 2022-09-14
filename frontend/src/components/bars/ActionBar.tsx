import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import UploadButton from '../buttons/UploadButton';
import NodeList from '../select/NodeList';
import ComponentsButton from '../buttons/ComponentsButton';

export default function ActionBar() {
  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <NodeList />
          <ComponentsButton />
        </Box>
        <Box>
          <UploadButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
