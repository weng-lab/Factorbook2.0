"use client";

import "./globals.css";
import { ReactNode } from "react";
import Topbar from "@/components/topbar";
import Footer from "@/components/footer";
import { ApolloWrapper } from "../../lib/apollo-wrapper";
import { ApiContext, apiContextValue } from "@/apicontext";
import { AppProvider } from "@/appcontext";
import ChatComponenet from "@/components/factorchat/ChatComponent";
import dynamic from "next/dynamic";
const ClientThemeProvider = dynamic(
  () => import("../components/clientthemeprovider"),
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
                <ChatComponenet />
              </ClientThemeProvider>
            </AppProvider>
          </ApiContext.Provider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
