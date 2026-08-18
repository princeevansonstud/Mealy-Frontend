import { configureStore } from '@reduxjs/toolkit';
import activeTabReducer from './slices/activeTabSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    activeTab: activeTabReducer,
    auth: authReducer,
  },
});
