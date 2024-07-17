"use client";

import "./globals.css";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import { ApolloWrapper } from "../../lib/apollo-wrapper";
import { ApiContext, apiContextValue } from "@/ApiContext";
import { AppProvider } from "@/AppContext";

const ClientThemeProvider = dynamic(
  () => import("../components/ClientThemeProvider"),
  { ssr: false }
);

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Helvetica+Neue"
          rel="stylesheet"
        />
      </head>
      <body>
        <ApolloWrapper>
          <ApiContext.Provider value={apiContextValue}>
            <AppProvider>
              <ClientThemeProvider>
                <Topbar />
                {children}
                <Footer />
              </ClientThemeProvider>
            </AppProvider>
          </ApiContext.Provider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
