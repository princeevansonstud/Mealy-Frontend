import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage or use defaults
const loadStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

const initialMealOptions = [
  { id: 1, name: 'BEEF WITH RICE', price: 250, description: 'SLOW-COOKED BEEF, STEAMED RICE, VEG', category: 'BEEF' },
  { id: 2, name: 'BEEF WITH FRIES', price: 280, description: 'GRILLED BEEF, CRISPY FRIES, SALAD', category: 'BEEF' },
  { id: 3, name: 'CHICKEN STEW WITH UGALI', price: 220, description: 'HOME-STYLE CHICKEN STEW, UGALI', category: 'CHICKEN' },
  { id: 4, name: 'VEGAN BUDDHA BOWL', price: 200, description: 'FRESH VEGGIES, QUINOA, TAHINI DRESSING', category: 'VEGAN' },
  { id: 5, name: 'CHEESY GREENS WRAP', price: 180, description: 'SPINACH, CHEESE, TORTILLA WRAP', category: 'CHEESE' },
];

const initialState = {
  mealOptions: loadStorage('mealOptions', initialMealOptions),
  dailyMenu: loadStorage('dailyMenu', [1, 2, 3, 4, 5]),
};

const mealManagementSlice = createSlice({
  name: 'mealManagement',
  initialState,
  reducers: {
    addMeal: (state, action) => {
      const newMeal = { id: Date.now(), ...action.payload };
      state.mealOptions.push(newMeal);
      state.dailyMenu.push(newMeal.id);

      localStorage.setItem('mealOptions', JSON.stringify(state.mealOptions));
      localStorage.setItem('dailyMenu', JSON.stringify(state.dailyMenu));
    },
    updateMeal: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.mealOptions.findIndex((meal) => meal.id === id);
      if (index !== -1) {
        state.mealOptions[index] = { ...state.mealOptions[index], ...updatedData };
        localStorage.setItem('mealOptions', JSON.stringify(state.mealOptions));
      }
    },
    deleteMeal: (state, action) => {
      const id = action.payload;
      state.mealOptions = state.mealOptions.filter((meal) => meal.id !== id);
      state.dailyMenu = state.dailyMenu.filter((mealId) => mealId !== id);

      localStorage.setItem('mealOptions', JSON.stringify(state.mealOptions));
      localStorage.setItem('dailyMenu', JSON.stringify(state.dailyMenu));
    },
    toggleDailyMenuMeal: (state, action) => {
      const mealId = action.payload;
      if (state.dailyMenu.includes(mealId)) {
        state.dailyMenu = state.dailyMenu.filter((id) => id !== mealId);
      } else {
        state.dailyMenu.push(mealId);
      }
      localStorage.setItem('dailyMenu', JSON.stringify(state.dailyMenu));
    },
  },
});

export const { addMeal, updateMeal, deleteMeal, toggleDailyMenuMeal } = mealManagementSlice.actions;
export default mealManagementSlice.reducer;