import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTodayMenu, updateMealOption } from '../../api/meals';

export const fetchTodayMenu = createAsyncThunk(
  'mealManagement/fetchTodayMenu',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTodayMenu();
      const mealsArray = data.meals || data.items || [];

      const mealOptions = mealsArray.map((meal) => ({
        id: Number(meal.meal_option_id ?? meal.id),
        name: meal.name || meal.title || '',
        category: meal.category || 'BEEF',
        price: Number(meal.price || 0),
        description: meal.description || '',
        image_url: meal.image_url || '',
      }));

      const dailyMenu = mealOptions.map((meal) => meal.id);

      return { mealOptions, dailyMenu };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load today menu');
    }
  }
);

export const updateMeal = createAsyncThunk(
  'mealManagement/updateMeal',
  async (payload, { rejectWithValue }) => {
    try {
      const { id, updatedData, ...flatFields } = payload;
      const targetId = id;
      const dataToSubmit = updatedData || flatFields;

      const response = await updateMealOption(targetId, dataToSubmit);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update meal');
    }
  }
);

export const deleteMeal = createAsyncThunk(
  'mealManagement/deleteMeal',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/meals/options/${id}/`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || 'Failed to delete meal');
      }

      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete meal');
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
        id: Number(action.payload.id || Date.now()),
        name: action.payload.name || action.payload.title || '',
        category: action.payload.category || 'BEEF',
        price: Number(action.payload.price || 0),
        description: action.payload.description || '',
      };
      state.mealOptions.push(newMeal);
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
      })
      .addCase(updateMeal.fulfilled, (state, action) => {
        const returnedData = action.payload;
        const targetId = Number(returnedData.id ?? returnedData.meal_option_id);

        const index = state.mealOptions.findIndex(
          (meal) => Number(meal.id) === targetId
        );

        if (index !== -1) {
          state.mealOptions[index] = {
            ...state.mealOptions[index],
            ...returnedData,
            id: targetId,
            name: returnedData.name || returnedData.title || state.mealOptions[index].name,
          };
        }
      })
      .addCase(updateMeal.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteMeal.fulfilled, (state, action) => {
        const targetId = Number(action.payload);
        state.mealOptions = state.mealOptions.filter((meal) => Number(meal.id) !== targetId);
        state.dailyMenu = state.dailyMenu.filter((id) => Number(id) !== targetId);
      })
      .addCase(deleteMeal.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setDailyMenu,
  toggleDailyMenuMeal,
  addMeal,
} = mealManagementSlice.actions;

export default mealManagementSlice.reducer;