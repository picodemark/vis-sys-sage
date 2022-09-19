export type Attributes = Record<string, string | number | boolean>;

export interface NodeListItem {
  id: string;
}

export interface ComponentListItem {
  nodeID: string;
  uniqueComponentID: string;
  name: string;
  attributes?: Record<string, string | number | boolean>;
}
