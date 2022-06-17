import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ButtonGroup, Grid } from '@mui/material';
import Button from '@mui/material/Button';

export default function ActionBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color={'secondary'}>
        <Toolbar variant="dense">
          <Grid justifyContent="flex-end" container spacing={24}>
            <Grid item justifyContent="flex-end">
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button>Upload</Button>
                <Button>Save</Button>
                <Button>Export</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
