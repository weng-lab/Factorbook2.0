"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme/theme";
import ClientOnly from "./ClientOnly";

type Props = {
  children: ReactNode;
};

const ClientThemeProvider = ({ children }: Props) => {
  return (
    <ClientOnly>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ClientOnly>
  );
};

export default ClientThemeProvider;
