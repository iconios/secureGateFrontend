export interface ServerResponse {
  success: boolean;
  message: string;
  data: {
    user: object;
    token: string;
    role: string;
  };
  error: {
    code: string;
    details: any;
  } | null;
  metadata: {
    timestamp: string;
  };
}

export interface ISecureStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface ActionContext {
  storage: ISecureStorage;
}
