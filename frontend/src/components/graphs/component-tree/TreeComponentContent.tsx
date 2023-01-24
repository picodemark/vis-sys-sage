import React, { useState } from 'react';
import ComponentAvatar from 'components/graphs/ComponentAvatar';
import TreeComponentArrow from 'components/graphs/component-tree/TreeComponentArrow';
import { selectHighlightedComponents, setHighlightedComponents } from 'store/graphDataSlice';
import { useAppDispatch, useAppSelector } from 'hooks/hooks';
import { CustomTreeNodeDatum } from 'types/component-tree';
import { CustomNodeElementProps } from 'react-d3-tree/lib/types/types/common';
import { Attributes } from 'types/common';

// replace nodeDatum with custom node nodeDatum
interface AdaptedCustomNodeElementProps extends Omit<CustomNodeElementProps, 'nodeDatum'> {
  nodeDatum: CustomTreeNodeDatum;
}

export default function TreeComponentContent(props: AdaptedCustomNodeElementProps) {
  const { nodeDatum, toggleNode } = props;

  const dispatch = useAppDispatch();

  const clickedComponentSelector = useAppSelector(
    (state) => selectHighlightedComponents(state).indexOf(nodeDatum.uniqueComponentID) > -1
  );

  const [highlight, setHighlight] = useState<boolean>(false);

  const triggerHighlight = () => {
    dispatch(setHighlightedComponents([nodeDatum.uniqueComponentID]));
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '250px',
          borderRadius: '10px',
          backgroundColor: highlight ? 'yellow' : '#dad7cd',
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          cursor: 'pointer'
        }}
        onClick={triggerHighlight}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', fontSize: '30px' }}>
          <ComponentAvatar
            label={nodeDatum.name}
            attributes={nodeDatum?.attributes as unknown as Attributes}
          />
          <span style={{ marginLeft: '0.5rem' }}>
            {nodeDatum.name === '' ? 'no name' : nodeDatum.name}
          </span>
        </div>
        <div style={{ fontSize: '26px', padding: '1rem' }}>
          <span>{nodeDatum?.id === undefined ? 'No ID' : 'ID: ' + nodeDatum.id}</span>
          {nodeDatum.attributes && (
            <span style={{ float: 'right' }}>INFO: {Object.keys(nodeDatum.attributes).length}</span>
          )}
        </div>
        {nodeDatum.children && (
          <div
            style={{
              alignSelf: 'flex-end',
              marginTop: 'auto',
              padding: '1rem',
              cursor: 'pointer'
            }}
            onClick={toggleNode}>
            <TreeComponentArrow direction={nodeDatum.__rd3t.collapsed ? 'up' : 'down'} />
          </div>
        )}
      </div>
    </div>
  );
}
