import React from 'react';
import { CustomNodeElementProps } from 'react-d3-tree/lib/types/common';
import TreeComponentContent from './TreeComponentContent';

export default function TreeComponent(props: CustomNodeElementProps) {
  return <TreeComponentContent {...props} />;
}
