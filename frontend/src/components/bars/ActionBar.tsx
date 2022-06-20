import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ButtonGroup, Grid, Input } from '@mui/material';
import Button from '@mui/material/Button';
import UploadButton from '../buttons/UploadButton';

export default function ActionBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color={'secondary'}>
        <Toolbar variant="dense">
          <Grid justifyContent="flex-end" container spacing={24}>
            <Grid item justifyContent="flex-end">
              <ButtonGroup
                size="small"
                variant="contained"
                aria-label="small secondary button group">
                <UploadButton></UploadButton>
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
