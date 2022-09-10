import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { CustomNodeElementProps } from 'react-d3-tree/lib/types/common';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import AttributesTable from './AttributesTable';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Typography from '@mui/material/Typography';

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function TreeNodeContent({ nodeDatum, toggleNode }: CustomNodeElementProps) {
  const [open, setOpen] = React.useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const treeNodeContentSize = {
    x: -100,
    y: 0,
    width: 200,
    height: 400
  };

  return (
    <React.Fragment>
      <foreignObject x={-100} y={0} width={200} height={400}>
        <Card sx={{ height: 160, backgroundColor: '#dad7cd' }} color="inherit">
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="component-header">
                T
              </Avatar>
            }
            title={nodeDatum.name === '' ? 'no name' : nodeDatum.name}
            subheader={
              nodeDatum?.attributes?.id === undefined ? 'no id' : 'id: ' + nodeDatum.attributes.id
            }
          />
          <CardContent sx={{ padding: '0.5rem' }}>
            <Typography sx={{ fontSize: '14px' }}>
              #attributes:{' '}
              {nodeDatum?.attributes === undefined ? 0 : Object.keys(nodeDatum.attributes).length}
            </Typography>
          </CardContent>
          <CardActions>
            {nodeDatum.attributes && (
              <Button size="small" onClick={openDialog}>
                Attributes
              </Button>
            )}
            {nodeDatum.children && (
              <Button size="small" onClick={toggleNode}>
                {nodeDatum.__rd3t.collapsed ? 'Open' : 'Close'}
              </Button>
            )}
          </CardActions>
        </Card>
      </foreignObject>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={closeDialog}>
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
      </ClickAwayListener>
    </React.Fragment>
  );
}
