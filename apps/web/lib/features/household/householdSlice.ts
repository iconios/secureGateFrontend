import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CreateHouseholdInputType,
  HouseholdInputType,
  HouseInputType,
  PersonInputType,
} from "./types";

const initialState: CreateHouseholdInputType = {
  estateId: "",
  households: [],
};

const householdSlice = createSlice({
  name: "household",
  initialState,
  reducers: {
    insertEstateId: (state, action: PayloadAction<string>) => {
      state.estateId = action.payload;
    },
    insertOneUnitDetails: (state, action: PayloadAction<HouseInputType>) => {
      state.households.push({
        house: action.payload,
        members: [],
      });
    },
    insertOnePrincipalResidentDetails: (
      state,
      action: PayloadAction<{
        householdIndex: number;
        principalResident: PersonInputType;
      }>,
    ) => {
      const { householdIndex, principalResident } = action.payload || {};
      if (!state.households[householdIndex]) return;
      state.households[householdIndex].principalResident = principalResident;
    },
    insertOneMemberDetails: (
      state,
      action: PayloadAction<{
        householdIndex: number;
        member: PersonInputType;
      }>,
    ) => {
      const { householdIndex, member } = action.payload || {};
      if (!state.households[householdIndex]) return;
      if (!state.households[householdIndex].members) {
        state.households[householdIndex].members = [];
      }

      state.households[householdIndex].members?.push(member);
    },
    removeOneMemberDetails: (
      state,
      action: PayloadAction<{
        householdIndex: number;
        memberIndex: number;
      }>,
    ) => {
      const { householdIndex, memberIndex } = action.payload || {};
      if (!state.households[householdIndex]?.members) return;
      state.households[householdIndex].members?.splice(memberIndex, 1);
    },
    insertMultipleHouseholdDetails: (
      state,
      action: PayloadAction<HouseholdInputType[]>,
    ) => {
      state.households.push(...action.payload);
    },
    clearHousehold: () => {
      return initialState;
    },
  },
});

export default householdSlice.reducer;
export const householdActions = householdSlice.actions;
