export interface ServerResponse {
  success: boolean;
  message: string;
  data: object | null;
  error: {
    code: string;
    details: any;
  } | null;
  metadata: {
    timestamp: string;
  };
}
