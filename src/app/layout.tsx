"use client";

import "./globals.css";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import Topbar from "@/components/topbar";
import Footer from "@/components/footer";
import { ApolloWrapper } from "../../lib/apollo-wrapper";
import { ApiContext, apiContextValue } from "@/apicontext";
import { AppProvider } from "@/appcontext";
import { Hind } from 'next/font/google'

const ClientThemeProvider = dynamic(
  () => import("../components/clientthemeprovider"),
  { ssr: false }
);

type LayoutProps = {
  children: ReactNode;
};

const hind = Hind({
  weight: "400",
  subsets: ["latin"]
})

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={hind.className}>
      {/* <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Helvetica+Neue"
          rel="stylesheet"
        />
      </head> */}
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
