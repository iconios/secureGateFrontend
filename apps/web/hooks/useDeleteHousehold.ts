import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteHouseholdServerResponse } from "@shared/services/household";

export const useDeleteHousehold = (estateId: string, householdId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["household", "deleteHousehold", estateId, householdId],

    mutationFn: async () => {
      if (!estateId) {
        throw new Error("Please select a estate before deleting household.");
      }

      if (!householdId) {
        throw new Error("Please select a household before deleting household.");
      }

      const params = new URLSearchParams();
      params.set("estateId", estateId);
      params.set("householdId", householdId);
      const queryString = params.toString();

      const url = `/api/household/deleteHousehold?${queryString}`;
      console.log("Url", url);

      const response = await fetch(url, {
        method: "DELETE",
      });

      let result: DeleteHouseholdServerResponse;

      try {
        result = (await response.json()) as DeleteHouseholdServerResponse;
      } catch {
        throw new Error(
          `The server returned an invalid response (${response.status}).`,
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete household.", {
          cause: "error" in result ? result.error : undefined,
        });
      }

      return result.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["households", estateId],
      });
    },
  });
};
