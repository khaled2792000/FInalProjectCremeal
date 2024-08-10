// slices/FavoriteMealSlice.js
import { createSlice } from '@reduxjs/toolkit';

const FavoriteMealSlice = createSlice({
  name: 'FavoriteMeal',
  initialState: {
    FavoriteMeals: [],
  },
  reducers: {
    setFavoriteMeals(state, action) {
      state.userInformation = action.payload;
    },

  },
});


export const { setFavoriteMeals } = FavoriteMealSlice.actions;
export default FavoriteMealSlice.reducer;
