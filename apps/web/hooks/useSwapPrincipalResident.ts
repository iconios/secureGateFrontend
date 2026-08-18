import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SwapPrincipalResidentType } from "../components/layout/dashboard/content/households/types";
import { SwapPrincipalResidentServerResponse } from "@shared/services/resident";

export const useSwapPrincipalResident = (
  estateId: string,
  householdId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    SwapPrincipalResidentServerResponse,
    Error,
    SwapPrincipalResidentType
  >({
    mutationKey: ["household", "swapPrincipal", estateId, householdId],

    mutationFn: async (swapData: SwapPrincipalResidentType) => {
      if (!estateId) {
        throw new Error("Please select an estate before swapping principal.");
      }

      if (!householdId) {
        throw new Error(
          "Please select an household before swapping principal.",
        );
      }

      const params = new URLSearchParams();
      params.set("estateId", encodeURIComponent(estateId));
      params.set("householdId", encodeURIComponent(householdId));

      const { oldPrincipalId, newPrincipalId } = swapData;
      if (!oldPrincipalId) {
        throw new Error(
          "Please select an old principal before swapping principal.",
        );
      }
      if (!newPrincipalId) {
        throw new Error(
          "Please select an new principal before swapping principal.",
        );
      }

      params.set("oldPrincipalId", encodeURIComponent(oldPrincipalId));
      params.set("newPrincipalId", encodeURIComponent(newPrincipalId));
      const queryString = params.toString();

      const url = `/api/resident/swapPrincipalResident?${queryString}`;
      console.log("Url", url);

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let result: SwapPrincipalResidentServerResponse;

      try {
        result = (await response.json()) as SwapPrincipalResidentServerResponse;
        console.log("Swap custom hook result", result);
      } catch {
        throw new Error(
          `The server returned an invalid response (${response.status}).`,
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create household.", {
          cause: "error" in result ? result.error : undefined,
        });
      }

      return result;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["households"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["nonPrincipalResidents"],
        }),
      ]);
    },
  });
};
