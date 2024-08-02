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
  const [geneName, setGeneName] = useState<string>("InitialGene");
  const [assembly, setAssembly] = useState<string>("hg38");

  return (
    <AppContext.Provider
      value={{ geneName, assembly, setGeneName, setAssembly }}
    >
      {children}
    </AppContext.Provider>
  );
};
