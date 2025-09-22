import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { NotAccessPage } from "../../pages/NotAccessPage/NotAccessPage";

interface ProtectedRouteProps {
  roleRequired: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roleRequired }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const userRole = sessionStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (
    (Array.isArray(roleRequired) && !roleRequired.includes(userRole || "")) ||
    (typeof roleRequired === "string" && roleRequired !== userRole)
  ) {
    return <NotAccessPage/>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
