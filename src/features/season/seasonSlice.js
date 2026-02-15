import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tmdb from "../../services/tmdb";

export const fetchSeason = createAsyncThunk(
  "season/fetchSeason",
  async ({ tvId, seasonNumber }, thunkAPI) => {
    try {
      const res = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
      return res.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.status_message || "TMDB error"
      );
    }
  }
);

const seasonSlice = createSlice({
  name: "season",
  initialState: {
    open: false,
    tvId: null,
    seasonNumber: null,
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    openSeason: (state, action) => {
      state.open = true;
      state.tvId = action.payload.tvId;
      state.seasonNumber = action.payload.seasonNumber;
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    closeSeason: (state) => {
      state.open = false;
      state.tvId = null;
      state.seasonNumber = null;
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeason.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSeason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      });
  },
});

export const { openSeason, closeSeason } = seasonSlice.actions;
export default seasonSlice.reducer;
