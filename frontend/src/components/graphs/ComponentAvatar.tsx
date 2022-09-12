import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import { selectComponentsDict } from '../../store/graphDataSlice';
import { useState } from 'react';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AttributesTable from './component-tree/AttributesTable';

interface Props {
  id: string;
}

export default function ComponentAvatar(props: Props) {
  const { id } = props;

  const [label, setLabel] = useState('');
  const [color, setColor] = useState('');
  const [initial, setInitial] = useState(true);

  const [open, setOpen] = React.useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const selector = useSelector((state) => selectComponentsDict(state));
  const info = selector[id];

  if (initial && info?.name !== undefined) {
    switch (info.name) {
      case 'topology':
        setLabel('TL');
        setColor('red');
        break;
      case 'sys-sage node':
        setLabel(`NO`);
        setColor('purple');
        break;
      case 'Chip':
        setLabel('CP');
        setColor('blue');
        break;
      case 'cache':
        setLabel(`L${info?.attributes?.cache_level}`);
        setColor('brown');
        break;
      case 'Numa':
        setLabel('NA');
        setColor('green');
        break;
      case 'Core':
        setLabel('CR');
        setColor('orange');
        break;
      case 'Thread':
        setLabel('TH');
        setColor('pink');
        break;
      default:
        setLabel('UN');
        setColor('darkgrey');
    }
    setInitial(false);
  }

  return (
    <React.Fragment>
      <Avatar onClick={openDialog} sx={{ backgroundColor: color }} aria-label="component-avatar">
        {label}
      </Avatar>
      <Dialog open={open} onClose={closeDialog} aria-describedby="alert-dialog-slide-description">
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {'Attributes of ' + info?.name}
        </DialogTitle>
        <DialogContent id="alert-dialog-slide-description" sx={{ padding: 0 }}>
          {info?.attributes !== undefined && <AttributesTable rowData={info?.attributes} />}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
