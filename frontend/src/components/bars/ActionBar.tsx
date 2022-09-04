import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import UploadButton from '../buttons/UploadButton';
import NodeList from '../select/NodeList';

export default function ActionBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color={'secondary'}>
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
          <Box>
            <NodeList />
          </Box>
          <Box>
            <ButtonGroup size="small" variant="contained" aria-label="small secondary button group">
              <UploadButton></UploadButton>
              <Button>Save</Button>
              <Button>Export</Button>
            </ButtonGroup>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
