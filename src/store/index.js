import { configureStore } from '@reduxjs/toolkit';
import activeTabReducer from './slices/activeTabSlice';

export const store = configureStore({
    reducer: {
        activeTab: activeTabReducer,
    },
});