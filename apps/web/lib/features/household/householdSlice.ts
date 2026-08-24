import { createSlice } from "@reduxjs/toolkit";
import { HouseholdSliceType } from "./types";

const initialState: HouseholdSliceType = {
  householdId: "",
  principalPersonId: "",
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
  openEdit: false,
  totalMembers: 0,
  totalResidents: 0,
  mobileAccess: false,
  guestPreAuthorize: false,
  guestArrivalNotify: false,
  emergencyAlerts: false,
};

const householdSlice = createSlice({
  name: "household",
  initialState,
  reducers: {
    insertEditHouseholdData: (state, action) => {
      const {
        householdId,
        principalResidentId,
        principalPersonId,
        unitNumber,
        blockOrStreet,
        photoUrl,
        fullName,
        gender,
        dateOfBirth,
        phone,
        email,
        houseCode,
        totalMembers,
        mobileAccess,
        guestPreAuthorize,
        guestArrivalNotify,
        emergencyAlerts,
        totalResidents,
      } = action.payload;

      if (householdId !== undefined) state.householdId = householdId;
      if (principalResidentId !== undefined)
        state.principalResidentId = principalResidentId;
      if (principalPersonId !== undefined)
        state.principalPersonId = principalPersonId;
      if (unitNumber !== undefined) state.unitNumber = unitNumber;
      if (blockOrStreet !== undefined) state.blockOrStreet = blockOrStreet;
      if (photoUrl !== undefined) state.photoUrl = photoUrl;
      if (fullName !== undefined) state.fullName = fullName;
      if (gender !== undefined) state.gender = gender;
      if (dateOfBirth !== undefined) state.dateOfBirth = dateOfBirth;
      if (phone !== undefined) state.phone = phone;
      if (email !== undefined) state.email = email;
      if (houseCode !== undefined) state.houseCode = houseCode;
      if (mobileAccess !== undefined) state.mobileAccess = mobileAccess;
      if (guestPreAuthorize !== undefined)
        state.guestPreAuthorize = guestPreAuthorize;
      if (guestArrivalNotify !== undefined)
        state.guestArrivalNotify = guestArrivalNotify;
      if (emergencyAlerts !== undefined)
        state.emergencyAlerts = emergencyAlerts;
      if (totalMembers !== undefined) state.totalMembers = totalMembers;
      if (totalResidents !== undefined) state.totalResidents = totalResidents;
    },
    openEditView: (state) => {
      state.openEdit = true;
    },
    closeEditView: (state) => {
      state.openEdit = false;
    },
    clearHouseholdData: () => {
      return initialState;
    },
  },
});

export default householdSlice.reducer;
export const householdActions = householdSlice.actions;
