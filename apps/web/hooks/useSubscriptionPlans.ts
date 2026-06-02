import { useQuery } from "@tanstack/react-query";
import FetchSubscriptionPlansService from "@shared/services/manager/fetch.subscription_plans.service";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiUrl) {
  throw new Error("Missing api url");
}

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => FetchSubscriptionPlansService({ baseUrl: apiUrl }),
  });
};
