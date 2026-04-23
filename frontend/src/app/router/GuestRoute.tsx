import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { getDashboardPathByRole } from "@/features/auth/utils/getDashboardPathByRole";

type GuestRouteProps = {
  children: ReactNode;
};

export default function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#10172a] text-white">
        Loading...
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPathByRole(user.role)} replace />;
  }

  return children;
}