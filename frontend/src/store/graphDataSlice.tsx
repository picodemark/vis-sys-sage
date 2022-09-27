import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';
import { ComponentListItem, CustomRawNodeDatum, NodeListItem } from '../types/types';

interface Props {
  nodeIDs: string[];
  tree: RawNodeDatum;
  componentsList: ComponentListItem[];
  componentsInfo: Record<string, ComponentListItem>;
  nodesList: NodeListItem[];
  dataPath: any;
  dataPathLinkAttributes: any;
  highlightedComponents: string[];
}

const initialState: Props = {
  nodeIDs: [],
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
      state.nodesList = [{ id: 'all' }].concat(action.payload?.nodesList);
      state.dataPath.nodes = action.payload?.dataPath?.nodes;
      state.dataPath.links = action.payload?.dataPath?.links;
      state.dataPathLinkAttributes = action.payload?.dataPath?.attributes;

      // show all nodes as default
      state.nodeIDs = ['all'].concat(action.payload?.nodesList.map((node) => node.id));

      // no components highlighted as default
      state.highlightedComponents = [];
    },
    setNodeIDs: (state, action: PayloadAction<string[]>) => {
      state.nodeIDs = action.payload;
    },
    setHighlightedComponents: (state, action: PayloadAction<string[]>) => {
      state.highlightedComponents = action.payload;
    }
  }
});

export const { setGraphData, setNodeIDs, setHighlightedComponents } =
  graphDataSlice.actions;

export default graphDataSlice.reducer;

export const selectFilteredTree = createSelector(
  (state) => state.graphData.nodeIDs,
  (state) => state.graphData.tree,
  (ids: string[], tree: CustomRawNodeDatum) => {
    if (ids.indexOf('all') === -1 && tree?.children !== undefined) {
      const filteredTree = Object.assign({}, tree);
      filteredTree.children = tree.children.filter((node) => ids.indexOf(node.id) > -1);
      return filteredTree;
    }
    return tree;
  }
);

export const selectComponentsList = (state) => state.graphData.componentsList;

export const selectComponentsInfo = (state) => state.graphData.componentsInfo;

export const selectNodeList = (state) => state.graphData.nodesList;

export const selectFilteredDataPath = createSelector(
  (state) => state.graphData.nodeIDs,
  (state) => state.graphData.dataPath,
  (ids, dataPath) => {
    const filteredDataPath = {};

    // merge all components per node into a single list
    filteredDataPath['nodes'] = Object.entries(dataPath.nodes).reduce(
      (newEntry, entry) =>
        ids.indexOf(entry[0]) > -1 ? newEntry.concat(entry[1]) : newEntry.concat([]),
      []
    );

    // merge all links per node into a single list
    filteredDataPath['links'] = Object.entries(dataPath.links).reduce(
      (newEntry, entry) =>
        ids.indexOf(entry[0]) > -1 ? newEntry.concat(entry[1]) : newEntry.concat([]),
      []
    );

    return filteredDataPath;
  }
);

export const selectDataPathLinkAttributes = (state) => state.graphData.dataPathLinkAttributes;

export const selectHighlightedComponents = (state) => state.graphData.highlightedComponents;
