import * as React from 'react';
import Button from '@mui/material/Button';
import { selectComponentsList } from '../../store/graphDataSlice';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ComponentsTable from '../tables/ComponentsTable';
import GridViewIcon from '@mui/icons-material/GridView';

export default function ComponentsButton() {
  const selector = useSelector((state) => selectComponentsList(state));

  const [open, setOpen] = React.useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={openDialog} variant="outlined" startIcon={<GridViewIcon />}>
        Components
      </Button>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-describedby="alert-dialog-slide-description"
        maxWidth="xl">
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          All Components
        </DialogTitle>
        <DialogContent id="alert-dialog-slide-description" sx={{ padding: 0 }}>
          <ComponentsTable rowData={selector} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
