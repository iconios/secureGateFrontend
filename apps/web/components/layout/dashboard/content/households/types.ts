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
          gender: "male" | "female";
          dateOfBirth: string;
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
  })
  .refine((value) => /^234\d{10}$/.test(value), {
    message: "Enter a valid Nigerian phone number",
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

const emailSchema = z
  .email("Enter a valid email address")
  .trim()
  .transform((v) => v.toLowerCase());

const blockOrStreetSchema = z
  .string()
  .trim()
  .min(2, "Block or street is required")
  .max(100, "Block or street is too long");

export const HouseDetailsSchema = z.object({
  unitNumber: z
    .string()
    .trim()
    .min(1, "Unit number is required")
    .max(50, "Unit number is too long"),
  blockOrStreet: blockOrStreetSchema,
});

export const CreatedResidentSchema = z.object({
  mode: z.literal("create"),
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100, "Full name is too long"),
  email: emailSchema,
  phone: termiiPhoneSchema,
  gender: genderEnum.default("male"),
  photoUrl: z.url(),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Enter a valid date of birth",
    }),
});

export type CreatedResidentType = z.infer<typeof CreatedResidentSchema>;

export const EditPrincipalSchema = CreatedResidentSchema.omit({
  mode: true,
  gender: true,
}).extend({
  gender: z.enum(["male", "female"], { message: "Please select a gender" }),
  unitNumber: z.string().trim().min(1, "Minimum of one character is required"),
  blockOrStreet: z
    .string()
    .trim()
    .min(1, "Minimum of one character is required"),
  principalPersonId: z
    .string()
    .trim()
    .min(1, "Minimum of one character is required"),
  householdId: z.string().trim().min(1, "Minimum of one character is required"),
});

export type EditPrincipalType = z.infer<typeof EditPrincipalSchema>;

export const LinkedResidentSchema = z.object({
  mode: z.literal("link"),
  personId: z.string().trim().min(1, "Select an existing resident"),
});

export type LinkedMemberType = z.infer<typeof LinkedResidentSchema>;

export const ResidentSchema = z.discriminatedUnion("mode", [
  LinkedResidentSchema,
  CreatedResidentSchema,
]);

export type ResidentFormInput = z.input<typeof ResidentSchema>;
export type ResidentPayload = z.output<typeof ResidentSchema>;

export const HouseholdSchema = z.object({
  house: HouseDetailsSchema,
  principalResident: ResidentSchema,
  members: z.array(ResidentSchema),
});

export const CreateHouseholdInputSchema = z.object({
  households: z.array(HouseholdSchema),
});

export type CreateHouseholdInputType = z.infer<
  typeof CreateHouseholdInputSchema
>;

export type CreateHouseholdFormInput = z.input<
  typeof CreateHouseholdInputSchema
>;

export type CreateHouseholdPayload = z.output<
  typeof CreateHouseholdInputSchema
>;

export type OpenHandleProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export type MainEditHouseholdProps = {
  householdId: string;
  principalResidentId: string;
  unitNumber: string;
  blockOrStreet: string;
  photoUrl: string;
  fullName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  phone: string;
  email: string;
  houseCode: string;
};

export type UpdateHouseholdAndPrincipalApiSuccess = {
  success: boolean;
  message: string;
  data: null | {
    household: {
      id: string;
      createdAt: string;
      updatedAt: string | null;
      code: string;
      estateId: string;
      blockOrStreet: string | null;
      unitNumber: string;
    };
    principal: {
      id: string;
      createdAt: string;
      updatedAt: string | null;
      fullName: string;
      gender: "male" | "female" | "unknown";
      dateOfBirth: string | null;
      photoUrl: string | null;
      phone: string;
      estateId: string;
      email: string;
    };
  };
};

export type SwapPrincipalResidentType = {
  oldPrincipalId: string;
  newPrincipalId: string;
};
