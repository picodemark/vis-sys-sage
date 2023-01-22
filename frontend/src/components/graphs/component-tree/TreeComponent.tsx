import React from 'react';
import TreeComponentContent from 'components/graphs/component-tree/TreeComponentContent';
import { CustomNodeElementProps } from 'react-d3-tree/lib/types/types/common';

export default function TreeComponent(props: CustomNodeElementProps) {
  return (
    <foreignObject x={-135} y={-100} width={270} height={260}>
      <TreeComponentContent {...props} />
    </foreignObject>
  );
}
