import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const item = action.payload; 
      const key = `${item.media_type}-${item.id}`;

      const exists = state.items.some((x) => `${x.media_type}-${x.id}` === key);

      if (exists) {
        state.items = state.items.filter((x) => `${x.media_type}-${x.id}` !== key);
      } else {
        state.items.unshift(item);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
