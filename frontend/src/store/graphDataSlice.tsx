import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';
import { ComponentListItem, CustomRawNodeDatum, NodeListItem } from '../types/types';

interface Props {
  nodeIDs: string[];
  tree: RawNodeDatum;
  componentList: ComponentListItem[];
  componentsInfo: Record<string, ComponentListItem>;
  nodeList: NodeListItem[];
  filteredTypes: string[];
  dataPathTypes: any;
  dataPath: any;
  dataPathLinkAttributes: any;
  highlightedComponents: string[];
}

const initialState: Props = {
  nodeIDs: [],
  tree: {
    name: ''
  },
  componentList: [],
  componentsInfo: {},
  nodeList: [],
  filteredTypes: [],
  dataPathTypes: [],
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
      state.componentList = action.payload?.componentList;
      state.componentsInfo = action.payload?.componentsInfo;
      state.nodeList = [{ id: 'all' }].concat(action.payload?.nodeList);
      state.dataPathTypes = [{ name: 'all' }].concat(action.payload?.dataPath?.types);
      state.dataPath.nodes = action.payload?.dataPath?.nodes;
      state.dataPath.links = action.payload?.dataPath?.links;
      state.dataPathLinkAttributes = action.payload?.dataPath?.attributes;

      // show all nodes as default
      state.nodeIDs = ['all'].concat(action.payload?.nodeList.map((node) => node.id));

      // show all data-path types as default
      state.filteredTypes = ['all'].concat(action.payload?.dataPath.types.map((type) => type.name));

      // no components highlighted as default
      state.highlightedComponents = [];
    },
    setNodeIDs: (state, action: PayloadAction<string[]>) => {
      state.nodeIDs = action.payload;
    },
    setFilteredTypes: (state, action: PayloadAction<string[]>) => {
      state.filteredTypes = action.payload;
    },
    setHighlightedComponents: (state, action: PayloadAction<string[]>) => {
      state.highlightedComponents = action.payload;
    }
  }
});

export const { setGraphData, setNodeIDs, setFilteredTypes, setHighlightedComponents } =
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

export const selectComponentList = (state) => state.graphData.componentList;

export const selectComponentsInfo = (state) => state.graphData.componentsInfo;

export const selectNodeList = (state) => state.graphData.nodeList;

export const selectDataPathTypes = (state) => state.graphData.dataPathTypes;

export const selectFilteredDataPath = createSelector(
  (state) => state.graphData.nodeIDs,
  (state) => state.graphData.filteredTypes,
  (state) => state.graphData.dataPath,
  (ids, types, dataPath) => {
    const filteredDataPath = {
      nodes: [],
      links: []
    };

    // merge all components per node into a single list
    filteredDataPath.nodes = Object.keys(dataPath.nodes).reduce((accNodes: any, id) => {
      if (ids.indexOf(id) > -1) {
        const nodeTypes = Object.keys(dataPath.nodes[id]).reduce((accTypes, type) => {
          if (types.indexOf(type) > -1) {
            return accTypes.concat(dataPath.nodes[id][type]);
          }
          return accTypes;
        }, []);
        return accNodes.concat(nodeTypes);
      }
      return accNodes;
    }, []);

    // merge all links per node into a single list
    filteredDataPath.links = Object.keys(dataPath.links).reduce((accLinks: any, id) => {
      if (ids.indexOf(id) > -1) {
        const nodeTypes = Object.keys(dataPath.links[id]).reduce((accTypes, type) => {
          if (types.indexOf(type) > -1) {
            return accTypes.concat(dataPath.links[id][type]);
          }
          return accTypes;
        }, []);
        return accLinks.concat(nodeTypes);
      }
      return accLinks;
    }, []);

    return filteredDataPath;
  }
);

export const selectDataPathLinkAttributes = (state) => state.graphData.dataPathLinkAttributes;

export const selectHighlightedComponents = (state) => state.graphData.highlightedComponents;
