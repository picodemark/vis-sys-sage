import React from 'react';
import { CustomNodeElementProps } from 'react-d3-tree/lib/types/common';
import TreeNodeContent from './TreeNodeContent';

export default function TreeNode(props: CustomNodeElementProps) {
  return <TreeNodeContent {...props} />;
}
