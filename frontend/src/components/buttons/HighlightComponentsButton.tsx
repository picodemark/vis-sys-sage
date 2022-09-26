import * as React from 'react';
import Button from '@mui/material/Button';
import { useAppDispatch } from '../../hooks/hooks';
import { setHighlightedComponents } from '../../store/graphDataSlice';

interface Props {
  label: string;
  components: string[];
}

export default function HighlightComponentsButton(props: Props) {
  const { label, components } = props;

  const dispatch = useAppDispatch();

  const highlightComponents = () => {
    dispatch(setHighlightedComponents(components));
  };

  return (
    <Button onClick={highlightComponents} variant="outlined">
      {label}
    </Button>
  );
}
