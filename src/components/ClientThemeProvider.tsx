import { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

interface ClientThemeProviderProps {
  children: ReactNode;
}

const ClientThemeProvider: React.FC<ClientThemeProviderProps> = ({
  children,
}) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default ClientThemeProvider;
