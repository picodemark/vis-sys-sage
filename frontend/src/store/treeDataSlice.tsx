import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';

interface TreeDataState {
  value: RawNodeDatum;
}

// Define the initial state using that type
const initialState: TreeDataState = {
  value: {
    name: ''
  }
};

export const treeDataSlice = createSlice({
  name: 'treeData',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setTreeData: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
      console.log(state.value);
    }
  }
});

export const { setTreeData } = treeDataSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.treeData.value;

export default treeDataSlice.reducer;
