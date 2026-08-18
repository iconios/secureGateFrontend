export type GetNonPrincipalsByEstateServerResponse = {
  success: boolean;
  message: string;
  data:
    | {
        count: number;
        nonPrincipals: {
          id: string;
          fullName: string;
          phone: string;
          email: string;
          photoUrl: string;
        }[];
        pagination: {
          page: number;
          pageSize: number;
          totalItems: number;
          totalPages: number;
        };
      }
    | {};
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

export type SwapPrincipalResidentServerResponse = {
  success: boolean;
  message: string;
  data: null | {
    household: {
      id: string;
      code: string;
      estateId: string;
      blockOrStreet: string | null;
      unitNumber: string;
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
  error: {
    code: string;
    details: string;
  } | null;
  metadata: {
    timestamp: string;
  };
};
