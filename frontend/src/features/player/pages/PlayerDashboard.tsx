import { useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/utils/logout";

export default function PlayerDashboardPage() {
  const navigate = useNavigate();

  function handleLogout() {
    logout(navigate);
  }

  return (
    <div className="p-6 text-white">
      <h1>Player Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}