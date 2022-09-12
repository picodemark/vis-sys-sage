import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { CustomNodeElementProps, TreeNodeDatum } from 'react-d3-tree/lib/types/common';
import AttributesTable from './AttributesTable';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import ComponentAvatar from '../ComponentAvatar';
import Badge from '@mui/material/Badge';

import Button from '@mui/material/Button';

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

interface SpecificTreeNodeDatum extends TreeNodeDatum {
  id?: string;
  unique_component_id?: string;
}

interface SpecificCustomNodeElementProps extends Omit<CustomNodeElementProps, 'nodeDatum'> {
  nodeDatum: SpecificTreeNodeDatum;
}

export default function TreeComponentContent({
  nodeDatum,
  toggleNode
}: SpecificCustomNodeElementProps) {
  const [open, setOpen] = React.useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <foreignObject x={-100} y={0} width={180} height={250}>
        <Card sx={{ height: 120, backgroundColor: '#dad7cd' }} elevation={0}>
          <CardHeader
            avatar={<ComponentAvatar id={nodeDatum.unique_component_id}></ComponentAvatar>}
            title={nodeDatum.name === '' ? 'no name' : nodeDatum.name}
            subheader={nodeDatum?.id === undefined ? 'no id' : 'id: ' + nodeDatum.id}
          />
          <CardActions disableSpacing>
            {nodeDatum.attributes && (
              <Badge badgeContent={Object.keys(nodeDatum.attributes).length} color="primary">
                <Button onClick={openDialog} variant="outlined" size="small">
                  Info
                </Button>
              </Badge>
            )}
            {nodeDatum.children && (
              <Button
                onClick={toggleNode}
                variant="outlined"
                size="small"
                sx={{ marginLeft: 'auto' }}>
                {nodeDatum.__rd3t.collapsed ? 'Open' : 'Close'}
              </Button>
            )}
          </CardActions>
        </Card>
        <Dialog
          open={open}
          onClose={closeDialog}
          PaperComponent={PaperComponent}
          aria-describedby="alert-dialog-slide-description">
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            {'Attributes of ' + nodeDatum.name}
          </DialogTitle>
          <DialogContent id="alert-dialog-slide-description" sx={{ padding: 0 }}>
            <AttributesTable rowData={nodeDatum.attributes} />
          </DialogContent>
        </Dialog>
      </foreignObject>
    </React.Fragment>
  );
}
