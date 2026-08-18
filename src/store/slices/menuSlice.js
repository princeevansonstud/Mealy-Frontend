// src/store/slices/menuSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ---- MOCK DATA (remove once backend is ready) ----
const MOCK_TODAY_MENU = {
  id: 1,
  date: new Date().toISOString().split('T')[0],
  mealOptions: [
    { id: 101, name: 'Beef with Rice', description: 'Slow-cooked beef, steamed rice, veg', price: 250, category: 'BEEF' },
    { id: 102, name: 'Beef with Fries', description: 'Grilled beef, crispy fries, salad', price: 280, category: 'BEEF' },
    { id: 103, name: 'Chicken Stew with Ugali', description: 'Home-style chicken stew, ugali', price: 220, category: 'CHICKEN' },
    { id: 104, name: 'Vegan Buddha Bowl', description: 'Quinoa, roasted veg, tahini dressing', price: 200, category: 'VEGAN' },
    { id: 105, name: 'Cheesy Greens Wrap', description: 'Grilled greens, melted cheese, tortilla', price: 180, category: 'CHEESE' },
  ],
};

export const fetchTodayMenu = createAsyncThunk(
  'menu/fetchTodayMenu',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_TODAY_MENU;
    } catch (err) {
      return rejectWithValue('Failed to load today\'s menu');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    todayMenu: null,
    selectedMealId: null,
    selectedCategory: 'ALL',
    status: 'idle',
    error: null,
  },
  reducers: {
    selectMeal: (state, action) => {
      state.selectedMealId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedMealId = null;
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayMenu.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodayMenu.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todayMenu = action.payload;
      })
      .addCase(fetchTodayMenu.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { selectMeal, clearSelection, setCategory } = menuSlice.actions;
export default menuSlice.reducer;