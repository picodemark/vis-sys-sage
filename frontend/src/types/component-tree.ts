import { RawNodeDatum, TreeNodeDatum } from 'react-d3-tree/lib/types/common';

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
