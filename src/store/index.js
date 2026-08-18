import { configureStore } from '@reduxjs/toolkit';
import activeTabReducer from './slices/activeTabSlice';
import mealManagementReducer from './slices/mealManagementSlice';

export const store = configureStore({
  reducer: {
    activeTab: activeTabReducer,
    mealManagement: mealManagementReducer,
  },
});
