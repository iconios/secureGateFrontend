import { z } from "zod";

export const VerificationCodeSchema = z.object({
  code: z
    .array(z.string().regex(/^[a-zA-Z0-9]$/, "Code must be alphanumeric"))
    .length(6, "Code must be exactly 6 characters"),
});

export type VerificationCodeFormData = z.infer<typeof VerificationCodeSchema>;

export const CreateManagerSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Name with minimum 2 characters is required"),
    email: z.email("Valid email address is required"),
    phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character",
      ),
    confirm_password: z.string().min(8, "Please confirm your password"),
    terms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
  });

export type CreateManagerData = z.infer<typeof CreateManagerSchema>;
