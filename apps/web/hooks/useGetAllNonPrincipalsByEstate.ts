import { GetNonPrincipalsByEstateServerResponse } from "@shared/services/resident/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetAllNonPrincipalsByEstate = (
  estateId: string,
  page?: string,
  pageSize?: string,
  searchTerm?: string,
  shouldFetch = true,
) => {
  const safeEstateId = estateId?.trim() ?? "";

  return useQuery({
    queryKey: [
      "non-principal-residents",
      safeEstateId,
      searchTerm,
      page,
      pageSize,
    ],
    enabled: shouldFetch && !!safeEstateId,
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
      console.log("Url", url);
      const response = await fetch(url);

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

      console.log("Non-principals", result.data);
      return result.data as GetNonPrincipalsByEstateServerResponse["data"];
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};
