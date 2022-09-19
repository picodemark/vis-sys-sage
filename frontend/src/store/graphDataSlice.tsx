import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';
import { ComponentListItem, NodeListItem } from '../types/types';

interface Props {
  nodeID: string;
  tree: RawNodeDatum;
  componentsList: ComponentListItem[];
  nodesList: NodeListItem[];
  dataPath: any;
  dataPathLinkAttributes: [];
  clickedComponent: string;
}

const initialState: Props = {
  nodeID: 'all',
  tree: {
    name: ''
  },
  componentsList: [],
  nodesList: [],
  dataPath: {
    nodes: [],
    links: []
  },
  dataPathLinkAttributes: [],
  clickedComponent: ''
};

export const graphDataSlice = createSlice({
  name: 'graphData',
  initialState,
  reducers: {
    setGraphData: (state, action: PayloadAction<any>) => {
      // set state based on payload
      state.tree = action.payload?.tree;
      state.componentsList = action.payload?.componentsList;
      state.nodesList = action.payload?.nodesList;
      state.dataPath.nodes = action.payload?.dataPath?.nodes;
      state.dataPath.links = action.payload?.dataPath?.links;
      state.dataPathLinkAttributes = action.payload?.dataPath?.attributes;

      // show all nodes
      state.nodeID = 'all';

      // no component selected
      state.clickedComponent = '';
    },
    setNodeID: (state, action: PayloadAction<string>) => {
      state.nodeID = action.payload;
    },
    setClickedComponent: (state, action: PayloadAction<string>) => {
      state.clickedComponent = action.payload;
    }
  }
});

export const { setGraphData, setNodeID, setClickedComponent } = graphDataSlice.actions;

export default graphDataSlice.reducer;

const selectNodeID = (state) => state.graphData.nodeID;

export const selectCurrentTree = (state) => {
  if (state.graphData.nodeID === 'all') {
    return state.graphData.tree;
  }
  const filteredTree = state.graphData.tree.children.filter(
    (node) => node.id === state.graphData.nodeID
  );
  return filteredTree[0];
};

export const selectComponentsList = (state) => state.graphData.componentsList;

export const selectNodeList = (state) => state.graphData.nodesList;

const selectDataPath = (state) => state.graphData.dataPath;

export const selectFilteredDataPath = createSelector(
  selectNodeID,
  selectDataPath,
  (nodeID, dataPath) => {
    const dataPathNew = {
      nodes: [],
      links: []
    };

    if (nodeID === 'all') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dataPathNew.nodes = Object.values(dataPath.nodes).reduce(
        (prev: any, current: any) => prev.concat(current),
        []
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dataPathNew.links = Object.values(dataPath.links).reduce(
        (prev: any, current: any) => prev.concat(current),
        []
      );
    } else {
      dataPathNew.nodes = dataPath.nodes[nodeID];
      dataPathNew.links = dataPath.links[nodeID];
    }
    return dataPathNew;
  }
);

export const selectDataPathLinkAttributes = (state) => state.graphData.dataPathLinkAttributes;

export const selectClickedComponent = (state) => state.graphData.clickedComponent;
