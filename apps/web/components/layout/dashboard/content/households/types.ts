import { z } from "zod";

export const UnitDetailsSchema = z
  .object({
    unitNumber: z.string().trim().min(1, "Unit number is required"),
    blockOrStreet: z.string().trim().min(1, "Block or street is required"),
  })
  .strict();

export type UnitDetailsData = z.infer<typeof UnitDetailsSchema>;

export type HouseholdsTableData = {
  households:
    | {
        id: string;
        code: string;
        unitNumber: string;
        blockOrStreet: string | null;
        principalResident: {
          id: string;
          residentId: string | null;
          fullName: string | null;
          photoUrl: string;
          phone: string;
          email: string;
        } | null;
        memberCount: number;
        assistantCount: number;
      }[]
    | null;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export const genderEnum = z.enum(["male", "female"]);
const termiiPhoneSchema = z
  .string()
  .trim()
  .transform((v) => {
    let cleaned = v.replace(/\D/g, "");
    if (cleaned.startsWith("0") && cleaned.length === 11) {
      cleaned = `234${cleaned.slice(1)}`;
    }
    return cleaned;
  });
export const NewResidentSchema = z
  .object({
    fullName: z.string().trim().min(1).max(50),
    gender: genderEnum,
    photoUrl: z.string().trim().min(1),
    dateOfBirth: z.string().optional(),
    phone: termiiPhoneSchema,
    email: z.email(),
  })
  .strict();

export type NewResidentType = z.infer<typeof NewResidentSchema>;
