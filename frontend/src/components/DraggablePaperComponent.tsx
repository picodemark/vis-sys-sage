import * as React from 'react';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';

export default function DraggablePaperComponent(props: PaperProps) {
  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
