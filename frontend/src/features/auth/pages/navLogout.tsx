import { useAuth } from "@/context/useAuth";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <p>{user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Guest</p>
      )}
    </nav>
  );
}