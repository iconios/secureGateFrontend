export type GenderType = "unknown" | "male" | "female";

export type HouseInputType = {
  unitNumber: string;
  blockOrStreet: string;
};

export type LinkedPersonInputType = {
  mode: "link";
  personId: string;
};

export type CreatedPersonInputType = {
  mode: "create";
  fullName: string;
  email?: string;
  phone?: string;
  gender?: GenderType;
  photoUrl?: string;
  dateOfBirth?: string;
};

export type PersonInputType = LinkedPersonInputType | CreatedPersonInputType;

export type HouseholdInputType = {
  house: HouseInputType;
  principalResident?: PersonInputType;
  members?: PersonInputType[];
};

export type CreateHouseholdInputType = {
  estateId: string;
  households: HouseholdInputType[];
};

export type HouseholdSliceType = {
  householdId: string;
  principalResidentId: string;
  principalPersonId: string;
  unitNumber: string;
  blockOrStreet: string;
  photoUrl: string;
  fullName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  phone: string;
  email: string;
  houseCode: string;
  openEdit: boolean;
  mobileAccess: boolean;
  guestPreAuthorize: boolean;
  guestArrivalNotify: boolean;
  emergencyAlerts: boolean;
  totalMembers: number;
  totalResidents: number;
};
