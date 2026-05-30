import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  isAuthenticated: false,
  isLoading: false,
  token: "",
  error: {},
  role: "",
  status: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = {};
      state.status = "loading";
    },
    loginSuccess: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.error = {};
      state.role = role;
      state.status = "succeeded";
    },
    loginFailure: (state, action) => {
      const { error } = action.payload;
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = error;
      state.user = {};
      state.status = "failed";
    },
    logout: () => initialState,
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    clearError: (state) => {
      state.error = {};
      state.status = "idle";
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
