import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {
  initial: true,
  nodeID: 'all',
  tree: {
    name: ''
  },
  allComponents: {},
  allNodes: [],
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
      state.allComponents = action.payload?.all_components;
      state.allNodes = action.payload?.all_nodes;
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
  return state.graphData.tree.children.filter((node) => {
    return node.attributes.id === state.graphData.nodeID;
  });
};

export const selectAllComponents = (state) => state.graphData.allComponents;

export const selectAllNodes = (state) => state.graphData.allNodes;

export const selectDataPath = (state) => state.graphData.dataPath;
