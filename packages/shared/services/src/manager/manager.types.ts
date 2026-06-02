export interface ServerLoginResponse {
  success: boolean;
  message: string;
  data:
    | {
        user: object;
        token: string;
        role: string;
      }
    | {};
  error: {
    code: string;
    details: any;
  } | null;
  metadata: {
    timestamp: string;
  };
}

export interface ServerSubscriptionPlansResponse {
  success: boolean;
  message: string;
  data: {
    plansData: [
      {
        id: string;
        description: string;
        name: string;
        household_limit: number;
        monthly_fee: number;
        yearly_fee: number;
      },
    ];
  } | null;
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
