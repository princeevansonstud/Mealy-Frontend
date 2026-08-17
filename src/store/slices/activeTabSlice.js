import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTab: 'daily-menu',
};

const activeTabSlice = createSlice({
  name: 'activeTab',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.currentTab = action.payload;
    },
  },
});

export const { setActiveTab } = activeTabSlice.actions;
export default activeTabSlice.reducer;