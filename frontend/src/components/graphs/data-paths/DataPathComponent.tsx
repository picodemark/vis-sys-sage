import React, { useState } from 'react';
import ComponentAvatar from '../ComponentAvatar';
import { selectClickedComponents, setClickedComponents } from '../../../store/graphDataSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { Attributes } from '../../../types/types';

interface Props {
  id: string;
  info: Record<string, string | Attributes>;
}

function DataPathComponent(props: Props) {
  const { id, info } = props;

  const clickedComponentSelector = useAppSelector(
    (state) => selectClickedComponents(state).indexOf(id) > -1
  );
  const dispatch = useAppDispatch();

  const [highlight, setHighlight] = useState<boolean>(false);

  const triggerHighlight = () => {
    dispatch(setClickedComponents([id]));
  };

  // highlight only when component ID is the same
  if (!highlight && clickedComponentSelector) {
    setHighlight(true);
  }

  // remove highlight when component ID is the same and component is highlighted
  if (highlight && !clickedComponentSelector) {
    setHighlight(false);
  }

  return (
    <div
      style={{
        width: '110px',
        borderRadius: '5px',
        backgroundColor: highlight ? 'yellow' : '#dad7cd',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        cursor: 'pointer'
      }}
      onClick={triggerHighlight}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem',
          fontSize: '30px'
        }}>
        <ComponentAvatar label={info.name as string} attributes={info.attributes as Attributes} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0.5rem 0.5rem 0.5rem 0',
          textAlign: 'center'
        }}>
        <span style={{ fontSize: '30px', fontWeight: 800, color: '#0065bd' }}>
          {info.nodeID as string}
        </span>
        <span style={{ fontSize: '24px', marginTop: 'auto' }}>{info.componentID as string}</span>
      </div>
    </div>
  );
}

export const MemoDataGraphComponent = React.memo(DataPathComponent);
