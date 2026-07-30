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
      membersTotal: number;
      assistantsTotal: number;
    };
    households:
      | {
          id: string;
          code: string;
          unitNumber: string;
          blockOrStreet: string | null;
          principalResident: {
            id: string;
            residentId: string | null;
            fullName: string | null;
            photoUrl: string;
            phone: string;
            email: string;
          } | null;
          memberCount: number;
          assistantCount: number;
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

export type CreateHouseholdServerResponse = {
  success: boolean;
  message: string;
  data:
    | {}
    | {
        householdId: string;
        unitNumber: string;
        code: string;
        principalResident: {
          personId: string;
          code?: string;
        };
        members: {
          personId: string;
          code?: string;
        }[];
      }[];
  error:
    | {}
    | {
        code: string;
        details: any;
      };
  metadata: {
    timestamp: string;
  };
};
