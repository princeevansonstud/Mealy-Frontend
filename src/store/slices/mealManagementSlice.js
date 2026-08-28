import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTodayMenu } from '../../api/meals';

export const fetchTodayMenu = createAsyncThunk(
  'mealManagement/fetchTodayMenu',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTodayMenu();

      const mealOptions = data.meals.map((meal) => ({
        id: meal.meal_option_id || meal.id,
        name: meal.title || meal.name,
        category: meal.category,
        price: meal.price,
        description: meal.description,
        image_url: meal.image_url,
      }));

      const dailyMenu = mealOptions.map((meal) => meal.id);

      return { mealOptions, dailyMenu };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load today menu');
    }
  }
);

const defaultMealOptions = [
  { id: 1, name: 'Beef with Rice', category: 'BEEF', price: 450, description: 'Tender beef stew served with fragrant steamed rice.' },
  { id: 2, name: 'Beef with Fries', category: 'BEEF', price: 500, description: 'Savory beef chunks paired with crispy potato fries.' },
  { id: 3, name: 'Chicken Stew with Ugali', category: 'CHICKEN', price: 400, description: 'Classic chicken stew with traditional ugali.' },
  { id: 4, name: 'Vegan Buddha Bowl', category: 'VEGAN', price: 350, description: 'Healthy mix of greens, grains, and fresh veggies.' },
  { id: 5, name: 'Cheesy Greens Wrap', category: 'CHEESE', price: 300, description: 'Warm tortilla wrapped with melted cheese and fresh greens.' },
  { id: 6, name: 'Pork Ribs with Mash', category: 'PORK', price: 600, description: 'BBQ glazed pork ribs served with creamy mashed potatoes.' },
  { id: 7, name: 'Mac and Cheese', category: 'CHEESE', price: 350, description: 'Rich and creamy macaroni coated in warm melted cheese.' },
  { id: 8, name: 'Kale and Avocado Bowl', category: 'GREENS', price: 300, description: 'Freshly chopped kale topped with avocado slice.' },
  { id: 9, name: 'Chicken Pilau', category: 'CHICKEN', price: 450, description: 'Spiced rice cooked to perfection with chicken.' },
];

const initialDailyMenu = defaultMealOptions.map((m) => m.id);

const mealManagementSlice = createSlice({
  name: 'mealManagement',
  initialState: {
    mealOptions: defaultMealOptions,
    dailyMenu: initialDailyMenu,
    status: 'idle',
    error: null,
  },
  reducers: {
    setDailyMenu: (state, action) => {
      state.dailyMenu = action.payload;
    },
    toggleDailyMenuMeal: (state, action) => {
      const mealId = action.payload;
      if (state.dailyMenu.includes(mealId)) {
        state.dailyMenu = state.dailyMenu.filter((id) => id !== mealId);
      } else {
        state.dailyMenu.push(mealId);
      }
    },
    addMeal: (state, action) => {
      const newMeal = {
        ...action.payload,
        id: action.payload.id || Date.now(),
      };
      state.mealOptions.push(newMeal);
    },
    updateMeal: (state, action) => {
      const index = state.mealOptions.findIndex((meal) => meal.id === action.payload.id);
      if (index !== -1) {
        state.mealOptions[index] = { ...state.mealOptions[index], ...action.payload };
      }
    },
    deleteMeal: (state, action) => {
      state.mealOptions = state.mealOptions.filter((meal) => meal.id !== action.payload);
      state.dailyMenu = state.dailyMenu.filter((id) => id !== action.payload);
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
        state.mealOptions = action.payload.mealOptions;
        state.dailyMenu = action.payload.dailyMenu;
      })
      .addCase(fetchTodayMenu.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setDailyMenu,
  toggleDailyMenuMeal,
  addMeal,
  updateMeal,
  deleteMeal,
} = mealManagementSlice.actions;

export default mealManagementSlice.reducer;