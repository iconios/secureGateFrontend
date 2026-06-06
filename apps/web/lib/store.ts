import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import estateReducer from "./features/estate/estateSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    estate: estateReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
