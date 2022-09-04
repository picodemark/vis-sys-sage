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
import DialogContentText from '@mui/material/DialogContentText';
import { CustomNodeElementProps } from 'react-d3-tree/lib/types/common';

export default function TreeNodeContent({ nodeDatum, toggleNode }: CustomNodeElementProps) {
  const [open, setOpen] = React.useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <foreignObject x={-100} y={0} width={200} height={400}>
        <Card sx={{ height: 150, backgroundColor: '#dad7cd' }} color="inherit">
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="component-header">
                C
              </Avatar>
            }
            title={nodeDatum.name === '' ? 'no name' : nodeDatum.name}
            subheader={
              nodeDatum?.attributes?.id === undefined ? 'no id' : 'id: ' + nodeDatum.attributes.id
            }
          />
          <CardContent></CardContent>
          <CardActions>
            {nodeDatum.attributes && (
              <Button size="small" onClick={openDialog}>
                Attributes
              </Button>
            )}
            {nodeDatum.children && (
              <Button size="small" onClick={toggleNode}>
                Children
              </Button>
            )}
          </CardActions>
        </Card>
      </foreignObject>
      <Dialog open={open} keepMounted aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
