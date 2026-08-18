import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ---- MOCK DATA (remove once backend is ready) ----
// This is the shape we EXPECT the Flask endpoint GET /menu/today to return.
const MOCK_TODAY_MENU = {
  id: 1,
  date: new Date().toISOString().split('T')[0], // e.g. "2026-08-18"
  mealOptions: [
    { id: 101, name: 'Beef with Rice', description: 'Slow-cooked beef, steamed rice, veg', price: 250 },
    { id: 102, name: 'Beef with Fries', description: 'Grilled beef, crispy fries, salad', price: 280 },
    { id: 103, name: 'Chicken Stew with Ugali', description: 'Home-style chicken stew, ugali', price: 220 },
  ],
};

// Fetch today's menu.
// Right now this just resolves with mock data after a short fake delay,
// so your UI can handle loading states properly.
// LATER: replace the body with `const res = await api.get('/menu/today'); return res.data;`
export const fetchTodayMenu = createAsyncThunk(
  'menu/fetchTodayMenu',
  async (_, { rejectWithValue }) => {
    try {
      // simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // simulate "no menu set yet" by uncommenting this:
      // return null;

      return MOCK_TODAY_MENU;
    } catch (err) {
      return rejectWithValue('Failed to load today\'s menu');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    todayMenu: null,       // null until fetched; will hold { id, date, mealOptions }
    selectedMealId: null,  // customer's current pick
    status: 'idle',        // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    selectMeal: (state, action) => {
      state.selectedMealId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedMealId = null;
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
        state.todayMenu = action.payload; // may be null if no menu set
      })
      .addCase(fetchTodayMenu.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { selectMeal, clearSelection } = menuSlice.actions;
export default menuSlice.reducer;