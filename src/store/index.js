import { configureStore } from '@reduxjs/toolkit';
import activeTabReducer from './slices/activeTabSlice';
import menuReducer from './slices/menuSlice';
import mealManagementReducer from './slices/mealManagementSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    activeTab: activeTabReducer,
    menu: menuReducer,
    mealManagement: mealManagementReducer,
    orders: orderReducer,
  },
});

export default store;