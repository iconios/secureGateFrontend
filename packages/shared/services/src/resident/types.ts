export type GetNonPrincipalsByEstateServerResponse = {
  success: boolean;
  message: string;
  data: {} | null;
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
