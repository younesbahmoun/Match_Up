import { createContext, useContext, useState } from "react";

type TestContextType = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
};

const TestContext = createContext<TestContextType | undefined>(undefined);

type TestProviderProps = {
  children: React.ReactNode;
};

export default function TestProvider({ children }: TestProviderProps) {
  const [name, setName] = useState("Younes");

  console.log("TestProvider render");
  console.log("Current name in provider:", name);

  return (
    <TestContext.Provider value={{ name, setName }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);

  if (!context) {
    throw new Error("useTest must be used within TestProvider");
  }

  return context;
}