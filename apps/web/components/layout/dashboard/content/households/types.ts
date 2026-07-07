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
