import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tmdb from "../../services/tmdb";

export const fetchMovieDetails = createAsyncThunk(
  "details/fetchMovieDetails",
  async (id, thunkAPI) => {
    try {
      const [detailRes, creditsRes, videosRes, similarRes] = await Promise.all([
        tmdb.get(`/movie/${id}`),
        tmdb.get(`/movie/${id}/credits`),
        tmdb.get(`/movie/${id}/videos`),
        tmdb.get(`/movie/${id}/similar`),
      ]);

      const videos = videosRes.data?.results || [];
      const trailer =
        videos.find(
          (v) =>
            v.site === "YouTube" &&
            (v.type === "Trailer" || v.type === "Teaser")
        ) || null;

      return {
        data: detailRes.data,
        cast: creditsRes.data?.cast || [],
        trailer,
        similar: similarRes.data?.results || [],
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.status_message || "TMDB error"
      );
    }
  }
);

export const fetchTvDetails = createAsyncThunk(
  "details/fetchTvDetails",
  async (id, thunkAPI) => {
    try {
      const [detailRes, creditsRes, videosRes, similarRes] = await Promise.all([
        tmdb.get(`/tv/${id}`),
        tmdb.get(`/tv/${id}/credits`),
        tmdb.get(`/tv/${id}/videos`),
        tmdb.get(`/tv/${id}/similar`),
      ]);

      const videos = videosRes.data?.results || [];
      const trailer =
        videos.find(
          (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        ) || null;

      return {
        data: detailRes.data,
        cast: creditsRes.data?.cast || [],
        trailer,
        similar: similarRes.data?.results || [],
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.status_message || "TMDB error"
      );
    }
  }
);


const detailsSlice = createSlice({
  name: "details",
  initialState: {
    data: null,
    cast: [],
    trailer: null,
    similar: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDetails: (state) => {
      state.data = null;
      state.cast = [];
      state.trailer = null;
      state.similar = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.cast = action.payload.cast;
        state.trailer = action.payload.trailer;
        state.similar = action.payload.similar;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

      .addCase(fetchTvDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTvDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.cast = action.payload.cast;
        state.trailer = action.payload.trailer;
        state.similar = action.payload.similar;
      })
      .addCase(fetchTvDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

  },
});

export const { clearDetails } = detailsSlice.actions;
export default detailsSlice.reducer;
