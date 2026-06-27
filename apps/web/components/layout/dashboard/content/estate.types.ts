import { z } from "zod";

export const createEstateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(5, "Name must be at least 5 characters")
      .max(100, "Name has a max allowed limit of 100 characters"),
    location: z
      .string()
      .trim()
      .min(5, "Location must be at least 5 characters")
      .max(100, "Location has a max allowed limit of 100 characters"),
    stateRegion: z.string().trim().min(1).max(100),
    logoUrl: z.string().trim().min(1, "Logo url must not be empty").nullable(),
  })
  .strict();

export type createEstateData = z.infer<typeof createEstateSchema>;

export type ConfirmAndPayResult = {
  success: boolean;
  message: string;
  data: {
    payment_id: string;
    estate_id: string;
    reference: string;
    authorization_url: string;
    access_code: string;
  } | null;
};

export type EstatesData = {
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
};

export type MainTopBarProps = {
  estates: {
    id: string;
    name: string;
  }[];
  selectedEstateId: string;
  changeSelectedEstate: (v: string) => void;
};

export const ForgotPasswordEmailSchema = z
  .object({
    email: z.email(),
  })
  .strict();

export type ForgotPasswordEmail = z.infer<typeof ForgotPasswordEmailSchema>;
