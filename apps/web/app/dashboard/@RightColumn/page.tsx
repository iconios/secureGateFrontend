import OverviewPage from "../../../components/layout/dashboard/content/main";
import { cookies } from "next/headers";

const MainContentPage = async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value || "";
  return <OverviewPage authToken={authToken} />;
};

export default MainContentPage;
