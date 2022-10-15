import React, { useState } from 'react';
import ComponentAvatar from '../ComponentAvatar';
import {
  selectHighlightedComponents,
  setHighlightedComponents
} from '../../../store/graphDataSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { Attributes } from '../../../types/common';
import SelfDataPathButton from '../../buttons/SelfDataPathButton';

interface Props {
  id: string;
  info: Record<string, string | Attributes>;
  linkInfo: any; // TODO: use better typing
}

function DataPathComponent(props: Props) {
  const { id, info, linkInfo } = props;

  const dispatch = useAppDispatch();

  const clickedComponentSelector = useAppSelector(
    (state) => selectHighlightedComponents(state).indexOf(id) > -1
  );

  const [highlight, setHighlight] = useState<boolean>(false);

  const triggerHighlight = () => {
    dispatch(setHighlightedComponents([id]));
  };

  // highlight only when component ID is selected to be highlighted
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
        display: 'flex',
        flexDirection: 'column',
        width: '110px',
        borderRadius: '5px',
        backgroundColor: highlight ? 'yellow' : '#dad7cd',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        cursor: 'pointer'
      }}
      onClick={triggerHighlight}>
      <div
        style={{
          display: 'flex'
        }}>
        <div
          style={{
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
      {linkInfo.length !== 0 && <SelfDataPathButton sourceInfo={info} linkInfo={linkInfo} />}
    </div>
  );
}

export const MemoDataGraphComponent = React.memo(DataPathComponent);
