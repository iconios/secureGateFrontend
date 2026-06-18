import { z } from "zod";

export const EstatePaymentDataSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
      estate_payment: z.object({
        estate_name: z.string(),
        subscription_amount: z.number(),
        payment_reference: z.string(),
        household_limit: z.string(),
        plan_name: z.string(),
      }),
      found: z.boolean(),
  })
})

export type EstatePaymentData = z.infer<typeof EstatePaymentDataSchema>;
