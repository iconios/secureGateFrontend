import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateHouseholdServerResponse } from "@shared/services/household";
import { CreateHouseholdPayload } from "../components/layout/dashboard/content/households/types";

export const useCreateHouseholds = (estateId: string) => {
  const queryClient = useQueryClient();
  const safeEstateId = estateId.trim();

  return useMutation<
    CreateHouseholdServerResponse["data"],
    Error,
    CreateHouseholdPayload
  >({
    mutationKey: ["households", "create", safeEstateId],

    mutationFn: async (householdData) => {
      if (!safeEstateId) {
        throw new Error("Please select an estate before creating a household.");
      }

      const response = await fetch("/api/household/createHousehold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...householdData,
          estateId: safeEstateId,
        }),
      });

      let result: CreateHouseholdServerResponse;

      try {
        result = (await response.json()) as CreateHouseholdServerResponse;
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

      return result.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["households", safeEstateId],
      });
    },
  });
};
