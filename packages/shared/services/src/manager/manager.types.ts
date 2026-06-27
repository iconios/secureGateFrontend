export interface ServerLoginResponse {
  success: boolean;
  message: string;
  data:
    | {
        user: {
          id: string;
          full_name: string;
          email: string;
        };
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
    plansData: {
      id: string;
      description: string;
      name: string;
      household_limit: number;
      monthly_fee: number;
      yearly_fee: number;
    }[];
  } | null;
  error: {
    code: string;
    details: any;
  } | null;
  metadata: {
    timestamp: string;
  };
}

export interface ServerManagerDashboardResponse {
  success: boolean;
  message: string;
  data:
    | {
        id: string;
        estate_id: string;
        estate_name: string;
        estate_location: string;
        estate_state: string;
        estate_status: string;
        estate_logo_url: string;
        estate_number_of_households: number;
        estate_plan_id: string;
        estate_subscription_plan_name: string | null;
        estate_subscription_plan_household_limit: number;
        estate_payment_id: string | null;
        estate_payment_expires_at: string | null;
        estate_payment_paid_at: string | null;
        estate_payment_status: "pending" | "paid" | "failed" | null;
      }[]
    | null;
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
  set(key: string, value: string, rememberMe: boolean): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface ActionContext {
  storage: ISecureStorage;
}

export interface ServerLogoutResponse {
  success: boolean;
  message: string;
  data: {};
  error:
    | {
        name: string;
        message: string;
      }
    | {};
  metadata: {
    timestamp: string;
  };
}

export type FetchUserInfoServerResponse = {
  success: boolean;
  message: string;
  data:
    | {
        user: {
          id: string;
          full_name: string;
          email: string;
        };
        role: string;
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

export type CodeVerificationServerResponse = {
  success: boolean;
  message: string;
  data:
    | {
        email: string;
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

export type CreateManagerServerResponse = {
  success: boolean;
  message: string;
  data: {};
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

export type ForgotPasswordServerResponse = {
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
