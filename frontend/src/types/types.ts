import { RawNodeDatum, TreeNodeDatum } from 'react-d3-tree/lib/types/common';

export type Attributes = Record<string, string | number | boolean>;

// type for node list item
export interface NodeListItem {
  id: string;
}

// type for components list item
export interface ComponentListItem {
  nodeID: string;
  uniqueComponentID: string;
  name: string;
  attributes?: Record<string, string | number | boolean>;
}

// custom type for raw node datum
export interface CustomRawNodeDatum extends RawNodeDatum {
  id?: string;
  uniqueComponentID?: string;
  children?: CustomRawNodeDatum[];
}

// custom type for tree node datum
export interface CustomTreeNodeDatum extends TreeNodeDatum {
  id?: string;
  uniqueComponentID?: string;
}
