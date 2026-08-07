import { GetNonPrincipalsByHouseholdServerResponse } from "@shared/services/household";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetAllNonPrincipalResidentsByHousehold = (
  estateId: string,
  householdId: string,
  searchTerm?: string,
  shouldFetch = true,
) => {
  return useQuery({
    queryKey: ["nonPrincipalResidents", estateId, householdId, searchTerm],
    enabled: shouldFetch && !!estateId && !!householdId,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (estateId) params.set("estateId", encodeURIComponent(estateId));
      if (householdId)
        params.set("householdId", encodeURIComponent(householdId));
      if (searchTerm) params.set("searchTerm", searchTerm);

      const queryString = params.toString();
      const url = queryString
        ? `/api/household/getNonPrincipalByHousehold?${queryString}`
        : `/api/household/getNonPrincipalByHousehold`;
      console.log("Url", url);
      const response = await fetch(url);

      const result = await response.json();
      console.log("Get non-principal residents data response", result);

      if (!result.success) {
        throw new Error(
          result.message ?? "Failed to get non-principal residents data",
          {
            cause: {
              code: result.error.code,
              details: result.error.details,
            },
          },
        );
      }

      console.log("Non-principals residents data", result.data);
      return result.data as GetNonPrincipalsByHouseholdServerResponse["data"];
    },
    staleTime: 1 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};
