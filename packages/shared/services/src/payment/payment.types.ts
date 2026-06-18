import { z } from "zod";

export type EstateDBPaymentStatusServerResponse = {
  success: boolean;
  message: string;
  data:
    | {
        estate_name: string;
        subscription_amount: number;
        payment_reference: string;
        household_limit: string;
        plan_name: string;
      }
    | {};
  error:
    | {
        name: string;
        message: string;
      }
    | {};
  metadata: {
    timestamp: string;
  };
};

export const InitializeEstatePaymentDataSchema = z.object({
  plan_id: z.string().min(5, "Minimum of five characters needed"),
  period: z.string().min(2, "Minimum of two characters needed"),
  name: z.string().min(2, "Minimum of two characters needed"),
  logo_url: z.string().min(5, "Minimum of five characters needed"),
  location: z.string().min(1, "Minimum of one character needed"),
  state: z.string().min(1, "Minimum of one character needed"),
});

export type InitializeEstatePaymentData = z.infer<
  typeof InitializeEstatePaymentDataSchema
>;

export type InitializeEstatePaymentServerResponse = {
  success: boolean;
  message: string;
  data:
    | {
        payment_id: string;
        estate_id: string;
        reference: string;
        authorization_url: string;
        access_code: string;
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
