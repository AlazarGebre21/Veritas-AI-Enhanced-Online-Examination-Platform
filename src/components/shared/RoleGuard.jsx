import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore.js";
import { ROUTES } from "@/config/routes.js";

/**
 * Restricts access to users whose role matches one of the allowed roles.
 * Redirects to /login if the role doesn't match.
 *
 * @param {{ roles: string[], children?: React.ReactNode }} props
 */
export default function RoleGuard({ roles, children }) {
  const { user } = useAuthStore();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children ?? <Outlet />;
}
