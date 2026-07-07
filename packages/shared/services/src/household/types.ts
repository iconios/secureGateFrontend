export type FetchHouseholdsByEstateServerResponse = {
  success: boolean;
  message: string;
  data: {
    estateId: string;
    estateName: string;
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
