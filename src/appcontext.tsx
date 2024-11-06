import React, { createContext, useState, ReactNode, FC } from "react";

// Defining the structure of the context
interface AppContextType {
  geneName: string;
  assembly: string;
  setGeneName: (name: string) => void;
  setAssembly: (assembly: string) => void;
}

// Creating the context with an undefined initial value
export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

// Provider component to wrap the app or relevant parts
export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [geneName, setGeneName] = useState<string>("InitialGene"); // Default value for geneName
  const [assembly, setAssembly] = useState<string>("hg38"); // Default value for assembly

  return (
    <AppContext.Provider
      value={{ geneName, assembly, setGeneName, setAssembly }}
    >
      {children}
    </AppContext.Provider>
  );
};
