import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore.js";
import { ROUTES } from "@/config/routes.js";

/**
 * Protects routes that require a valid JWT.
 * Redirects to /login if access token is missing or expired.
 *
 * @param {{ children?: React.ReactNode }} props
 */
export default function ProtectedRoute({ children }) {
  const { accessToken, isTokenExpired } = useAuthStore();

  if (!accessToken || isTokenExpired()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children ?? <Outlet />;
}
