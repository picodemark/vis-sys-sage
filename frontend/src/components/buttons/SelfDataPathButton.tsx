import React from 'react';
import Dialog from '@mui/material/Dialog';
import DraggablePaperComponent from 'components/DraggablePaperComponent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import DataPathText from 'components/graphs/data-paths/DataPathText';
import DataPathTable from 'components/tables/DataPathTable';
import { DataPathLinkAttributeInfo } from 'types/data-path';
import { Attributes } from 'types/common';

interface Props {
  sourceInfo: Record<string, string | Attributes>;
  linkInfo: DataPathLinkAttributeInfo;
}

export default function SelfDataPathButton(props: Props) {
  const { sourceInfo, linkInfo } = props;

  const [open, setOpen] = React.useState<boolean>(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        onClick={openDialog}>
        <div
          style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#0065bd',
            paddingBottom: '0.5rem'
          }}>
          SELF
        </div>
      </div>
      <Dialog
        open={open}
        onClose={closeDialog}
        PaperComponent={DraggablePaperComponent}
        hideBackdrop={true}
        maxWidth="xl">
        <DialogTitle style={{ cursor: 'move' }}>Data-Paths for Single Component</DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <Box display="flex" flexDirection="column" width="100%" minHeight="500">
            <Box>
              <DataPathText sourceInfo={sourceInfo as Record<string, string>} orientation="self" />
            </Box>
            <Box width={1000}>
              <DataPathTable linkInfo={linkInfo} />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
