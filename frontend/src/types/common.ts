// type for attributes
export type Attributes = Record<string, string | number | boolean>[];

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

// type for component table entry
export interface ComponentTableEntry {
  uniqueComponentID: string;
  nodeID: string;
  name: string;
  attributesNumber: number;
  attributes?: Attributes;
}
