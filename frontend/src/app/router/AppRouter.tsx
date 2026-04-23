import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import OwnerDashboardPage from "@/features/owner/pages/OwnerDashboard";
import OwnerTerrainsPage from "@/features/owner/pages/OwnerTerrainsPage";
import OwnerTerrainDetailsPage from "@/features/owner/pages/OwnerTerrainDetailsPage";
import PlayerDashboardPage from "@/features/player/pages/PlayerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/terrains"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerTerrainsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/terrains/:terrainId"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerTerrainDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/my-terrains"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <Navigate to="/owner/terrains" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/terrains/create"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <Navigate to="/owner/terrains" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/terrains/:terrainId/edit"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <Navigate to="/owner/terrains" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/player/dashboard"
        element={
          <ProtectedRoute allowedRoles={["player"]}>
            <PlayerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
