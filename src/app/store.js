import { configureStore } from "@reduxjs/toolkit";
import discoverReducer from "../features/discover/discoverSlice";
import detailsReducer from "../features/details/detailsSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import searchReducer from "../features/search/searchSlice";
import seasonReducer from "../features/season/seasonSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    discover: discoverReducer,
    details: detailsReducer,
    favorites: favoritesReducer,
    search: searchReducer,
    season: seasonReducer,
    auth: authReducer
  },
});
