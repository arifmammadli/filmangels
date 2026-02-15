import { createSlice } from "@reduxjs/toolkit";

const USERS_KEY = "fa_users";
const STORAGE_KEY = "fa_auth";

const loadAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
};

const saveAuth = (auth) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
};

const initialState = {
  user: loadAuth(),
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, password } = action.payload;

      if (username === "admin" && password === "1234") {
        state.user = { username: "admin", role: "admin" };
        state.error = null;
        saveAuth(state.user);
        return;
      }

      if (username === "user" && password === "1234") {
        state.user = { username: "user", role: "user" };
        state.error = null;
        saveAuth(state.user);
        return;
      }

      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const found = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!found) {
        state.user = null;
        state.error = "Username və ya password səhvdir.";
        return;
      }

      if (found.banned) {
        state.user = null;
        state.error = "Your account has been blocked by the administrator.";
        return;
      }

      state.user = {
        username: found.username,
        role: found.role || "user",
      };

      state.error = null;
      saveAuth(state.user);
    },

    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { login, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
