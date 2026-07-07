/*
#Workflow Plan:
1. User clicks household sidebar link
2. Household page accepts estate id for its household to be fetched to display
3. If the user provides no estate id or fetching the household data for the estate id returns no estate, 
    the page redirects to the main overview page
4. If the user provides an estate id and fetching the household data for the estate id returns household data even if zeros,
    the page should display the zero household data
    the page should also display the top bar to switch between estates if available. 
*/

type SearchParams = Promise<{ [key: string]: string | undefined }>;

import { redirect } from "next/navigation";
import { MainHouseholdComponent } from "../../../../components/layout/dashboard/content/households/mainHousehold";

const HouseholdsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  // 2. Household page accepts estate id for its household to be fetched to display
  const resolvedParams = await searchParams;
  const estateId = (resolvedParams.estateId as string) || "";

  // 3. If the user provides no estate id or fetching the household data for the estate id returns no estate,
  //    the page redirects to the main overview page
  if (!estateId) {
    redirect("/dashboard");
  }

  return <MainHouseholdComponent estateId={estateId} />;
};

export default HouseholdsPage;
