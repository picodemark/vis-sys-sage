import * as React from 'react';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';

export default function DraggablePaperComponent(props: PaperProps) {
  const defaultProps: PaperProps = {
    elevation: 10
  };

  // replace passed props by default props
  const mergedProps = { ...props, ...defaultProps };

  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...mergedProps} />
    </Draggable>
  );
}
