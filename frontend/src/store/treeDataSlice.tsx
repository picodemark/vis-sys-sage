import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';

interface TreeDataState {
  value: RawNodeDatum;
}

const initialState: TreeDataState = {
  value: {
    name: ''
  }
};

export const treeDataSlice = createSlice({
  name: 'treeData',
  initialState,
  reducers: {
    setTreeData: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    }
  }
});

export const { setTreeData } = treeDataSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.treeData.value;

export default treeDataSlice.reducer;
