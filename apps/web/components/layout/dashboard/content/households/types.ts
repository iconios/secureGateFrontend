import { z } from "zod";

const optionalPhotoUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.url().safeParse(value).success,
    "Enter a valid photo URL",
  )
  .optional()
  .transform((value) => value || undefined);

const optionalEmailSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || z.email().safeParse(value).success,
    "Enter a valid email address",
  )
  .transform((value) => (value ? value.toLowerCase() : undefined));

const optionalTermiiPhoneSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) return undefined;

    let cleaned = value.replace(/\D/g, "");

    if (cleaned.startsWith("0") && cleaned.length === 11) {
      cleaned = `234${cleaned.slice(1)}`;
    }

    return cleaned;
  })
  .refine(
    (value) => value === undefined || /^234\d{10}$/.test(value),
    "Enter a valid Nigerian phone number",
  );

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
        mobileAccess: boolean;
        guestPreAuthorize: boolean;
        guestArrivalNotify: boolean;
        emergencyAlerts: boolean;
        principalResident: {
          id: string;
          residentId: string | null;
          fullName: string | null;
          photoUrl: string | null;
          phone: string;
          email: string | null;
          gender: "male" | "female";
          dateOfBirth: string;
        } | null;
        memberCount: number;
        assistantCount: number;
        residentsTotal: number;
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
// export const NewResidentSchema = z
//   .object({
//     fullName: z.string().trim().min(1).max(50),
//     gender: genderEnum,
//     photoUrl: optionalPhotoUrlSchema,
//     dateOfBirth: z.string().optional(),
//     phone: termiiPhoneSchema,
//     email: z.email(),
//   })
//   .strict();

// export type NewResidentType = z.infer<typeof NewResidentSchema>;

const emailSchema = z
  .email("Enter a valid email address")
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

export const CreatedPrincipalSchema = z.object({
  mode: z.literal("create"),
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100, "Full name is too long"),
  email: emailSchema,
  phone: termiiPhoneSchema,
  gender: genderEnum.default("male"),
  photoUrl: optionalPhotoUrlSchema,
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Enter a valid date of birth",
    })
    .optional(),
});

export type CreatedPrincipalType = z.infer<typeof CreatedPrincipalSchema>;

export const CreatedMemberSchema = z.object({
  mode: z.literal("create"),
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100, "Full name is too long"),
  email: optionalEmailSchema,
  phone: optionalTermiiPhoneSchema,
  gender: genderEnum.default("male"),
  photoUrl: optionalPhotoUrlSchema,
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Enter a valid date of birth",
    })
    .optional(),
});

export type CreatedMemberType = z.infer<typeof CreatedMemberSchema>;

export const EditPrincipalSchema = CreatedPrincipalSchema.omit({
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
  mobileAccess: z.boolean(),
  guestPreAuthorize: z.boolean(),
  guestArrivalNotify: z.boolean(),
  emergencyAlerts: z.boolean(),
});

export type EditPrincipalType = z.infer<typeof EditPrincipalSchema>;

export const LinkedResidentSchema = z.object({
  mode: z.literal("link"),
  personId: z.string().trim().min(1, "Select an existing resident"),
});

export type LinkedMemberType = z.infer<typeof LinkedResidentSchema>;

export const PrincipalResidentSchema = z.discriminatedUnion("mode", [
  LinkedResidentSchema,
  CreatedPrincipalSchema,
]);

export const MemberResidentSchema = z.discriminatedUnion("mode", [
  LinkedResidentSchema,
  CreatedMemberSchema,
]);

export type PrincipalResidentFormInput = z.input<
  typeof PrincipalResidentSchema
>;
export type PrincipalResidentPayload = z.output<typeof PrincipalResidentSchema>;

export type MemberResidentFormInput = z.input<typeof MemberResidentSchema>;
export type MemberResidentPayload = z.output<typeof MemberResidentSchema>;

export const HouseholdSchema = z.object({
  house: HouseDetailsSchema,
  principalResident: PrincipalResidentSchema,
  members: z.array(MemberResidentSchema),
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
  photoUrl: string | null;
  fullName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  phone: string;
  email: string;
  houseCode: string;
  mobileAccess: boolean;
  guestPreAuthorize: boolean;
  guestArrivalNotify: boolean;
  emergencyAlerts: boolean;
  totalResidents: number;
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
    totalResidents: number;
  };
};

export type SwapPrincipalResidentType = {
  oldPrincipalId: string;
  newPrincipalId: string;
};

export const DeleteFormSchema = (houseCode: string) =>
  z.object({
    confirm: z.literal(`${houseCode}`, {
      message: "Please type in the house code",
    }),
  });

export type EditHouseholdSuccessData = {
  subTitle: string;
  backButtonName: string;
  backFunction: () => void;
  unitDetails: string;
  principalFullName: string;
  totalResidents: string;
};

export type AddHouseholdSuccessData = {
  open: boolean;
  subTitle: string;
  backButtonName: string;
  onClose: () => void;
  onBack: () => void;
  onAddAnother: () => void;
};

export type AddOneHouseholdErrorData = {
  open: boolean;
  message: string;
  error: {
    code: string;
    details: string;
  };
  onClose: () => void;
  onBack: () => void;
  onRetry: () => void;
};

export type DeleteHouseholdSuccessData = {
  open: boolean;
  houseCode: string;
  unitNumber: string;
  blockOrStreet: string;
  totalResidents: number;
  onDismiss: () => void;
};

export const RowSchema = z.object({
  unitNumber: z
    .string()
    .trim()
    .min(1, "Unit number cannot be empty")
    .max(50, "Unit number cannot exceed 50 characters"),
  blockOrStreet: blockOrStreetSchema,
  principalFullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100, "Full name is too long"),
  principalEmail: emailSchema,
  principalPhone: termiiPhoneSchema,
  principalGender: z.enum(["male", "female"], {
    message: "Gender must be male or female",
  }),
});

export type ValidRow = z.infer<typeof RowSchema>;

export type RawHouseholdRow = {
  "Unit Number": string;
  "Block or Street": string;
  "Principal Full Name": string;
  "Principal Email": string;
  "Principal Phone": string;
  "Principal Gender": string;
};

export type RowResult = {
  rowNumber: number;
  original: RawHouseholdRow;
  data?: ValidRow;
  errors: Record<string, string[]>;
  valid: boolean;
};
