export type Attributes = any; // TODO: use better typing

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
