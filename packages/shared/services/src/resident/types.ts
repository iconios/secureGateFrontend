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
