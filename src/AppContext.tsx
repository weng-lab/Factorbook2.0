import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";

interface AppContextType {
  geneName: string;
  assembly: string;
  setGeneName: (name: string) => void;
  setAssembly: (assembly: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [geneName, setGeneName] = useState<string>(""); // Default value can be set here
  const [assembly, setAssembly] = useState<string>(""); // Default value can be set here

  useEffect(() => {
    // Fetch or set initial values for geneName and assembly
    setGeneName("InitialGene"); // Example initial value
    setAssembly("hg38"); // Example initial value
  }, []);

  return (
    <AppContext.Provider
      value={{ geneName, assembly, setGeneName, setAssembly }}
    >
      {children}
    </AppContext.Provider>
  );
};
