import { configureStore } from '@reduxjs/toolkit';
import activeTabReducer from './slices/activeTabSlice';
import menuReducer from './slices/menuSlice';
import authReducer from './slices/authSlice';
import mealManagementReducer from './slices/mealManagementSlice';

export const store = configureStore({
    reducer: {
        activeTab: activeTabReducer,
        menu: menuReducer,
        auth: authReducer,
        mealManagement: mealManagementReducer,
    },
});