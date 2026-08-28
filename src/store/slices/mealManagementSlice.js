import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTodayMenu } from '../../api/meals';

export const fetchTodayMenu = createAsyncThunk(
  'mealManagement/fetchTodayMenu',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTodayMenu();

      // Reshape backend response into what CustomerMenuPage expects
      const mealOptions = data.meals.map((meal) => ({
        id: meal.meal_option_id,
        name: meal.title,
        category: meal.category,
        price: meal.price,
        description: meal.description,
        image_url: meal.image_url,
      }));

      const dailyMenu = mealOptions.map((meal) => meal.id);

      return { mealOptions, dailyMenu };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load today\'s menu');
    }
  }
);

const mealManagementSlice = createSlice({
  name: 'mealManagement',
  initialState: {
    mealOptions: [],
    dailyMenu: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayMenu.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodayMenu.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.mealOptions = action.payload.mealOptions;
        state.dailyMenu = action.payload.dailyMenu;
      })
      .addCase(fetchTodayMenu.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default mealManagementSlice.reducer;
