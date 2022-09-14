import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {
  initial: true,
  nodeID: 'all',
  tree: {
    name: ''
  },
  componentsDict: {},
  componentsList: [],
  nodesList: [],
  dataPath: {
    nodes: [],
    links: []
  }
};

export const graphDataSlice = createSlice({
  name: 'graphData',
  initialState,
  reducers: {
    setGraphData: (state, action: PayloadAction<any>) => {
      state.initial = false;
      state.tree = action.payload?.tree;
      state.componentsDict = action.payload?.components_dict;
      state.componentsList = action.payload?.components_list;
      state.nodesList = action.payload?.nodes_list;
      state.dataPath = action.payload?.data_path;
    },
    setNodeID: (state, action: PayloadAction<any>) => {
      state.nodeID = action.payload;
    }
  }
});

export const { setGraphData, setNodeID } = graphDataSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.graphData.value;

export default graphDataSlice.reducer;

export const selectCurrentTree = (state) => {
  if (state.graphData.initial || state.graphData.nodeID === 'all') {
    return state.graphData.tree;
  }
  const filteredTree = state.graphData.tree.children.filter(
    (node) => node.id === state.graphData.nodeID
  );
  return filteredTree[0];
};

export const selectComponentsDict = (state) => state.graphData.componentsDict;

export const selectComponentsList = (state) => state.graphData.componentsList;

export const selectNodeList = (state) => state.graphData.nodesList;

export const selectDataPath = (state) => state.graphData.dataPath;
