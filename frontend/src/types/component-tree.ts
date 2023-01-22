// custom type for raw node datum
import { RawNodeDatum, TreeNodeDatum } from 'react-d3-tree/lib/types/types/common';

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
