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
  data: {
    oldPrincipalId: string;
    newPrincipal: {
      id: string;
      fullName: string;
      phone: string | null;
      photoUrl: string | null;
      email: string | null;
      gender: "male" | "female" | "unknown";
      dateOfBirth: string | null;
      role: "principal" | "assistant" | "member";
    };
  } | null;
  error: {
    code: string;
    details: string;
  } | null;
  metadata: {
    timestamp: string;
  };
};
