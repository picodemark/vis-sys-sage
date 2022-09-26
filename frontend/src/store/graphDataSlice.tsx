import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';
import { ComponentListItem, CustomRawNodeDatum, NodeListItem } from '../types/types';

interface Props {
  nodeID: string;
  tree: RawNodeDatum;
  componentsList: ComponentListItem[];
  componentsInfo: Record<string, ComponentListItem>;
  nodesList: NodeListItem[];
  dataPath: any;
  dataPathLinkAttributes: any;
  highlightedComponents: string[];
}

const initialState: Props = {
  nodeID: 'all',
  tree: {
    name: ''
  },
  componentsList: [],
  componentsInfo: {},
  nodesList: [],
  dataPath: {
    nodes: [],
    links: []
  },
  dataPathLinkAttributes: [],
  highlightedComponents: []
};

export const graphDataSlice = createSlice({
  name: 'graphData',
  initialState,
  reducers: {
    setGraphData: (state, action: PayloadAction<any>) => {
      // set state based on payload
      state.tree = action.payload?.tree;
      state.componentsList = action.payload?.componentsList;
      state.componentsInfo = action.payload?.componentsInfo;
      state.nodesList = action.payload?.nodesList;
      state.dataPath.nodes = action.payload?.dataPath?.nodes;
      state.dataPath.links = action.payload?.dataPath?.links;
      state.dataPathLinkAttributes = action.payload?.dataPath?.attributes;

      // show all nodes as default
      state.nodeID = 'all';

      // no components highlighted as default
      state.highlightedComponents = [];
    },
    setNodeID: (state, action: PayloadAction<string>) => {
      state.nodeID = action.payload;
    },
    setHighlightedComponents: (state, action: PayloadAction<string[]>) => {
      state.highlightedComponents = action.payload;
    }
  }
});

export const { setGraphData, setNodeID, setHighlightedComponents } = graphDataSlice.actions;

export default graphDataSlice.reducer;

export const selectNodeID = (state) => state.graphData.nodeID;

export const selectCurrentTree = createSelector(
  selectNodeID,
  (state) => state.graphData.tree,
  (nodeID: string, tree: CustomRawNodeDatum) => {
    if (nodeID === 'all') {
      return tree;
    }
    return tree.children.filter((node) => node.id === nodeID)[0];
  }
);

export const selectComponentsList = (state) => state.graphData.componentsList;

export const selectComponentsInfo = (state) => state.graphData.componentsInfo;

export const selectNodeList = (state) => state.graphData.nodesList;

export const selectFilteredDataPath = createSelector(
  selectNodeID,
  (state) => state.graphData.dataPath,
  (nodeID, dataPath) => {
    const dataPathNew = {};

    if (nodeID === 'all') {
      // merge all components per node into single list
      dataPathNew['nodes'] = Object.values(dataPath.nodes).reduce(
        (prev: any, current: any) => prev.concat(current),
        []
      );
      // merge all links per node into single list
      dataPathNew['links'] = Object.values(dataPath.links).reduce(
        (prev: any, current: any) => prev.concat(current),
        []
      );
    } else {
      dataPathNew['nodes'] = dataPath.nodes[nodeID];
      dataPathNew['links'] = dataPath.links[nodeID];
    }

    return dataPathNew;
  }
);

export const selectDataPathLinkAttributes = (state) => state.graphData.dataPathLinkAttributes;

export const selectHighlightedComponents = (state) => state.graphData.highlightedComponents;
