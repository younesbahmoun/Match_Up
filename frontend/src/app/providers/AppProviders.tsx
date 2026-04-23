import type { ReactNode } from "react";
import AuthProvider from "@/context/AuthContext";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}