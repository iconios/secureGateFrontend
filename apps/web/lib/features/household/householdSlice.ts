import { createSlice } from "@reduxjs/toolkit";
import { HouseholdSliceType } from "./types";

const initialState: HouseholdSliceType = {
  householdId: "",
  principalResidentId: "",
  unitNumber: "",
  blockOrStreet: "",
  photoUrl: "",
  fullName: "",
  gender: "male",
  dateOfBirth: "",
  phone: "",
  email: "",
  houseCode: "",
};

const householdSlice = createSlice({
  name: "household",
  initialState,
  reducers: {
    insertEditHouseholdData: (state, action) => {
      const {
        householdId,
        principalResidentId,
        unitNumber,
        blockOrStreet,
        photoUrl,
        fullName,
        gender,
        dateOfBirth,
        phone,
        email,
        houseCode,
      } = action.payload;

      if (householdId !== undefined) state.householdId = householdId;
      if (principalResidentId !== undefined)
        state.principalResidentId = principalResidentId;
      if (unitNumber !== undefined) state.unitNumber = unitNumber;
      if (blockOrStreet !== undefined) state.blockOrStreet = blockOrStreet;
      if (photoUrl !== undefined) state.photoUrl = photoUrl;
      if (fullName !== undefined) state.fullName = fullName;
      if (gender !== undefined) state.gender = gender;
      if (dateOfBirth !== undefined) state.dateOfBirth = dateOfBirth;
      if (phone !== undefined) state.phone = phone;
      if (email !== undefined) state.email = email;
      if (houseCode !== undefined) state.houseCode = houseCode;
    },
    clearHouseholdData: () => {
      return initialState;
    },
  },
});

export default householdSlice.reducer;
export const householdActions = householdSlice.actions;
