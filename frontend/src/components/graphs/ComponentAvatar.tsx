import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AttributesTable from 'components/tables/AttributesTable';
import { Attributes } from 'types/common';
import Box from '@mui/material/Box';
import 'components/DraggablePaperComponent';
import DraggablePaperComponent from 'components/DraggablePaperComponent';

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
  label: string;
  cacheLevel?: number;
  attributes?: Attributes;
  size?: 'small' | 'medium' | 'large';
}

export default function ComponentAvatar(props: Props) {
  const { label, cacheLevel, attributes, size } = props;

  const [open, setOpen] = React.useState<boolean>(false);

  const clickable = attributes !== undefined ? attributes.length > 0 : false;

  const openDialog = () => {
    if (clickable) {
      setOpen(true);
    }
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const avatarConfig = {
    label: 'UN ',
    color: 'darkgrey'
  };

  const showCacheLevel =
    cacheLevel ??
    (label === 'cache' && attributes !== undefined
      ? attributes?.filter((attribute) => attribute?.name === 'cache_level')[0].value
      : '');

  switch (label) {
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
      avatarConfig.label = `L${showCacheLevel}`;
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

  return (
    <React.Fragment>
      <div
        onClick={openDialog}
        style={{
          width: AVATAR_SIZES[size ?? 'medium'].dim,
          height: AVATAR_SIZES[size ?? 'medium'].dim,
          lineHeight: AVATAR_SIZES[size ?? 'medium'].dim,
          flexShrink: 0,
          borderRadius: '50%',
          color: '#ffffff',
          backgroundColor: avatarConfig.color,
          textAlign: 'center' as const,
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          fontSize: AVATAR_SIZES[size ?? 'medium'].fontSize,
          cursor: clickable ? 'pointer' : 'default'
        }}>
        {avatarConfig.label}
      </div>
      <Dialog
        open={open}
        onClose={closeDialog}
        PaperComponent={DraggablePaperComponent}
        hideBackdrop={true}>
        <DialogTitle style={{ cursor: 'move' }}>{'Attributes of ' + label}</DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          {attributes !== undefined && (
            <Box minWidth={600}>
              <AttributesTable data={attributes} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
