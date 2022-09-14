import React from 'react';
import { useSelector } from 'react-redux';
import { selectComponentsDict } from '../../store/graphDataSlice';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AttributesTable from '../tables/AttributesTable';

const AVATAR_SIZES = {
  small: {
    dim: '35px',
    fontSize: '20px'
  },
  medium: {
    dim: '70px',
    fontSize: '40px'
  },
  large: {
    dim: '140px',
    fontSize: '80px'
  }
};

interface Props {
  id: string;
  clickable: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ComponentAvatar(props: Props) {
  const { id, clickable, size } = props;

  const [avatarSize, setAvatarSize] = useState('medium');

  const [open, setOpen] = React.useState(false);

  const openDialog = () => {
    if (clickable) {
      setOpen(true);
    }
  };

  const closeDialog = () => {
    setOpen(false);
  };

  // get component info from store
  const selector = useSelector((state) => selectComponentsDict(state));
  const info = selector[id];

  const avatarConfig = {
    label: 'UN ',
    color: 'darkgrey'
  };
  if (info?.name !== undefined) {
    switch (info.name) {
      case 'topology':
        avatarConfig.label = 'TR';
        avatarConfig.color = 'red';
        break;
      case 'sys-sage node':
        avatarConfig.label = 'NO';
        avatarConfig.color = 'purple';
        break;
      case 'Chip':
        avatarConfig.label = 'CP';
        avatarConfig.color = 'blue';
        break;
      case 'cache':
        avatarConfig.label = `L${info?.attributes?.cache_level}`;
        avatarConfig.color = 'brown';
        break;
      case 'Numa':
        avatarConfig.label = 'NA';
        avatarConfig.color = 'green';
        break;
      case 'Core':
        avatarConfig.label = 'CR';
        avatarConfig.color = 'orange';
        break;
      case 'Thread':
        avatarConfig.label = 'TH';
        avatarConfig.color = 'pink';
        break;
    }
  }

  if (size !== undefined) {
    setAvatarSize(size);
  }

  return (
    <React.Fragment>
      <div
        onClick={openDialog}
        style={{
          width: AVATAR_SIZES[avatarSize].dim,
          height: AVATAR_SIZES[avatarSize].dim,
          lineHeight: AVATAR_SIZES[avatarSize].dim,
          flexShrink: 0,
          borderRadius: '50%',
          color: '#fff',
          backgroundColor: avatarConfig.color,
          textAlign: 'center' as const,
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          fontSize: AVATAR_SIZES[avatarSize].fontSize,
          cursor: clickable ? 'pointer' : 'default'
        }}>
        {avatarConfig.label}
      </div>
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
