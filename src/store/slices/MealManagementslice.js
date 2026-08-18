import { createSlice } from '@reduxjs/toolkit';


const initialMealOptions = [
  { id: 1, name: 'Beef with Rice', price: 12.50, description: 'Steamed rice with tender beef sauce' },
  { id: 2, name: 'Beef with Fries', price: 13.00, description: 'Crispy fries with grilled beef' },
  { id: 3, name: 'Chicken Salad', price: 9.00, description: 'Fresh veggies with grilled chicken breast' },
];

const mealManagementSlice = createSlice({
  name: 'mealManagement',
  initialState: {
    mealOptions: initialMealOptions,
    dailyMenu: [1, 2], 
  },
  reducers: {
    addMealOption: (state, action) => {
      const newMeal = { id: Date.now(), ...action.payload };
      state.mealOptions.push(newMeal);
    },
    editMealOption: (state, action) => {
      const { id, name, price, description } = action.payload;
      const index = state.mealOptions.findIndex((meal) => meal.id === id);
      if (index !== -1) {
        state.mealOptions[index] = { id, name, price, description };
      }
    },
    deleteMealOption: (state, action) => {
      const idToDelete = action.payload;
      state.mealOptions = state.mealOptions.filter((meal) => meal.id !== idToDelete);
      state.dailyMenu = state.dailyMenu.filter((id) => id !== idToDelete);
    },
    toggleDailyMenuMeal: (state, action) => {
      const mealId = action.payload;
      if (state.dailyMenu.includes(mealId)) {
        state.dailyMenu = state.dailyMenu.filter((id) => id !== mealId);
      } else {
        state.dailyMenu.push(mealId);
      }
    },
  },
});

export const {
  addMealOption,
  editMealOption,
  deleteMealOption,
  toggleDailyMenuMeal,
} = mealManagementSlice.actions;

export default mealManagementSlice.reducer;