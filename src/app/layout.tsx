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
import { Hind } from 'next/font/google'

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
