"use client";

import { FetchBlockOrStreetOptionsServerResponse } from "@shared/services/estate";
import { useQuery } from "@tanstack/react-query";

export const useFetchBlockOrStreet = (estateId: string) => {
  const safeEstateId = estateId.trim() ?? "";

  return useQuery({
    queryKey: ["blockOrStreetOptions", safeEstateId],
    enabled: Boolean(safeEstateId),
    queryFn: async () => {
      const response = await fetch(
        `/api/estate/fetchBlockOrStreetOptions?estateId=${encodeURIComponent(safeEstateId)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const result: FetchBlockOrStreetOptionsServerResponse =
        await response.json();
      console.log("Block or street options response", result);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data?.blockOrStreetOptions as string[];
    },
  });
};
