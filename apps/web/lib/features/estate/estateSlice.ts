import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  location: "",
  stateRegion: "Lagos",
  logoUrl: "",
  households: 0,
  period: "monthly",
  amount: 0,
  plan: "",
  planId: "",
  estateId: "",
  estateBlockOrStreet: [],
};

const estateSlice = createSlice({
  name: "estate",
  initialState,
  reducers: {
    insertEstate: (state, action) => {
      const { name, location, stateRegion, logoUrl } = action.payload || {};
      if (name !== undefined) state.name = name;
      if (location !== undefined) state.location = location;
      if (stateRegion !== undefined) state.stateRegion = stateRegion;
      if (logoUrl !== undefined) state.logoUrl = logoUrl;
    },
    upsertHousehold: (state, action) => {
      state.households = action.payload?.households ?? state.households;
      state.period = action.payload?.period ?? state.period;
      state.amount = action.payload?.amount ?? state.amount;
      state.plan = action.payload?.plan ?? state.plan;
      state.planId = action.payload?.planId ?? state.planId;
    },
    updateName: (state, action) => {
      state.name = action.payload?.name ?? state.name;
    },
    updateLocation: (state, action) => {
      state.location = action.payload?.location ?? state.location;
    },
    updateStateRegion: (state, action) => {
      state.stateRegion = action.payload?.stateRegion ?? state.stateRegion;
    },
    updateLogoUrl: (state, action) => {
      state.logoUrl = action.payload?.logoUrl ?? state.logoUrl;
    },
    updatePlanId: (state, action) => {
      state.planId = action.payload?.planId ?? state.planId;
    },
    clearEstate: () => {
      return initialState;
    },
    insertEstateId: (state, action) => {
      state.estateId = action.payload ?? state.estateId;
    },
    insertEstateBlockOrStreet: (state, action) => {
      state.estateBlockOrStreet = action.payload ?? state.estateBlockOrStreet;
    },
  },
});

export default estateSlice.reducer;
export const estateActions = estateSlice.actions;
