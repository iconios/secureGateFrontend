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
    logoUrl: z.string().trim().min(1, "Logo url must not be empty"),
  })
  .strict();

export type createEstateData = z.infer<typeof createEstateSchema>;
