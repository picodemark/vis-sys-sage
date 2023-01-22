// type for data path type
export interface DataPathTypeItem {
  name: string;
}

// type for data path node
interface DataPathNodeItem {
  id: string;
}

// type for data path nodes
interface DataPathNodes {
  [dataPathType: string]: DataPathNodeItem[];
}

// type for data path link
interface DataPathLinkItem {
  source: string;
  target: string;
}

// type for data path links
interface DataPathLinks {
  [dataPathType: string]: DataPathLinkItem[];
}

// type for data path
export interface DataPathItem {
  nodes: DataPathNodes | [];
  links?: DataPathLinks | [];
}

// type for data path link attributes
interface DataPathLinkAttributeItem {
  [attributeName: string]: string;
}

// type for data path links attributes for
interface DataPathLinkAttributeConnection {
  attributeNames: string[];
  attributes: DataPathLinkAttributeItem[];
}

// type for data path link attributes
interface DataPathLinkAttributesTarget {
  [target: string]: DataPathLinkAttributeConnection;
}

export interface DataPathLinkAttributes {
  [source: string]: DataPathLinkAttributesTarget;
}
