import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import LoadButton from '../buttons/LoadButton';
import NodeList from '../select/NodeList';

export default function ActionBar() {
  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box>
          <NodeList />
        </Box>
        <Box>
          <ButtonGroup size="small" variant="contained" aria-label="small secondary button group">
            <LoadButton></LoadButton>
            <Button disabled>Save</Button>
            <Button disabled>Export</Button>
          </ButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
