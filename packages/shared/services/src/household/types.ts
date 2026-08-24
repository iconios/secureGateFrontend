export type FetchHouseholdsByEstateServerResponse = {
  success: boolean;
  message: string;
  data: {
    estateId: string;
    estateName: string;
    allEstates: {
      id: string;
      name: string;
    }[];
    summary: {
      householdsTotal: number;
      residentsTotal: number;
      assistantsTotal: number;
    };
    households:
      | {
          id: string;
          code: string;
          unitNumber: string;
          blockOrStreet: string | null;
          mobileAccess: boolean;
          guestPreAuthorize: boolean;
          guestArrivalNotify: boolean;
          emergencyAlerts: boolean;
          principalResident: {
            id: string;
            residentId: string | null;
            fullName: string | null;
            photoUrl: string;
            phone: string;
            email: string;
            gender: string;
            dateOfBirth: string;
          } | null;
          memberCount: number;
          assistantCount: number;
          residentsTotal: number;
        }[]
      | [];
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
    searchTerm: string;
  } | null;
  error:
    | {
        code: string;
        details: string;
      }
    | {};
  metadata: {
    timestamp: string;
  };
};

export type CreateHouseholdInput = {
  estateId: string;
  households: {
    house: {
      unitNumber: string;
      blockOrStreet?: string;
    };
    principalResident: {
      mode: "link" | "create";
      personId?: string;
      fullName?: string;
      email?: string;
      phone?: string;
      gender?: "male" | "female";
      photoUrl?: string;
      dateOfBirth?: string;
    };
    members: {
      mode: "link" | "create";
      personId?: string;
      fullName?: string;
      dateOfBirth?: string;
      email?: string;
      phone?: string;
      photoUrl?: string;
      gender?: "male" | "female";
    }[];
  }[];
};

export type CreatedHouseholdSummary = {
  householdId: string;
  unitNumber: string;
  blockOrStreet: string;
  code: string;
  principalResident: {
    personId: string;
    code: string;
    fullName: string;
    photoUrl: string;
  };
  members: {
    personId: string;
    code: string;
  }[];
};

export type CreateHouseholdData = {
  households: CreatedHouseholdSummary[];
  count: number;
};

type ResponseMetadata = {
  timestamp: string;
};

type CreateHouseholdError = {
  code: string;
  details?: unknown;
};

export type CreateHouseholdServerResponse =
  | {
      success: true;
      message: string;
      data: CreateHouseholdData;
      error: null;
      metadata: ResponseMetadata;
    }
  | {
      success: false;
      message: string;
      data: null;
      error: CreateHouseholdError;
      metadata: ResponseMetadata;
    };

export type UpdateHouseholdAndPrincipalType = {
  household:
    | {
        unitNumber?: string;
        blockOrStreet?: string;
        mobileAccess?: boolean;
        guestPreAuthorize?: boolean;
        guestArrivalNotify?: boolean;
        emergencyAlerts?: boolean;
      }
    | undefined;
  principal:
    | {
        fullName?: string;
        email?: string;
        phone?: string;
        gender?: "male" | "female";
        photoUrl?: string;
        dateOfBirth?: Date;
      }
    | undefined;
};

export type UpdateHouseholdAndPrincipalServerResponse = {
  success: boolean;
  message: string;
  data: null | {
    household: {
      id: string;
      code: string;
      estateId: string;
      blockOrStreet: string | null;
      unitNumber: string;
      mobileAccess: boolean;
      guestPreAuthorize: boolean;
      guestArrivalNotify: boolean;
      emergencyAlerts: boolean;
    };
    principal: {
      id: string;
      fullName: string;
      gender: "male" | "female";
      dateOfBirth: string | null;
      photoUrl: string | null;
      phone: string;
      estateId: string;
      email: string;
    };
    totalResidents: number;
  };
  error: null | {
    code: string;
    details: string;
  };
  metadata: {
    timestamp: string;
  };
};

export type GetNonPrincipalsByHouseholdServerResponse = {
  success: boolean;
  message: string;
  data: null | {
    count: number;
    nonPrincipalResidents: {
      id: string;
      personId: string;
      fullName: string;
      email: string;
      phone: string;
      photoUrl: string;
    }[];
  };
  error: null | {
    code: string;
    details: string;
  };
  metadata: {
    timestamp: string;
  };
};

export type DeleteHouseholdServerResponse = {
  success: boolean;
  message: string;
  data: null | {
    residentsCount: number;
    householdCount: number;
    householdId: string;
    estateId: string;
  };
  error: null | {
    code: string;
    details: string;
  };
  metadata: {
    timestamp: string;
  };
};
