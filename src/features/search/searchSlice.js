import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tmdb from "../../services/tmdb";

export const searchMulti = createAsyncThunk(
  "search/searchMulti",
  async ({ query, page = 1 }, thunkAPI) => {
    try {
      const q = query?.trim();
      if (!q) return { results: [], page: 1, total_pages: 1, query: "" };

      const res = await tmdb.get("/search/multi", {
        params: { query: q, page, include_adult: false },
      });

      return { ...res.data, query: q };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.status_message || "TMDB error"
      );
    }
  }
);

export const quickSearch = createAsyncThunk(
  "search/quickSearch",
  async (query, thunkAPI) => {
    try {
      const q = query?.trim();
      if (!q) return { results: [] };

      const res = await tmdb.get("/search/multi", {
        params: { query: q, page: 1, include_adult: false },
      });

      return { results: res.data?.results || [] };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.status_message || "TMDB error"
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    list: [],
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,

    quick: {
      open: false,
      list: [],
      loading: false,
      error: null,
    },
  },
  reducers: {
    clearSearch: (state) => {
      state.query = "";
      state.list = [];
      state.page = 1;
      state.totalPages = 1;
      state.loading = false;
      state.error = null;
    },
    setQuickOpen: (state, action) => {
      state.quick.open = action.payload;
    },
    clearQuick: (state) => {
      state.quick.list = [];
      state.quick.loading = false;
      state.quick.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMulti.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMulti.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.total_pages;
        state.query = action.payload.query || "";
      })
      .addCase(searchMulti.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

      .addCase(quickSearch.pending, (state) => {
        state.quick.loading = true;
        state.quick.error = null;
      })
      .addCase(quickSearch.fulfilled, (state, action) => {
        state.quick.loading = false;
        state.quick.list = action.payload.results;
      })
      .addCase(quickSearch.rejected, (state, action) => {
        state.quick.loading = false;
        state.quick.error = action.payload || "Error";
      });
  },
});

export const { clearSearch, setQuickOpen, clearQuick } = searchSlice.actions;
export default searchSlice.reducer;
