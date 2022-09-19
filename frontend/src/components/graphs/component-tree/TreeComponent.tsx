import React from 'react';
import { CustomNodeElementProps } from 'react-d3-tree/lib/types/common';
import TreeComponentContent from './TreeComponentContent';

export default function TreeComponent(props: CustomNodeElementProps) {
  return (
    <foreignObject x={-135} y={-100} width={270} height={260}>
      <TreeComponentContent {...props} />
    </foreignObject>
  );
}
