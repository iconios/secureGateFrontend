import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  user:
    | {
        id: string;
        email: string;
        full_name: string;
      }
    | {};
  isAuthenticated: boolean;
  isLoading: boolean;
  error:
    | {}
    | {
        code: string;
        details: string;
      };
  role: string;
  status: string;
};

const initialState: InitialState = {
  user: {},
  isAuthenticated: false,
  isLoading: false,
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
      const { user, role } = action.payload;
      state.user = user;
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
    hydrateSession: (state) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.status = "succeeded";
    },
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
