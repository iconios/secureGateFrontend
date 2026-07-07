"use client";

import { useQuery } from "@tanstack/react-query";

export const useFetchBlockOrStreet = (estateId: string) => {
  const safeEstateId = estateId?.trim() ?? "";

  return useQuery({
    queryKey: ["blockOrStreetOptions", `${safeEstateId}`],
    enabled: Boolean(safeEstateId),
    queryFn: async () => {
      const response = await fetch(
        `/api/estate/fetchBlockOrStreetOption?estateId=${encodeURIComponent(safeEstateId)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const result = await response.json();
      console.log("Block or street options response", response);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data.blockOrStreetOptions as string[];
    },
  });
};
