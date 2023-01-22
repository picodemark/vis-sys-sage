import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { useAppDispatch } from 'hooks/hooks';
import { setHighlightedComponents } from 'store/graphDataSlice';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Tooltip from '@mui/material/Tooltip';

interface Props {
  components: string[];
}

export default function HighlightComponentsButton(props: Props) {
  const { components } = props;

  const dispatch = useAppDispatch();

  const highlightComponents = () => {
    dispatch(setHighlightedComponents(components));
  };

  return (
    <Tooltip title="Highlight Component">
      <IconButton onClick={highlightComponents}>
        <VisibilityOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
}
