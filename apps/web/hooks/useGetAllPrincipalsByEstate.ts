import { GetNonPrincipalsByEstateServerResponse } from "@shared/services/resident/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetAllPrincipalsByEstate = (
  estateId: string,
  page?: string,
  pageSize?: string,
  searchTerm?: string,
) => {
  const safeEstateId = estateId?.trim() ?? "";

  return useQuery({
    queryKey: ["residents", `${safeEstateId}`, searchTerm, page, pageSize],
    enabled: Boolean(safeEstateId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (safeEstateId)
        params.set("estateId", encodeURIComponent(safeEstateId));
      if (searchTerm) params.set("searchTerm", searchTerm);
      if (page) params.set("page", page);
      if (pageSize) params.set("pageSize", pageSize);

      const queryString = params.toString();
      const url = queryString
        ? `/api/resident/getNonPrincipals?${queryString}`
        : `/api/resident/getNonPrincipals`;
      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();
      console.log("Get residents data response", result);

      if (!result.success) {
        throw new Error(result.message ?? "Failed to get residents data", {
          cause: {
            code: result.error.code,
            details: result.error.details,
          },
        });
      }

      return result.data as GetNonPrincipalsByEstateServerResponse["data"];
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};
