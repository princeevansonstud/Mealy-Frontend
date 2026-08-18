import { configureStore } from '@reduxjs/toolkit';
import activeTabReducer from './slices/activeTabSlice';
import menuReducer from './slices/menuSlice';


export const store = configureStore({
    reducer: {
        activeTab: activeTabReducer,
        menu: menuReducer,
    },
});