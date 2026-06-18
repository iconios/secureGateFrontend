// hooks/useAuthCheck.ts
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { authActions } from "../lib/features/auth/authSlice";

const useAuthCheck = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, status } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    const autoLoginOnRefresh = async () => {
      dispatch(authActions.loginStart()); // Sets status to "loading"

      try {
        const response = await fetch("/api/auth/check-session");
        const result = await response.json();

        if (response.ok && result.success && result.data) {
          // Re-insert user payload directly into Redux on browser refresh
          dispatch(
            authActions.loginSuccess({
              user: result.data.user,
              role: result.data.role,
            }),
          );
        } else {
          dispatch(
            authActions.loginFailure({
              error: { message: result.message || "Session expired" },
            }),
          );
        }
      } catch (error) {
        dispatch(
          authActions.loginFailure({
            error: {
              message:
                error instanceof Error
                  ? error.message
                  : "Network error restoring session",
            },
          }),
        );
      }
    };

    // 1. Trigger the background recovery when the page refreshes (Redux status is idle/empty)
    if (status === "" || status === "idle") {
      autoLoginOnRefresh();
      return;
    }

    // 2. Do not redirect anywhere while the API call is in progress
    if (status === "loading" || isLoading) {
      return;
    }

    // 3. If checking finishes and user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [router, dispatch, isAuthenticated, status, isLoading]);
};

export default useAuthCheck;
