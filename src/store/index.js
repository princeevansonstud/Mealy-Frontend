import { configureStore } from '@reduxjs/toolkit';
import activeTabReducer from './slices/activeTabSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
    reducer: {
        activeTab: activeTabReducer,
        orders: orderReducer,
    },
});