export type FetchBlockOrStreetOptionsServerResponse = {
  success: boolean;
  message: string;
  data: {
    blockOrStreetOptions: string[];
    count: number;
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
