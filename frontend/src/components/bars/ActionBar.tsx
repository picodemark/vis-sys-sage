import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import UploadButton from 'components/buttons/UploadButton';
import ComponentsButton from 'components/buttons/ComponentsButton';
import NodeList from 'components/select/NodeList';

export default function ActionBar() {
  return (
    <AppBar position="sticky" color="secondary" elevation={1}>
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
