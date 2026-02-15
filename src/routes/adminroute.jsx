import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AdminRoute() {
  const user = useSelector((s) => s.auth.user);
  const loc = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
