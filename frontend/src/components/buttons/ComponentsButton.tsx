import * as React from 'react';
import Button from '@mui/material/Button';
import { selectComponentList } from 'store/graphDataSlice';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ComponentTable from 'components/tables/ComponentTable';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { useAppSelector } from 'hooks/hooks';
import DraggablePaperComponent from 'components/DraggablePaperComponent';
import Box from '@mui/material/Box';

export default function ComponentsButton() {
  const componentListSelector = useAppSelector((state) => selectComponentList(state));

  const [open, setOpen] = React.useState<boolean>(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        onClick={openDialog}
        variant="outlined"
        startIcon={<GridViewOutlinedIcon />}
        sx={{ paddingRight: '1rem' }}>
        Components
      </Button>
      <Dialog
        open={open}
        onClose={closeDialog}
        PaperComponent={DraggablePaperComponent}
        hideBackdrop={true}
        maxWidth="xl">
        <DialogTitle style={{ cursor: 'move' }}>All Components</DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <Box width={1000} maxHeight={600}>
            <ComponentTable data={componentListSelector} />
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
