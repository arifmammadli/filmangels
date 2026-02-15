import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tmdb from "../../services/tmdb";



export const fetchPopularMovies = createAsyncThunk(
  "discover/fetchPopularMovies",
  async (page = 1, thunkAPI) => {
    try {
      const res = await tmdb.get("/movie/popular", { params: { page } });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.status_message || "TMDB error"
      );
    }
  }
);

export const fetchMovies = createAsyncThunk(
  "discover/fetchMovies",
  async ({ page = 1, query = "", genreId = null }, thunkAPI) => {
    try {
      const q = query?.trim();

      // Search varsa search endpoint
      if (q) {
        const res = await tmdb.get("/search/movie", {
          params: { query: q, page, include_adult: false },
        });

        return { ...res.data, query: q, genreId: null };
      }

      // Yoxdursa discover + genre filter
      const res = await tmdb.get("/discover/movie", {
        params: {
          page,
          sort_by: "popularity.desc",
          ...(genreId ? { with_genres: genreId } : {}),
        },
      });

      return { ...res.data, query: "", genreId: genreId || null };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.status_message || "TMDB error"
      );
    }
  }
);



export const fetchTv = createAsyncThunk(
  "discover/fetchTv",
  async ({ type = "popular", page = 1 }, thunkAPI) => {
    try {
      const res = await tmdb.get(`/tv/${type}`, { params: { page } });
      return { ...res.data, type };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.status_message || "TMDB error"
      );
    }
  }
);

export const fetchMovieGenres = createAsyncThunk(
  "discover/fetchMovieGenres",
  async (_, thunkAPI) => {
    try {
      const res = await tmdb.get("/genre/movie/list");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.status_message || "TMDB error"
      );
    }
  }
);




const discoverSlice = createSlice({
  name: "discover",
  initialState: {
    home: {
      movies: [],
      loading: false,
      error: null,
    },

    movies: {
      list: [],
      page: 1,
      totalPages: 1,
      query: "",
      genreId: null,
      loading: false,
      error: null,
    },


    tv: {
      type: "popular",
      list: [],
      page: 1,
      totalPages: 1,
      loading: false,
      error: null,
    },
    genres: {
      list: [],
      loading: false,
      error: null,
    },



  },
  reducers: {},
  extraReducers: (builder) => {
  builder
    .addCase(fetchPopularMovies.pending, (state) => {
      state.home.loading = true;
      state.home.error = null;
    })
    .addCase(fetchPopularMovies.fulfilled, (state, action) => {
      state.home.loading = false;
      state.home.movies = action.payload.results;
    })
    .addCase(fetchPopularMovies.rejected, (state, action) => {
      state.home.loading = false;
      state.home.error = action.payload || "Error";
    })

    .addCase(fetchMovies.pending, (state) => {
      state.movies.loading = true;
      state.movies.error = null;
    })
    .addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies.loading = false;
      state.movies.list = action.payload.results;
      state.movies.page = action.payload.page;
      state.movies.totalPages = action.payload.total_pages;
      state.movies.query = action.payload.query || "";
      state.movies.genreId = action.payload.genreId ?? null;
    })
    .addCase(fetchMovies.rejected, (state, action) => {
      state.movies.loading = false;
      state.movies.error = action.payload || "Error";
    })

    .addCase(fetchTv.pending, (state) => {
      state.tv.loading = true;
      state.tv.error = null;
    })
    .addCase(fetchTv.fulfilled, (state, action) => {
      state.tv.loading = false;
      state.tv.type = action.payload.type;
      state.tv.list = action.payload.results;
      state.tv.page = action.payload.page;
      state.tv.totalPages = action.payload.total_pages;
    })
    .addCase(fetchTv.rejected, (state, action) => {
      state.tv.loading = false;
      state.tv.error = action.payload || "Error";
    })

    .addCase(fetchMovieGenres.pending, (state) => {
      state.genres.loading = true;
      state.genres.error = null;
    })
    .addCase(fetchMovieGenres.fulfilled, (state, action) => {
      state.genres.loading = false;
      state.genres.list = action.payload.genres || [];
    })
    .addCase(fetchMovieGenres.rejected, (state, action) => {
      state.genres.loading = false;
      state.genres.error = action.payload || "Error";
    });
},


});

export default discoverSlice.reducer;
