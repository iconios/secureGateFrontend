import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

const useAuthCheck = () => {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.replace("/login");
    }
  }, [router, auth]);
};

export default useAuthCheck;
