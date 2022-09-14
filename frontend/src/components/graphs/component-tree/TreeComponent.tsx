import React, { useState } from 'react';
import { CustomNodeElementProps, TreeNodeDatum } from 'react-d3-tree/lib/types/common';
import ComponentAvatar from '../ComponentAvatar';
import TreeComponentArrow from './TreeComponentArrow';

interface SpecificTreeNodeDatum extends TreeNodeDatum {
  id?: string;
  unique_component_id?: string;
}

interface SpecificCustomNodeElementProps extends Omit<CustomNodeElementProps, 'nodeDatum'> {
  nodeDatum: SpecificTreeNodeDatum;
}

export default function TreeComponent(props: SpecificCustomNodeElementProps) {
  const { nodeDatum, toggleNode } = props;

  return (
    <foreignObject x={-135} y={-100} width={270} height={260}>
      <div
        style={{
          width: '250px',
          borderRadius: '10px',
          backgroundColor: '#dad7cd',
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'grab'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', fontSize: '30px' }}>
          <ComponentAvatar
            id={nodeDatum.unique_component_id}
            clickable={nodeDatum?.attributes !== undefined}
          />
          <span style={{ marginLeft: '0.5rem' }}>
            {nodeDatum.name === '' ? 'no name' : nodeDatum.name}
          </span>
        </div>
        <div style={{ fontSize: '20px', padding: '1rem' }}>
          <span>{nodeDatum?.id === undefined ? 'No ID' : 'ID: ' + nodeDatum.id}</span>
          {nodeDatum.attributes && (
            <span style={{ float: 'right' }}>
              Attributes: {Object.keys(nodeDatum.attributes).length}
            </span>
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
    </foreignObject>
  );
}
