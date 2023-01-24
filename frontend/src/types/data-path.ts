// type for data path type
import { Attributes } from 'types/common';

export interface DataPathTypeItem {
  name: string;
}

// type for data path node
interface DataPathNodeItem {
  id: string;
}

// type for data path link
export interface DataPathLinkItem {
  source: string;
  target: string;
}

// type for data path
export interface DataPathItem {
  nodes: Record<string, DataPathNodeItem[]> | [];
  links?: Record<string, DataPathLinkItem[]> | [];
}

// type for data path link attributes for a connection between two nodes
export interface DataPathLinkAttributeInfo {
  attributeNames: string[];
  attributes: Attributes;
}

// type for data path link attributes
export interface DataPathLinkAttributes {
  [source: string]: Record<string, DataPathLinkAttributeInfo>;
}
