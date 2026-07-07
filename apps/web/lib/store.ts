import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import estateReducer from "./features/estate/estateSlice";
import householdReducer from "./features/household/householdSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    estate: estateReducer,
    household: householdReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
