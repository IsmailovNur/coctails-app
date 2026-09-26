import { AppRoutes } from "../routing/routes.ts";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks.ts";
import { selectUser } from "../entities/User/userSlice.ts";

export const RequireAuth = () => {
  const user = useAppSelector(selectUser);
  if (!user) return <Navigate to={AppRoutes.login} replace />

  return <Outlet />;
};

export const RequireAdmin = () => {
  const user = useAppSelector(selectUser);
  if (!user) return <Navigate to={AppRoutes.login} replace />

  if (user.role !== "admin") return <Navigate to={AppRoutes.main} replace />

  return <Outlet />;
};